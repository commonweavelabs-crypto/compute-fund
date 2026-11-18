// OPEN DATA — the community's search signals, fully anonymized.
// Every row = (query, result count, timestamp). No user identity is ever
// stored with a search (D5.3 law). The zero-result feed = the category-gap
// signal; the hot feed = what the community wants. Open to everyone.
import { NextResponse } from "next/server";
import { db } from "../../../lib/db";


export async function GET() {
  try {
    const totals = db.prepare(`SELECT COUNT(*) AS n_30d FROM search_queries WHERE at >= datetime('now','-30 days')`).get() as { n_30d: number };
    const all = db.prepare("SELECT COUNT(*) AS n_all FROM search_queries").get() as { n_all: number };
    const top = db.prepare(`SELECT q, COUNT(*) AS hits FROM search_queries WHERE n_results > 0 AND at >= datetime('now','-30 days') GROUP BY lower(q) ORDER BY hits DESC LIMIT 25`).all();
    const zero = db.prepare(`SELECT q, COUNT(*) AS hits FROM search_queries WHERE n_results = 0 AND at >= datetime('now','-30 days') GROUP BY lower(q) ORDER BY hits DESC LIMIT 25`).all();
    const daily = db.prepare(`SELECT date(at) AS d, COUNT(*) AS n FROM search_queries WHERE at >= datetime('now','-14 days') GROUP BY d ORDER BY d`).all();
    return NextResponse.json({
      about: "Anonymized search signals for computefund.dev. No user identity is recorded — only the query, the result count and the timestamp. Zero-result queries = category gaps we may fill.",
      totals: totals ?? {}, all: all ?? {},
      top_queries_30d: top,
      zero_result_30d: zero,
      daily_14d: daily,
      license: "CC0 1.0 — open data, use freely.",
    });
  } catch (e) {
    return NextResponse.json({ error: "search signals unavailable" }, { status: 500 });
  }
}
