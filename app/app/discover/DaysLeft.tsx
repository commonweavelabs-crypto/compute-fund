"use client";
// Days-left chip for the /discover board (header pass v2). The board hole is a
// streaming dynamic segment; a bare Date.now() inside it makes the Next 16
// cacheComponents prerender probe throw "unstable value while prerendering"
// (the same blocking-prerender-current-time class the /p/[slug] recordView
// path logs), which aborts the hole's in-place fill in dev. Law (same as the
// useTheme hook in components/chrome): NO current-time read during
// SSR/prerender — render the neutral placeholder, then compute from the
// BROWSER clock in a post-hydration effect (useEffect state is never compared
// during hydration, so there is no #418 mismatch, and the value stays honest).
import { useEffect, useState } from "react";

export function DaysLeft({ deadline }: { deadline: string }) {
  const [label, setLabel] = useState("—");
  useEffect(() => {
    if (!deadline) {
      setLabel("—");
      return;
    }
    const d = Math.ceil((new Date(deadline).getTime() - Date.now()) / 86400000);
    setLabel(d > 1 ? `${d} days left` : d === 1 ? "1 day left" : d === 0 ? "final day" : "ended");
  }, [deadline]);
  return <span>{label}</span>;
}
