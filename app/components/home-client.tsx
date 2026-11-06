"use client";
// C-8 client parts of the v0-design homepage rebuild (mainline). The v0 archive
// page (compute-fund-v0/src/app/archive/page.tsx 642-950) is the approved design;
// this file carries the pieces that need browser state:
//   HeroFilm          — hero photo panel (still + looping film; ref-callback muted
//                       law, reduced-motion drops the film per the v0 law);
//   FeaturedRotator   — the auto-rotating featured photo-card + stats side panel
//                       with the live-receipt cascade and rotation dots (6s),
//                       no rotation under prefers-reduced-motion;
//   MediaCard         — v0 photo card for the Recommended grid (art via the
//                       art map, vbar funding bar, CFQ chip);
//   RecommendedTabs   — the C-4 tablist port (roving tabindex + arrow keys +
//                       role/aria work kept verbatim), restyled to the v0 tab
//                       buttons; a tab click re-fetches /api/home?tab=X and
//                       swaps ONLY the grid (the server paints the first grid).
// All data arrives via serializable props from the server page — no fetch on
// mount, no Date.now()-dependent SSR text (hydration-safe).
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { HomeCard, TabId } from "../app/api/home/route";
// Prebuilt art thumbs (800px jpgs, ~30-75KB) + intrinsic dims for the img
// width/height attributes — the ~1.2MB pngs stay only for print-time swaps.
import { artFor, artThumb, THUMB_W, THUMB_H, HERO_THUMB } from "../lib/art-map";

export type Cf0Card = HomeCard & {
  claimed?: number; // 1 | 0 | undefined (unknown on tab-fetched cards → resolved via claimedMap)
  unit: string; // v0 furniture: board index + 42, zero-padded (placeholder numbering)
  art: string; // /project-art/<file> from lib/art-map.ts
  receipts: number; // per-project receipt count (featured side panel)
};
export type ReceiptLine = { project: string; model: string; cost: string };
export type TabDef = { id: TabId; label: string };

const money = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

// claim-state resolver: card value first (server-known), then the request-time
// claimedMap, defaulting to claimed — an unknown future project never shows a
// parked badge by accident.
function claimOf(p: Cf0Card, map?: Record<string, number> | null): number {
  return p.claimed ?? map?.[p.slug] ?? 1;
}
// v0 runStatusText, mapped to the live board's two truths: claimed projects run
// receipts (RUNNING) or stand by; unclaimed mirrors sit parked.
function statusText(p: Cf0Card, claimed: number): string {
  if (!claimed) return "UNCLAIMED";
  return p.receipts > 0 ? "RUNNING" : "STANDBY";
}

// animated count-up; respects prefers-reduced-motion (verbatim v0 hook)
function useCountUp(target: number, durationMs = 900) {
  const [value, setValue] = useState(target);
  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(target);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const from = 0;
    const tick = (t: number) => {
      const k = Math.min(1, (t - t0) / durationMs);
      setValue(Math.round(from + (target - from) * (1 - Math.pow(1 - k, 3))));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, durationMs]);
  return value;
}

/* ── hero typed-terminal headline (white → phosphor green, 12-sentence cycle) ── */

// Copy verbatim: [white part, green part] — the flat line is the full sentence.
const HERO_SENTENCES: ReadonlyArray<readonly [string, string]> = [
  ["Fund the work that", "moves us forward."],
  ["Back real builders,", "not marketing decks."],
  ["Compute for the commons,", "receipts for everyone."],
  ["Patronage, not promises —", "proof on the record."],
  ["Park your tokens,", "watch the work ship."],
  ["Every dollar becomes", "machine-time on the record."],
  ["Open source deserves", "a funding model that works."],
  ["The ledger is public.", "The receipts are the product."],
  ["No investors, no equity —", "just people funding work."],
  ["Fund the tools you use,", "then use the tools you funded."],
  ["Claims get verified.", "Runs get receipted."],
  ["A community effort,", "on the public record."],
];
const HERO_FLAT: ReadonlyArray<string> = HERO_SENTENCES.map(([w, g]) => `${w} ${g}`);
// Zero-layout-shift law: an invisible sizer carries the widest line so the h1
// reserves the longest sentence's full wrapped height at every breakpoint.
const HERO_SIZER = HERO_FLAT.reduce((a, b) => (b.length > a.length ? b : a));
const TYPE_MS = 30; // per-char in
const HOLD_MS = 3500; // full-sentence hold
const ERASE_MS = 12; // fast out-delete
const SWAP_MS = 320; // caret-dark beat between sentences
const H1_STATIC_TITLE = "Fund compute, not promises - Compute Fund";

type TypePhase = "type" | "hold" | "erase" | "swap";

export function HeroTyping() {
  // SSR paints sentence 1 whole (hydration-safe, no-js fallback, SEO reads it);
  // the machine takes over on mount: type → hold → fast out-delete → swap.
  const [sentIdx, setSentIdx] = useState(0);
  const [n, setN] = useState(HERO_FLAT[0].length);
  const [phase, setPhase] = useState<TypePhase>("hold");
  const [reduced, setReduced] = useState(false);

  // Reduced-motion law: resolve once mounted (server + first client paint agree),
  // then every sentence renders whole and instantly — no animation, just swaps.
  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      setReduced(true);
  }, []);

  useEffect(() => {
    if (reduced) {
      // Instant full sentence → hold → instant next (erase/typing are skipped).
      const full = HERO_FLAT[sentIdx].length;
      if (n !== full) {
        setN(full);
        return;
      }
      const t = setTimeout(() => setSentIdx((s) => (s + 1) % HERO_SENTENCES.length), HOLD_MS);
      return () => clearTimeout(t);
    }
    if (phase === "type") {
      if (n < HERO_FLAT[sentIdx].length) {
        const t = setTimeout(() => setN((c) => c + 1), TYPE_MS);
        return () => clearTimeout(t);
      }
      setPhase("hold");
      return;
    }
    if (phase === "hold") {
      const t = setTimeout(() => setPhase("erase"), HOLD_MS);
      return () => clearTimeout(t);
    }
    if (phase === "erase") {
      if (n > 0) {
        const t = setTimeout(() => setN((c) => c - 1), ERASE_MS);
        return () => clearTimeout(t);
      }
      setPhase("swap");
      return;
    }
    // swap: caret dark for one beat, then the next sentence starts typing.
    const t = setTimeout(() => {
      setSentIdx((s) => (s + 1) % HERO_SENTENCES.length);
      setN(0);
      setPhase("type");
    }, SWAP_MS);
    return () => clearTimeout(t);
  }, [reduced, sentIdx, n, phase]);

  const whiteLen = HERO_SENTENCES[sentIdx][0].length;
  const white = HERO_FLAT[sentIdx].slice(0, Math.min(n, whiteLen));
  const green = n > whiteLen ? HERO_FLAT[sentIdx].slice(whiteLen, n) : "";
  return (
    <h1 className="cf0-h1 cf0-display">
      {/* The accessible name stays stable for screen readers: the sr-only static
          title is the only copy AT reads. The typed copy below is aria-hidden
          (nothing to announce mid-type) and carries aria-live="off" per the law. */}
      <span className="cf0-h1-static" aria-hidden="false">
        {H1_STATIC_TITLE}
      </span>
      <span className="cf0-h1-size" aria-hidden="true">
        {HERO_SIZER}
      </span>
      <span className="cf0-h1-type" aria-hidden="true" aria-live="off" data-phase={phase}>
        <span className="cf0-h1-white">{white}</span>
        <span className="cf0-h1-em">{green}</span>
        {phase !== "swap" && <span className={phase === "hold" ? "cf0-caret cf0-caret-blink" : "cf0-caret"} />}
      </span>
    </h1>
  );
}

/* ── hero photo panel ─────────────────────────────────────────────────────── */

export function HeroFilm() {
  // Autoplay belt-and-braces: Chromium can defer the autoplay start (hidden tab
  // / timing), so the effect retries play() once mounted. The muted property is
  // already set by the ref; play() on a muted element needs no user gesture.
  const vidRef = useRef<HTMLVideoElement | null>(null);
  useEffect(() => {
    const el = vidRef.current;
    if (!el) return;
    el.muted = true;
    const p = el.play();
    if (p && typeof p.catch === "function") p.catch(() => {});
  }, []);
  return (
    <div className="cf0-hero-photo">
      <img
        src={HERO_THUMB.src}
        alt=""
        className="cf0-hero-img"
        width={HERO_THUMB.w}
        height={HERO_THUMB.h}
        loading="eager"
        decoding="async"
      />
      <video
        className="cf0-hero-video"
        src="/project-art/hero-loop.mp4"
        poster={HERO_THUMB.src}
        ref={(el) => {
          vidRef.current = el;
          // React skips the muted ATTRIBUTE; set the property directly.
          if (el) el.muted = true;
        }}
        muted
        loop
        autoPlay
        playsInline
        aria-hidden="true"
        tabIndex={-1}
      />
      <div className="cf0-hero-scrim" aria-hidden="true" />
    </div>
  );
}

/* ── featured project (auto-rotating) — v0 archive 705-837 ────────────────── */

export function FeaturedRotator({
  pool,
  receipts,
  claimedMap,
}: {
  pool: Cf0Card[];
  receipts: ReceiptLine[];
  claimedMap: Record<string, number>;
}) {
  const [featuredIdx, setFeaturedIdx] = useState(0);
  useEffect(() => {
    if (pool.length < 2) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;
    const timer = setInterval(() => setFeaturedIdx((i) => (i + 1) % pool.length), 6000);
    return () => clearInterval(timer);
  }, [pool.length]);

  // hooks stay unconditional (Rules of Hooks) even for an empty pool
  const featured = pool[featuredIdx % Math.max(1, pool.length)];
  const featuredPct = useCountUp(featured ? featured.pct : 0);
  if (!featured) return null;
  const claimed = claimOf(featured, claimedMap);
  const status = statusText(featured, claimed);
  const lines = receipts.length > 0 ? receipts.slice(0, 3) : null;

  return (
    <section className="cf0-feat">
      {/* photo card — ONE link, inner elements carry no second link (nesting law) */}
      <Link
        href={`/p/${featured.slug}`}
        className="cf0-feat-photo"
        aria-label={`open ${featured.name} — featured project`}
        key={featured.slug}
      >
        {/* thumbs stay for the featured slot too (eager per the featured law) */}
        <img
          key={featured.slug}
          src={artThumb(featured.art ?? artFor(featured.slug))}
          alt=""
          className="cf0-feat-img cf0-anim-fadein"
          width={THUMB_W}
          height={THUMB_H}
          loading="eager"
          decoding="async"
        />
        <div className="cf0-feat-fade" aria-hidden="true" />
        <div className="cf0-feat-badges">
          <span className="cf0-badge mono">
            <span aria-hidden="true">★ </span>featured project
          </span>
          {!claimed && <span className="cf0-badge-amber mono">unclaimed · tokens parked</span>}
        </div>
        <div className="cf0-feat-overlay">
          <h2 className="cf0-feat-title cf0-display">{featured.name}</h2>
          <p className="cf0-feat-meta mono">
            by {featured.org_name ?? "the maintainers"} · {featured.cfq_id}
          </p>
          <div className="cf0-feat-chiprow">
            <span className="cf0-feat-chip">open source</span>
            {!claimed && <span className="cf0-feat-chip">independent mirror</span>}
          </div>
        </div>
      </Link>

      {/* stats side panel */}
      <aside className="cf0-feat-side">
        <div className="cf0-siderow mono">
          <span>
            <i className="cf0-live" aria-hidden="true" />
            UNIT {featured.unit} · {status}
          </span>
          <span className="cf0-amber-s">deadline {featured.deadline || "open"}</span>
        </div>
        <div className="cf0-pctrow mono">
          <span className="cf0-pct">{featuredPct}%</span>
          <span className="cf0-pctlabel">funded</span>
        </div>
        <div
          className="cf0-vbar"
          role="progressbar"
          aria-label={`${featured.name} funding progress`}
          aria-valuenow={featured.pct}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <i style={{ width: `${featured.pct}%` }} />
        </div>
        <div className="cf0-fundrow mono">
          <span>{money(featured.funded_usd)} committed{featured.pct >= 100 && featured.funded_usd > featured.budget_credits ? " · goal capped" : ""}</span>
          <span>{money(featured.budget_credits)} goal</span>
        </div>
        <dl className="cf0-stream mono">
          <div className="cf0-streamline">
            <span>&gt; patrons</span>
            <span>{featured.donors}</span>
          </div>
          <div className="cf0-streamline">
            <span>&gt; receipt stream</span>
            <span>{featured.receipts} entr{featured.receipts === 1 ? "y" : "ies"}</span>
          </div>
          <div className="cf0-streamline">
            <span>&gt; fund this unit</span>
            <span>
              <Link className="cf0-fundlink" href={`/p/${featured.slug}`}>
                on the project page →
              </Link>
            </span>
          </div>
        </dl>
        <Link href={`/p/${featured.slug}`} className="cf0-viewbtn mono">
          view project →
        </Link>

        {/* receipt cascade (v0: live receipts → real receipts table tail) */}
        <div className="cf0-cascade mono">
          <span className="cf0-cascade-label">
            <i className="cf0-live" aria-hidden="true" />
            live receipts
          </span>
          {lines
            ? lines.map((r, i) => (
                <div key={`${r.project}-${r.model}-${i}`} className="cf0-cascade-line" style={{ animationDelay: `${i * 120}ms` }}>
                  &gt; {r.project.slice(0, 16)} · {r.model}
                  {r.cost ? <b> −{r.cost}</b> : null}
                </div>
              ))
            : <div className="cf0-cascade-line">&gt; no runs yet — fund a unit to start the stream</div>}
        </div>

        <div className="cf0-dots">
          {pool.map((p, i) => (
            <button
              key={p.slug}
              type="button"
              onClick={() => setFeaturedIdx(i)}
              aria-label={`Feature ${p.name}`}
              aria-pressed={i === featuredIdx}
              className={i === featuredIdx ? "cf0-dot on" : "cf0-dot"}
            />
          ))}
        </div>
      </aside>
    </section>
  );
}

/* ── MediaCard (v0 archive 968-1039) — photo card for the recommended grid ── */

export function MediaCard({
  p,
  idx,
  claimedMap,
}: {
  p: Cf0Card;
  idx: number;
  claimedMap: Record<string, number>;
}) {
  const claimed = claimOf(p, claimedMap);
  return (
    <article className="cf0-mcard">
      <div className="cf0-mcard-media">
        {/* art = decorative; the title link carries the card's accessible name */}
        <img
          src={artThumb(p.art ?? artFor(p.slug))}
          alt=""
          className="cf0-mcard-img"
          width={THUMB_W}
          height={THUMB_H}
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="cf0-mcard-strip mono">
        <span>
          UNIT {p.unit || String(42 + idx).padStart(4, "0")} · {statusText(p, claimed)}
        </span>
        <span className="cf0-amber-s">{p.cfq_id}</span>
      </div>
      <div className="cf0-mcard-body">
        <h3 className="cf0-mcard-title">
          <Link className="cf0-stretch" href={`/p/${p.slug}`}>
            {p.name}
          </Link>
        </h3>
        <p className="cf0-mcard-line mono">{p.one_liner}</p>
        <div className="cf0-mcard-foot mono">
          <div className="cf0-pctrowsmall">
            <span className="cf0-mcard-pct">{p.pct}%</span>
            <span className="cf0-mcard-nums">
              {money(p.funded_usd)} / {money(p.budget_credits)}
              {p.pct >= 100 && p.funded_usd > p.budget_credits ? " · capped" : ""}
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
          <div className="cf0-mcard-sub">
            <span>{p.donors} patron{p.donors === 1 ? "" : "s"}</span>
            <span>{p.deadline || "open"}</span>
          </div>
          <div className="cf0-mcard-chips">
            <span className="cf0-tagchip mono">open source</span>
            {!claimed && <span className="cf0-tagchip mono cf0-tagchip-amber">claim it</span>}
          </div>
        </div>
      </div>
    </article>
  );
}

/* ── Recommended for you — C-4 tablist port, v0 tab buttons (archive 839-876) ─ */

export function RecommendedTabs({
  tabs,
  initial,
  initialTab,
  claimedMap,
}: {
  tabs: TabDef[];
  initial: Cf0Card[];
  initialTab?: TabId;
  claimedMap: Record<string, number>;
}) {
  // Tab state starts on the SERVER-PAINTED default tab (page passes DEFAULT_TAB
  // = newest; never tabs[0], which would select "trending" over a newest grid).
  const [tab, setTab] = useState<TabId>(initialTab ?? tabs[0]?.id ?? "newest");
  const [grid, setGrid] = useState<Cf0Card[]>(initial);
  // Swap bookkeeping: swapping = a tab re-fetch is in flight (grid keeps its
  // panel slot and goes aria-busy); swapErr = the LAST tab re-fetch failed.
  const [swapping, setSwapping] = useState(false);
  const [swapErr, setSwapErr] = useState(false);
  // Sequence guard: a slow response from an older tab click must never
  // overwrite the grid a newer click already answered.
  const seqRef = useRef(0);
  // The server painted the first grid; only tab clicks fetch.
  const mounted = useRef(false);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    const seq = ++seqRef.current;
    setSwapping(true);
    let alive = true;
    fetch(`/api/home?tab=${encodeURIComponent(tab)}`)
      .then((r) => r.json().catch(() => ({})))
      .then(
        (j: { recommended?: HomeCard[] }) => {
          if (!alive || seqRef.current !== seq) return;
          setGrid((j.recommended ?? []) as Cf0Card[]);
          setSwapping(false);
          setSwapErr(false);
        },
        () => {
          if (!alive || seqRef.current !== seq) return;
          setSwapErr(true);
          setSwapping(false);
        }
      );
    return () => {
      alive = false;
    };
  }, [tab]);

  // Roving tabindex + arrow-key focus movement per the APG tab pattern (the
  // C-4 aria work, kept verbatim; only the classes are v0).
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const idx = tabs.findIndex((t) => t.id === tab);
    let next = -1;
    if (e.key === "ArrowRight") next = (idx + 1) % tabs.length;
    else if (e.key === "ArrowLeft") next = (idx - 1 + tabs.length) % tabs.length;
    if (next >= 0) {
      e.preventDefault();
      setTab(tabs[next].id);
      refs.current[next]?.focus();
    }
  };

  return (
    <section className="cf0-section" aria-label="recommended for you">
      {/* v0 arrangement: h2 left, tab buttons right, one bottom-border row */}
      <div className="cf0-rowhead">
        <h2 className="cf0-h2 cf0-display">Recommended for you</h2>
        <div className="cf0-tablist" role="tablist" aria-label="recommended sort order" onKeyDown={onKeyDown}>
          {tabs.map((t, i) => (
            <button
              key={t.id}
              ref={(el) => {
                refs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`tab-${t.id}`}
              aria-controls="rec-panel"
              aria-selected={t.id === tab}
              tabIndex={t.id === tab ? 0 : -1}
              className={t.id === tab ? "cf0-tab on" : "cf0-tab"}
              onClick={() => setTab(t.id)}
            >
              {t.id === tab && <span aria-hidden="true">▸ </span>}
              {t.label}
            </button>
          ))}
          <Link href="/discover" className="cf0-seeall mono">
            see all →
          </Link>
        </div>
      </div>
      <div
        id="rec-panel"
        role="tabpanel"
        aria-labelledby={`tab-${tab}`}
        aria-busy={swapping ? "true" : "false"}
      >
        {swapping ? (
          <p className="cf0-boot mono" role="status">
            ▚ sorting the board…
          </p>
        ) : swapErr ? (
          <div className="cf0-warm" role="status">
            <p>The board did not answer that reorder — the last set is still shown. Refresh to retry.</p>
          </div>
        ) : grid.length ? (
          <div className="cf0-cards" aria-label="recommended projects">
            {grid.map((p, i) => (
              <MediaCard key={p.slug} p={p} idx={i} claimedMap={claimedMap} />
            ))}
          </div>
        ) : (
          <div className="cf0-warm" role="status">
            <p>
              Nothing to recommend yet — the fund is warming.{" "}
              <Link href="/discover" className="cf0-warmlink">
                Browse discovery →
              </Link>
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
