"use client";
// Site chrome on every route (Kickstarter law: quiet corner sign-in everywhere, browsable
// everywhere). Home page has its own AppHeader mount; pages without one get this shell.
import { AppHeader, AppFooter, useTheme } from "./chrome";

export default function Shell({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  return (
    <>
      <AppHeader theme={theme.theme} toggle={theme.toggle} />
      {children}
      <AppFooter />
    </>
  );
}
