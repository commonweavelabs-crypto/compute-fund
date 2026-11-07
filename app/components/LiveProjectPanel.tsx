"use client";
import type React from "react";
import { useEffect, useState } from "react";

type Receipt = { id: string; ts: string; model: string; kind: string; tokens_in: number; tokens_out: number; cost_usd: number; outcome: string };
type Live = { cfq_id: string; funded_usd: number; donors: number; receipts: Receipt[] };
type ClaimState = { slug: string; name?: string; claimed: boolean; claimable: boolean; repo_url?: string | null };

// Live panel on the project page: funding state from the database, receipts appended after
// each governed run, demo funding button, and key issuance for the owner. Demo payment is
// labeled demo everywhere it appears. D2: UNCLAIMED projects (research-imported stubs)
// get a maintainer-claim section; a successful claim moves REAL ownership to the claimant.
export default function LiveProjectPanel({ slug, isOwner }: { slug: string; isOwner: boolean }) {
  const [live, setLive] = useState<Live | null>(null);
  const [claim, setClaim] = useState<ClaimState | null>(null);
  const [proofRepo, setProofRepo] = useState("");
  const [proofText, setProofText] = useState("");
  const [iClaimed, setIClaimed] = useState(false);
  const [note, setNote] = useState<React.ReactNode>("");
  const [key, setKey] = useState("");
  const [busy, setBusy] = useState("");
  const [me, setMe] = useState<{ display_name?: string } | null>(null);
  // D5 follow button: state from GET /api/follow (truth, not a guess), then an
  // optimistic toggle (flip immediately, revert on failure; 401 = sign-in note).
  const [following, setFollowing] = useState<boolean | null>(null);
  const [followCount, setFollowCount] = useState<number | null>(null);
  // The claim moves real ownership: right after it lands, the claimant is the owner
  // even before the page's next /api/ownerof round-trip picks it up.
  const ownerNow = isOwner || iClaimed;

  function refresh() {
    fetch(`/api/pubproj/${slug}`).then(r => r.json()).then(setLive);
  }
  useEffect(refresh, [slug]);
    useEffect(() => {
    let alive = true;
    fetch("/api/session").then(r => (r.ok ? r.json() : null)).then(d => {
      if (alive && d?.user) setMe({ display_name: d.user.display_name });
    }).catch(() => {});
    return () => { alive = false; };
  }, []);
useEffect(() => {
    if (!slug) return;
    fetch(`/api/claim?slug=${encodeURIComponent(slug)}`).then(r => r.json()).then(d => {
      if (!d.error) {
        setClaim(d);
        if (d.repo_url) setProofRepo(d.repo_url);
      }
    });
    fetch(`/api/follow?slug=${encodeURIComponent(slug)}`).then(r => r.json()).then(d => {
      setFollowing(!!d.following);
      setFollowCount(Number(d.count ?? 0));
    }).catch(() => { setFollowing(false); });
  }, [slug]);

  async function toggleFollow() {
    // Optimistic: flip at click-time; a failed request reverts and notes why.
    const next = !following;
    setFollowing(next);
    setFollowCount((c) => Math.max(0, (c ?? 0) + (next ? 1 : -1)));
    try {
      const res = await fetch("/api/follow", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });
      const d = await res.json().catch(() => ({}));
      if (res.ok) {
        setFollowing(!!d.following);
        setFollowCount(Number(d.count ?? 0));
      } else {
        setFollowing(!next);
        setFollowCount((c) => Math.max(0, (c ?? 0) + (next ? -1 : 1)));
        if (res.status === 401) {
          setNote(<>Sign in to follow this project — <a href={`/login?next=${encodeURIComponent(`/p/${slug}`)}`}>you come right back</a>.</>);
        } else setNote(d.error ?? "Follow failed.");
      }
    } catch {
      setFollowing(!next);
      setFollowCount((c) => Math.max(0, (c ?? 0) + (next ? -1 : 1)));
      setNote("The follow did not stick — try again in a moment.");
    }
  }

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
  async function submitClaim() {
    setBusy("claim");
    const res = await fetch("/api/claim", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, proof: { repo_url: proofRepo, proof_text: proofText } }),
    });
    const d = await res.json().catch(() => ({}));
    setBusy("");
    if (res.status === 401) {
      setNote(
        <>
          <b>Before you claim — connect your GitHub.</b>
          <br />Claims here are bound to real maintainers, so builders trust
          them. One click and you&apos;re right back on this page.
          <br />
          <a className="cf0-btn" href={`/login?next=${encodeURIComponent(`/p/${slug}`)}`}>Connect GitHub ↗</a>
          <br />
          <small>You&apos;ll need to be signed in with the GitHub account that owns this project&apos;s repository — your handle has to match the maintainer&apos;s. That&apos;s how we keep claims honest.</small>
        </>
      );
      return;
    }
    if (res.status === 409) {
      setNote("Already claimed — another maintainer got here first.");
      return;
    }
    if (res.status === 422) {
      setNote(<>Proof rejected: {d.error ?? "the repo URL must match this project's repo exactly."} MVP proof = the exact repo URL + your maintainership statement; commit-hash verification lands later.</>);
      return;
    }
    if (res.status === 403) {
      // MAINTAINER-PROOF LAW (2026-11-07): the maintainer's identity is bound to
      // the claim — surface the exact reason (e.g. misdirected claim attempts).
      setNote(<>Claim refused: {d.error ?? "the maintainer's GitHub identity does not match."}</>);
      return;
    }
    if (res.ok) {
      setIClaimed(true);
      // stale-UI fix (Gui 2026-11-07): the ownership moved server-side —
      // refresh so every surface (panel, homepage, receipts) reflects it.
      fetch("/api/session").then(() => window.location.reload());
      setNote(`Claim recorded ✓ — ownership moved to you (receipt ${d.receipt_id ?? ""}). Executor role unlocked below; on your next visit the page recognizes you as the owner.`);
      refresh();
      fetch(`/api/claim?slug=${encodeURIComponent(slug)}`).then(r => r.json()).then(setClaim);
    } else setNote(d.error ?? "Claim failed.");
  }

  return (
    <section className="cfq">
      <div className="cfqhead"><span>LIVE FUNDING</span>{live && <span className="cfqid">donors: {live.donors}</span>}</div>
      <p className="cfqq">{live ? `$${live.funded_usd.toFixed(2)} funded` : "loading…"}</p>
      {/* D5: compact follow button — a real <button> (keyboard reachable), the
          aria-pressed state mirrors the ledger, count is the project's real
          follows total (community-picks signal). */}
      <div className="tier-row" style={{ marginTop: 8 }}>
        <button
          type="button"
          className="btn ghost"
          aria-pressed={!!following}
          aria-label={following ? `Following this project — ${followCount ?? 0} followers total` : `Follow this project — ${followCount ?? 0} followers total`}
          onClick={toggleFollow}
          disabled={following === null}
        >
          {following === null ? "…" : following ? "★ following" : "☆ follow"}
          {followCount ? ` · ${followCount}` : ""}
        </button>
      </div>
      <div className="tier-row">
        {(["25","100","500"] as const).map(t => (
          <button key={t} className="tier-btn" onClick={() => fund(t)} disabled={busy === t} aria-label={`Fund ${t} dollars, demo`}>
            ${t}{busy === t ? "…" : " · demo"}
          </button>
        ))}
      </div>
      {claim && !claim.claimed && (
        <div style={{ marginTop: 14 }}>
          <div className="cfqhead"><span>MAINTAINERSHIP — UNCLAIMED</span>{claim.repo_url && <a className="cfqid" href={claim.repo_url} rel="noopener noreferrer">repo ↗</a>}</div>
          {me === null ? (
            <p className="cfqq">UNCLAIMED — are you its maintainer? Claim it.</p>
          ) : me ? (
            <p className="cfqq">UNCLAIMED — are you its maintainer, {me.display_name ?? "friend"}? Claim it.</p>
          ) : null}
          <p className="onedim">
            Research-imported stubs wait here until the real maintainer claims them. Claiming moves
            real ownership to you (an ops receipt is written). MVP proof: the project's repo URL
            (must match exactly) plus a maintainership statement; commit-hash verification lands later.
          </p>
          {me !== null && (
          <>
          <div className="tier-row" style={{ marginTop: 8 }}>
            <input
              className="inp" type="url" value={proofRepo}
              onChange={e => setProofRepo(e.target.value)}
              placeholder="https://github.com/<org>/<repo>" aria-label="Repo URL (proof)"
            />
          </div>
          <div className="tier-row">
            <input
              className="inp" type="text" value={proofText}
              onChange={e => setProofText(e.target.value)}
              placeholder="Maintainership statement (e.g. 'I maintain this repo.')"
              aria-label="Maintainership statement"
            />
          </div>
          <div className="tier-row">
            <button className="btn btn-primary" onClick={submitClaim} disabled={busy === "claim"}>
              {busy === "claim" ? "claiming…" : "Claim as maintainer"}
            </button>
          </div>
          </>
          )}
          {me === null && (
            <div className="tier-row" style={{ marginTop: 8 }}>
              <a className="btn btn-primary" href={`/login?next=${encodeURIComponent(`/p/${slug}`)}`}>Connect GitHub to claim ↗</a>
              <p className="onedim" style={{ marginTop: 6 }}>
                <b>Before you claim — connect your GitHub.</b> Claims here are bound to real
                maintainers, so builders trust them. One click and you&apos;re right back on this page.
                <br />
                <small>
                  You&apos;ll need to be signed in with the GitHub account that owns this project&apos;s
                  repository — your handle has to match the maintainer&apos;s. That&apos;s how we keep claims
                  honest.
                </small>
              </p>
            </div>
          )}
        </div>
      )}
      {ownerNow && (
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
