"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
export default function StartaprojectPage() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  useEffect(() => {
    const id = requestAnimationFrame(() => document.documentElement.setAttribute("data-theme", theme));
    return () => cancelAnimationFrame(id);
  }, [theme]);
  return (
    <>
      <header className="top">
        <div className="wrap inner">
          <Link href="/" className="brand"><span className="sig">▚</span><b>COMPUTE&nbsp;FUND</b></Link>
          <button className="theme-toggle" type="button" onClick={() => setTheme(t => t === "dark" ? "light" : "dark")}>
            {theme === "dark" ? "☾ terminal" : "☀ ledger"} — switch
          </button>
        </div>
      </header>
      <main className="wrap doc">
        <h1>Start a project</h1>
        <p className="sub">MVP Phase 1: sign up as a user, then publish a CFQ-passing question. The intake form + auth arrive with the money loop.</p>
      </main>
      <footer className="bottom big"><div className="footrow">
        <span>A <b>CommonWeave Labs</b> project — fund the compute, see the receipts.</span>
      </div></footer>
    </>
  );
}
