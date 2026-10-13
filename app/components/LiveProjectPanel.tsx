"use client";
import type React from "react";
import { useEffect, useState } from "react";

type Receipt = { id: string; ts: string; model: string; kind: string; tokens_in: number; tokens_out: number; cost_usd: number; outcome: string };
type Live = { cfq_id: string; funded_usd: number; donors: number; receipts: Receipt[] };

// Live panel on the project page: funding state from the database, receipts appended after
// each governed run, demo funding button, and key issuance for the owner. Demo payment is
// labeled demo everywhere it appears.
export default function LiveProjectPanel({ slug, isOwner }: { slug: string; isOwner: boolean }) {
  const [live, setLive] = useState<Live | null>(null);
  const [note, setNote] = useState<React.ReactNode>("");
  const [key, setKey] = useState("");
  const [busy, setBusy] = useState("");

  function refresh() {
    fetch(`/api/pubproj/${slug}`).then(r => r.json()).then(setLive);
  }
  useEffect(refresh, [slug]);

  async function fund(tier: "25" | "100" | "500") {
    setBusy(tier);
    const res = await fetch("/api/fund", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId: slug, tier }),
    });
    const d = await res.json().catch(() => ({}));
    setBusy("");
    if (res.ok && d.url) {
      // Stripe test/live mode: redirect to the hosted checkout. The webhook confirms.
      window.location.assign(d.url);
      return;
    }
    if (res.status === 401) {
      setNote(<>Sign in to fund this project — <a href={`/login?next=${encodeURIComponent(`/p/${slug}`)}`}>you come right back</a>.</>);
      return;
    }
    if (res.ok) { setNote(`+$${tier} demo payment recorded. In live mode this is a real card charge.`); refresh(); }
    else setNote(d.error ?? "Funding failed.");
  }
  async function issueKey() {
    setBusy("key");
    const res = await fetch("/api/gateway/mykey", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId: slug }),
    });
    const d = await res.json().catch(() => ({}));
    setBusy("");
    if (res.ok && d.key) { setKey(d.key); setNote(`Cap: $${d.cap_credits}. The key is shown once; only its hash is stored.`); }
    else if (res.status === 401) {
      setNote(<>Sign in as the project owner to issue the key — <a href={`/login?next=${encodeURIComponent(`/p/${slug}`)}`}>you come right back</a>.</>);
    }
    else setNote(d.error ?? "Key issuance failed.");
  }

  return (
    <section className="cfq">
      <div className="cfqhead"><span>LIVE FUNDING</span>{live && <span className="cfqid">donors: {live.donors}</span>}</div>
      <p className="cfqq">{live ? `$${live.funded_usd.toFixed(2)} funded` : "loading…"}</p>
      <div className="tier-row">
        {(["25","100","500"] as const).map(t => (
          <button key={t} className="tier-btn" onClick={() => fund(t)} disabled={busy === t} aria-label={`Fund ${t} dollars, demo`}>
            ${t}{busy === t ? "…" : " · demo"}
          </button>
        ))}
      </div>
      {isOwner && (
        <div className="tier-row">
          <button className="ghost" onClick={issueKey} disabled={busy === "key"}>Issue governed key</button>
        </div>
      )}
      {note && <p className="form-note" role="status">{note}</p>}
      {key && <p className="key-reveal"><span className="hint">governed key (shown once):</span><code>{key}</code></p>}
      <div className="cfqhead" style={{marginTop: 14}}><span>COMPUTE RECEIPTS (LIVE)</span></div>
      {live?.receipts?.length ? (
        <table className="rcpt-table">
          <thead><tr><th>ts</th><th>model</th><th>kind</th><th>tok in</th><th>tok out</th><th>cost</th><th>outcome</th></tr></thead>
          <tbody>
            {live.receipts.map(r => (
              <tr key={r.id}>
                <td>{String(r.ts).slice(0, 19).replace("T", " ")}</td><td>{r.model}</td><td>{r.kind}</td>
                <td>{r.tokens_in}</td><td>{r.tokens_out}</td><td>${r.cost_usd.toFixed(4)}</td>
                <td>{r.outcome}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : <p className="onedim">No compute spent against this question yet. Receipts appear here after each governed run.</p>}
    </section>
  );
}
