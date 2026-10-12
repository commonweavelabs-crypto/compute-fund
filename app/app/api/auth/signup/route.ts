import { NextResponse } from "next/server";
import { findUserByEmail, createUser, newId } from "../../../../lib/db";
import { hashPassword, setSessionCookie, sessionTokenFor } from "../../../../lib/auth";

export async function POST(req: Request) {
  const { email, password, displayName } = await req.json();
  if (!email?.includes("@") || !password || password.length < 8 || !displayName?.trim()) {
    return NextResponse.json({ error: "Valid email, 8+ char password, and a display name are required." }, { status: 400 });
  }
  if (findUserByEmail(email)) {
    return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
  }
  const user = createUser(email, hashPassword(password), displayName.trim());
  await setSessionCookie(sessionTokenFor((user as { id: string }).id));
  return NextResponse.json({ ok: true, user });
}
