#!/usr/bin/env python3
"""D5 discovery-engine integration test (same pattern as d3_create_test.py).

PART A — rule logic on a SEEDED DB COPY (never touches the live DB): the copy is
made via SQLite's backup API, then the REAL lib/discover.ts + lib/db.ts are
executed against it through node's built-in TypeScript stripping (no transpiler).
Seeded rows on the copy = allowed (it is a test fixture; the live DB is read-only
to this test, opened mode=ro).

PART B — live dev-server wiring (writes only through real app HTTP like d3 does:
throwaway signup, a published test project, a real follow toggle, one real page
view). Zero synthetic rows are ever written by hand into the live DB.
"""
import base64, json, os, sqlite3, subprocess, sys, tempfile, time, urllib.request
from pathlib import Path

APP = Path(r"C:/Users/Guilherme/AppData/Local/hermes/projects/compute-fund/app")
SCRATCH = Path(r"C:/Users/Guilherme/AppData/Local/hermes/cache/scratch")
SCRATCH.mkdir(exist_ok=True)
BASE = "http://localhost:8872"

ok = []
def check(name, cond, detail=""):
    ok.append(bool(cond))
    print(("PASS " if cond else "FAIL ") + name + (" | " + str(detail)[:120] if not cond else ""))

# ------------------------------------------------------------------- session jar
class Jar:
    def __init__(self): self.c = ""
    def req(self, path, method="GET", data=None, headers=None, raw=False):
        h = {"Content-Type": "application/x-www-form-urlencoded"}
        if headers: h.update(headers)
        if self.c: h["Cookie"] = self.c
        r = urllib.request.Request(BASE + path, data=data, headers=h, method=method)
        try:
            resp = urllib.request.urlopen(r, timeout=90)
        except urllib.error.HTTPError as e:
            resp = e
        for sc in (resp.headers.get_all("Set-Cookie") or []):
            kv = sc.split(";")[0]
            if kv.startswith("cf_session"): self.c = kv
        body = resp.read()
        if raw: return resp.status, body
        return resp.status, (json.loads(body) if body and body[:1] in (b"{", b"[") else body.decode("utf-8", "replace")[:200])

# PART A ─ build the seeded copy -------------------------------------------------
copy = SCRATCH / "d5-copy.db"
if copy.exists(): copy.unlink()
for suffix in ("-wal", "-shm"):
    p = SCRATCH / ("d5-copy.db" + suffix)
    if p.exists(): p.unlink()
src = sqlite3.connect(f"file:{APP / 'compute-fund.db'}?mode=ro", uri=True)
dst = sqlite3.connect(str(copy))
src.backup(dst)
dst.close(); src.close()

con = sqlite3.connect(str(copy))
con.row_factory = sqlite3.Row
now_iso = time.strftime("%Y-%m-%dT%H:%M:%S", time.gmtime()) + ".000Z"
now_sql = time.strftime("%Y-%m-%d %H:%M:%S", time.gmtime())
def iso_ago(days, pad="Z"):  # ISO at-string for events
    return time.strftime("%Y-%m-%dT%H:%M:%S.000Z", time.gmtime(time.time() - days * 86400))
def sql_ago(days):  # SQLite datetime('now') format for created_at
    return time.strftime("%Y-%m-%d %H:%M:%S", time.gmtime(time.time() - days * 86400))

user = con.execute("SELECT id FROM users LIMIT 1").fetchone()[0]
uid2 = con.execute("SELECT id FROM users WHERE id != ? LIMIT 1", (user,)).fetchone()[0]
PID = {}
# five dedicated rule-check projects (test fixture on the copy only)
def mk(slug, created_ago, claimed, funded_cents=0, n=0):
    pid = f"prj_d5_{slug}"
    con.execute("""INSERT INTO projects (id, cfq_id, owner_id, slug, name, one_liner, question,
        data_inputs, method, deliverable, done_criteria, falsified_by, review_process,
        budget_credits, deadline, assumptions, status, created_at, claimed)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)""",
        (pid, f"CFQ-2026-90{n}", user, slug, "D5 " + slug, "integration fixture",
         "does the discovery rule hold?", "none", '["qwen3:4b"]', "this test", "the test ran",
         "any FAIL", "the script", 500.0, "2027-01-01", "test", "active", sql_ago(created_ago), claimed))
    if funded_cents:
        con.execute("INSERT INTO donations (id, user_id, project_id, amount_cents, tier, demo, created_at) VALUES (?,?,?,?,?,?,?)",
            (f"don_d5_{slug}", user, pid, funded_cents, 100, 1, sql_ago(created_ago)))
    PID[slug] = pid
    return pid
mk("fresh-unclaimed", 1, 0, 200, 1)      # unclaimed + funded but 1d old, no receipts -> NOT ready
mk("old-unclaimed", 26, 0, 200, 2)       # unclaimed + funded, 26d old, zero receipts -> READY
mk("never-wanted", 26, 0, 0, 3)          # unclaimed, no funding, no events -> NOT ready
quiet = mk("quiet-runner", 30, 1, 200, 4)   # CLAIMED with receipts 20d ago -> NOT ready (claimed)
abandoned = mk("abandoned-runner", 30, 0, 200, 5)  # unclaimed, receipt 20d ago, none since -> READY
# receipts: quiet-runner 20d ago; abandoned-runner 20d ago
for pid in (quiet, abandoned):
    con.execute("INSERT INTO receipts (id, project_id, cfq_id, ts, model, kind, tokens_in, tokens_out, cost_usd, outcome) VALUES (?,?,?,?,?,?,?,?,?,?)",
        (f"rcp_d5_{pid}", pid, "CFQ-2026-900", iso_ago(20), "qwen3:4b", "classify", 10, 10, 0.001, "success"))
con.commit()

# events (view=1, follow=3, fund=10; weights at query time)
EID = [0]
def ev(kind, pid, user_id, age_days=0.0):
    EID[0] += 1
    con.execute("INSERT INTO events (id, at, kind, project_id, user_id) VALUES (?,?,?,?,?)",
        (f"evt_seed_{EID[0]}", iso_ago(age_days), kind, pid, user_id))
ev("fund", PID["old-unclaimed"], user)      # 10
ev("view", PID["old-unclaimed"], user)      # 1  -> old-unclaimed v = 11
ev("fund", PID["fresh-unclaimed"], user)    # 10 -> fresh-unclaimed v = 10 (must NOT beat 11)
# follows: users follow projects (Community picks check): 2 follows for old-unclaimed, 1 for fresh-unclaimed
con.execute("INSERT INTO follows (user_id, project_id, at) VALUES (?,?,?)", (user, PID["old-unclaimed"], iso_ago(1)))
con.execute("INSERT INTO follows (user_id, project_id, at) VALUES (?,?,?)", (uid2, PID["old-unclaimed"], iso_ago(2)))
con.execute("INSERT INTO follows (user_id, project_id, at) VALUES (?,?,?)", (uid2, PID["fresh-unclaimed"], iso_ago(1)))
# a 10-day-old fund on abandoned-runner: OUTSIDE the 7d window (must not count)
con.execute("INSERT INTO events (id, at, kind, project_id, user_id) VALUES ('evt_seed_old', ?, 'fund', ?, ?)", (iso_ago(10), PID["abandoned-runner"], user))
# a 40-day-old donation (30d-window check), parked on the CLAIMED fixture so the
# forking rule is not touched
con.execute("INSERT INTO donations (id, user_id, project_id, amount_cents, tier, demo, created_at) VALUES ('don_d5_old30', ?, ?, 50000, 500, 1, ?)", (user, quiet, sql_ago(40)))
# staff pick flag on one project
con.execute("UPDATE projects SET staff_pick = 1 WHERE id = ?", (PID["old-unclaimed"],))
con.commit()

# affinity setup: user's events concentrate on 'research' categories? — the copy's
# real projects carry guessCategory values; give user a fund+follow on tierllama
tierllama = con.execute("SELECT id FROM projects WHERE slug='tierllama'").fetchone()[0]
con.execute("INSERT INTO events (id, at, kind, project_id, user_id) VALUES ('evt_seed_aff1', ?, 'follow', ?, ?)", (iso_ago(1), tierllama, uid2))
con.execute("UPDATE projects SET category='video' WHERE id=?", (PID["old-unclaimed"],))
con.execute("INSERT INTO events (id, at, kind, project_id, user_id) VALUES ('evt_seed_aff2', ?, 'view', ?, ?)", (iso_ago(0), PID["old-unclaimed"], uid2))
con.commit()
con.close()

# PART A ─ run the REAL library against the copy ---------------------------------
HARNESS = SCRATCH / "d5_harness.ts"
HARNESS.write_text("""import { registerHooks } from "node:module";
import { pathToFileURL } from "node:url";
registerHooks({ resolve(spec, ctx, next) { try { return next(spec, ctx); } catch (e) { try { return next(spec + ".ts", ctx); } catch { throw e; } } } });
const d = await import(pathToFileURL("C:/Users/Guilherme/AppData/Local/hermes/projects/compute-fund/app/lib/discover.ts").href);
const dbm = await import(pathToFileURL("C:/Users/Guilherme/AppData/Local/hermes/projects/compute-fund/app/lib/db.ts").href);
const db = dbm.db;
const out: any = {};
out.velocity7d = d.velocity7d();
out.velBySlug = d.velocityBySlug();
out.buzzing = d.buzzing();
out.forking = d.forkingReady();
out.picks = d.communityPicks();
out.f30 = d.mostFunded30d();
out.staff = d.staffPicks();
out.affUid2 = d.affinity(process.env.D5_USER2);
// recorders on the copy
out.recGood = d.recordEvent("view", process.env.D5_TIERLLAMA, process.env.D5_UIDA);
out.recBadKind = (d.recordEvent as unknown as (k: string, p?: string | null, u?: string | null) => boolean)("hack", process.env.D5_TIERLLAMA, null);
out.recViewDraft = d.recordView("x-flow-vlwh", "fpA");         // draft fixture in live data
out.recViewUnknown = d.recordView("no-such-slug-d5", "fpA");   // unknown FK guard
out.recView1 = d.recordView("tierllama", "fpA", process.env.D5_UIDA);
out.recView2 = d.recordView("tierllama", "fpA", process.env.D5_UIDA);  // same request -> idempotent
out.recView3 = d.recordView("tierllama", "fpB", process.env.D5_UIDA);  // distinct fingerprint -> new row
out.viewRows = (db.prepare("SELECT COUNT(*) AS n FROM events WHERE project_id = ? AND kind='view' AND id LIKE 'evt_view_%'").get(process.env.D5_TIERLLAMA) as any).n;
// follow toggle idempotence on the copy (uidA on never-wanted — no seeded follows)
const fs = d.followStateFor(process.env.D5_UIDA, "never-wanted");
out.followCountBefore = fs.count;
const t1 = d.toggleFollow(process.env.D5_UIDA, "never-wanted");
out.followEventsAfterOn = (db.prepare("SELECT COUNT(*) AS n FROM events WHERE kind='follow'").get() as any).n;
out.followRowsAfterOn = (db.prepare("SELECT COUNT(*) AS n FROM follows WHERE user_id=? AND project_id=?").get(process.env.D5_UIDA, process.env.D5_NEVER_PID) as any).n;
const t2 = d.toggleFollow(process.env.D5_UIDA, "never-wanted"); // off: no event
out.followEventsAfterOff = (db.prepare("SELECT COUNT(*) AS n FROM events WHERE kind='follow'").get() as any).n;
out.followRowsAfterOff = (db.prepare("SELECT COUNT(*) AS n FROM follows WHERE user_id=? AND project_id=?").get(process.env.D5_UIDA, process.env.D5_NEVER_PID) as any).n;
const t3 = d.toggleFollow(process.env.D5_UIDA, "never-wanted"); // on again: +1 event, 1 row
out.followRowsAfterReOn = (db.prepare("SELECT COUNT(*) AS n FROM follows WHERE user_id=? AND project_id=?").get(process.env.D5_UIDA, process.env.D5_NEVER_PID) as any).n;
out.followEventsAfterReOn = (db.prepare("SELECT COUNT(*) AS n FROM events WHERE kind='follow'").get() as any).n;
out.toggles = [t1.following, t2.following, t3.following];
// category backfill + guessCategory sanity
out.guessRoute = dbm.guessCategory("Does the tierllama router route Jev lanes correctly?", "decision-models router");
out.guessVideo = dbm.guessCategory("A video documentary about training runs", null);
out.guessNone = dbm.guessCategory("zzzz-no-keyword-here", "qqqq");
out.catCount = (db.prepare("SELECT COUNT(*) AS n FROM projects WHERE category IS NOT NULL").get() as any).n;
out.staffPickRow = (db.prepare("SELECT COUNT(*) AS n FROM projects WHERE staff_pick = 1").get() as any).n;
console.log("D5JSON" + JSON.stringify(out));
""", encoding="utf-8")

env = dict(os.environ)
env["CF_DB_PATH"] = str(copy)  # the rollups open the COPY, never the live DB
env["D5_TIERLLAMA"] = tierllama
env["D5_UIDA"] = uid2
env["D5_USER2"] = uid2
env["D5_FRESH_PID"] = PID["fresh-unclaimed"]
env["D5_NEVER_PID"] = PID["never-wanted"]
# node must run with cwd = APP so lib/schema.sql (read via process.cwd()) resolves
# to the REAL app schema; CF_DB_PATH does the DB redirection.
r = subprocess.run(["node", str(HARNESS)], capture_output=True, text=True, shell=True, cwd=str(APP), env=env, timeout=180)
HARNESS.unlink(missing_ok=True)
if r.returncode != 0:
    print("HARNESS STDERR:", r.stderr[:2000])
    check("harness ran", False, r.returncode)
data = None
for line in r.stdout.splitlines():
    if line.startswith("D5JSON"):
        data = json.loads(line[6:])

if data:
    # NOTE: velocity7d() is keyed by project_id (prj_d5_…); every ORDER-returning
    # rollup (buzzing/forking/picks/f30/staff/affinity) returns SLUGS.
    # seeded weights: fund=10, view=1 — old-unclaimed = fund+view+affinity-view = 12
    check("velocity7d weights (fund=10, view=1)", data["velocity7d"].get(PID["old-unclaimed"]) == 12
          and data["velocity7d"].get(PID["fresh-unclaimed"]) == 10, data["velocity7d"])
    check("velocity 7-day window (10d-old fund excluded)",
          data["velocity7d"].get(PID["abandoned-runner"]) in (None, 0), data["velocity7d"].get(PID["abandoned-runner"]))
    buzz = data["buzzing"]
    bySlug = data["velBySlug"]
    vels = [bySlug.get(s, 0) for s in buzz]
    check("buzzing: velocity desc, no zero-velocity buzz",
          vels == sorted(vels, reverse=True) and all(v > 0 for v in vels)
          and "never-wanted" not in buzz
          and ("fresh-unclaimed" in buzz and "old-unclaimed" in buzz), (vels, buzz))
    fork = data["forking"]
    check("forkingReady: old unclaimed + quiet abandoned qualify", "old-unclaimed" in fork and "abandoned-runner" in fork, fork)
    check("forkingReady: fresh stub / never-wanted / claimed-runner excluded",
          "fresh-unclaimed" not in fork and "never-wanted" not in fork and "quiet-runner" not in fork, fork)
    picks = data["picks"]
    fvals = [p["follows"] for p in picks]
    check("communityPicks: follows count desc (ties slug-asc), ≥1 only",
          fvals == sorted(fvals, reverse=True) and all(v >= 1 for v in fvals)
          and any(p["slug"] == "old-unclaimed" and p["follows"] == 2 for p in picks)
          and any(p["slug"] == "fresh-unclaimed" and p["follows"] == 1 for p in picks), picks)
    f30 = {x["slug"]: x["funded30d"] for x in data["f30"]}
    check("mostFunded30d: 40d-old donation excluded, recent counted",
          "never-wanted" not in f30 and f30.get("old-unclaimed") == 2.0, f30)
    check("staffPicks: ONLY the flagged project renders", data["staff"] == ["old-unclaimed"], data["staff"])
    # affinity: uid2's freshest follow (1d) is fresh-unclaimed → own interactions first
    aff = data["affUid2"]
    check("affinity: own interactions first (follows lead)", aff[:1] == ["fresh-unclaimed"], aff)
    check("affinity: category lift before cold-velocity fill",
          "old-unclaimed" in aff[:3], aff)
    check("events CHECK constraint rejects unknown kind", data["recGood"] is True and data["recBadKind"] is False, [data["recGood"], data["recBadKind"]])
    check("recordView guards drafts + unknown slugs", data["recViewDraft"] is False and data["recViewUnknown"] is False,
          [data["recViewDraft"], data["recViewUnknown"]])
    check("view idempotence: same request re-render = 1 row, new fingerprint = +1", data["viewRows"] == 2, data["viewRows"])
    check("follow toggle: on->off->on == 1 row, events +1 per real follow",
          data["toggles"] == [True, False, True] and data["followRowsAfterOn"] == 1 and data["followRowsAfterOff"] == 0
          and data["followRowsAfterReOn"] == 1
          and data["followEventsAfterOff"] == data["followEventsAfterOn"]
          and data["followEventsAfterReOn"] == data["followEventsAfterOn"] + 1,
          {k: data[k] for k in ("toggles", "followCountBefore", "followRowsAfterOn", "followEventsAfterOn",
                                "followRowsAfterOff", "followEventsAfterOff", "followRowsAfterReOn", "followEventsAfterReOn")})
    check("guessCategory maps to cfqDomains + honest null", data["guessRoute"] == "decision-models"
          and data["guessVideo"] == "video" and data["guessNone"] is None, data)
    check("category backfill non-empty on migration", data["catCount"] > 0 and data["staffPickRow"] == 1,
          [data["catCount"], data["staffPickRow"]])

# PART B ─ live wiring ------------------------------------------------------------
# (live DB is READ-only to this test; every write below goes through the app HTTP.)
def live_count(sql, args=()):
    con = sqlite3.connect(f"file:{APP / 'compute-fund.db'}?mode=ro", uri=True)
    try: return con.execute(sql, args).fetchone()[0]
    finally: con.close()

jar = Jar()
ts = str(int(time.time()))[-6:]
EMAIL = f"cf-d5-{ts}@compute.fund"
s, d = jar.req("/api/auth/signup", "POST", json.dumps({"email": EMAIL, "password": "d5-int-test-pass", "displayName": "D5 Tester"}).encode(),
               {"Content-Type": "application/json"})
check("signup (scratch session)", s == 200, d)

# unauth follow = 401
un = Jar()
s, d = un.req("/api/follow", "POST", json.dumps({"slug": "tierllama"}).encode(), {"Content-Type": "application/json"})
check("follow unauth = 401", s == 401, (s, d))

# unknown slug = 404 (authed)
s, d = jar.req("/api/follow", "POST", json.dumps({"slug": "no-such-slug-d5"}).encode(), {"Content-Type": "application/json"})
check("follow unknown slug = 404", s == 404, (s, d))

LIVE = "gate-validation-corpus-pass-4y1h"  # a live seeded board project
evBefore = live_count("SELECT COUNT(*) FROM events WHERE kind='follow'")
s, d = jar.req("/api/follow", "POST", json.dumps({"slug": LIVE}).encode(), {"Content-Type": "application/json"})
check("follow toggle on = {following:true}", s == 200 and d.get("following") is True, (s, d))
followRows = live_count("SELECT COUNT(*) FROM follows f JOIN users u ON u.id=f.user_id WHERE u.email=? AND f.project_id=(SELECT id FROM projects WHERE slug=?)", (EMAIL, LIVE))
check("exactly one follows row", followRows == 1, followRows)
followEvents = live_count("SELECT COUNT(*) FROM events WHERE kind='follow'") - evBefore
check("one 'follow' event for a real follow", followEvents == 1, followEvents)
s, d = jar.req("/api/follow", "POST", json.dumps({"slug": LIVE}).encode(), {"Content-Type": "application/json"})
check("follow toggle off = {following:false}", s == 200 and d.get("following") is False, (s, d))
check("off removes the row, writes NO event",
      live_count("SELECT COUNT(*) FROM follows f JOIN users u ON u.id=f.user_id WHERE u.email=? AND f.project_id=(SELECT id FROM projects WHERE slug=?)", (EMAIL, LIVE)) == 0
      and live_count("SELECT COUNT(*) FROM events WHERE kind='follow'") - evBefore == 1)
# re-follow: the fund keeps its (throwaway-user) signal — back on, then off to leave the board as found
s, d = jar.req("/api/follow", "POST", json.dumps({"slug": LIVE}).encode(), {"Content-Type": "application/json"})
check("re-follow works", s == 200 and d.get("following") is True, (s, d))

# create a test project (real app path), check its category + view event
cfq = {"question": f"Given a near-cap key {ts}, does applying the qwen3:4b model produce a governed 402 once spend exceeds the cap?",
       "data_inputs": f"N-001 corpus (public, sha256 in receipt) d5-{ts}", "method": '["qwen3:4b"]',
       "deliverable": "the D5 test page", "done_criteria": "the script asserts 42 checks inside 30 seconds", "falsified_by": "any 422", "review_process": "the script",
       "budget_credits": 500, "deadline": "2027-01-01", "assumptions": "dev server up"}
s, d = jar.req("/api/project", "POST", json.dumps({**cfq, "name": f"D5 Discovery {ts}", "one_liner": "the discovery-engine integration test project", "status": "draft"}).encode(),
               {"Content-Type": "application/json"})
check("project created (live app path)", s == 200, d)
slug = d.get("slug", "")
s, d = jar.req("/api/project", "PATCH", json.dumps({"slug": slug, "action": "publish"}).encode(), {"Content-Type": "application/json"})
check("project published", s == 200, d)
cat = live_count("SELECT COUNT(*) FROM projects WHERE slug=? AND category IS NOT NULL", (slug,))
check("new project carries a naive category at insert", cat == 1, cat)

evBefore = live_count("SELECT COUNT(*) FROM events WHERE kind='view'")
import http.client
conn = http.client.HTTPConnection("localhost", 8872, timeout=90)
conn.request("GET", f"/p/{slug}", headers={"User-Agent": "D5Probe/1"})
resp = conn.getresponse(); html = resp.read(); conn.close()
check("/p/<live slug> = 200", resp.status == 200, resp.status)
time.sleep(1.5)
gained = live_count("SELECT COUNT(*) FROM events WHERE kind='view'") - evBefore
check("one /p/<slug> hit = EXACTLY one 'view' row", gained == 1, gained)
check("view event row keyed by request fingerprint",
      live_count("SELECT COUNT(*) FROM events WHERE kind='view' AND id LIKE 'evt_view_%'") > 0)

# trending tab = velocity order (monotonic non-increasing)
def get_json(path):
    r = urllib.request.urlopen(BASE + path, timeout=90)
    return json.loads(r.read())
rec = get_json("/api/home?tab=trending")["recommended"]
vels = [c.get("velocity", 0) for c in rec]
check("trending tab returns velocity-desc order", vels == sorted(vels, reverse=True), vels)
rec = get_json("/api/home?tab=community")["recommended"]
cvals = [(c.get("follows", 0), c.get("velocity", 0)) for c in rec]
check("community tab = follows desc w/ velocity tiebreak",
      cvals == sorted(cvals, key=lambda x: (-x[0], -x[1])), cvals)

# homepage rows: honest presence/absence per live reality
r = urllib.request.urlopen(BASE + "/", timeout=120)
home = r.read().decode("utf-8", "replace")
import html as _html
home = _html.unescape(home)  # React escapes apostrophes (&#x27;) in SSR text
def heading(t): return ('>' + t + '</h2>') in home
almost = heading("Nearly funded"); launched = heading("Just launched"); claims = heading("Open for claims")
funded = heading("Most funded this month"); buzz = heading("What's buzzing now"); staff = heading("Staff picks")
forkingrow = heading("Ready for forking"); picksrow = heading("Community picks")
check("home renders 200 with the classic rows", r.status == 200, r.status)
mostfunded30 = None  # (marker removed)
# live board reality (read-only): which rows SHOULD show
cons = sqlite3.connect(f"file:{APP / 'compute-fund.db'}?mode=ro", uri=True)
n_buzz = cons.execute("SELECT COUNT(DISTINCT p.slug) FROM events e JOIN projects p ON p.id=e.project_id WHERE p.status='active' AND e.at >= strftime('%Y-%m-%dT%H:%M:%fZ','now','-7 days')").fetchone()[0]
n_fork = cons.execute("SELECT COUNT(*) FROM projects p WHERE p.status='active' AND p.claimed=0 AND ((SELECT COALESCE(SUM(d.amount_cents),0) FROM donations d WHERE d.project_id=p.id AND d.demo != 2) > 0 OR (SELECT COUNT(*) FROM events e WHERE e.project_id=p.id) >= 10) AND (((SELECT COUNT(*) FROM receipts r WHERE r.project_id=p.id) > 0 AND (SELECT COUNT(*) FROM receipts r WHERE r.project_id=p.id AND r.ts >= strftime('%Y-%m-%dT%H:%M:%fZ','now','-14 days')) = 0) OR ((SELECT COUNT(*) FROM receipts r WHERE r.project_id=p.id) = 0 AND p.created_at <= datetime('now','-21 days')))").fetchone()[0]
n_picks = cons.execute("SELECT COUNT(*) FROM (SELECT p.slug FROM follows f JOIN projects p ON p.id=f.project_id WHERE p.status='active' GROUP BY p.slug HAVING COUNT(*)>=1)").fetchone()[0]
n_f30 = cons.execute("SELECT COUNT(*) FROM (SELECT p.slug FROM donations d JOIN projects p ON p.id=d.project_id WHERE p.status='active' AND d.created_at >= datetime('now','-30 days') GROUP BY p.slug HAVING COUNT(*)>=1)").fetchone()[0]
n_staff = cons.execute("SELECT COUNT(*) FROM projects WHERE staff_pick=1 AND status='active'").fetchone()[0]
cons.close()
check("mostFunded row shows (live 30d data >= 2)", (n_f30 >= 2) == funded, (n_f30, funded))
check("staff picks row ABSENT (0 picks — flag is Gui-owned, nothing synthetic)",
      n_staff == 0 and staff is False, (n_staff, staff))
check("buzzing row tracks live reality (only when >= 2 real signals)",
      buzz == (n_buzz >= 2), (n_buzz, buzz))
check("forking row tracks live reality (>= 2 qualifying unclaimed)",
      forkingrow == (n_fork >= 2), (n_fork, forkingrow))
check("community-picks row tracks live reality (>= 2 followed)",
      picksrow == (n_picks >= 2), (n_picks, picksrow))
check("unit stamps intact on MediaCards (no stamp regression)",
      "cf0-scard-title" in home and (">UNIT " in home or "UNIT" in home) and "CFQ-2026" in home)
check("footer/shell untouched: exactly one global <footer", home.count("<footer") == 1, home.count("<footer"))

r = urllib.request.urlopen(BASE + "/discover?tab=trending", timeout=120)
dv = r.read().decode("utf-8", "replace")
check("/discover renders 200 with the GET-form tabs", r.status == 200 and "discover-panel" in dv, r.status)

print("\n" + ("ALL PASS: %d checks" % ok.count(True) if all(ok) else "SOME FAILED: %d/%d passed" % (ok.count(True), len(ok))))
sys.exit(0 if all(ok) else 1)
