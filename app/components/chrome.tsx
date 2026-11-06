// Shared layout primitives (header = sticky identity bar + layered category
// rail, footer, theme toggle hook, hover cards). Header pass v2 (Gui-approved):
// row1 is identity only — logo mark + COMPUTE FUND + investors badge left,
// auth-aware actions right (Start a project + Log in when logged out; Start a
// project + avatar chip/dropdown when logged in). The disabled fake search
// input and the "terminal — switch" theme toggle were removed from row1
// (their CSS stays in globals.css untouched); row2 is the layered category
// rail with drawers + REAL counts from /api/categories.
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { orgs } from "../lib/data";
import { CATEGORY_TAXONOMY, slugify } from "../lib/categories";

// -- /api/session + /api/categories payloads ---------------------------------
type SessionUser = { username: string | null; email: string | null; name: string | null };
type TaxonomyCounts = { tops: Array<{ top: string; count: number; subs: Array<{ sub: string; count: number }> }> };

const initialsOf = (u: SessionUser | null): string => {
  const seed = (u?.name || u?.username || u?.email || "?").trim();
  const words = seed.split(/\s+/).filter(Boolean);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return seed.slice(0, 2).toUpperCase();
};

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

export function AppHeader() {
  const router = useRouter();
  // session: header renders the LOGGED-OUT default first (SSR and first client
  // paint agree — no mismatch), /api/session promotes it on mount when a
  // cf_session cookie resolves to a reader.
  const [user, setUser] = useState<SessionUser | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // -- rail state ------------------------------------------------------------
  const [openTop, setOpenTop] = useState<string | null>(null);
  const [leavingTop, setLeavingTop] = useState<string | null>(null); // closing-animation holder
  const [counts, setCounts] = useState<TaxonomyCounts | null>(null);
  const countsFetched = useRef(false);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingCloseRef = useRef<{ top: string; timer: ReturnType<typeof setTimeout> } | null>(null);
  const topBtnRefs = useRef<Array<HTMLButtonElement | null>>([]);
  // mirror of openTop for event handlers (stale-closure safety)
  const openTopRef = useRef<string | null>(null);
  openTopRef.current = openTop;

  useEffect(() => {
    let alive = true;
    fetch("/api/session", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("session"))))
      .then((j) => {
        if (alive && j && j.user) setUser(j.user as SessionUser);
      })
      .catch(() => {}); // an unreadable session is an anonymous header, never a 500
    return () => {
      alive = false;
    };
  }, []);

  const clearLeaveTimer = () => {
    if (leaveTimer.current) {
      clearTimeout(leaveTimer.current);
      leaveTimer.current = null;
    }
  };
  // One drawer open at a time: opening a top wins over any closing animation.
  // Gui's three-act open (2026-11-06): ACT 1 'seed' = the two brackets sit
  // together at the top-left (~480ms, box hidden) → ACT 2 = phase 'open' (box
  // scales out of the anchor while the BR bracket rolls the diagonal; text
  // fades last via CSS delay). Reduced-motion users jump straight to 'open'.
  const [drawerPhase, setDrawerPhase] = useState<"seed" | "open">("seed");
  const phaseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clearPhaseTimer = () => {
    if (phaseTimer.current) {
      clearTimeout(phaseTimer.current);
      phaseTimer.current = null;
    }
  };
  const startSeedPhase = useCallback(() => {
    clearPhaseTimer();
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setDrawerPhase("open"); // reduced motion: no acts, straight to the final state
      return;
    }
    setDrawerPhase("seed");
    phaseTimer.current = setTimeout(() => {
      phaseTimer.current = null;
      setDrawerPhase("open");
    }, 250);
  }, []);
  const openTopNow = useCallback((top: string) => {
    if (pendingCloseRef.current) {
      clearTimeout(pendingCloseRef.current.timer);
      pendingCloseRef.current = null;
    }
    clearLeaveTimer();
    setLeavingTop(null);
    const isNew = openTopRef.current !== top;
    setOpenTop((cur) => (cur === top ? cur : top));
    if (isNew) startSeedPhase();
  }, [startSeedPhase]);
  // Pointer grace (Gui 2026-11-06): leaving the word must NOT kill the drawer
  // instantly — the pointer crosses an 8-10px dead strip to reach the box.
  // closeTopSoon schedules the real close 450ms later; re-entering (openTopNow)
  // or landing in the drawer's bridge cancels it. Deliberate intents (Esc,
  // outside mousedown, link click) close immediately via closeTopNow.
  const closeTopSoon = useCallback((top: string) => {
    if (pendingCloseRef.current?.top === top) return;
    if (pendingCloseRef.current) clearTimeout(pendingCloseRef.current.timer);
    const timer = setTimeout(() => {
      pendingCloseRef.current = null;
      setOpenTop((cur) => (cur === top ? null : cur));
      setLeavingTop(top);
      clearLeaveTimer();
      leaveTimer.current = setTimeout(() => setLeavingTop(null), 480);
      }, 450);
      pendingCloseRef.current = { top, timer };
      }, []);
  const closeTopNow = useCallback((top: string) => {
    if (pendingCloseRef.current) {
      clearTimeout(pendingCloseRef.current.timer);
      pendingCloseRef.current = null;
    }
    clearPhaseTimer();
    clearLeaveTimer();
    setOpenTop((cur) => (cur === top ? null : cur));
    setLeavingTop(top);
    leaveTimer.current = setTimeout(() => setLeavingTop(null), 480);
  }, []);

  // Counts arrive lazily: the FIRST open of any drawer fetches /api/categories
  // exactly once (no-store), then every drawer reads the same payload.
  useEffect(() => {
    if (openTop === null || countsFetched.current) return;
    countsFetched.current = true;
    fetch("/api/categories", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("categories"))))
      .then((j) => setCounts(j as TaxonomyCounts))
      .catch(() => {}); // degraded -> keep the loading ellipsis, never fake numbers
  }, [openTop]);

  // close on outside click (rail drawers + avatar menu)
  useEffect(() => {
    if (openTop === null && !menuOpen) return;
    const onDocMouseDown = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (openTop !== null && t && !t.closest(".cf0-cat")) closeTopNow(openTop);
      if (menuOpen && t && !t.closest(".cf0-user")) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, [openTop, menuOpen, closeTopSoon]);

  // rail keyboard roster: ArrowLeft/Right between tops, ArrowDown/Up enter the
  // subs, Enter activates a link natively (the top button's click navigates to
  // the category board), Home/End jump within the drawer, Escape closes and
  // returns focus to the top button.
  const railKeyDown = (e: React.KeyboardEvent, idx: number) => {
    const isOnBtn = (e.target as HTMLElement).classList.contains("cf0-topbtn");
    const group = e.currentTarget as HTMLElement;
    const subs = () => Array.from(group.querySelectorAll<HTMLElement>(".cf0-sub"));
    const posIn = () => {
      const list = subs();
      const i = list.findIndex((el) => el === document.activeElement);
      return { list, i };
    };
    if (e.key === "Escape") {
      e.preventDefault();
      // Esc = deliberate intent: close immediately (no pointer grace).
      // If a STALE one is somehow open (another top), close it too.
      closeTopNow(CATEGORY_TAXONOMY[idx].top);
      if (openTopRef.current && openTopRef.current !== CATEGORY_TAXONOMY[idx].top) {
        closeTopNow(openTopRef.current);
      }
      topBtnRefs.current[idx]?.focus();
      return;
    }
    if (isOnBtn) {
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        e.preventDefault();
        const next =
          e.key === "ArrowLeft"
            ? Math.max(0, idx - 1)
            : Math.min(CATEGORY_TAXONOMY.length - 1, idx + 1);
        topBtnRefs.current[next]?.focus();
      } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        subs()[0]?.focus(); // focus already opened the drawer
      }
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const { list, i } = posIn();
      (list[Math.min(list.length - 1, i + 1)] ?? list[0])?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const { list, i } = posIn();
      if (i <= 0) topBtnRefs.current[idx]?.focus();
      else list[i - 1]?.focus();
    } else if (e.key === "Home") {
      e.preventDefault();
      subs()[0]?.focus();
    } else if (e.key === "End") {
      e.preventDefault();
      subs()[subs().length - 1]?.focus();
    }
  };

  // avatar menu: roster keyboard (Down/Up cycle items, Home/End first/last),
  // Escape closes and returns focus to the chip.
  const userMenuRef = useRef<HTMLDivElement | null>(null);
  const userKeyDown = (e: React.KeyboardEvent) => {
    const items = () =>
      Array.from((e.currentTarget as HTMLElement).querySelectorAll<HTMLElement>(".cf0-menuitem"));
    const posIn = () => {
      const list = items();
      return { list, i: list.findIndex((el) => el === document.activeElement) };
    };
    if (e.key === "Escape") {
      e.preventDefault();
      setMenuOpen(false);
      (e.currentTarget as HTMLElement).querySelector<HTMLButtonElement>(".cf0-chip")?.focus();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const { list, i } = posIn();
      (list[Math.min(list.length - 1, i + 1)] ?? list[0])?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const { list, i } = posIn();
      (list[Math.max(0, i - 1)] ?? list[list.length - 1])?.focus();
    } else if (e.key === "Home") {
      e.preventDefault();
      items()[0]?.focus();
    } else if (e.key === "End") {
      e.preventDefault();
      const list = items();
      list[list.length - 1]?.focus();
    }
  };
  const closeUserMenu = (refocus: boolean) => {
    setMenuOpen(false);
    if (refocus) userMenuRef.current?.querySelector<HTMLButtonElement>(".cf0-chip")?.focus();
  };
  const logOut = async () => {
    closeUserMenu(true);
    // POST /api/auth/logout exists (the auth port's own route: it clears the
    // cf_session cookie); the header then drops to the logged-out row.
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {}
    setUser(null);
    router.refresh();
  };

  return (
    <>
      {/* ROW 1 = sticky identity bar. The sticky element IS header.top: it
          pins while the rail (row2) and the page scroll away under it. */}
      <header className="top">
        <div className="wrap inner">
          <Link href="/" className="brand" aria-label="Compute Fund home">
            <span className="sig">▚</span>
            <b>COMPUTE&nbsp;FUND</b>
          </Link>
          <span className="badge-none">investors: none</span>
          <div className="actions">
            <Link className="ghost" href="/start">Start a project</Link>
            {user ? (
              <div
                className="cf0-user"
                ref={userMenuRef}
                onKeyDown={userKeyDown}
                onBlurCapture={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget as Node)) setMenuOpen(false);
                }}
              >
                <button
                  type="button"
                  className="cf0-chip"
                  aria-haspopup="menu"
                  aria-expanded={menuOpen}
                  onClick={() => setMenuOpen((o) => !o)}
                >
                  <span className="cf0-chipava" aria-hidden="true">{initialsOf(user)}</span>
                  <span className="cf0-chipname">{user.name || user.username}</span>
                </button>
                {menuOpen && (
                  <div className="cf0-usermenu" role="menu" aria-label="Account">
                    <Link role="menuitem" className="cf0-menuitem" href="/account" onClick={() => setMenuOpen(false)}>
                      My projects &amp; dashboard
                    </Link>
                    {/* platform settings anchor: /account carries no #settings
                        section yet — the anchor-safe landing is plain /account. */}
                    <Link role="menuitem" className="cf0-menuitem" href="/account" onClick={() => setMenuOpen(false)}>
                      Platform settings
                    </Link>
                    <button role="menuitem" type="button" className="cf0-menuitem" onClick={logOut}>
                      Log out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link className="ghost" href="/login">Log in</Link>
            )}
          </div>
        </div>
      </header>

      {/* ROW 2 = the layered category rail (scrolls away normally; the single
          hairline between header and content sits on its bottom edge). */}
      <nav className="cf0-railwrap" aria-label="project categories">
        <div className="wrap cf0-railrow">
          <Link href="/discover" className="cf0-all">All projects</Link>
          {CATEGORY_TAXONOMY.map((t, i) => {
            const open = openTop === t.top;
            const leaving = leavingTop === t.top;
            const catEntry = counts?.tops.find((x) => x.top === t.top);
            return (
              <div
                key={t.top}
                className="cf0-cat"
                onMouseEnter={() => openTopNow(t.top)}
                onMouseLeave={() => closeTopSoon(t.top)}
                onFocusCapture={() => openTopNow(t.top)}
                onBlurCapture={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget as Node)) closeTopSoon(t.top);
                }}
                onKeyDown={(e) => railKeyDown(e, i)}
              >
                <button
                  type="button"
                  ref={(el) => {
                    topBtnRefs.current[i] = el;
                  }}
                  className="cf0-topbtn"
                  aria-expanded={open}
                  aria-haspopup="menu"
                  aria-controls={open ? `cf0-drawer-${i}` : undefined}
                  onClick={() => router.push(`/discover?cat=${slugify(t.top)}`)}
                >
                  {t.top}
                </button>
                {(open || leaving) && (
                  <div
                    id={`cf0-drawer-${i}`}
                    role="menu"
                    className={
                      "cf0-drawer" +
                      (open ? ` cf0-phase-${drawerPhase}` : "") +
                      (open ? "" : " cf0-closing")
                    }
                    aria-label={`${t.top} subcategories`}
                  >
                    <div className="cf0-subgrid">
                      {t.subs.map((s) => {
                        const subCount = catEntry?.subs.find((x) => x.sub === s)?.count ?? 0;
                        return (
                          <Link
                            key={s}
                            role="menuitem"
                            className="cf0-sub"
                            href={`/discover?cat=${slugify(t.top)}&sub=${slugify(s)}`}
                            onClick={() => closeTopSoon(t.top)}
                          >
                            <span className="cf0-sublabel">{s}</span>
                            <span className="cf0-subcount" title="active projects in this sub">
                              {counts ? subCount : "…"}
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </nav>
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
          <Link href="/account">My projects &amp; dashboard</Link>
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