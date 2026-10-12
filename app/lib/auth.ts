// Password hashing and signed session cookies.
// scrypt (node crypto) for passwords; HMAC-SHA256 over "userId.expiry" for the cookie.
// No framework, no deps: the secrets live in env, never in the repo.
import { randomBytes, scryptSync, timingSafeEqual, createHmac } from "node:crypto";
import { cookies } from "next/headers";
import { findUserById } from "./db";

const SESSION_COOKIE = "cf_session";
const SESSION_DAYS = 30;

function secret(): string {
  // Dev default keeps local runs working; production must set CF_AUTH_SECRET.
  return process.env.CF_AUTH_SECRET || "dev-only-rotate-me";
}

// -- passwords -----------------------------------------------------------------
export function hashPassword(pw: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(pw, salt, 64).toString("hex");
  return `${salt}$${hash}`;
}
export function verifyPassword(pw: string, stored: string): boolean {
  const [salt, hash] = stored.split("$");
  if (!salt || !hash) return false;
  const candidate = scryptSync(pw, salt, 64);
  const actual = Buffer.from(hash, "hex");
  return candidate.length === actual.length && timingSafeEqual(candidate, actual);
}

// -- session cookie --------------------------------------------------------------
export function sessionTokenFor(userId: string): string {
  const expiry = Date.now() + SESSION_DAYS * 86400_000;
  const payload = `${userId}.${expiry}`;
  const sig = createHmac("sha256", secret()).update(payload).digest("hex");
  return `${payload}.${sig}`;
}
export function userIdFromToken(token: string | undefined): string | null {
  if (!token) return null;
  const [userId, expiry, sig] = token.split(".");
  if (!userId || !expiry || !sig) return null;
  const payload = `${userId}.${expiry}`;
  const expected = createHmac("sha256", secret()).update(payload).digest("hex");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  if (Number(expiry) < Date.now()) return null;
  return userId;
}
export async function setSessionCookie(token: string) {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.CF_FORCE_SECURE_COOKIE === "1",
    maxAge: SESSION_DAYS * 86400,
    path: "/",
  });
}
export async function clearSessionCookie() {
  (await cookies()).delete(SESSION_COOKIE);
}
export async function currentUser() {
  const jar = await cookies();
  const id = userIdFromToken(jar.get(SESSION_COOKIE)?.value);
  if (!id) return null;
  return findUserById(id) ?? null;
}