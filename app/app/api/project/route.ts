import { NextResponse } from "next/server";
import { db, newId, insertProject, nextCfqId } from "../../../lib/db";
import { currentUser } from "../../../lib/auth";
import { lintCfq, type CfqDraft } from "../../../lib/cfq";

export async function POST(req: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  const body = await req.json();

  const draft: CfqDraft = {
    question: body.question, data_inputs: body.data_inputs, method: body.method,
    deliverable: body.deliverable, done_criteria: body.done_criteria,
    falsified_by: body.falsified_by, review_process: body.review_process,
    budget_credits: Number(body.budget_credits), deadline: body.deadline,
    assumptions: body.assumptions,
  };
  const lint = lintCfq(draft);
  if (lint.length > 0) return NextResponse.json({ errors: lint }, { status: 422 });

  const name: string = body.name?.trim();
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 60) + "-" + Date.now().toString(36).slice(-4);
  const cfqId = nextCfqId();
  const id = newId("prj");
  insertProject({
    id, cfq_id: cfqId, owner_id: (user as { id: string }).id, slug,
    name, one_liner: body.one_liner?.trim() ?? name,
    question: draft.question, data_inputs: draft.data_inputs, method: draft.method,
    deliverable: draft.deliverable, done_criteria: draft.done_criteria,
    falsified_by: draft.falsified_by, review_process: draft.review_process,
    budget_credits: draft.budget_credits, deadline: draft.deadline, assumptions: draft.assumptions,
  });
  return NextResponse.json({ ok: true, slug, cfq_id: cfqId });
}
