import { NextResponse } from "next/server";
import { db, receiptsForProject } from "../../../../lib/db";
import { currentUser } from "../../../../lib/auth";

// Public, read-only project data: funding state + receipts (the trust product).
// DRAFT projects are private: they 404 here unless the caller is the owner.
export async function GET(_req: Request, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;
  const project = db.prepare("SELECT id, cfq_id, slug, name, one_liner, question, deliverable, done_criteria, falsified_by, deadline, status, logo_path, repo_url, links, owner_org_id FROM projects WHERE slug = ?")
    .get(slug) as Record<string, string | null> | undefined;
  if (!project) return NextResponse.json({ error: "Unknown project." }, { status: 404 });
  if (project.status === "draft") {
    const user = await currentUser();
    const owner = db.prepare("SELECT owner_id FROM projects WHERE slug = ?").get(slug) as { owner_id: string } | undefined;
    if (!user || !owner || (user as { id: string }).id !== owner.owner_id) {
      return NextResponse.json({ error: "Unknown project." }, { status: 404 });
    }
  }
  const pid = String(project.id ?? "");
  const fundedRow = db.prepare("SELECT COALESCE(SUM(amount_cents),0)/100.0 AS usd, COUNT(*) AS n FROM donations WHERE project_id = ?")
    .get(pid) as { usd: number; n: number };
  const receipts = receiptsForProject(pid).map(r => ({
    id: r.id, ts: r.ts, model: r.model, kind: r.kind,
    tokens_in: r.tokens_in, tokens_out: r.tokens_out,
    cost_usd: r.cost_usd, outcome: r.outcome,
  }));
  return NextResponse.json({
    cfq_id: project.cfq_id, name: project.name, question: project.question,
    deliverable: project.deliverable, done_criteria: project.done_criteria,
    falsified_by: project.falsified_by, deadline: project.deadline,
    funded_usd: fundedRow.usd, donors: fundedRow.n, receipts,
    status: project.status ?? "active", logo_path: project.logo_path,
    repo_url: project.repo_url, links: project.links ? JSON.parse(project.links as string) : [],
    one_liner: project.one_liner,
  });
}
