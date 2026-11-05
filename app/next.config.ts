import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  experimental: { agentUpgrade: "security" },
  // Dev tunnels (cloudflared quick tunnels) serve the app cross-origin; Next 16 blocks
  // dev resources (incl. /_next/hmr) from unknown origins, which stalls hydration.
  allowedDevOrigins: ["*.trycloudflare.com", "*.supabase.co", "localhost:8872"],
};

export default nextConfig;
