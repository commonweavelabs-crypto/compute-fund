import { NextResponse } from "next/server";
import { currentUser } from "../../../lib/auth";
import { writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { randomBytes } from "node:crypto";

// Local static upload rail (no third-party host, per D3 law). POST multipart
// form: file + kind=logo|avatar|hero. Returns the public path stored in the
// DB columns (logo_path / avatar_path). Limit 2 MB; png/jpg/webp/svg only.
const KINDS = new Set(["logo", "avatar", "hero"]);
const OK_TYPES: Record<string, string> = {
  "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp",
  "image/svg+xml": "svg", "image/x-icon": "ico",
};

export async function POST(req: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  const form = await req.formData();
  const file = form.get("file");
  const kind = String(form.get("kind") ?? "logo");
  if (!(file instanceof File)) return NextResponse.json({ error: "No file." }, { status: 400 });
  if (!KINDS.has(kind)) return NextResponse.json({ error: "kind must be logo|avatar|hero." }, { status: 400 });
  if (file.size > 2 * 1024 * 1024) return NextResponse.json({ error: "Max 2 MB." }, { status: 413 });
  const ext = OK_TYPES[file.type];
  if (!ext) return NextResponse.json({ error: "png/jpg/webp/svg only." }, { status: 415 });

  const name = `${randomBytes(6).toString("hex")}.${ext}`;
  const dir = join(process.cwd(), "public", "u");
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, name), Buffer.from(await file.arrayBuffer()));
  return NextResponse.json({ ok: true, path: `/u/${name}` });
}
