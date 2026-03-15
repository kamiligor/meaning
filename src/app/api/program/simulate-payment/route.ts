import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const bodySchema = z.object({
  method: z.enum(["card", "blik"]),
});

// Development-only endpoint for testing payment flow.
// Sets a short-lived httpOnly cookie that the auth callback reads
// to grant program access without a real payment processor.
export async function POST(request: NextRequest) {
  const raw = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(raw);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid body. Expected: { method: 'card' | 'blik' }" },
      { status: 400 }
    );
  }

  const response = NextResponse.json({ success: true });

  response.cookies.set("payment_completed", "true", {
    httpOnly: true,
    maxAge: 60 * 60, // 1 hour
    path: "/",
    sameSite: "lax",
  });

  return response;
}
