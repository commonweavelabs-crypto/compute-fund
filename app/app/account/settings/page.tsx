"use client";
// D1.4 USER SETTINGS (Gui 11/19): the honest control room. Chrome-style toggle
// switches, categorized. REAL (wired to users.prefs): personalization.
// PLACEHOLDERS (styled, inert, honestly labeled - the milestone follows);
// consent receipts live here; agreements = linked, per-doc.
import { useEffect, useState } from "react";
import Link from "next/link";

type Receipt = { version: string; at: string };
type Prefs = Record<string, unknown>;

function Toggle({ on, onClick, disabled }: { on: boolean; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      onClick={onClick}
      disabled={disabled}
      style={{
        width: 46, height: 26, borderRadius: 13, position: "relative",
        border: "1px solid rgba(255,255,255,0.18)", cursor: disabled ? "not-allowed" : "pointer",
        background: on ? "var(--acc, currentColor)" : "rgba(255,255,255,0.08)", opacity: disabled ? 0.4 : 1,
        transition: "background 0.15s ease", flexShrink: 0, padding: 0,
      }}
    >
      <span style={{
        position: "absolute", top: 2, left: on ? 22 : 2, width: 20, height: 20,
        borderRadius: "50%", background: on ? "#fff" : "rgba(255,255,255,0.55)",
        transition: "left 0.15s ease, background 0.15s ease",
        boxShadow: "0 1px 3px rgba(0,0,0,0.4)",
      }} />
    </button>
  );
}

function Row({ label, desc, on, onClick, disabled }: { label: string; desc: string; on: boolean; onClick?: () => void; disabled?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "12px 0", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: "0.97rem" }}>{label}{disabled ? <span className="mono" style={{ opacity: 0.55, fontSize: "0.75em", marginLeft: 8 }}>always on, by design</span> : null}</div>
        <div style={{ opacity: 0.68, fontSize: "0.87rem", lineHeight: 1.5, marginTop: 2 }}>{desc}</div>
      </div>
      <Toggle on={on} onClick={onClick ?? (() => {})} disabled={disabled} />
    </div>
  );
}

function H2({ children }: { children: string }) {
  return <h2 className="mono" style={{ opacity: 0.6, margin: "26px 0 4px", fontSize: "0.8rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>{children}</h2>;
}

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [signedIn, setSignedIn] = useState(false);
  const [prefs, setPrefs] = useState<Prefs>({});
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [note, setNote] = useState("");
  const [placeholderToggles, setPlaceholderToggles] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetch("/api/settings").then(r => r.json()).then(d => {
      if (d.error) { setSignedIn(false); setLoading(false); return; }
      setSignedIn(true);
      setPrefs(d.prefs ?? {});
      setReceipts(d.consentReceipts ?? []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  function persist(next: Prefs) {
    setPrefs(next);
    fetch("/api/settings", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prefs: next }) })
      .then(r => setNote(r.ok ? "Saved." : "Save failed - try again."));
  }
  const real = (k: string) => prefs[k] !== false && prefs[k] !== "off";
  const ph = (k: string) => placeholderToggles[k] ?? false;
  const flip = (k: string) => setPlaceholderToggles(t => ({ ...t, [k]: !(t[k] ?? false) }));

  if (loading) return <main className="wrap"><p className="onedim">loading...</p></main>;
  if (!signedIn) return <main className="wrap"><p className="onedim">Not signed in. <Link href="/login">Log in</Link></p></main>;

  return (
    <main className="wrap" style={{ maxWidth: 720 }}>
      <section className="orgpage" style={{ padding: "26px 0 40px" }}>
        <div style={{ marginBottom: 8 }}>
          <h1 style={{ fontSize: "clamp(1.6rem, 4vw, 2.2rem)", margin: "0 0 6px", letterSpacing: "-0.02em" }}>Platform settings</h1>
          <p className="mono" style={{ opacity: 0.65, margin: 0, fontSize: "0.85rem" }}>yours alone - other members see the platform, never your switches</p>
          <p className="mono" style={{ margin: "14px 0 0", fontSize: "0.85rem", opacity: note ? 0.8 : 0 }}>{note}</p>
        </div>

        <H2>YOUR FEED</H2>
        <section style={{ borderRadius: 14, padding: "6px 20px", border: "1px solid rgba(255,255,255,0.12)" }}>
          <Row
            label="Personalized suggestions"
            desc="Your activity (views, follows, funding) shapes your feed. Only you experience the effect - never sold, never an ad."
            on={real("personalization")}
            onClick={() => persist({ ...prefs, personalization: !real("personalization") })}
          />
          <Row
            label="Weekly digest"
            desc="A Monday email: new projects in your categories, milestones that posted since your last visit."
            on={ph("weeklyDigest")}
            onClick={() => flip("weeklyDigest")}
          />
          <Row
            label="Swipe mode on Discover"
            desc="The optional fast-browse mode (roadmap: never a slot machine - a deck you close)."
            on={ph("swipeMode")}
            onClick={() => flip("swipeMode")}
          />
          <Row
            label="Show me projects with no art yet"
            desc="Imported but not plated projects keep a plain card. On = discover a project the day it lands, not the day its art renders."
            on={ph("showUnplated")}
            onClick={() => flip("showUnplated")}
          />
        </section>

        <H2>PRIVACY & DATA</H2>
        <section style={{ borderRadius: 14, padding: "6px 20px", border: "1px solid rgba(255,255,255,0.12)" }}>
          <Row
            label="Anonymous search logging"
            desc="What the community searches powers the public open-data dashboard. Query + result count only - never linked to any account. This is the platform's data law, so this switch is fixed."
            on={true}
            disabled
          />
          <Row
            label="Public profile"
            desc="Your display name and bio visible on projects you claim. Off = projects show the community avatar with your handle only."
            on={ph("publicProfile")}
            onClick={() => flip("publicProfile")}
          />
          <Row
            label="Show my donations publicly"
            desc="Funding receipts are public by design (the trust product). This hides your name on the donor line, not the receipt itself."
            on={ph("publicDonations")}
            onClick={() => flip("publicDonations")}
          />
        </section>

        <H2>NOTIFICATIONS</H2>
        <section style={{ borderRadius: 14, padding: "6px 20px", border: "1px solid rgba(255,255,255,0.12)" }}>
          <Row label="Milestone posts on projects I follow" desc="Email me when a followed project posts a milestone." on={ph("notifyMilestones")} onClick={() => flip("notifyMilestones")} />
          <Row label="Replies and mentions" desc="Email me when someone replies to my project or mentions my handle." on={ph("notifyReplies")} onClick={() => flip("notifyReplies")} />
          <Row label="Receipts activity" desc="Email me when a project I funded runs a new compute receipt." on={ph("notifyReceipts")} onClick={() => flip("notifyReceipts")} />
        </section>

        <H2>APPEARANCE</H2>
        <section style={{ borderRadius: 14, padding: "6px 20px", border: "1px solid rgba(255,255,255,0.12)" }}>
          <Row
            label="Terminal-style chrome"
            desc="The monospace, receipt-ledger look. Your call - the header switch flips it live; this row records your default."
            on={ph("terminalChrome")}
            onClick={() => flip("terminalChrome")}
          />
          <Row label="High-contrast mode" desc="Accessibility: push contrast to the ceiling for low-light viewing." on={ph("highContrast")} onClick={() => flip("highContrast")} />
          <Row label="Reduce motion" desc="Minimize animated transitions across the platform." on={ph("reduceMotion")} onClick={() => flip("reduceMotion")} />
        </section>

        <H2>COMMUNITY</H2>
        <section style={{ borderRadius: 14, padding: "6px 20px", border: "1px solid rgba(255,255,255,0.12)" }}>
          <Row label="Show me claimed projects first" desc="Maintainer-claimed projects carry verified ownership. On = claimed rows float up in your browse (never in search - the search law holds)." on={ph("claimedFirst")} onClick={() => flip("claimedFirst")} />
          <Row label="Open-gates feed" desc="The up-for-grabs feed: projects whose maintainers stepped away and the community can adopt." on={ph("openGates")} onClick={() => flip("openGates")} />
        </section>

        <H2>AGREEMENTS & CONSENT</H2>
        <section style={{ borderRadius: 14, padding: "18px 20px", border: "1px solid rgba(255,255,255,0.12)", marginBottom: 10 }}>
          <p style={{ opacity: 0.75, fontSize: "0.92rem", lineHeight: 1.55, marginTop: 0 }}>
            Everything you've agreed to, with its receipt - append-only, like the ledger itself.
          </p>
          {receipts.length === 0 ? (
            <p className="mono" style={{ opacity: 0.6, fontSize: "0.85rem" }}>No consent receipts yet.</p>
          ) : (
            <div className="mono" style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: "0.85rem", opacity: 0.8 }}>
              {receipts.map((r, i) => (
                <div key={i}>{r.at} - {r.version}</div>
              ))}
            </div>
          )}
          <div style={{ display: "flex", gap: 18, marginTop: 14, flexWrap: "wrap", fontSize: "0.9rem" }}>
            <Link href="/privacy/data" style={{ color: "inherit", textDecoration: "underline" }}>Data & You (link)</Link>
            <Link href="/policy/content" style={{ color: "inherit", textDecoration: "underline" }}>Content policy (link)</Link>
            <Link href="/guide#law" style={{ color: "inherit", textDecoration: "underline" }}>Rules & receipt law (link)</Link>
          </div>
        </section>

        <section style={{ border: "1px dashed rgba(255,255,255,0.14)", borderRadius: 14, padding: "16px 20px" }}>
          <p style={{ opacity: 0.7, fontSize: "0.88rem", lineHeight: 1.6, margin: 0 }}>
            <strong>Coming later - built like everything else, when it's real.</strong> Switches without persistence are placeholders until their milestone ships; clicking them doesn't save yet. The real, wired one: <strong>Personalized suggestions</strong> (plus the receipts list). Found something broken on this page? <Link href="/report" style={{ color: "inherit", textDecoration: "underline" }}>Tell us</Link>.
          </p>
        </section>
      </section>
    </main>
  );
}
