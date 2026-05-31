import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

interface RateLimitAttempt {
  count: number;
  firstAttempt: number;
  lockoutUntil: number;
}

// In-memory rate limiting map keyed by client IP
const rateLimitMap = new Map<string, RateLimitAttempt>();

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes sliding window
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes lockout duration

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
    if (signature !== expectedSignature) return false;

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
 * GET /api/us/auth?token=...
 *
 * Verifies if a stored client session token is valid and not expired.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

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
 * Validates the passcode, handles IP rate limiting, and returns a signed token.
 */
export async function POST(req: NextRequest) {
  try {
    const clientIp = getClientIp(req);
    const now = Date.now();

    // Check rate limiting state
    let record = rateLimitMap.get(clientIp);
    if (record) {
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
      if (now - record.firstAttempt > WINDOW_MS) {
        record = { count: 0, firstAttempt: now, lockoutUntil: 0 };
        rateLimitMap.set(clientIp, record);
      }
    } else {
      record = { count: 0, firstAttempt: now, lockoutUntil: 0 };
      rateLimitMap.set(clientIp, record);
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
      rateLimitMap.delete(clientIp);

      const secret = process.env.US_PAGE_AUTH_SECRET || correctPasscode;
      const token = generateToken(secret);

      return NextResponse.json({ success: true, token }, { status: 200 });
    } else {
      // Increment lockout counter
      record.count += 1;
      if (record.count >= MAX_ATTEMPTS) {
        record.lockoutUntil = now + LOCKOUT_MS;
      }
      rateLimitMap.set(clientIp, record);

      // Add a slight delay to prevent timing-based brute force
      await new Promise((r) => setTimeout(r, 400));

      if (record.count >= MAX_ATTEMPTS) {
        return NextResponse.json(
          {
            success: false,
            error: "Too many failed attempts. Locked out for 15 minutes. 🔒",
          },
          { status: 401 }
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
