import { NextResponse } from "next/server";
import { db, receiptsForProject } from "../../../../lib/db";

// Public, read-only project data: funding state + receipts (the trust product).
export async function GET(_req: Request, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;
  const project = db.prepare("SELECT id, cfq_id, slug, name, one_liner, question, deliverable, done_criteria, falsified_by, deadline FROM projects WHERE slug = ?")
    .get(slug) as Record<string, string> | undefined;
  if (!project) return NextResponse.json({ error: "Unknown project." }, { status: 404 });
  const fundedRow = db.prepare("SELECT COALESCE(SUM(amount_cents),0)/100.0 AS usd, COUNT(*) AS n FROM donations WHERE project_id = ?")
    .get(project.id) as { usd: number; n: number };
  const receipts = receiptsForProject(project.id).map(r => ({
    id: r.id, ts: r.ts, model: r.model, kind: r.kind,
    tokens_in: r.tokens_in, tokens_out: r.tokens_out,
    cost_usd: r.cost_usd, outcome: r.outcome,
  }));
  return NextResponse.json({
    cfq_id: project.cfq_id, name: project.name, question: project.question,
    deliverable: project.deliverable, done_criteria: project.done_criteria,
    falsified_by: project.falsified_by, deadline: project.deadline,
    funded_usd: fundedRow.usd, donors: fundedRow.n, receipts,
  });
}
