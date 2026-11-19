"use client";
// D1.4 USER SETTINGS (Gui 11/19): the honest control room. Toggles live in
// users.prefs (JSON); consent receipts read from privacy_acks (append-only).
import { useEffect, useState } from "react";
import Link from "next/link";

type Receipt = { version: string; at: string };
type Prefs = Record<string, unknown>;

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [signedIn, setSignedIn] = useState(false);
  const [prefs, setPrefs] = useState<Prefs>({});
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [note, setNote] = useState("");

  useEffect(() => {
    fetch("/api/settings").then(r => r.json()).then(d => {
      if (d.error) { setSignedIn(false); setLoading(false); return; }
      setSignedIn(true);
      setPrefs(d.prefs ?? {});
      setReceipts(d.consentReceipts ?? []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  async function save(next: Prefs) {
    setPrefs(next);
    const r = await fetch("/api/settings", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prefs: next }) });
    setNote(r.ok ? "Saved." : "Save failed — try again.");
  }

  const personalized = prefs.personalization !== false; // DEFAULT-ON per law

  if (loading) return <main className="wrap"><p className="onedim">loading…</p></main>;
  if (!signedIn) return <main className="wrap"><p className="onedim">Not signed in. <Link href="/login">Log in</Link></p></main>;

  return (
    <main className="wrap" style={{ maxWidth: 720 }}>
      <section className="orgpage">
        <div style={{ marginBottom: 26 }}>
          <h1 style={{ fontSize: "clamp(1.6rem, 4vw, 2.2rem)", margin: "0 0 6px", letterSpacing: "-0.02em" }}>Platform settings</h1>
          <p className="mono" style={{ opacity: 0.65, margin: 0, fontSize: "0.85rem" }}>your rules, one screen, nothing hidden</p>
        </div>

        {/* PERSONALIZATION */}
        <section style={{ border: "1px solid rgba(255,255,255,0.12)", borderRadius: 14, padding: "18px 20px", marginBottom: 16 }}>
          <h2 style={{ fontSize: "1.05rem", margin: "0 0 4px" }}>Personalized suggestions</h2>
          <p style={{ opacity: 0.75, fontSize: "0.92rem", lineHeight: 1.55, margin: "0 0 12px" }}>
            Turn your activity (views, follows, funding) into suggestions for you. Private per account — only you experience the effect. Off = the generic, top-rated feed. Default is on.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              onClick={() => save({ ...prefs, personalization: !personalized })}
              style={{ padding: "8px 18px", borderRadius: 10, cursor: "pointer", opacity: personalized ? 1 : 0.55 }}
            >
              {personalized ? "On — click to turn off" : "Off — click to turn on"}
            </button>
            <span className="mono" style={{ opacity: 0.6, fontSize: "0.82rem" }}>takes effect on your next visit</span>
          </div>
        </section>

        {/* CONSENT RECEIPTS */}
        <section style={{ border: "1px solid rgba(255,255,255,0.12)", borderRadius: 14, padding: "18px 20px", marginBottom: 16 }}>
          <h2 style={{ fontSize: "1.05rem", margin: "0 0 4px" }}>Your consent receipts</h2>
          <p style={{ opacity: 0.75, fontSize: "0.92rem", lineHeight: 1.55, margin: "0 0 10px" }}>
            Append-only, like everything in the ledger: what you agreed to, and when.
          </p>
          {receipts.length === 0 ? (
            <p className="mono" style={{ opacity: 0.6, fontSize: "0.85rem", margin: 0 }}>No consent receipts yet.</p>
          ) : (
            <div className="mono" style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: "0.85rem", opacity: 0.8 }}>
              {receipts.map((r, i) => (
                <div key={i}>{r.at} — {r.version}</div>
              ))}
            </div>
          )}
          <p style={{ opacity: 0.7, fontSize: "0.88rem", margin: "12px 0 0" }}>
            Current policy: <Link href="/privacy/data" style={{ color: "inherit", textDecoration: "underline" }}>Data &amp; You</Link>
          </p>
        </section>

        {/* PLACEHOLDERS — honest labels, nothing fake-wired */}
        <section style={{ border: "1px dashed rgba(255,255,255,0.14)", borderRadius: 14, padding: "18px 20px" }}>
          <h2 style={{ fontSize: "1.05rem", margin: "0 0 4px" }}>Coming later — built like everything else, when it's real</h2>
          <ul style={{ opacity: 0.7, fontSize: "0.92rem", lineHeight: 1.7, margin: "6px 0 0", paddingLeft: 18 }}>
            <li>Notification preferences (milestone posts, replies, digest)</li>
            <li>Data export ("your data is wealth" — the download arrives with the data-wealth phase)</li>
            <li>Account deletion with a verified cooldown window</li>
          </ul>
        </section>

        <p className="mono" style={{ opacity: 0.6, fontSize: "0.85rem", marginTop: 18 }}>{note}</p>
      </section>
    </main>
  );
}
