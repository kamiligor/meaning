import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { getCourse } from "@/lib/courses";
import { verifyReminderOptOutToken } from "@/lib/course-mail";
import { publicOrigin } from "@/lib/domains";

/**
 * One-click opt-out from course reminder mail, no login needed: the link in
 * every reminder carries the enrollment id and a signature (src/lib/course-mail.ts).
 * Accepts GET (a click) and POST (RFC 8058 one-click from mail clients).
 */
async function optOut(request: NextRequest): Promise<NextResponse> {
  const enrollmentId = request.nextUrl.searchParams.get("e") ?? "";
  const token = request.nextUrl.searchParams.get("t") ?? "";
  const origin = publicOrigin(request.headers, request.nextUrl.origin);

  if (
    !/^[0-9a-f-]{36}$/.test(enrollmentId) ||
    !verifyReminderOptOutToken(enrollmentId, token)
  ) {
    return NextResponse.redirect(new URL("/kursy", origin));
  }

  try {
    const admin = getSupabaseAdmin();
    const { data } = await admin
      .from("course_enrollments")
      .update({ reminders_enabled: false })
      .eq("id", enrollmentId)
      .select("course_slug")
      .maybeSingle();
    const course = data?.course_slug ? getCourse(data.course_slug) : null;
    const target = course ? `${course.path}?przypomnienia=off` : "/kursy";
    return NextResponse.redirect(new URL(target, origin));
  } catch (err) {
    console.error("[course reminders off] failed:", err instanceof Error ? err.message : err);
    return NextResponse.redirect(new URL("/kursy", origin));
  }
}

export async function GET(request: NextRequest) {
  return optOut(request);
}

export async function POST(request: NextRequest) {
  return optOut(request);
}
