// GET /api/categories — the layered rail's count rollup (header pass v2).
// Shape per spec: { tops: [{ top, count, subs: [{ sub, count }] }] } where
// count = COUNT(*) WHERE projects.status='active' AND category=top AND
// subcategory=sub, computed with exactly TWO SQL statements (one per
// GROUP BY level) and walked against lib/categories.ts in JS (the tolerant
// dashes<->spaces comparison lives there; SQLite LIKE/REPLACE gymnastics
// would just re-implement normCat badly).
// Numbers are mechanism-backed, never decorative: a 0 renders as 0.
// cacheComponents (Next 16) law — same as /api/home: route segment configs
// (force-dynamic) are ILLEGAL in this repo; a plain handler runs per request
// and Cache-Control: no-store keeps the response uncacheable.
import { NextResponse, connection } from "next/server";
import { db } from "../../../lib/db";
import { CATEGORY_TAXONOMY, normCat } from "../../../lib/categories";

export async function GET() {
  // cacheComponents law: a plain GET handler is static-by-default and its
  // response rides the Next route cache (x-nextjs-cache: HIT even under
  // Cache-Control: no-store — proven 2026-11-08 when freshly imported and
  // hand-recategorised rows never moved the rail counts). `await connection()`
  // is the per-request opt-out the repo relies on (segment configs are banned).
  await connection();
  const noStore = { "cache-control": "no-store" } as const;
  try {
    // Query 1/2: the top-level bins — every distinct (normalized) category with
    // its active-project count. Unclassified rows are absent by definition.
    const topRows = db
      .prepare(
        `SELECT category AS c, COUNT(*) AS n
         FROM projects
         WHERE status = 'active' AND category IS NOT NULL
         GROUP BY category`
      )
      .all() as Array<{ c: string; n: number }>;
    // Query 2/2: the sub bins, same law.
    const subRows = db
      .prepare(
        `SELECT category AS c, subcategory AS s, COUNT(*) AS n
         FROM projects
         WHERE status = 'active' AND category IS NOT NULL AND subcategory IS NOT NULL
         GROUP BY category, subcategory`
      )
      .all() as Array<{ c: string; s: string; n: number }>;

    const tops = CATEGORY_TAXONOMY.map((t) => {
      const topNorm = normCat(t.top);
      const count = topRows.reduce(
        (acc, r) => acc + (normCat(r.c) === topNorm ? Number(r.n) : 0),
        0
      );
      const subs = t.subs.map((s) => {
        const subNorm = normCat(s);
        const sc = subRows.reduce(
          (acc, r) =>
            acc + (normCat(r.c) === topNorm && normCat(r.s) === subNorm ? Number(r.n) : 0),
          0
        );
        return { sub: s, count: sc };
      });
      return { top: t.top, count, subs };
    });

    return NextResponse.json({ tops }, { headers: noStore });
  } catch {
    // Degrade law (same as /api/home): an unreadable ledger yields an EMPTY
    // taxonomy (the rail renders, counts show as loading ellipses), never a 500.
    return NextResponse.json({ tops: [] }, { status: 200, headers: noStore });
  }
}
