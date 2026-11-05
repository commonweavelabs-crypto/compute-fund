import { NextResponse } from "next/server";
import { db } from "../../../lib/db";

// cacheComponents (Next 16): route segment configs (force-dynamic) are Illegal
// — the opt-out is running the DB read behind a request read (headers touched
// below), which keeps this handler on the runtime path instead of being
// snapshotted into the build, and Cache-Control: no-store keeps every response
// live. Funding math mirrors /api/pubproj/[slug] so the homepage and project
// pages can never disagree: usd = SUM(amount_cents)/100, pct = funded/
// budget_credits.
export type Creator = {
  slug: string;
  name: string;
  bio: string | null;
  avatar_path: string | null;
  created_count: number;
  funded_usd: number;
  joined: string;
};

export type HomeCard = {
  slug: string;
  name: string;
  one_liner: string;
  cfq_id: string;
  budget_credits: number;
  funded_usd: number;
  donors: number;
  pct: number; // rounded display %
  fraction: number; // raw funded/budget for thresholds
  deadline: string;
  logo_path: string | null;
  repo_url: string | null;
  created_at: string;
  org_slug: string | null;
  org_name: string | null;
};

export type HomeBoard = {
  featured: HomeCard | null;
  recommended: HomeCard[];
  home_stretch: HomeCard[];
  creators: Creator[];
};

const EMPTY: HomeBoard = { featured: null, recommended: [], home_stretch: [], creators: [] };

export async function GET(req: Request) {
  // Touching the request (headers read = dynamic API access) is what excludes
  // this handler from build-time prerender under cacheComponents.
  req.headers.get("user-agent");
  try {
    const rows = db
      .prepare(
        `SELECT p.slug, p.name, p.one_liner, p.cfq_id, p.budget_credits, p.deadline,
                p.logo_path, p.repo_url, p.created_at,
                COALESCE(d.usd, 0) AS funded_usd, COALESCE(d.n, 0) AS donors,
                o.slug AS org_slug, o.name AS org_name
         FROM projects p
         LEFT JOIN (SELECT project_id, SUM(amount_cents) / 100.0 AS usd, COUNT(*) AS n
                    FROM donations GROUP BY project_id) d ON d.project_id = p.id
         LEFT JOIN orgs o ON o.id = p.owner_org_id
         WHERE p.status = 'active' AND p.budget_credits > 0`
      )
      .all() as Array<Record<string, unknown>>;

    const cards: HomeCard[] = rows.map((r): HomeCard => {
      const budget = Number(r.budget_credits) || 0;
      const funded = Number(r.funded_usd) || 0;
      const fraction = budget > 0 ? funded / budget : 0;
      return {
        slug: String(r.slug ?? ""),
        name: String(r.name ?? ""),
        one_liner: String(r.one_liner ?? ""),
        cfq_id: String(r.cfq_id ?? ""),
        budget_credits: budget,
        funded_usd: funded,
        donors: Number(r.donors) || 0,
        pct: Math.min(100, Math.round(fraction * 100)),
        fraction,
        deadline: String(r.deadline ?? ""),
        logo_path: (r.logo_path as string | null) || null,
        repo_url: (r.repo_url as string | null) || null,
        created_at: String(r.created_at ?? ""),
        org_slug: (r.org_slug as string | null) || null,
        org_name: (r.org_name as string | null) || null,
      };
    });

    // Featured = the most-funded active project (deterministic tie-break:
    // soonest deadline, then oldest submission).
    const featured =
      [...cards].sort(
        (a, b) =>
          b.funded_usd - a.funded_usd ||
          a.deadline.localeCompare(b.deadline) ||
          a.created_at.localeCompare(b.created_at)
      )[0] ?? null;

    // Recommended = 4 newest active, minus the featured slot (never repeated).
    const recommended = cards
      .filter((p) => !featured || p.slug !== featured.slug)
      .sort((a, b) => b.created_at.localeCompare(a.created_at))
      .slice(0, 4);

    // Home Stretch = past 55% funded, ending first (urgency order).
    const home_stretch = cards
      .filter((p) => p.fraction > 0.55)
      .sort(
        (a, b) =>
          a.deadline.localeCompare(b.deadline) ||
          b.fraction - a.fraction ||
          b.funded_usd - a.funded_usd
      );

    // Creator cards = top 3 orgs by created (non-draft) projects, then oldest first.
    const creators = (
      db
        .prepare(
          `SELECT o.slug, o.name, o.bio, o.avatar_path, o.created_at,
             (SELECT COUNT(*) FROM projects p
               WHERE p.owner_org_id = o.id AND p.status = 'active') AS created_count,
             (SELECT COALESCE(SUM(d.amount_cents), 0) / 100.0 FROM donations d
                JOIN projects p ON p.id = d.project_id
                WHERE p.owner_org_id = o.id AND p.status = 'active') AS funded_usd
           FROM orgs o
           ORDER BY created_count DESC, o.created_at ASC
           LIMIT 3`
        )
        .all() as Array<Record<string, unknown>>
    ).map(
      (o): Creator => ({
        slug: String(o.slug ?? ""),
        name: String(o.name ?? ""),
        bio: (o.bio as string | null) || null,
        avatar_path: (o.avatar_path as string | null) || null,
        created_count: Number(o.created_count) || 0,
        funded_usd: Number(o.funded_usd) || 0,
        joined: String(o.created_at ?? ""),
      })
    );

    return NextResponse.json({ featured, recommended, home_stretch, creators }, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (err) {
    // Hard DB failure still degrades to an honest empty board: the homepage
    // renders "the fund is warming" copy, never an error page.
    console.error("home board read failed:", err);
    return NextResponse.json(EMPTY, {
      status: 200,
      headers: { "Cache-Control": "no-store" },
    });
  }
}
