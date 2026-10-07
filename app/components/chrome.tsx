// Shared layout primitives (header w/ search + categories, footer, theme toggle, hover cards)
import Link from "next/link";
import { useEffect, useState } from "react";
import { cfqDomains, orgs } from "../lib/data";

export function useTheme() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  useEffect(() => {
    // Next 16 hydration law: DOM mutations inside a client effect during the
    // hydration pass trigger React #418 (mismatch). Defer one microtask so the
    // attribute lands after the pass; SSR carries no theme attribute (CSS
    // :root default = dark), so there is nothing to mismatch.
    const id = requestAnimationFrame(() => {
      document.documentElement.setAttribute("data-theme", theme);
    });
    return () => cancelAnimationFrame(id);
  }, [theme]);
  return { theme, toggle: () => setTheme(t => (t === "dark" ? "light" : "dark")) };
}

export function AppHeader({ theme, toggle }: { theme: string; toggle: () => void }) {
  return (
    <>
      <header className="top">
        <div className="wrap inner">
          <Link href="/" className="brand" aria-label="Compute Fund home">
            <span className="sig">▚</span>
            <b>COMPUTE&nbsp;FUND</b>
          </Link>
          <span className="badge-none">investors: none</span>
          <input
            className="search"
            type="search"
            placeholder="search projects, creators, categories…"
            aria-label="search projects (coming in v2)"
            disabled
            title="Search arrives in v2 — Phase 2 of the roadmap"
          />
          <div className="actions">
            <Link className="ghost" href="/start">Start a project</Link>
            <Link className="ghost" href="/login">Log in</Link>
            <button className="theme-toggle" type="button" onClick={toggle}>
              {theme === "dark" ? "☾ terminal" : "☀ ledger"} — switch
            </button>
          </div>
        </div>
        <nav className="catwrap" aria-label="cfq domains">
          <div className="wrap catrow">
            {cfqDomains.map(d => (
              <Link key={d} href={`/discover?domain=${d}`} className="catlink">{d}</Link>
            ))}
            <Link href="/discover" className="catlink strong">discover</Link>
          </div>
        </nav>
      </header>
    </>
  );
}

export function AppFooter() {
  return (
    <footer className="bottom big">
      <div className="footcols">
        <div>
          <h4>Discover</h4>
          <Link href="/discover">All projects</Link>
          <Link href="/discover?status=final-days">Final days</Link>
          <Link href="/?tab=featured">Question of the Month</Link>
        </div>
        <div>
          <h4>Creators</h4>
          <Link href="/start">Start a project</Link>
          <Link href="/guide">CFQ guide</Link>
          <Link href="/guide#receipts">Receipt law</Link>
        </div>
        <div>
          <h4>About</h4>
          <Link href="/guide#law">Our rules</Link>
          <Link href="https://github.com/commonweavelabs-crypto/compute-fund">Source code</Link>
          <Link href="/guide#brand">Brand assets</Link>
        </div>
      </div>
      <div className="footmark" aria-hidden="true">COMPUTE&nbsp;FUND</div>
      <div className="footrow">
        <span>A <b>CommonWeave Labs</b> project — fund the compute, see the receipts.</span>
        <nav className="socials" aria-label="social links">
          <a href="https://x.com/Commonweavelabs" target="_blank" rel="noopener noreferrer">X</a>
          <a href="https://www.youtube.com/@CommonweaveLabs" target="_blank" rel="noopener noreferrer">YouTube</a>
          <a href="https://github.com/commonweavelabs-crypto" target="_blank" rel="noopener noreferrer">GitHub</a>
        </nav>
      </div>
      <div className="legal">Patronage, not investment — no equity, no returns. Compute credits are prepaid, single-purpose and non-transferable. Public receipts for every run.</div>
    </footer>
  );
}

export function OrgHoverCard({ orgSlug, children }: { orgSlug: string; children: React.ReactNode }) {
  const org = orgs[orgSlug];
  const [open, setOpen] = useState(false);
  if (!org) return <>{children}</>;
  return (
    <span className="orgwrap"
      onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)} onBlur={() => setOpen(false)}>
      <Link href={`/org/${org.slug}`} className="orglink" aria-haspopup="dialog">{children}</Link>
      {open && (
        <div className="popup" role="dialog" aria-label={`${org.name} record`}>
          <div className="pophead">
            <span className="popavatar">{org.avatar}</span>
            <div>
              <b>{org.name}</b>
              <div className="popmeta">{org.location} · joined {org.joined.slice(0, 7)}</div>
            </div>
          </div>
          <p className="popbio">{org.bio}</p>
          <div className="popstats">
            <span><b>5</b> projects created</span>
            <span><b>0</b> platforms funded</span>
            <span><b>100%</b> receipts public</span>
          </div>
          <Link className="popcta" href={`/org/${org.slug}`}>View profile →</Link>
        </div>
      )}
    </span>
  );
}