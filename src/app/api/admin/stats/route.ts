import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { getSession } from "@/lib/auth";
import { getStats, parseStatsQuery, StatsQueryError } from "@/lib/analytics-stats";

/**
 * Panel data for /admin/statystyki. Spec: docs/specs/tracking-analytics.md,
 * sections 6 and 10. Aggregated numbers only — never an e-mail address, see
 * analytics-stats.ts.
 *
 * GET is not covered by the admin-JWT gate in src/proxy.ts (that gate only
 * applies to non-GET requests under /api/), so the session check has to
 * happen in the handler itself, same as /api/admin/comments.
 */
export async function GET(request: NextRequest) {
  try {
    if (!(await getSession())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let query;
    try {
      query = parseStatsQuery(request.nextUrl.searchParams);
    } catch (err) {
      if (err instanceof StatsQueryError) {
        return NextResponse.json({ error: err.message }, { status: 400 });
      }
      throw err;
    }

    const admin = getSupabaseAdmin();
    const stats = await getStats(admin, query);

    return NextResponse.json(stats, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (err) {
    console.error("[admin stats GET] Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
