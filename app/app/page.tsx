"use client";
// Platform homepage v1.6 — Kickstarter arrangement, 100% our skin (Terminal
// Commons/Carbon Ledger). Layout law (docs/ROADMAP.md "Platform homepage v1.5"
// + docs/CONSOLIDATION-PLAN-20261104.md C-4): centered slogan → featured card
// (living hero: LTX-2.5 loop + poster, reduced-motion = poster only; progress
// line ON the image, meta row "time left • % funded", one-liner, tag chips) →
// values trio band (verbatim port of the v0 value props) → "Recommended for
// you" 2×2 behind a tab list (trending / newest / ending soon / community
// priority; tab click re-fetches /api/home?tab=X and swaps ONLY this grid)
// with mini progress-underlines + pagination stub → "Home Stretch" urgency
// row → creator-guide 4-card row. Header (logo, search, Start a project, Log
// in, category strip) and footer (category columns, giant wordmark, legal row)
// are the single global Shell mounts from the root layout — this page must
// never mount its own (C-3 law: one header/footer per page, everywhere).
// Data = /api/home (read-only board, force-dynamic). Zero rows ⇒ "the fund is
// warming" copy; nothing here can crash the page.
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Creator, HomeBoard, HomeCard, TabId } from "./api/home/route";

const SLOGAN_SUB =
  "Patronage for open-source AI: money in → LLM compute credits out → every run publishes a public receipt. No investors, no returns, no equity — the community funds what it wants to see exist.";

// The C-4 tab set. Server = source of truth for ordering (GET /api/home?tab=X
// returns the tab-ordered grid); this list only carries the client labels.
// Default tab = newest — the exact board the main-line showed before tabs.
const TABS: Array<{ id: TabId; label: string }> = [
  { id: "trending", label: "Trending" },
  { id: "newest", label: "Newest" },
  { id: "ending", label: "Ending soon" },
  { id: "community", label: "Community priority" },
];

const money = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

// Deadline is a plain date string from the board; time-left is Date.now()-bound,
// but cards only exist client-side (fetched after hydration), so there is no
// prerendered text for a server/client mismatch to eat.
function timeLeft(deadline: string): string {
  if (!deadline) return "—";
  const d = Math.ceil((new Date(deadline).getTime() - Date.now()) / 86400000);
  if (d > 1) return `${d} days left`;
  if (d === 1) return "1 day left";
  if (d === 0) return "final day";
  return "ended";
}

function Chips({ p }: { p: HomeCard }) {
  return (
    <div className="tagchips">
      <span className="tag live">LIVE</span>
      <span className="tag">{p.cfq_id}</span>
      {p.repo_url && <span className="tag">repo</span>}
    </div>
  );
}

function RecCard({ p }: { p: HomeCard }) {
  return (
    <article className="rcard">
      <h3>
        <Link href={`/project/${p.slug}`} className="cardlink">
          {p.name}
        </Link>
      </h3>
      {/* mini progress-underline sits directly under the title, KS-style */}
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
      <div className="rmeta">
        <span>{money(p.funded_usd)} raised</span>
        <span>·</span>
        <span>{p.pct}% funded</span>
        <span className="go">
          <Link href={`/project/${p.slug}`}>view →</Link>
        </span>
      </div>
    </article>
  );
}

function StretchCard({ p }: { p: HomeCard }) {
  return (
    <article className="scard">
      <h3>
        <Link href={`/project/${p.slug}`} className="cardlink">
          {p.name}
        </Link>
      </h3>
      <p className="one">{p.one_liner}</p>
      <div
        className="bar"
        role="progressbar"
        aria-label={`${p.name} funding progress`}
        aria-valuenow={p.pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <i style={{ ["--pct" as string]: `${p.pct}%` }} />
      </div>
      <div className="rmeta">
        <span className="urg">{timeLeft(p.deadline)}</span>
        <span>·</span>
        <span>{p.pct}% funded</span>
        <span>·</span>
        <span>{p.donors} patron{p.donors === 1 ? "" : "s"}</span>
      </div>
    </article>
  );
}

// C-4 port: the values trio band, verbatim copy from the v0 value props
// (compute-fund-v0 src/app/page.tsx ValueProp block), reskinned in the
// Terminal Commons palette (var() tokens only — no new colors).
function ValuesTrio() {
  const trio = [
    {
      glyph: "⌘",
      title: "A community of builders",
      body: "Creators, researchers, and everyday people funding useful work together — no investors in the ledger, patronage only.",
    },
    {
      glyph: "◎",
      title: "Receipts you can verify",
      body: "Every run, prompt, and cost is public. The receipts are the product — open to verify, auditable by anyone.",
    },
    {
      glyph: "⇄",
      title: "No dead tokens",
      body: "Unclaimed work passes the torch: day 90 the community steers parked tokens to forks and keeps projects alive. No gates, no gatekeepers.",
    },
  ];
  return (
    <section className="values3" aria-label="how the fund works">
      {trio.map((v) => (
        <div className="vcard" key={v.title}>
          <span className="vglyph" aria-hidden="true">
            {v.glyph}
          </span>
          <div className="vbody">
            <h3>{v.title}</h3>
            <p>{v.body}</p>
          </div>
        </div>
      ))}
    </section>
  );
}

// C-4 tab list for "Recommended for you": real <button role=tab> semantics,
// roving tabindex + arrow-key focus movement per the APG tab pattern. The
// panel it controls is the recommended grid only (the featured card above stays
// put across tab swaps).
function Tablist({ active, onSelect }: { active: TabId; onSelect: (t: TabId) => void }) {
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const idx = TABS.findIndex((t) => t.id === active);
    let next = -1;
    if (e.key === "ArrowRight") next = (idx + 1) % TABS.length;
    else if (e.key === "ArrowLeft") next = (idx - 1 + TABS.length) % TABS.length;
    if (next >= 0) {
      e.preventDefault();
      onSelect(TABS[next].id);
      refs.current[next]?.focus();
    }
  };
  return (
    <div className="tabs" role="tablist" aria-label="recommended sort order" onKeyDown={onKeyDown}>
      {TABS.map((t, i) => (
        <button
          key={t.id}
          ref={(el) => {
            refs.current[i] = el;
          }}
          type="button"
          role="tab"
          id={`tab-${t.id}`}
          aria-controls="rec-panel"
          aria-selected={t.id === active}
          tabIndex={t.id === active ? 0 : -1}
          className="tab"
          onClick={() => onSelect(t.id)}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

// Creator hover-card popup (DB-backed: created count · funded · joined · mini bio).
// House pattern from the project page's OrgChip: hover/focus open + click toggle,
// aria-haspopup dialog, profile CTA last in reading order.
function CreatorChip({ c }: { c: Creator }) {
  const [open, setOpen] = useState(false);
  const sig = c.avatar_path ? <img src={c.avatar_path} alt="" width={26} height={26} /> : "▚";
  return (
    <span
      className="orgwrap"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      <button
        type="button"
        className="orgchip"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={`${c.name} creator record`}
      >
        <span className="popavatar">{sig}</span> {c.name}
      </button>
      {open && (
        <div className="popup" role="dialog" aria-label={`${c.name} record`}>
          <div className="pophead">
            <span className="popavatar">{sig}</span>
            <div>
              <b>{c.name}</b>
              <div className="popmeta">joined {c.joined.slice(0, 10)}</div>
            </div>
          </div>
          {c.bio && <p className="popbio">{c.bio}</p>}
          <div className="popstats">
            <span>
              <b>{c.created_count}</b> projects created
            </span>
            <span>
              <b>{money(c.funded_usd)}</b> funded
            </span>
          </div>
          <Link className="popcta" href={`/org/${c.slug}`}>
            View profile →
          </Link>
        </div>
      )}
    </span>
  );
}

export default function Home() {
  const [board, setBoard] = useState<HomeBoard | null>(null);
  const [failed, setFailed] = useState(false);
  const [tab, setTab] = useState<TabId>("newest");
  // Swap bookkeeping: swapping = a tab re-fetch is in flight (grid keeps its
  // role/panel slot and goes aria-busy); swapErr = the LAST tab re-fetch failed
  // (initial-load failure still uses the whole-board `failed` state).
  const [swapping, setSwapping] = useState(false);
  const [swapErr, setSwapErr] = useState(false);
  // Sequence guard: a slow response from an older tab click must never
  // overwrite the grid a newer click already answered.
  const seqRef = useRef(0);

  useEffect(() => {
    const seq = ++seqRef.current;
    setSwapping(true);
    let alive = true;
    fetch(`/api/home?tab=${encodeURIComponent(tab)}`)
      .then((r) => r.json())
      .then(
        (j: Partial<HomeBoard>) => {
          if (!alive || seqRef.current !== seq) return;
          setBoard({
            tab: j.tab ?? tab,
            featured: j.featured ?? null,
            recommended: j.recommended ?? [],
            home_stretch: j.home_stretch ?? [],
            creators: j.creators ?? [],
          });
          setSwapping(false);
          setSwapErr(false);
        },
        () => {
          if (!alive || seqRef.current !== seq) return;
          if (board) setSwapErr(true);
          else setFailed(true);
          setSwapping(false);
        }
      );
    return () => {
      alive = false;
    };
    // board is read in the rejection branch only (initial vs swap failure);
    // the effect stays keyed on `tab` so a click is always exactly one fetch.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const f = board?.featured ?? null;

  return (
    <main className="wrap">
      {/* centered slogan */}
      <section className="hero center">
        <h1>
          <span className="hl">Fund compute,</span> not promises.
        </h1>
        <p className="sub center">{SLOGAN_SUB}</p>
      </section>

      {!board ? (
        failed ? (
          <div className="warm" role="status">
            <p>
              The live board is unreachable right now — refresh in a moment. The board answers again
              the second its reader is back.
            </p>
          </div>
        ) : (
          <p className="boot" role="status">
            ▚ warming the fund…
          </p>
        )
      ) : (
        <>
          {/* featured project — living hero (C-4): LTX-2.5 loop video over a
              poster photo; prefers-reduced-motion drops the video and the
              poster alone stands in (the v0 reduced-motion fallback law).
              The film is the featured slot's ambience; the project's own art
              (logo) floats as a framed inset over the scrim when it exists. */}
          <section className="feat" aria-label="featured project">
            {f ? (
              <>
                <Link href={`/project/${f.slug}`} className="featart" aria-label={`open ${f.name}`}>
                  <img
                    src="/hero/hero-poster.png"
                    alt={`${f.name} hero film still`}
                    className="featposter"
                  />
                  <video
                    className="featvideo"
                    ref={(el) => {
                      // React skips the muted ATTRIBUTE; set the property directly.
                      if (el) el.muted = true;
                    }}
                    src="/hero/hero-loop.mp4"
                    poster="/hero/hero-poster.png"
                    autoPlay
                    muted
                    loop
                    playsInline
                    aria-hidden="true"
                    tabIndex={-1}
                  />
                  <span className="featscrim" aria-hidden="true" />
                  <span className="featcontent">
                    {f.logo_path ? (
                      <img src={f.logo_path} alt={`${f.name} project art`} className="featlogo-frame" />
                    ) : (
                      <span className="featframe">
                        <span className="featslogan">FEATURED · {f.cfq_id}</span>
                        <span className="featq">{f.name}</span>
                        <span className="featsub">{f.one_liner}</span>
                      </span>
                    )}
                  </span>
                  <div className="featbar">
                    <i style={{ ["--pct" as string]: `${f.pct}%` }} />
                  </div>
                  <span className="chip">{f.pct >= 100 ? "goal reached" : `${f.pct}% funded`}</span>
                </Link>
                <div className="featmeta">
                  <small className="catline">FEATURED PROJECT</small>
                  <h3 className="fmtitle">
                    <Link href={`/project/${f.slug}`}>{f.name}</Link>
                  </h3>
                  {f.org_slug && (
                    <Link className="orgline" href={`/org/${f.org_slug}`}>
                      <span className="popavatar sm">▚</span> by {f.org_name}
                    </Link>
                  )}
                  <div className="pmeta">
                    {timeLeft(f.deadline)} • {f.pct}% funded
                  </div>
                  <p className="one">{f.one_liner}</p>
                  <Chips p={f} />
                  {f.repo_url && (
                    <a className="catlink" href={f.repo_url} target="_blank" rel="noopener noreferrer">
                      repo ↗
                    </a>
                  )}
                </div>
              </>
            ) : (
              <div className="warm" role="status">
                <h3 className="fmtitle">The fund is warming</h3>
                <p>
                  No live projects on the board yet — be the first to name the question and fund it.
                </p>
                <p>
                  <Link href="/start">Start a project →</Link>
                </p>
              </div>
            )}
          </section>

          {/* values trio band — between featured and recommended (C-4 port) */}
          <ValuesTrio />

          {/* recommended for you — tabbed 2×2 + pagination stub */}
          <section className="rowhead" aria-label="recommended for you">
            <h2>Recommended for you</h2>
            <Link className="catlink strong" href="/discover">
              discover more →
            </Link>
          </section>
          <Tablist active={tab} onSelect={setTab} />
          <div
            id="rec-panel"
            role="tabpanel"
            aria-labelledby={`tab-${tab}`}
            aria-busy={swapping ? "true" : "false"}
          >
            {swapping ? (
              <p className="boot" role="status">
                ▚ sorting the board…
              </p>
            ) : swapErr ? (
              <div className="warm" role="status">
                <p>
                  The board did not answer that reorder — the last set is still shown. Refresh to
                  retry.
                </p>
              </div>
            ) : board.recommended.length ? (
              <>
                <section className="recomm" aria-label="recommended projects">
                  {board.recommended.map((p) => (
                    <RecCard key={p.slug} p={p} />
                  ))}
                </section>
                <nav className="pager" aria-label="recommended pages">
                  <span className="pr disabled" aria-disabled="true">
                    ‹ previous
                  </span>
                  <span className="pr cur" aria-current="page">
                    1
                  </span>
                  <Link className="pr" href="/discover">
                    next ›
                  </Link>
                </nav>
              </>
            ) : (
              <div className="warm" role="status">
                <p>
                  Nothing to recommend yet — the fund is warming.{" "}
                  <Link href="/discover">Browse discovery →</Link>
                </p>
              </div>
            )}
          </div>

          {/* home stretch — funded past 55%, ending first */}
          <section className="rowhead" aria-label="home stretch">
            <h2>Home Stretch</h2>
            <span className="urg">funded past 55% · ending first</span>
          </section>
          {board.home_stretch.length ? (
            <section className="stretch" aria-label="projects in their final stretch">
              {board.home_stretch.map((p) => (
                <StretchCard key={p.slug} p={p} />
              ))}
            </section>
          ) : (
            <div className="warm" role="status">
              <p>
                Nothing in home stretch right now — projects surface here past 55% funded, ordered
                by end date.
              </p>
            </div>
          )}

          {/* creator guide — 4 cards with vertical accent bars */}
          <section className="rowhead" aria-label="for creators">
            <h2>For creators</h2>
            <Link className="catlink strong" href="/guide">
              read the guide →
            </Link>
          </section>
          <section className="guide4" aria-label="creator guide cards">
            <Link href="/guide#cfq" className="gcard">
              <h3>How funding works</h3>
              <p>
                Every experiment starts with the same question: how will the compute be paid for?
                Patronage in, compute credits out, receipts public.
              </p>
              <span className="go">Start with the guide →</span>
            </Link>
            <Link href="/guide#cfq" className="gcard">
              <h3>Name the question first</h3>
              <p>
                The CFQ standard wants the data, the method, the deliverable, the done criteria, and
                the falsified-by line — before any money moves.
              </p>
              <span className="go">Read the standard →</span>
            </Link>
            <Link href="/guide#receipts" className="gcard">
              <h3>Receipts, not pitch decks</h3>
              <p>
                Every funded run posts a public receipt: model, tokens, cost, outcome. Overclaiming
                is structurally difficult here.
              </p>
              <span className="go">See the receipt law →</span>
            </Link>
            <Link href="/start" className="gcard">
              <h3>Start a project</h3>
              <p>
                Drafts stay private while you write. Publish when the question is falsifiable — the
                board takes it from there.
              </p>
              <span className="go">Open the draft form →</span>
            </Link>
          </section>

          {/* featured creators (top 3 orgs by created projects, from the board) */}
          {board.creators.length > 0 && (
            <>
              <section className="rowhead" aria-label="featured creators">
                <h2>Featured creators</h2>
              </section>
              <section className="creators" aria-label="creator records">
                {board.creators.map((c) => (
                  <CreatorChip key={c.slug} c={c} />
                ))}
              </section>
            </>
          )}
        </>
      )}
    </main>
  );
}
