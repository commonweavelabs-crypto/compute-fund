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
// Header pass v2 (Gui-approved): ?cat=<top>&sub=<sub> (slugified link params
// from the rail drawers) filter the board. LAW: when a category filter is
// present it takes PRECEDENCE over the tab ORDER — the category board renders
// newest-first, and the tab form carries the filter as hidden inputs (the
// tabs stay reachable; the status line states what actually ordered the grid).
// The heading carries the filter ("Gaming" instead of "Discover").
// Streaming law (set by /p/[slug], 2026-11-06): header pass v2 hit the
// /discover Suspense-hole's dev fill aborting out-of-place (stale shell +
// content appended inert after the scripts — the "runs TWICE per request in
// dev" double-pass the /p comment already warned about). The board is a
// BLOCKING route now, same as /p: `instant = false` + a top-level headers()
// await = ONE runtime pass per request, nothing at build time, normal
// in-place hydration; the Suspense hole is gone (no fallback needed).
import { headers } from "next/headers";
import Link from "next/link";
import type { Metadata } from "next";
import { db } from "../../lib/db";
import { velocityBySlug, followsBySlug } from "../../lib/discover";
import type { HomeCard, TabId } from "../api/home/route";
import { CATEGORY_TAXONOMY, normCat, prettyLabel, slugify } from "../../lib/categories";
// DaysLeft = the hydration-safe "x days left" chip (browser clock in an
// effect — see the file header; a bare Date.now() in the hole aborts the
// cacheComponents fill with blocking-prerender-current-time).
import { DaysLeft } from "./DaysLeft";
// Art treatment = the homepage's: themed art per slug, served as the prebuilt
// 800px jpg thumbs (lazy, explicit width/height), via artThumb + art-map.
import { artFor, artThumb, THUMB_W, THUMB_H } from "../../lib/art-map";

export const metadata: Metadata = {
  title: "Discover — Compute Fund",
  description:
    "The live catalog of projects seeking patronage: trending, newest, ending soon, community priority. Every run posts a public receipt.",
};

// Request-keyed blocking route (the /p/[slug] cacheComponents law): one
// runtime pass per request, no prerender, no hole.
export const instant = false;

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

type SP = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function DiscoverPage({ searchParams }: SP) {
  // The top-level headers() await is the request-time opt-out — after it the
  // board can read searchParams + the DB inline (single pass, no hole).
  await headers();
  return (
    <main className="wrap">
      <DiscoverBoard searchParams={searchParams} />
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

  // -- header pass v2: ?cat= / ?sub= (slug params from the rail) --------------
  // The rail links carry SLUGS (slugify), the DB rows carry display forms
  // ("recomp ports", "decision-models") — the two meet only through normCat
  // (lowercase, dashes <-> spaces), the same tolerant compare /api/categories
  // uses, so ?cat=gaming&sub=recomp-ports and a ?sub=recomp%20ports variant
  // both resolve. Unknown cats still filter (honestly empty).
  const rawCat = Array.isArray(sp.cat) ? sp.cat[0] : sp.cat;
  const rawSub = Array.isArray(sp.sub) ? sp.sub[0] : sp.sub;
  const catSlug = slugify(String(rawCat ?? ""));
  const subSlug = slugify(String(rawSub ?? ""));
  const catNorm = catSlug ? normCat(catSlug) : "";
  const subNorm = subSlug ? normCat(subSlug) : "";
  const taxTop = catNorm ? CATEGORY_TAXONOMY.find((t) => normCat(t.top) === catNorm) : undefined;
  const taxSub = taxTop && subNorm ? taxTop.subs.find((s) => normCat(s) === subNorm) : undefined;
  const catLabel = taxTop ? taxTop.top : catSlug ? catSlug.replace(/-/g, " ") : "";
  const subLabel = taxSub ? taxSub : subNorm ? subSlug.replace(/-/g, " ") : "";
  const hasCat = catNorm !== "";

  let cards: HomeCard[] = [];
  let dbFailed = false;
  try {
    const vel = velocityBySlug();
    const fols = followsBySlug();
    const rows = db
      .prepare(
        `SELECT p.slug, p.name, p.one_liner, p.cfq_id, p.budget_credits, p.deadline,
                p.logo_path, p.repo_url, p.created_at, p.category, p.subcategory,
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
          category: (r.category as string | null) ?? null,
          subcategory: (r.subcategory as string | null) ?? null,
        };
      })
      // Header pass v2: the category/sub WHERE-equivalents, applied here in JS
      // — the board already reads the full active slice for the rollups, and
      // the tolerant compare has to normalize both sides anyway (the DB may
      // store "decision-models" while the taxonomy top says "decision models").
      .filter((c) => (catNorm ? normCat(c.category ?? "") === catNorm : true))
      .filter((c) => (subNorm ? normCat(c.subcategory ?? "") === subNorm : true));

    if (hasCat) {
      // cat precedence (the documented law above): a filtered category board is
      // ALWAYS newest-first, regardless of ?tab — the tab form stays reachable
      // but a filtered category cannot be reordered by tab.
      cards.sort((a, b) => b.created_at.localeCompare(a.created_at));
    } else {
      cards = cards.sort(TAB_SORTS[tab]);
    }
  } catch (err) {
    // Hard DB failure degrades to the honest empty state — never an error page
    // (the same degrade law as /api/home).
    console.error("discover board read failed:", err);
    dbFailed = true;
  }

  const activeTab = hasCat
    ? TABS.find((t) => t.id === "newest") ?? TABS[1] // honest: the render IS newest-first
    : TABS.find((t) => t.id === tab) ?? TABS[1];

  const shownCount = cards.length;
  const filterTail = subNorm
    ? `category: ${prettyLabel(catLabel)} · sub: ${prettyLabel(subLabel)}`
    : hasCat
      ? `category: ${prettyLabel(catLabel)}`
      : "";

  return (
    <>
      {/* hero: the heading carries the filter ("Gaming" instead of "Discover") */}
      <section className="hero center dhead">
        <h1>
          {hasCat ? prettyLabel(catLabel) : "Discover"}
          {subLabel ? <span className="hl"> · {prettyLabel(subLabel)}</span> : null}
        </h1>
        <p className="sub center">
          {hasCat
            ? "One category of the live catalog, newest first — the rail's sub links land here with the sub pre-filtered. Money in, compute out, public receipts."
            : "The live catalog of projects seeking patronage — sorted by the same four orders as the homepage board. Money in, compute out, public receipts."}
        </p>
        {hasCat && (
          <p className="cf0-clearfilter">
            <Link href="/discover">× clear the {prettyLabel(catLabel)} filter — the full catalog</Link>
          </p>
        )}
      </section>

      {/* tab list = plain GET form: real <button role=tab> semantics that work
          with scripts off; the active tab is aria-selected, the grid below is
          its tabpanel. With a category filter the cat/sub ride along as hidden
          inputs (the filter takes precedence over the tab ORDER — see the law
          comment above; the selected tab stays "newest" because that is what
          actually rendered). */}
      <form method="get" action="/discover" className="tabform">
        {hasCat && <input type="hidden" name="cat" value={catSlug} />}
        {hasCat && subSlug && <input type="hidden" name="sub" value={subSlug} />}
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
              aria-selected={t.id === activeTab.id}
              tabIndex={t.id === activeTab.id ? 0 : -1}
              className="tab"
            >
              {t.label}
            </button>
          ))}
        </div>
      </form>

      <div className="dmeta" role="status">
        {shownCount} active project{shownCount === 1 ? "" : "s"}
        {filterTail ? ` · ${filterTail}` : ""} · sorted by{" "}
        {hasCat
          ? "newest (category filter takes precedence over the tab order)"
          : activeTab.label.toLowerCase()}
      </div>

      {dbFailed ? (
        <div className="warm" role="status">
          <p>
            The catalog could not be read right now — refresh in a moment. The reader answers again
            the second the fund is back.
          </p>
        </div>
      ) : cards.length ? (
        <div className="recomm" id="discover-panel" role="tabpanel" aria-labelledby={`dtab-${activeTab.id}`}>
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
                <DaysLeft deadline={p.deadline} />
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
      ) : hasCat ? (
        // honest filtered empty state (header pass v2): "<cat> is warming"
        <div className="warm" role="status">
          <p>
            {prettyLabel(catLabel)}{subLabel ? ` · ${prettyLabel(subLabel)}` : ""} is warming —
            nothing here yet.
          </p>
          <p>
            <Link href="/start">Start a project →</Link> ·{" "}
            <Link href="/discover">the full catalog →</Link>
          </p>
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

