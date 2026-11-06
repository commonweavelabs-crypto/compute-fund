// GET /api/session — the header's identity probe (header pass v2): fast,
// no-store, try/catch, never throws. Reuses the EXACT helper the auth port
// uses to identify a reader: lib/auth currentUser() (cf_session cookie ->
// HMAC check -> the local ledger user row), the same path /api/account and
// the /api/auth/* routes ride. No session (or an unreadable one) is simply
// { user: null } — the anonymous header, never an error.
// cacheComponents (Next 16) law — same as /api/home: route segment configs
// (force-dynamic) are ILLEGAL in this repo; reading cookies() makes the
// handler per-request, and Cache-Control: no-store keeps it uncacheable.
import { NextResponse } from "next/server";
import { currentUser } from "../../../lib/auth";

export async function GET() {
  const noStore = { "cache-control": "no-store" } as const;
  try {
    const u = await currentUser();
    if (!u) return NextResponse.json({ user: null }, { headers: noStore });
    const row = u as {
      email: string;
      display_name?: string | null;
      username?: string | null;
    };
    // The users table has no username column (schema: display_name); the
    // header consumes name + initials, username mirrors display_name.
    return NextResponse.json(
      {
        user: {
          username: row.username ?? row.display_name ?? null,
          email: row.email,
          name: row.display_name ?? null,
        },
      },
      { headers: noStore }
    );
  } catch {
    return NextResponse.json({ user: null }, { headers: noStore });
  }
}
