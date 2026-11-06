// C-8 DESIGN REVERSAL — mainline homepage rebuilt in the v0 approved design
// language (compute-fund-v0/src/app/archive/page.tsx 642-950, Gui's approved
// hero/featured/recommended/strip/values sections) with LIVE board data.
// Section order is v0's: hero (eyebrow / typed-terminal display h1 / mono sub /
// CTAs / 3 real HeroMetrics / living photo panel) → auto-rotating
// featured photo-card (stats side panel + receipt cascade + dots) →
// "Recommended for you" behind the EXISTING 4 tabs (the C-4 aria work kept;
// v0 tab styling; the heading lives inside the client component so it renders
// exactly once) → "Open for funding" strip (v0 B-style with vbar) → the
// Kickstarter-style discovery rows: first the D5 MECHANISM rows (staff picks =
// ONLY the Gui-owned staff_pick flag; then What's buzzing now / Ready for
// forking / Community picks / Most funded this month, each one rollup in
// lib/discover.ts against real events/follows/donations), then the three v0
// board slices (Nearly funded / Just launched / Open for claims) — every row
// auto-hides unless ≥2 qualifying projects (staff picks ≥1; an empty mechanism
// is an honest empty, never an invented card), and each see-all lands on the
// closest /discover tab (velocity → trending, follows/claims → community) →
// the v0 value-prop trio. The global Shell (header + footer) stays mounted by
// the root
// layout; this page never mounts chrome (C-3 law).
//
// Data = the live SQLite board, read the EXACT /api/home way: the route's GET
// query + card math (usd = SUM(amount_cents)/100, pct = funded/budget_credits)
// are mirrored here so the homepage, /api/home and /discover can never
// disagree — the two extra live columns this page adds (claimed, per-project
// receipt count) feed the v0 furniture. Keep the query in sync with the route.
//   metrics  = machine-time under stewardship (Σ funded) · patrons (Σ donors) ·
//              runs on the record (receipts count) — server-computed, no fetch
//   featured = /api/home's featured rule (most funded, then deadline, oldest)
//              and heads the 5-card rotation pool
//   tabs     = trending / newest / ending / community (TAB_SORTS imported from
//              the route); tab clicks re-fetch /api/home?tab=X and swap only
//              the grid; the featured slot is never repeated in any grid
//   strip    = the 3 next-newest projects (v0 takes the Newest slice of 3)
//   art      = lib/art-map.ts places themed v0 archive art per slug
//              (illustrative placeholders; no logos anywhere)
// Board reads are dynamic (cacheComponents opt-out: the headers() read below
// is the same request-time trick /api/home uses).
import { headers } from "next/headers";

// cacheComponents: the homepage is a BLOCKING route (live board + live metrics,
// no instant shell) — this is the "block" opt-out Next offers for routes whose
// every render must read runtime data (same spirit as /api/home).
export const instant = false;
import Link from "next/link";
import { db } from "../lib/db";
import { TAB_SORTS, type TabId } from "./api/home/route";
import {
  buzzing as buzzingSlugs, forkingReady, communityPicks, mostFunded30d, staffPicks,
  velocityBySlug, followsBySlug,
} from "../lib/discover";
import { artFor, artThumb, THUMB_W, THUMB_H } from "../lib/art-map";
import {
  HeroFilm,
  HeroTyping,
  FeaturedRotator,
  MediaCard,
  RecommendedTabs,
  type Cf0Card,
  type ReceiptLine,
  type TabDef,
} from "../components/home-client";

// Tab ids mirror the C-4 set; labels render through v0's lowercase + CSS
// uppercase (the active tab gets the ▸ prefix from the client component).
const TABS: TabDef[] = [
  { id: "trending", label: "trending" },
  { id: "newest", label: "newest" },
  { id: "ending", label: "ending soon" },
  { id: "community", label: "community priority" },
];
// The pre-tab default board (C-4 law: newest is the old homepage order).
const DEFAULT_TAB: TabId = "newest";

type Board = {
  cards: Cf0Card[];
  pool: Cf0Card[];
  recommended: Cf0Card[];
  strip: Cf0Card[];
  // Kickstarter-style discovery rows (each an honest slice of the SAME board
  // read — duplicates across curation rows are fine, no dedup law):
  nearly: Cf0Card[]; // pct 60..99, deadline asc
  launched: Cf0Card[]; // newest created first
  claims: Cf0Card[]; // unclaimed mirrors (CLAIM IT), newest first
  // D5 mechanism rows (same board read + the SQL rollups in lib/discover):
  buzzing: Cf0Card[]; // velocity > 0 over the last 7d, velocity desc
  forking: Cf0Card[]; // forkingReady() law (unclaimed + wanted + compute-quiet)
  picks: Cf0Card[]; // follows count desc (≥1 follow)
  funded30: Cf0Card[]; // SUM donations last 30d desc (≥1 donation row)
  staff: Cf0Card[]; // ONLY the Gui-owned staff_pick flag (≥1 → row shows)
  receipts: ReceiptLine[];
  claimedMap: Record<string, number>;
  totals: { funded: number; patrons: number; runs: number };
};

const usdFmt = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

function claimOf(p: Cf0Card, map: Record<string, number>): number {
  return p.claimed ?? map[p.slug] ?? 1;
}

async function loadBoard(): Promise<Board> {
  const empty: Board = {
    cards: [], pool: [], recommended: [], strip: [],
    nearly: [], launched: [], claims: [],
    buzzing: [], forking: [], picks: [], funded30: [], staff: [], receipts: [],
    claimedMap: {}, totals: { funded: 0, patrons: 0, runs: 0 },
  };
  try {
    // D5 rollup maps first — cards get velocity/follows at build time so every
    // sort downstream (incl. TAB_SORTS.trending/community) sorts a full card.
    const vel = velocityBySlug();
    const fols = followsBySlug();
    const rows = db
      .prepare(
        `SELECT p.slug, p.name, p.one_liner, p.cfq_id, p.budget_credits, p.deadline,
                p.logo_path, p.repo_url, p.created_at, p.claimed,
                (SELECT COUNT(*) FROM receipts r WHERE r.project_id = p.id) AS receipts,
                COALESCE(d.usd, 0) AS funded_usd, COALESCE(d.n, 0) AS donors,
                o.slug AS org_slug, o.name AS org_name
         FROM projects p
         LEFT JOIN (SELECT project_id, SUM(amount_cents) / 100.0 AS usd, COUNT(*) AS n
                    FROM donations GROUP BY project_id) d ON d.project_id = p.id
         LEFT JOIN orgs o ON o.id = p.owner_org_id
         WHERE p.status = 'active' AND p.budget_credits > 0`
      )
      .all() as Array<Record<string, unknown>>;

    const cards: Cf0Card[] = rows.map((r, i): Cf0Card => {
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
        claimed: Number(r.claimed) ? 1 : 0,
        unit: String(42 + i).padStart(4, "0"),
        art: artFor(String(r.slug ?? "")),
        receipts: Number(r.receipts) || 0,
        velocity: vel[String(r.slug ?? "")] ?? 0,
        follows: fols[String(r.slug ?? "")] ?? 0,
      };
    });

    // Featured = /api/home's featured rule (most funded, soonest deadline, oldest).
    const featured =
      [...cards].sort(
        (a, b) =>
          b.funded_usd - a.funded_usd ||
          a.deadline.localeCompare(b.deadline) ||
          a.created_at.localeCompare(b.created_at)
      )[0] ?? null;

    // Rotation pool v0 = top-5; featured heads it, the rest ranked by funding
    // fraction then funded (the priority stand-in), oldest first on ties.
    const pool: Cf0Card[] = featured
      ? [
          featured,
          ...cards
            .filter((p) => p.slug !== featured.slug)
            .sort(
              (a, b) =>
                b.fraction - a.fraction ||
                b.funded_usd - a.funded_usd ||
                a.created_at.localeCompare(b.created_at)
            )
            .slice(0, 4),
        ]
      : [];

    const recommended = cards
      .filter((p) => !featured || p.slug !== featured.slug)
      .sort(TAB_SORTS[DEFAULT_TAB])
      .slice(0, 4);

    // Open-for-funding strip = v0's tabProjects("Newest").slice(0, 3).
    const strip = cards
      .filter((p) => !featured || p.slug !== featured.slug)
      .sort(TAB_SORTS[DEFAULT_TAB])
      .slice(0, 3);

    // Kickstarter-style discovery rows — three more honest slices of this same
    // board read (duplicates across curation rows are fine; NO dedup law):
    //   nearly  = 60% ≤ pct < 100, deadline asc — urgency first, TAB_SORTS.ending
    //   launched = newest created first, TAB_SORTS.newest
    //   claims  = unclaimed mirror stubs (owner_org_id IS NULL → claimed 0),
    //             newest first; MediaCard keeps the CLAIM IT badge visible
    const nearly = cards
      .filter((p) => p.pct >= 60 && p.pct < 100)
      .sort(TAB_SORTS["ending"])
      .slice(0, 4);
    const launched = [...cards].sort(TAB_SORTS["newest"]).slice(0, 4);
    const claims = cards
      .filter((p) => claimOf(p, {}) === 0)
      .sort(TAB_SORTS["newest"])
      .slice(0, 4);

    // D5 mechanism rows — the mechanisms are SQL rollups in lib/discover.ts; the
    // composition here only maps their slug order onto THIS board's cards.
    // Every row auto-hides when it has <2 qualifying projects (staff picks hide
    // under 1 — one pick is a curation, not a crowd). Empty mechanisms stay
    // hidden: the fund shows only what really happened, never invented rows.
    const byOrder = (order: string[], keep?: (c: Cf0Card) => boolean): Cf0Card[] =>
      order
        .map((s) => cards.find((c) => c.slug === s))
        .filter((c): c is Cf0Card => !!c)
        .filter((c) => (keep ? keep(c) : true))
        .slice(0, 4);
    // buzzing() is already velocity-desc; the keep is belt-and-braces on the
    // board join (budget>0 cards only — a buzzing zero-budget project has no
    // card to show and the row is honest about fewer entries).
    const buzzing = byOrder(buzzingSlugs(), (c) => c.velocity > 0);
    const forking = byOrder(forkingReady());
    const picks = byOrder(communityPicks().map((c) => c.slug));
    const funded30 = byOrder(mostFunded30d().map((c) => c.slug));
    const staff = byOrder(staffPicks());

    // v0 receipt cascade → the real receipts table tail (public data).
    const receipts = (
      db
        .prepare(
          `SELECT r.model, r.cost_usd, p.name AS project
           FROM receipts r LEFT JOIN projects p ON p.id = r.project_id
           ORDER BY r.ts DESC LIMIT 6`
        )
        .all() as Array<Record<string, unknown>>
    ).map((r): ReceiptLine => {
      const c = Number(r.cost_usd) || 0;
      return {
        project: String(r.project ?? "unlinked receipt"),
        model: String(r.model ?? "—"),
        cost: c > 0 ? `$${c.toFixed(4).replace(/0+$/, "").replace(/\.$/, "")}` : "",
      };
    });

    const claimedMap: Record<string, number> = {};
    for (const c of cards) claimedMap[c.slug] = claimOf(c, {});

    const totals = {
      funded: cards.reduce((s, c) => s + c.funded_usd, 0),
      patrons: cards.reduce((s, c) => s + c.donors, 0),
      runs: (db.prepare("SELECT COUNT(*) AS n FROM receipts").get() as { n: number }).n,
    };

    return { cards, pool, recommended, strip, nearly, launched, claims, buzzing, forking, picks, funded30, staff, receipts, claimedMap, totals };
  } catch (err) {
    // Hard DB failure degrades to the honest empty board (never an error page).
    console.error("home board read failed:", err);
    return empty;
  }
}

export default async function Home() {
  // Request-time read = the cacheComponents opt-out (dynamic board, live math).
  await headers();
  const board = await loadBoard();
  const { totals, claimedMap, receipts } = board;

  // Discovery rows render only when ≥2 qualifying projects exist (never an
  // invented card): nearly-funded → ending tab, just-launched → newest,
  // open-for-claims → community tab (the outreach angle). D5 rows join them in
  // v0-strip order — staff picks first (curation beats algorithms; the flag is
  // Gui-owned, so its row hides entirely while the flag is 0 everywhere), then
  // the four mechanisms, each see-all mapping to its closest /discover tab
  // (buzzing/most-funded → trending = velocity, forking/picks → community).
  const discoveryRows = (
    [
      { id: "staff-picks", title: "Staff picks", tab: "", min: 1, cards: board.staff },
      { id: "buzzing-now", title: "What's buzzing now", tab: "trending", min: 2, cards: board.buzzing },
      { id: "ready-for-forking", title: "Ready for forking", tab: "community", min: 2, cards: board.forking },
      { id: "community-picks", title: "Community picks", tab: "community", min: 2, cards: board.picks },
      { id: "most-funded-30d", title: "Most funded this month", tab: "trending", min: 2, cards: board.funded30 },
      { id: "nearly-funded", title: "Nearly funded", tab: "ending", min: 2, cards: board.nearly },
      { id: "just-launched", title: "Just launched", tab: "newest", min: 2, cards: board.launched },
      { id: "open-for-claims", title: "Open for claims", tab: "community", min: 2, cards: board.claims },
    ] as const
  ).filter((row) => row.cards.length >= row.min);

  return (
    <main className="wrap cf0-main cf0">
      {/* ── hero (v0 archive 644-706) ── */}
      <section className="cf0-hero">
        <div className="cf0-hero-copy">
          <p className="cf0-eyebrow mono">patronage only · receipts are the product</p>
          <HeroTyping />
          <p className="cf0-sub mono">
            &gt; real open-source projects, mirrored for the commons. fund the tools you
            believe in — every claim verified, every run receipted, every token
            accounted. investors: none.
          </p>
          <div className="cf0-ctas">
            <Link href="/discover" className="cf0-btn mono">
              explore projects →
            </Link>
            <Link href="/guide" className="cf0-btn-ghost mono">
              how it works
            </Link>
          </div>
          <div className="cf0-metrics">
            <div className="cf0-metric">
              <p className="cf0-metric-v mono">{usdFmt(totals.funded)}</p>
              <p className="cf0-metric-l mono">machine-time under stewardship</p>
            </div>
            <div className="cf0-metric">
              <p className="cf0-metric-v mono">{String(totals.patrons)}</p>
              <p className="cf0-metric-l mono">patrons</p>
            </div>
            <div className="cf0-metric">
              <p className="cf0-metric-v mono">{String(totals.runs)}</p>
              <p className="cf0-metric-l mono">runs on the record</p>
            </div>
          </div>
        </div>
        <HeroFilm />
      </section>

      {/* ── featured project (auto-rotating) ── */}
      {board.pool.length > 0 && (
        <FeaturedRotator pool={board.pool} receipts={receipts} claimedMap={claimedMap} />
      )}

      {/* ── recommended for you (tabs + photo grid; the section + heading live
          inside RecommendedTabs — page-level wrapper removed C-9: the heading
          used to render twice) ── */}
      <RecommendedTabs
        tabs={TABS}
        initial={board.recommended}
        initialTab={DEFAULT_TAB}
        claimedMap={claimedMap}
      />

      {/* ── open for funding strip (v0 B-style) ── */}
      <section className="cf0-section" aria-label="open for funding">
        <div className="cf0-rowhead">
          <h2 className="cf0-h2 cf0-display">Open for funding</h2>
          <Link href="/discover" className="cf0-seeall mono">
            see all projects →
          </Link>
        </div>
        {board.strip.length ? (
          <div className="cf0-strip">
            {board.strip.map((p) => (
              <Link
                key={p.slug}
                href={`/p/${p.slug}`}
                className="cf0-scard"
                aria-label={`open ${p.name} — project page`}
              >
                <img
                  src={artThumb(p.art)}
                  alt=""
                  className="cf0-scard-img"
                  width={THUMB_W}
                  height={THUMB_H}
                  loading="lazy"
                  decoding="async"
                />
                <div className="cf0-scard-body">
                  <div className="cf0-scard-line mono">
                    <span className={claimOf(p, claimedMap) ? "cf0-dimmono" : "cf0-amber-s"}>
                      {claimOf(p, claimedMap)
                        ? p.receipts > 0
                          ? "RUNNING"
                          : "STANDBY"
                        : "UNCLAIMED · TOKENS PARKED"}
                    </span>
                    <span className="cf0-amber-s">ends {p.deadline || "open"}</span>
                  </div>
                  <p className="cf0-scard-title">{p.name}</p>
                  <div className="cf0-scard-meta mono">
                    <span className="cf0-phos-s">{p.pct}% funded</span>
                    <span>
                      {usdFmt(p.funded_usd)} / {usdFmt(p.budget_credits)}
                    </span>
                  </div>
                  <div
                    className="cf0-vbar"
                    role="progressbar"
                    aria-label={`${p.name} funding progress`}
                    aria-valuenow={p.pct}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    <i style={{ width: `${p.pct}%` }} />
                  </div>
                  <p className="cf0-scard-view mono">view project →</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="cf0-warm" role="status">
            <p>No live projects on the board yet — be the first to name the question and fund it.</p>
          </div>
        )}
      </section>

      {/* ── discovery rows (Kickstarter-style slices of the same board read;
          a row renders only when ≥2 qualifying projects exist — staff picks
          ≥1; D5 rows see-all → the closest /discover tab) ── */}
      {discoveryRows.map((row) => (
        <section key={row.id} className="cf0-section" aria-label={row.id}>
          <div className="cf0-rowhead">
            <h2 className="cf0-h2 cf0-display">{row.title}</h2>
            <Link
              href={row.tab ? `/discover?tab=${row.tab}` : "/discover"}
              className="cf0-seeall mono"
            >
              see all →
            </Link>
          </div>
          <div className="cf0-cards">
            {row.cards.map((p, i) => (
              <MediaCard key={p.slug} p={p} idx={i} claimedMap={claimedMap} />
            ))}
          </div>
        </section>
      ))}

      {/* ── value props (v0 archive 935-966, exact copy) ── */}
      <section className="cf0-values" aria-label="how the fund works">
        <div className="cf0-value">
          <span className="cf0-glyph mono" aria-hidden="true">⌘</span>
          <span className="cf0-value-body">
            <h3>A community of builders</h3>
            <p className="mono">
              Creators, researchers, and everyday people funding useful work together — no
              investors in the ledger, patronage only.
            </p>
          </span>
        </div>
        <div className="cf0-value">
          <span className="cf0-glyph mono" aria-hidden="true">◎</span>
          <span className="cf0-value-body">
            <h3>Receipts you can verify</h3>
            <p className="mono">
              Every run, prompt, and cost is public. The receipts are the product — open to
              verify, auditable by anyone.
            </p>
          </span>
        </div>
        <div className="cf0-value">
          <span className="cf0-glyph mono" aria-hidden="true">⇄</span>
          <span className="cf0-value-body">
            <h3>No dead tokens</h3>
            <p className="mono">
              Unclaimed work passes the torch: day 90 the community steers parked tokens to
              forks and keeps projects alive. No gates, no gatekeepers.
            </p>
          </span>
        </div>
      </section>
    </main>
  );
}
