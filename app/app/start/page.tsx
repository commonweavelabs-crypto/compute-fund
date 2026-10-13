"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

// Kickstarter law: the doors are browsable without an account. The two paths an engaged
// user can take are shown directly; sign-in is requested at the interaction (funding or
// opening a project asks there and returns), never as a wall before the tour.
export default function StartPage() {
  const [user, setUser] = useState<{ display_name: string } | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me").then(r => r.json()).then(d => { if (d.user) setUser(d.user); setReady(true); });
  }, []);

  return (
    <main className="wrap">
      <section className="start-hero">
        <p className="ptitle">START</p>
        <h1 className="auth-h">{ready && user ? `Welcome back${user.display_name ? `, ${user.display_name}` : ""}.` : "Two doors. No account needed to look."}</h1>
        <p className="auth-lead">Browse everything as a visitor. When you fund or open a project, we ask — once, right there, and bring you straight back.</p>
        <div className="start-choices">
          <Link className="guide" href="/start/project">
            <div className="guideart ga1">?</div>
            <div className="guidebody">
              <h3>Open a project</h3>
              <p>Write a Question that passes the CFQ standard. Patrons fund it; the gateway dispenses compute against it.</p>
              <span className="readguide">Write the question →</span>
            </div>
          </Link>
          <Link className="guide" href="/discover">
            <div className="guideart ga2">$</div>
            <div className="guidebody">
              <h3>Fund a question</h3>
              <p>Pick a live project, choose a tier, watch every spent token land on the public ledger.</p>
              <span className="readguide">Browse the fund →</span>
            </div>
          </Link>
        </div>
        {ready && !user && (
          <p className="auth-alt">Already a member? <Link href="/login">Log in</Link></p>
        )}
      </section>
    </main>
  );
}
