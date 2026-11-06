// D5 view recorder: /p/[slug] became a server component whose ONLY extra duty is
// one 'view' event per RENDER → exactly one view row per page REQUEST. The
// client page itself lives verbatim in ./project-client.tsx.
//
// cacheComponents law (homepage pattern, NOT the /discover Suspense-hole): a
// dynamic hole runs TWICE per request in dev (static-shell pass + resume), so
// the beacon is a BLOCKING route — instant=false + top-level headers() await
// make this a single runtime pass per request and nothing at build time. Dev
// StrictMode can still re-invoke the render (48ms apart), so recordView()
// collapses same-request re-renders onto a stable per-request event id: the
// ledger's view resolution = one row per distinct request-fingerprint per
// minute (see lib/discover.ts — never overcounts, never invents).
import { headers } from "next/headers";

export const instant = false;
import { recordView, viewFingerprint } from "../../../lib/discover";
import DbProjectPage from "./project-client";

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  // Request-time read = the cacheComponents opt-out (blocking route). The
  // fingerprint identifies THE REQUEST (stable across StrictMode re-renders):
  // slug itself plus the headers that actually vary client-to-client.
  const h = await headers();
  const { slug } = await params;
  try {
    // fire-and-forget: a failed INSERT is a lost view, never a broken page.
    recordView(
      slug,
      viewFingerprint([h.get("user-agent"), h.get("accept-language"), h.get("accept-encoding")]),
    );
  } catch {
    // swallowed — see fire-and-forget law above
  }
  return (
    <>
      <DbProjectPage />
    </>
  );
}
