"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
export default function DiscoverPage() {
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
        <h1>Discover</h1>
        <p className="sub">The catalog page (filters: CFQ domain, status, % raised) lands in Phase 2. For now, browse the grid.</p>
        <p className="backline"><Link href="/" style={{ color: "var(--accent)" }}>← back to the grid</Link></p>
      </main>
      <footer className="bottom big"><div className="footrow">
        <span>A <b>CommonWeave Labs</b> project — fund the compute, see the receipts.</span>
      </div></footer>
    </>
  );
}
