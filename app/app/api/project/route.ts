import { NextResponse } from "next/server";
import { newId, insertProject, nextCfqId, orgBySlug, projectBySlug, setProjectStatus, setProjectFields, setProjectOrg, orgsOwnedBy } from "../../../lib/db";
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

  const status = body.status === "draft" ? "draft" : "active";
  const name: string = body.name?.trim();
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 60) + "-" + Date.now().toString(36).slice(-4);
  const cfqId = nextCfqId();
  const id = newId("prj");

  let ownerOrgId: string | null = null;
  if (body.org_slug) {
    const org = orgBySlug(String(body.org_slug)) as { id: string; owner_id: string } | undefined;
    if (!org) return NextResponse.json({ error: "Unknown organization." }, { status: 404 });
    if (org.owner_id !== (user as { id: string }).id) return NextResponse.json({ error: "Not your organization." }, { status: 403 });
    ownerOrgId = org.id;
  }

  insertProject({
    id, cfq_id: cfqId, owner_id: (user as { id: string }).id, slug,
    name, one_liner: body.one_liner?.trim() ?? name,
    question: draft.question, data_inputs: draft.data_inputs, method: draft.method,
    deliverable: draft.deliverable, done_criteria: draft.done_criteria,
    falsified_by: draft.falsified_by, review_process: draft.review_process,
    budget_credits: draft.budget_credits, deadline: draft.deadline, assumptions: draft.assumptions,
    status, logo_path: body.logo_path ?? null, repo_url: body.repo_url ?? null,
    links: body.links ? JSON.stringify(body.links) : null, owner_org_id: ownerOrgId,
    story: body.story ?? null, roadmap: body.roadmap ?? null,
  });
  return NextResponse.json({ ok: true, slug, cfq_id: cfqId, status });
}

// Owner updates: publish a draft ("project open" moment), move under an org
// (TRANSFERABLE law), or edit surface fields.
export async function PATCH(req: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  const uid = (user as { id: string }).id;
  const body = await req.json();
  const p = projectBySlug(String(body.slug)) as
    { id: string; owner_id: string; status: string; slug: string } | undefined;
  if (!p) return NextResponse.json({ error: "Unknown project." }, { status: 404 });
  if (p.owner_id !== uid) return NextResponse.json({ error: "Not your project." }, { status: 403 });

  if (body.action === "publish") {
    if (p.status !== "draft") return NextResponse.json({ error: "Already published." }, { status: 409 });
    setProjectStatus(p.id, "active");
    return NextResponse.json({ ok: true, status: "active", slug: p.slug });
  }
  if (body.action === "transfer") {
    if (body.org_slug === undefined || body.org_slug === null) return NextResponse.json({ error: "org_slug required ('' = personal)." }, { status: 400 });
    if (body.org_slug === "") { setProjectOrg(p.id, null); return NextResponse.json({ ok: true, org: null }); }
    const org = orgBySlug(String(body.org_slug)) as { id: string; owner_id: string } | undefined;
    if (!org) return NextResponse.json({ error: "Unknown organization." }, { status: 404 });
    if (org.owner_id !== uid) return NextResponse.json({ error: "Not your organization." }, { status: 403 });
    setProjectOrg(p.id, org.id);
    return NextResponse.json({ ok: true, org: org.id });
  }
  if (body.fields) {
    setProjectFields(p.id, body.fields);
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ error: "Unknown action." }, { status: 400 });
}

export async function GET() {
  const user = await currentUser();
  if (!user) return NextResponse.json({ orgs: [] });
  return NextResponse.json({ orgs: orgsOwnedBy((user as { id: string }).id) });
}
