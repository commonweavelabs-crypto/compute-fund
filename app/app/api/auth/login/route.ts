import { NextResponse } from "next/server";
import { findUserByEmail } from "../../../../lib/db";
import { verifyPassword, setSessionCookie, sessionTokenFor } from "../../../../lib/auth";

export async function POST(req: Request) {
  const { email, password } = await req.json();
  const user = findUserByEmail(email ?? "") as { id: string; pw_hash: string } | undefined;
  // Same error for unknown email and wrong password: no account enumeration.
  if (!user || !verifyPassword(password ?? "", user.pw_hash)) {
    return NextResponse.json({ error: "Email or password is incorrect." }, { status: 401 });
  }
  await setSessionCookie(sessionTokenFor(user.id));
  return NextResponse.json({ ok: true });
}
