import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabase";

interface RateLimitAttempt {
  count: number;
  firstAttempt: number;
  lockoutUntil: number;
}

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes sliding window
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes lockout duration

// Fallback bounded in-memory rate limiting map
const rateLimitMap = new Map<string, RateLimitAttempt>();
const MAX_MAP_SIZE = 1000;

/**
 * Periodically evicts stale entries from the fallback in-memory map to prevent memory growth.
 */
function cleanInMemoryLimits() {
  const now = Date.now();
  for (const [ip, record] of rateLimitMap.entries()) {
    if (record.lockoutUntil < now && now - record.firstAttempt > WINDOW_MS) {
      rateLimitMap.delete(ip);
    }
  }
  // Bounded safety: clear completely if it somehow exceeds capacity
  if (rateLimitMap.size > MAX_MAP_SIZE) {
    rateLimitMap.clear();
  }
}

/**
 * Retrieves the client's IP address from common forwarding headers.
 */
function getClientIp(req: NextRequest): string {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  const realIp = req.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }
  return "unknown-ip";
}

/**
 * Retrieves the rate-limit record for an IP address.
 * Reads from Supabase and falls back to a bounded in-memory map if queries fail or table is missing.
 */
async function getRateLimitRecord(ip: string): Promise<RateLimitAttempt> {
  const now = Date.now();
  try {
    const { data, error } = await supabaseAdmin
      .from("us_auth_attempts")
      .select("count, first_attempt, lockout_until")
      .eq("ip", ip)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (data) {
      return {
        count: data.count,
        firstAttempt: Number(data.first_attempt),
        lockoutUntil: Number(data.lockout_until),
      };
    }
  } catch (err) {
    console.warn("Supabase rate-limit read failed, falling back to in-memory:", err);
  }

  // Fallback to bounded in-memory map
  cleanInMemoryLimits();
  let record = rateLimitMap.get(ip);
  if (!record) {
    record = { count: 0, firstAttempt: now, lockoutUntil: 0 };
    rateLimitMap.set(ip, record);
  }
  return record;
}

/**
 * Saves or updates a rate-limit record.
 * Writes to Supabase and falls back to the in-memory map on failure.
 */
async function saveRateLimitRecord(ip: string, record: RateLimitAttempt): Promise<void> {
  try {
    const { error } = await supabaseAdmin
      .from("us_auth_attempts")
      .upsert({
        ip,
        count: record.count,
        first_attempt: record.firstAttempt,
        lockout_until: record.lockoutUntil,
      });

    if (error) {
      throw error;
    }
    return;
  } catch (err) {
    console.warn("Supabase rate-limit write failed, falling back to in-memory:", err);
  }

  // Fallback to in-memory map
  rateLimitMap.set(ip, record);
}

/**
 * Deletes a rate-limit record upon successful authentication.
 * Deletes from Supabase and falls back to in-memory removal on failure.
 */
async function deleteRateLimitRecord(ip: string): Promise<void> {
  try {
    const { error } = await supabaseAdmin
      .from("us_auth_attempts")
      .delete()
      .eq("ip", ip);

    if (error) {
      throw error;
    }
    return;
  } catch (err) {
    console.warn("Supabase rate-limit delete failed, falling back to in-memory:", err);
  }

  // Fallback to in-memory map
  rateLimitMap.delete(ip);
}

/**
 * Generates a signed authentication token using a server-side secret.
 * Format: timestamp:sha256(timestamp, secret)
 */
function generateToken(secret: string): string {
  const timestamp = Date.now().toString();
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(timestamp);
  const signature = hmac.digest("hex");
  return `${timestamp}:${signature}`;
}

/**
 * Verifies a token signature and checks if it's within the expiration window.
 */
function verifyToken(token: string, secret: string): boolean {
  try {
    const parts = token.split(":");
    if (parts.length !== 2) return false;
    const [timestamp, signature] = parts;

    // Verify signature
    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(timestamp);
    const expectedSignature = hmac.digest("hex");

    const signatureBuffer = Buffer.from(signature, "utf-8");
    const expectedSignatureBuffer = Buffer.from(expectedSignature, "utf-8");

    if (signatureBuffer.length !== expectedSignatureBuffer.length) {
      return false;
    }

    if (!crypto.timingSafeEqual(signatureBuffer, expectedSignatureBuffer)) {
      return false;
    }

    // Check expiration (30 days validity)
    const tokenTime = parseInt(timestamp, 10);
    if (isNaN(tokenTime)) return false;

    const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
    if (Date.now() - tokenTime > thirtyDaysMs) {
      return false; // Expired
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * GET /api/us/auth
 *
 * Verifies if a stored client session token is valid and not expired.
 * Expects the token in the standard `Authorization: Bearer <token>` header.
 */
export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Token is required." },
        { status: 400 }
      );
    }

    const secret = process.env.US_PAGE_AUTH_SECRET || process.env.US_PAGE_PASSCODE;
    if (!secret) {
      console.error("US_PAGE_PASSCODE environment variable is not set.");
      return NextResponse.json(
        { success: false, error: "Server configuration error." },
        { status: 500 }
      );
    }

    const isValid = verifyToken(token, secret);

    if (isValid) {
      return NextResponse.json({ success: true }, { status: 200 });
    } else {
      return NextResponse.json(
        { success: false, error: "Invalid or expired token." },
        { status: 401 }
      );
    }
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request." },
      { status: 400 }
    );
  }
}

/**
 * POST /api/us/auth
 *
 * Validates the passcode, handles persistent IP rate limiting, and returns a signed token.
 */
export async function POST(req: NextRequest) {
  try {
    const clientIp = getClientIp(req);
    const now = Date.now();

    // Check rate limiting state
    let record = await getRateLimitRecord(clientIp);

    if (record.lockoutUntil > now) {
      const remainingTime = Math.ceil((record.lockoutUntil - now) / 1000 / 60);
      return NextResponse.json(
        {
          success: false,
          error: `Too many failed attempts. Locked out. Try again in ${remainingTime} minute${remainingTime > 1 ? "s" : ""}. 🔒`,
        },
        { status: 429 }
      );
    }

    // Reset the window count if enough time has passed
    if (record.count > 0 && now - record.firstAttempt > WINDOW_MS) {
      record = { count: 0, firstAttempt: now, lockoutUntil: 0 };
      await saveRateLimitRecord(clientIp, record);
    }

    const body = await req.json();
    const { passcode } = body as { passcode?: string };

    if (!passcode || typeof passcode !== "string") {
      return NextResponse.json(
        { success: false, error: "Passcode is required." },
        { status: 400 }
      );
    }

    const correctPasscode = process.env.US_PAGE_PASSCODE;
    if (!correctPasscode) {
      console.error("US_PAGE_PASSCODE environment variable is not set.");
      return NextResponse.json(
        { success: false, error: "Server configuration error." },
        { status: 500 }
      );
    }

    // Case-sensitive, trimmed comparison
    const isValid = passcode.trim() === correctPasscode.trim();

    if (isValid) {
      // Clear rate limit record upon success
      await deleteRateLimitRecord(clientIp);

      const secret = process.env.US_PAGE_AUTH_SECRET || correctPasscode;
      const token = generateToken(secret);

      return NextResponse.json({ success: true, token }, { status: 200 });
    } else {
      // Increment lockout counter
      if (record.count === 0) {
        record.firstAttempt = now;
      }
      record.count += 1;

      const isLockedOut = record.count >= MAX_ATTEMPTS;
      if (isLockedOut) {
        record.lockoutUntil = now + LOCKOUT_MS;
      }

      await saveRateLimitRecord(clientIp, record);

      // Add a slight delay to prevent timing-based brute force
      await new Promise((r) => setTimeout(r, 400));

      if (isLockedOut) {
        return NextResponse.json(
          {
            success: false,
            error: "Too many failed attempts. Locked out for 15 minutes. 🔒",
          },
          { status: 429 } // Correctly return 429 Too Many Requests status code
        );
      }

      const attemptsLeft = MAX_ATTEMPTS - record.count;
      return NextResponse.json(
        {
          success: false,
          error: `Incorrect passcode. Try again, my love! 💔 (${attemptsLeft} attempt${attemptsLeft > 1 ? "s" : ""} left)`,
        },
        { status: 401 }
      );
    }
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request." },
      { status: 400 }
    );
  }
}
