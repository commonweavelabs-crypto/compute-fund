import { NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { claimProjectBySlug, projectClaimState } from "../../../lib/db";
import { currentUser } from "../../../lib/auth";

// D2-CLAIM-FLOW: maintainer proof -> executor role.
// A claim moves REAL ownership: owner_id -> the claimant, claimed 0 -> 1,
// receipted as an 'ops' row. MVP proof is honest and mechanical: the proof's
// repo_url must normalize to the SAME repo the stub carries, plus a written
// maintainership statement. Commit-hash verification lands later (ladder step 2).

// Repo normalization: lowercase, no scheme/www/trailing-slash/.git. Also accepts
// the bare "owner/repo" shorthand as github.com/owner/repo (never loosens identity).
function normalizeRepo(raw: string): string {
  let u = raw.trim().toLowerCase();
  u = u.replace(/^https?:\/\//, "").replace(/^\/+/, "").replace(/\.git$/, "").replace(/\/+$/, "");
  u = u.replace(/^www\./, "");
  if (!u.includes(".") && /[a-z0-9_-]+\/[a-z0-9_.-]+/.test(u)) u = `github.com/${u}`;
  return u;
}

// Public claim state for the project page panel (repo_url is already public via pubproj).
export async function GET(req: Request) {
  const slug = new URL(req.url).searchParams.get("slug");
  if (!slug) return NextResponse.json({ error: "slug required." }, { status: 400 });
  const p = projectClaimState(slug);
  if (!p || p.status === "draft") return NextResponse.json({ error: "Unknown project." }, { status: 404 });
  return NextResponse.json({
    slug: p.slug, name: p.name, repo_url: p.repo_url,
    claimed: !!p.claimed, claimable: !p.claimed && !!p.repo_url,
  });
}

export async function POST(req: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Sign in to claim." }, { status: 401 });
  const uid = (user as { id: string }).id;

  const body = await req.json().catch(() => ({}));
  const slug = String(body.slug ?? "");
  const proof = (body.proof ?? {}) as { repo_url?: string; proof_text?: string };
  const repo = String(proof.repo_url ?? "").trim();
  const statement = String(proof.proof_text ?? "").trim();
  if (!slug) return NextResponse.json({ error: "slug required." }, { status: 400 });
  if (!repo || !statement) {
    return NextResponse.json({ error: "Proof requires repo_url and proof_text (the maintainership statement)." }, { status: 400 });
  }

  const p = projectClaimState(slug);
  if (!p || p.status === "draft") return NextResponse.json({ error: "Unknown project." }, { status: 404 });
  if (p.claimed) return NextResponse.json({ error: "Already claimed — this project has a real owner." }, { status: 409 });

  if (!p.repo_url) {
    return NextResponse.json({ error: "Proof does not name the project's repo." }, { status: 422 });
  }
  const target = normalizeRepo(p.repo_url);
  const offered = normalizeRepo(repo);
  if (offered !== target) {
    return NextResponse.json({ error: "Proof does not name the project's repo." }, { status: 422 });
  }

  const proofHash = createHash("sha256")
    .update(`${slug}|${target}|${statement}|${uid}`)
    .digest("hex").slice(0, 16);
  const res = claimProjectBySlug(slug, uid, proofHash);
  if (res.ok) {
    return NextResponse.json({
      ok: true, claimed: true, slug: p.slug, owner_id: res.owner_id, receipt_id: res.receipt_id,
      next: "Executor role unlocked: issue the governed key. The claim moves real ownership; commit-hash verification lands later.",
    });
  }
  if (res.reason === "already-claimed") {
    return NextResponse.json({ error: "Already claimed — this project has a real owner." }, { status: 409 });
  }
  return NextResponse.json({ error: "Claim could not be recorded." }, { status: 500 });
}
