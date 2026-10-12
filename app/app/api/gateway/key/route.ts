import { NextResponse } from "next/server";
import { randomBytes, createHash } from "node:crypto";
import { db, newId, insertVirtualKey } from "../../../../lib/db";
import { currentUser } from "../../../../lib/auth";

// Issue a governed virtual key for the signer's OWN project.
// Cap = dollars funded so far (hard, no rollover). Allowlist = models named in the CFQ.
export async function POST(req: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  const { projectId } = await req.json();
  const project = db.prepare("SELECT * FROM projects WHERE id = ? OR slug = ?").get(projectId, projectId) as
    { id: string; owner_id: string; cfq_id: string; method: string } | undefined;
  if (!project) return NextResponse.json({ error: "Unknown project." }, { status: 404 });
  if ((project as { owner_id: string }).owner_id !== (user as { id: string }).id) {
    return NextResponse.json({ error: "Only the project owner can issue its key." }, { status: 403 });
  }
  const fundedRow = db.prepare("SELECT COALESCE(SUM(amount_cents),0)/100.0 AS usd FROM donations WHERE project_id = ?")
    .get(project.id) as { usd: number };
  if (fundedRow.usd <= 0) {
    return NextResponse.json({ error: "No funding yet; the cap would be zero." }, { status: 400 });
  }
  const rawKey = `cfk_${randomBytes(24).toString("hex")}`;
  const id = newId("vk");
  insertVirtualKey({
    id,
    project_id: project.id,
    beneficiary_id: (user as { id: string }).id,
    key_hash: createHash("sha256").update(rawKey).digest("hex"),
    cap_credits: fundedRow.usd,
    // The Question's method field names the models; the allowlist is a hard subset of that.
    model_allowlist: project.method,
  });
  // Raw key appears exactly once, in this response; only its hash is stored.
  return NextResponse.json({ ok: true, key: rawKey, cap_credits: fundedRow.usd, note: "Store it now. It is not shown again." });
}
