"use client";
// Platform homepage v1.5 — Kickstarter arrangement, 100% our skin (Terminal
// Commons/Carbon Ledger). Layout law (docs/ROADMAP.md "Platform homepage v1.5"):
// centered slogan → featured card (progress line ON the image, meta row
// "time left • % funded", one-liner, tag chips) → "Recommended for you" 2×2 with
// mini progress-underlines + pagination stub → "Home Stretch" urgency row →
// creator-guide 4-card row. Header (logo, search, Start a project, Log in,
// category strip) and footer (category columns, giant wordmark, legal row) are
// the single global Shell mounts from the root layout — this page must never
// mount its own. Data = /api/home (read-only board, force-dynamic).
// Zero rows ⇒ "the fund is warming" copy; nothing here can crash the page.
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Creator, HomeBoard, HomeCard } from "./api/home/route";

const SLOGAN_SUB =
  "Patronage for open-source AI: money in → LLM compute credits out → every run publishes a public receipt. No investors, no returns, no equity — the community funds what it wants to see exist.";

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

  useEffect(() => {
    let alive = true;
    fetch("/api/home")
      .then((r) => r.json())
      .then(
        (j: Partial<HomeBoard>) =>
          alive &&
          setBoard({
            featured: j.featured ?? null,
            recommended: j.recommended ?? [],
            home_stretch: j.home_stretch ?? [],
            creators: j.creators ?? [],
          })
      )
      .catch(() => {
        if (alive) setFailed(true);
      });
    return () => {
      alive = false;
    };
  }, []);

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
          {/* featured project — progress line ON the image */}
          <section className="feat" aria-label="featured project">
            {f ? (
              <>
                <Link href={`/project/${f.slug}`} className="featart" aria-label={`open ${f.name}`}>
                  {f.logo_path ? (
                    <img src={f.logo_path} alt={`${f.name} project art`} className="featlogo" />
                  ) : (
                    <div className="featframe">
                      <p className="featslogan">FEATURED · {f.cfq_id}</p>
                      <p className="featq">{f.name}</p>
                      <p className="featsub">{f.one_liner}</p>
                    </div>
                  )}
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

          {/* recommended for you — 2×2 + pagination stub */}
          <section className="rowhead" aria-label="recommended for you">
            <h2>Recommended for you</h2>
            <Link className="catlink strong" href="/discover">
              discover more →
            </Link>
          </section>
          {board.recommended.length ? (
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
