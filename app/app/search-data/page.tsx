// SEARCH SIGNALS — the public dashboard. The community's anonymized search
// feed becomes a shared market instrument: hot queries = demand; zero-result
// queries = category gaps the platform should fill. Open data (CC0), no user
// identity anywhere (D5.3 law). The monthly pattern report reads this same
// dataset.
import { db } from "../../lib/db";

export const metadata = { title: "Search Signals — Compute Fund", description: "What the community is looking for, in the open." };

export default function SearchSignalsPage() {
  let top: Array<Record<string, unknown>> = [];
  let zero: Array<Record<string, unknown>> = [];
  let totals: Record<string, number> = { n30: 0, nall: 0 };
  try {
    totals = db.prepare(
      `SELECT SUM(CASE WHEN at >= datetime('now','-30 days') THEN 1 ELSE 0 END) AS n30, COUNT(*) AS nall FROM search_queries`
    ).get() as Record<string, number>;
    top = db.prepare(`SELECT q, COUNT(*) AS hits FROM search_queries WHERE n_results > 0 AND at >= datetime('now','-30 days') GROUP BY lower(q) ORDER BY hits DESC LIMIT 20`).all() as Array<Record<string, unknown>>;
    zero = db.prepare(`SELECT q, COUNT(*) AS hits FROM search_queries WHERE n_results = 0 AND at >= datetime('now','-30 days') GROUP BY lower(q) ORDER BY hits DESC LIMIT 15`).all() as Array<Record<string, unknown>>;
  } catch {}

  return (
    <main className="wrap cf0-main" style={{ maxWidth: 900 }}>
      <h1 className="cf0-h2" style={{ marginTop: 30 }}>SEARCH SIGNALS</h1>
      <p style={{ lineHeight: 1.65, marginTop: 10, opacity: 0.85 }}>
        Every search on this platform — fully anonymized, joined to no account — feeds
        this page. Hot queries tell creators what the community wants next; zero-result
        queries are category gaps we should fill. The full dataset is{" "}
        <a href="/api/search-data" style={{ color: "var(--accent)" }}>open data (CC0)</a> —
        use it freely. Nothing here is tracked to a user; that privacy line is law.
      </p>
      <div className="cf0-cards" style={{ marginTop: 22 }}>
        <div style={{ padding: 14, background: "rgba(0,0,0,.2)", borderRadius: 10 }}>
          <p className="ptitle">SEARCHES · LAST 30 DAYS</p>
          <p className="mono">{totals.n30 ?? 0}</p>
        </div>
        <div style={{ padding: 14, background: "rgba(0,0,0,.2)", borderRadius: 10 }}>
          <p className="ptitle">SEARCHES · ALL TIME</p>
          <p className="mono">{totals.nall ?? 0}</p>
        </div>
      </div>
      <h2 className="cf0-h2" style={{ marginTop: 30 }}>HOT QUERIES · 30 DAYS</h2>
      {top.length === 0 ? (
        <p style={{ opacity: 0.7 }}>Honest zero — no searches yet. The board appears the moment the community starts looking.</p>
      ) : (
        <ul style={{ lineHeight: 1.9 }}>
          {top.map((r, i) => (
            <li key={i}><span className="mono">{String(r.hits)}</span> × <a href={`/discover?q=${encodeURIComponent(String(r.q))}`}>{String(r.q)}</a></li>
          ))}
        </ul>
      )}
      <h2 className="cf0-h2" style={{ marginTop: 30 }}>ZERO-RESULT QUERIES · CATEGORY GAPS</h2>
      {zero.length === 0 ? (
        <p style={{ opacity: 0.7 }}>Honest zero — every search this month found something.</p>
      ) : (
        <p style={{ lineHeight: 1.9 }}>
          {zero.map((r, i) => <span key={i} className="mono" style={{ marginRight: 14 }}>{String(r.q)} ({String(r.hits)})</span>)}
        </p>
      )}
      <p className="mono" style={{ marginTop: 36, opacity: 0.6 }}>
        Monthly pattern reports: compiled by an LLM pass over this dataset and posted as platform blog entries.
      </p>
    </main>
  );
}
