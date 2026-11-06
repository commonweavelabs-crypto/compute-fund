// C-3/C-4: /discover rebuild — the Phase-2 stub (which mounted a DUPLICATE
// header of its own + old furniture) is gone; this page rides the single
// global Shell (components/Shell via the root layout) like every other route:
// one header, one footer, per page. This file renders <main> only — never its
// own chrome.
// Data = a tiny server-side lib/db read (same active board slice + donations
// sum as /api/home, so homepage and catalog can never disagree), sorted by the
// SAME four tabs as the homepage (?tab=): trending (D5: the velocity rollup —
// 7-day fund×10/follow×3/view×1) / newest (default) / ending soon (deadline
// asc, nothing excluded — funded stays visible) / community priority (D5:
// follows count desc with the velocity rollup as tiebreak — the real M6.1
// seed). The tab list is a plain GET form of real
// <button role=tab> semantics that navigates without any client JS; the active
// tab is aria-selected and the grid is its tabpanel.
// D5: the two mechanism tabs are now REAL — trending = the velocity rollup
// (7-day fund×10/follow×3/view×1, lib/discover.ts), community = follows count
// desc with the velocity rollup as tiebreak (the M6.1 seed). Card counts stay
// mirrored with /api/home (velocityBySlug/followsBySlug are the same SQL).
import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { db } from "../../lib/db";
import { velocityBySlug, followsBySlug } from "../../lib/discover";
import type { HomeCard, TabId } from "../api/home/route";
// Art treatment = the homepage's: themed art per slug, served as the prebuilt
// 800px jpg thumbs (lazy, explicit width/height), via artThumb + art-map.
import { artFor, artThumb, THUMB_W, THUMB_H } from "../../lib/art-map";

export const metadata: Metadata = {
  title: "Discover — Compute Fund",
  description:
    "The live catalog of projects seeking patronage: trending, newest, ending soon, community priority. Every run posts a public receipt.",
};

// Tab ids/labels mirror the homepage TABS line-for-line (server twin).
const TABS: Array<{ id: TabId; label: string }> = [
  { id: "trending", label: "Trending" },
  { id: "newest", label: "Newest" },
  { id: "ending", label: "Ending soon" },
  { id: "community", label: "Community priority" },
];

// Mirrors /api/home parseTab/TAB_SORTS (types imported from the route keep one
// card shape; the comparators are duplicated here because a route module is an
// entry point — values are never imported out of one).
function parseTab(raw: string | null | undefined): TabId {
  const v = (raw ?? "").toLowerCase().replace(/[^a-z]/g, "");
  if (v === "trending") return "trending";
  if (v === "endingsoon" || v === "ending") return "ending";
  if (v === "community" || v === "communitypriority") return "community";
  return "newest";
}
const TAB_SORTS: Record<TabId, (a: HomeCard, b: HomeCard) => number> = {
  // D5 trending: velocity desc (the rollup), then most funded, then oldest.
  trending: (a, b) =>
    (b.velocity ?? 0) - (a.velocity ?? 0) ||
    b.funded_usd - a.funded_usd ||
    a.created_at.localeCompare(b.created_at),
  newest: (a, b) => b.created_at.localeCompare(a.created_at),
  ending: (a, b) =>
    a.deadline.localeCompare(b.deadline) ||
    b.fraction - a.fraction ||
    a.created_at.localeCompare(b.created_at),
  // D5 community priority: follows desc, velocity tiebreak, slug determinism
  // (mirrors /api/home TAB_SORTS exactly — the M6.1 seed is now the real move).
  community: (a, b) =>
    (b.follows ?? 0) - (a.follows ?? 0) ||
    (b.velocity ?? 0) - (a.velocity ?? 0) ||
    a.slug.localeCompare(b.slug),
};

const money = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

const timeLeft = (deadline: string): string => {
  if (!deadline) return "—";
  const d = Math.ceil((new Date(deadline).getTime() - Date.now()) / 86400000);
  if (d > 1) return `${d} days left`;
  if (d === 1) return "1 day left";
  if (d === 0) return "final day";
  return "ended";
};

type SP = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default function DiscoverPage({ searchParams }: SP) {
  // cacheComponents law: uncached reads (the searchParams await + the DB read
  // keyed to it) must sit inside a Suspense hole — the static shell prerenders
  // with the fallback and the board streams on the request path. (The build
  // proved the law for us: without the boundary the /discover prerender
  // errored with blocking-prerender-dynamic.)
  return (
    <main className="wrap">
      <section className="hero center dhead">
        <h1>Discover</h1>
        <p className="sub center">
          The live catalog of projects seeking patronage — sorted by the same four orders as the
          homepage board. Money in, compute out, public receipts.
        </p>
      </section>
      <Suspense fallback={<p className="boot" role="status">▚ loading the catalog…</p>}>
        <DiscoverBoard searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

async function DiscoverBoard({
  searchParams,
}: {
  searchParams: SP["searchParams"];
}) {
  const sp = await searchParams;
  const raw = Array.isArray(sp.tab) ? sp.tab[0] : sp.tab;
  const tab = parseTab(raw);

  let cards: HomeCard[] = [];
  let dbFailed = false;
  try {
    const vel = velocityBySlug();
    const fols = followsBySlug();
    const rows = db
      .prepare(
        `SELECT p.slug, p.name, p.one_liner, p.cfq_id, p.budget_credits, p.deadline,
                p.logo_path, p.repo_url, p.created_at,
                COALESCE(d.usd, 0) AS funded_usd, COALESCE(d.n, 0) AS donors,
                o.slug AS org_slug, o.name AS org_name
         FROM projects p
         LEFT JOIN (SELECT project_id, SUM(amount_cents) / 100.0 AS usd, COUNT(*) AS n
                    FROM donations GROUP BY project_id) d ON d.project_id = p.id
         LEFT JOIN orgs o ON o.id = p.owner_org_id
         WHERE p.status = 'active' AND p.budget_credits > 0`
      )
      .all() as Array<Record<string, unknown>>;
    cards = rows
      .map((r): HomeCard => {
        const budget = Number(r.budget_credits) || 0;
        const funded = Number(r.funded_usd) || 0;
        const fraction = budget > 0 ? funded / budget : 0;
        return {
          slug: String(r.slug ?? ""),
          name: String(r.name ?? ""),
          one_liner: String(r.one_liner ?? ""),
          cfq_id: String(r.cfq_id ?? ""),
          budget_credits: budget,
          funded_usd: funded,
          donors: Number(r.donors) || 0,
          pct: Math.min(100, Math.round(fraction * 100)),
          fraction,
          deadline: String(r.deadline ?? ""),
          logo_path: (r.logo_path as string | null) || null,
          repo_url: (r.repo_url as string | null) || null,
          created_at: String(r.created_at ?? ""),
          org_slug: (r.org_slug as string | null) || null,
          org_name: (r.org_name as string | null) || null,
          velocity: vel[String(r.slug ?? "")] ?? 0,
          follows: fols[String(r.slug ?? "")] ?? 0,
        };
      })
      .sort(TAB_SORTS[tab]);
  } catch (err) {
    // Hard DB failure degrades to the honest empty state — never an error page
    // (the same degrade law as /api/home).
    console.error("discover board read failed:", err);
    dbFailed = true;
  }

  const activeTab = TABS.find((t) => t.id === tab) ?? TABS[1];

  return (
    <>
      {/* tab list = plain GET form: real <button role=tab> semantics that work
          with scripts off; the active tab is aria-selected, the grid below is
          its tabpanel. */}
      <form method="get" action="/discover" className="tabform">
        <div className="tabs" role="tablist" aria-label="discover sort order">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="submit"
              name="tab"
              value={t.id}
              role="tab"
              id={`dtab-${t.id}`}
              aria-controls="discover-panel"
              aria-selected={t.id === tab}
              tabIndex={t.id === tab ? 0 : -1}
              className="tab"
            >
              {t.label}
            </button>
          ))}
        </div>
      </form>

      <div className="dmeta" role="status">
        {cards.length} active project{cards.length === 1 ? "" : "s"} · sorted by{" "}
        {activeTab.label.toLowerCase()}
      </div>

      {dbFailed ? (
        <div className="warm" role="status">
          <p>
            The catalog could not be read right now — refresh in a moment. The reader answers again
            the second the fund is back.
          </p>
        </div>
      ) : cards.length ? (
        <div className="recomm" id="discover-panel" role="tabpanel" aria-labelledby={`dtab-${tab}`}>
          {cards.map((p) => (
            <article className="rcard" key={p.slug}>
              {/* same art treatment as the homepage cards: thumb + lazy + dims */}
              <img
                src={artThumb(artFor(p.slug))}
                alt=""
                className="rcard-art"
                width={THUMB_W}
                height={THUMB_H}
                loading="lazy"
                decoding="async"
              />
              <h3>
                <Link href={`/project/${p.slug}`} className="cardlink">
                  {p.name}
                </Link>
              </h3>
              <div
                className="mini-line"
                role="progressbar"
                aria-label={`${p.name} funding progress`}
                aria-valuenow={p.pct}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <i style={{ ["--pct" as string]: `${p.pct}%` }} />
              </div>
              <p className="one">{p.one_liner}</p>
              <div className="tagchips">
                <span className="tag live">LIVE</span>
                <span className="tag">{p.cfq_id}</span>
                {p.repo_url && <span className="tag">repo</span>}
              </div>
              <div className="rmeta">
                <span>{money(p.funded_usd)} raised</span>
                <span>·</span>
                <span>{p.pct}% funded</span>
                <span>·</span>
                <span>{timeLeft(p.deadline)}</span>
                {p.org_slug && (
                  <>
                    <span>·</span>
                    <Link href={`/org/${p.org_slug}`}>{p.org_name}</Link>
                  </>
                )}
                <span className="go">
                  <Link href={`/project/${p.slug}`}>view →</Link>
                </span>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="warm" role="status">
          <p>
            The catalog is warming — no active projects on the board yet. Name a question and fund
            it, or browse the homepage while the fund wakes up.
          </p>
          <p>
            <Link href="/start">Start a project →</Link> · <Link href="/">back to the grid →</Link>
          </p>
        </div>
      )}
    </>
  );
}

