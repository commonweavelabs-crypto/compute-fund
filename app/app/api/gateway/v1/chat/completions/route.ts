import { NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { db, virtualKeyByKeyHash, addSpend, insertReceipt, newId } from "../../../../../../lib/db";

// The governed completion endpoint. One OpenAI-compatible shape, three governance layers:
// 1 key valid + under hard cap  2 model in allowlist  3 spend logged as an append-only receipt.
const UPSTREAM = process.env.CF_GATEWAY_UPSTREAM || "https://ollama.com/v1";
const UPSTREAM_KEY = process.env.CF_GATEWAY_KEY || "";

export async function POST(req: Request) {
  const auth = req.headers.get("authorization") || "";
  const rawKey = auth.replace(/^Bearer\s+/i, "");
  const vk = virtualKeyByKeyHash(createHash("sha256").update(rawKey).digest("hex")) as {
    id: string; project_id: string; cap_credits: number; spent_credits: number; model_allowlist: string;
  } | undefined;
  if (!vk) return NextResponse.json({ error: "Invalid or revoked key." }, { status: 401 });

  const body = await req.json();
  const model: string = body.model;
  const allowlist: string[] = JSON.parse(vk.model_allowlist);
  if (!allowlist.includes(model)) {
    return NextResponse.json({ error: `Model ${model} is not in this project's allowlist.` }, { status: 403 });
  }
  if (vk.spent_credits >= vk.cap_credits) {
    return NextResponse.json({ error: "Project budget exhausted. Hard cap: no rollover, no recharge." }, { status: 402 });
  }

  const upstream = await fetch(`${UPSTREAM}/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${UPSTREAM_KEY}` },
    body: JSON.stringify(body),
  });
  const result = await upstream.json();
  const usage = result.usage ?? { prompt_tokens: 0, completion_tokens: 0 };
  // Credit accounting uses the platform's cost basis, not the patron's. One cost source:
  // dollars funded. 1 credit = $1 of compute at platform rates.
  const cost = Number(process.env.CF_EST_COST_USD_PER_1K_TOKENS ?? 0.002) *
    ((usage.prompt_tokens + usage.completion_tokens) / 1000);

  const project = db.prepare("SELECT cfq_id FROM projects WHERE id = ?").get(vk.project_id) as { cfq_id: string };
  insertReceipt({
    id: newId("rcp"), project_id: vk.project_id, cfq_id: project.cfq_id, ts: new Date().toISOString(),
    model, kind: "generation", tokens_in: usage.prompt_tokens, tokens_out: usage.completion_tokens,
    cost_usd: Number(cost.toFixed(4)), outcome: upstream.ok ? "success" : "failure",
    output_hash: createHash("sha256").update(JSON.stringify(result.choices ?? result)).digest("hex").slice(0, 16),
    api_key_id: vk.id,
  });
  addSpend(vk.id, cost);
  return NextResponse.json(result, { status: upstream.status });
}
