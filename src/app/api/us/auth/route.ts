import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/us/auth
 *
 * Validates the passcode for the /us page against the
 * server-side environment variable US_PAGE_PASSCODE.
 * The passcode is never exposed to the client bundle.
 */
export async function POST(req: NextRequest) {
  try {
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

    // Case-insensitive, trimmed comparison
    const isValid =
      passcode.trim().toLowerCase() === correctPasscode.trim().toLowerCase();

    if (isValid) {
      return NextResponse.json({ success: true }, { status: 200 });
    } else {
      // Slight delay to prevent brute-force guessing
      await new Promise((r) => setTimeout(r, 400));
      return NextResponse.json(
        { success: false, error: "Incorrect passcode. Try again, my love! 💔" },
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
