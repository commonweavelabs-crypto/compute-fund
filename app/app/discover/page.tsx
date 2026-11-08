// THE STANDARD CATEGORY TEMPLATE PAGE (Gui's ask, 2026-11-06): /discover is
// ONE page that serves the full catalog AND every category and subcategory
// (?cat=…, ?cat=&sub=… from the rail) in the homepage's v0 design language —
// no forks, the tabs and single Shell stay. This file renders <main> only
// (never its own chrome — C-3 law); main carries .cf0/.cf0-main so the v0
// tokens scope the whole board (same design feel as the homepage; v0 ignores
// the light-theme toggle by design).
//
// Data = a tiny server-side lib/db read (same active board slice + donations
// sum as /api/home, so homepage and catalog can never disagree), sorted by the
// SAME four tabs as the homepage (?tab=): trending (D5: the velocity rollup —
// 7-day fund×10/follow×3/view×1) / newest (default) / ending soon (deadline
// asc, nothing excluded — funded stays visible) / community priority (D5:
// follows count desc with the velocity rollup as tiebreak — the real M6.1
// seed). The tab list is a plain GET form of real <button role=tab> semantics
// that navigates without any client JS; the active tab is aria-selected and
// the grid is its tabpanel.
//
// D5: the two mechanism tabs are REAL — trending = the velocity rollup,
// community = follows count desc. Card counts stay mirrored with /api/home.
//
// Header pass v2 (Gui-approved): ?cat=<top>&sub=<sub> (slugified link params
// from the rail drawers) filter the board. LAW: when a category filter is
// present it takes PRECEDENCE over the tab ORDER — the category board renders
// newest-first, and the tab form carries the filter as hidden inputs (the
// tabs stay reachable; the status line states what actually ordered the grid).
//
// Template header (the v0 block): when a filter is present the page opens with
// the mono eyebrow 'BROWSING COMPUTE', the display heading = the pretty
// category (+' · '+pretty sub), one honest line from lib/categories' copy map,
// and SERVER-rendered chips: '<n> projects' + the sibling sub links as
// selectable chips (the current sub is phos-highlighted via .cf0-fchip.on).
// Clicking a chip re-enters page 1. The plain catalog renders the same block
// with the full-board count.
//
// Pagination: SERVER-side, 8 cards/page (?page=N; prev/next are real <Link>s
// styled like the tab buttons — no JS; tab submits and filter chips carry no
// ?page, so they reset to page 1). Out-of-range pages clamp to the last page.
//
// Grid + empties: the 4-col MediaCard grid (components/home-client) with the
// homepage's funded/pct/vbar/CLAIM-IT anatomy — deadlineLive renders the
// hydration-safe DaysLeft chip (its law: browser clock in a post-hydration
// effect, never a Date.now() during SSR). GUI'S LAW: /discover keeps the FULL
// honest board — the demo-project exclusion is NOT applied here (unlike the
// homepage's curation rows). The honest empty states keep their copy and name
// the sub when one is set. An unreadable DB degrades to the same honest
// empty — never an error page.
//
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
import { CATEGORY_TAXONOMY, normCat, prettyLabel, slugify, categoryBlurb } from "../../lib/categories";
import { artFor } from "../../lib/art-map";
// MediaCard = the homepage's v0 photo card (client component, serializable
// props only): thumb, UNIT strip, pct/vbar, donors/deadline, claim-it chip.
import { MediaCard, type Cf0Card } from "../../components/home-client";

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

// Template-pagination page size (Gui: "6 cards/page... use 8").
const PAGE_SIZE = 8;

type SP = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function DiscoverPage({ searchParams }: SP) {
  // The top-level headers() await is the request-time opt-out — after it the
  // board can read searchParams + the DB inline (single pass, no hole).
  await headers();
  return (
    <main className="wrap cf0 cf0-main">
      <DiscoverBoard searchParams={searchParams} />
    </main>
  );
}

function pick(sp: Record<string, string | string[] | undefined>, key: string): string {
  const v = sp[key];
  return (Array.isArray(v) ? v[0] : v) ?? "";
}

async function DiscoverBoard({
  searchParams,
}: {
  searchParams: SP["searchParams"];
}) {
  const sp = await searchParams;
  const tab = parseTab(pick(sp, "tab"));

  // -- header pass v2: ?cat= / ?sub= (slug params from the rail) --------------
  // The rail links carry SLUGS (slugify), the DB rows carry display forms
  // ("recomp ports", "decision-models") — the two meet only through normCat
  // (lowercase, dashes <-> spaces), the same tolerant compare /api/categories
  // uses, so ?cat=gaming&sub=recomp-ports and a ?sub=recomp%20ports variant
  // both resolve. Unknown cats still filter (honestly empty).
  const catSlug = slugify(pick(sp, "cat"));
  const subSlug = slugify(pick(sp, "sub"));
  const catNorm = catSlug ? normCat(catSlug) : "";
  const subNorm = subSlug ? normCat(subSlug) : "";
  const taxTop = catNorm ? CATEGORY_TAXONOMY.find((t) => normCat(t.top) === catNorm) : undefined;
  const taxSub = taxTop && subNorm ? taxTop.subs.find((s) => normCat(s) === subNorm) : undefined;
  const catLabel = taxTop ? taxTop.top : catSlug ? catSlug.replace(/-/g, " ") : "";
  const subLabel = taxSub ? taxSub : subNorm ? subSlug.replace(/-/g, " ") : "";
  const hasCat = catNorm !== "";

  // -- server-side pagination ------------------------------------------------
  let page = Math.max(1, parseInt(pick(sp, "page") || "1", 10) || 1);

  let allIn: Cf0Card[] = []; // the full active board (stable unit indexing)
  let dbFailed = false;
  try {
    const vel = velocityBySlug();
    const fols = followsBySlug();
    const rows = db
      .prepare(
        `SELECT p.slug, p.name, p.one_liner, p.cfq_id, p.budget_credits, p.deadline,
                p.logo_path, p.repo_url, p.created_at, p.category, p.subcategory, p.claimed,
                (SELECT COUNT(*) FROM receipts r WHERE r.project_id = p.id) AS receipts,
                COALESCE(d.usd, 0) AS funded_usd, COALESCE(d.n, 0) AS donors,
                o.slug AS org_slug, o.name AS org_name
         FROM projects p
         LEFT JOIN (SELECT project_id, SUM(amount_cents) / 100.0 AS usd, COUNT(*) AS n
                    FROM donations GROUP BY project_id) d ON d.project_id = p.id
         LEFT JOIN orgs o ON o.id = p.owner_org_id
         WHERE p.status = 'active'`
      )
      .all() as Array<Record<string, unknown>>;
    // Same card math as /api/home + the homepage board (usd = SUM/100,
    // pct = funded/budget), enriched with the v0 MediaCard furniture: claimed,
    // per-project receipt count, UNIT placeholder index, themed art. The unit
    // index is stable (board row order), so pagination never re-numbers cards.
    allIn = rows.map((r, i): Cf0Card => {
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
        claimed: Number(r.claimed) ? 1 : 0,
        receipts: Number(r.receipts) || 0,
        unit: String(42 + i).padStart(4, "0"),
        art: artFor(String(r.slug ?? "")),
      };
    });
  } catch (err) {
    // Hard DB failure degrades to the honest empty state — never an error page
    // (the same degrade law as /api/home).
    console.error("discover board read failed:", err);
    dbFailed = true;
  }

  // Category/sub WHERE-equivalents in JS (the tolerant compare has to
  // normalize both sides — the DB may store "decision-models" while the
  // taxonomy top says "decision models"). inCat keeps the cat-unsubbed set for
  // the header chips' honest counts.
  const inCat = hasCat
    ? allIn.filter((c) => normCat(c.category ?? "") === catNorm)
    : allIn;
  let cards = subNorm
    ? inCat.filter((c) => normCat(c.subcategory ?? "") === subNorm)
    : inCat;

  if (hasCat) {
    // cat precedence (the documented law above): a filtered category board is
    // ALWAYS newest-first, regardless of ?tab — the tab form stays reachable
    // but a filtered category cannot be reordered by tab.
    cards.sort((a, b) => b.created_at.localeCompare(a.created_at));
  } else {
    cards = [...cards].sort(TAB_SORTS[tab]);
  }

  // The pagination slice: 8 per page; ?page beyond the last clamps to it (the
  // status line still carries the full honest count).
  const total = cards.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  if (page > totalPages) page = totalPages;
  const pageCards = dbFailed ? [] : cards.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const activeTab = hasCat
    ? TABS.find((t) => t.id === "newest") ?? TABS[1] // honest: the render IS newest-first
    : TABS.find((t) => t.id === tab) ?? TABS[1];

  const claimedMap: Record<string, number> = {};
  for (const c of allIn) claimedMap[c.slug] = c.claimed ?? 1;

  // Header chips' honest counts (server-rendered, same tolerant compare as
  // the /api/categories rail rollup).
  const catCount = hasCat ? inCat.length : allIn.length;
  const subCountOf = (s: string) =>
    inCat.filter((c) => normCat(c.subcategory ?? "") === normCat(s)).length;

  const filterTail = subNorm
    ? `category: ${prettyLabel(catLabel)} · sub: ${prettyLabel(subLabel)}`
    : hasCat
      ? `category: ${prettyLabel(catLabel)}`
      : "";

  // prev/next page hrefs carry the current filter (cat/sub or tab) — chips and
  // tab submits never carry ?page, so they always re-enter page 1.
  const pageHref = (n: number): string => {
    const qs: string[] = [];
    if (hasCat) {
      qs.push(`cat=${encodeURIComponent(catSlug)}`);
      if (subSlug) qs.push(`sub=${encodeURIComponent(subSlug)}`);
    } else {
      qs.push(`tab=${tab}`);
    }
    qs.push(`page=${n}`);
    return `/discover?${qs.join("&")}`;
  };

  const heading = hasCat
    ? { top: prettyLabel(catLabel), sub: subLabel ? prettyLabel(subLabel) : "" }
    : { top: "Discover", sub: "" };

  return (
    <>
      {/* v0 template header: eyebrow / display heading / one honest line. The
          copy map lives in lib/categories (patronage tone, no investor speak);
          the unknown-cat fallback keeps the block honest. Server-rendered
          chips: the count + sibling sub links (current sub = phos chip). */}
      <section className="cf0-cathead" aria-labelledby="cf0-cath1">
        <p className="cf0-eyebrow mono">browsing compute</p>
        <h1 id="cf0-cath1" className="cf0-cath1 cf0-display">
          {heading.top}
          {heading.sub ? <span className="cf0-catdot"> · {heading.sub}</span> : null}
        </h1>
        <p className="cf0-catdesc mono">{categoryBlurb(catLabel)}</p>
        <div className="cf0-chiprow">
          {hasCat ? (
            <>
              <Link
                className={"cf0-countchip mono" + (subSlug ? "" : " on")}
                href={`/discover?cat=${encodeURIComponent(catSlug)}`}
                aria-current={subSlug ? undefined : "page"}
              >
                {catCount} project{catCount === 1 ? "" : "s"}
              </Link>
              {taxTop
                ? taxTop.subs.map((s) => {
                    const isCur = subNorm !== "" && normCat(s) === subNorm;
                    return (
                      <Link
                        key={s}
                        className={"cf0-fchip mono" + (isCur ? " on" : "")}
                        href={`/discover?cat=${encodeURIComponent(catSlug)}&sub=${encodeURIComponent(slugify(s))}`}
                        aria-current={isCur ? "page" : undefined}
                      >
                        {s}
                        <span className="cf0-fcount">{subCountOf(s)}</span>
                      </Link>
                    );
                  })
                : null}
              {/* a ?sub= outside the taxonomy still gets its honest chip */}
              {subSlug && !taxSub ? (
                <Link
                  className="cf0-fchip mono on"
                  href={`/discover?cat=${encodeURIComponent(catSlug)}&sub=${encodeURIComponent(subSlug)}`}
                  aria-current="page"
                >
                  {subLabel}
                </Link>
              ) : null}
            </>
          ) : (
            <span className="cf0-countchip mono on" aria-current="page">
              {catCount} project{catCount === 1 ? "" : "s"}
            </span>
          )}
        </div>
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
          actually rendered). Tab submits carry no ?page → page 1. */}
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
        {total} active project{total === 1 ? "" : "s"}
        {filterTail ? ` · ${filterTail}` : ""} · sorted by{" "}
        {hasCat
          ? "newest (category filter takes precedence over the tab order)"
          : activeTab.label.toLowerCase()}
        {totalPages > 1 ? ` · page ${page} of ${totalPages}` : ""}
      </div>

      {dbFailed ? (
        <div className="cf0-warm" role="status">
          <p>
            The catalog could not be read right now — refresh in a moment. The reader answers again
            the second the fund is back.
          </p>
        </div>
      ) : total ? (
        <>
          {/* the v0 MediaCard grid — the homepage's card anatomy (funded /
              pct / vbar / claim-it), full honest board (demo exclusion is a
              homepage curation law, never applied here) */}
          <div
            className="cf0-cards"
            id="discover-panel"
            role="tabpanel"
            aria-labelledby={`dtab-${activeTab.id}`}
          >
            {pageCards.map((p) => (
              <MediaCard key={p.slug} p={p} idx={0} claimedMap={claimedMap} deadlineLive />
            ))}
          </div>
          {totalPages > 1 && (
            <nav className="cf0-pages" aria-label="catalog pages">
              {page > 1 ? (
                <Link className="cf0-page" href={pageHref(page - 1)}>
                  ← prev
                </Link>
              ) : (
                <span className="cf0-page cf0-page-off" aria-disabled="true">
                  ← prev
                </span>
              )}
              <span className="cf0-pageinfo mono">
                page {page} / {totalPages}
              </span>
              {page < totalPages ? (
                <Link className="cf0-page" href={pageHref(page + 1)}>
                  next →
                </Link>
              ) : (
                <span className="cf0-page cf0-page-off" aria-disabled="true">
                  next →
                </span>
              )}
            </nav>
          )}
        </>
      ) : hasCat ? (
        // honest filtered empty state (header pass v2; the copy names the sub
        // when one is set — unchanged)
        <div className="cf0-warm" role="status">
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
        <div className="cf0-warm" role="status">
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
