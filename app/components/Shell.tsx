"use client";
// Site chrome on every route (Kickstarter law: quiet corner sign-in everywhere, browsable
// everywhere). Header pass v2: AppHeader is self-sufficient (client-side
// /api/session probe + rail state) — no theme props; the Shell no longer
// mounts useTheme, so the row1 toggle-free terminal stays dark via CSS :root.
import { AppHeader, AppFooter } from "./chrome";

export default function Shell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppHeader />
      {children}
      <AppFooter />
    </>
  );
}
