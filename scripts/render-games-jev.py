"""Render plates for games+jev rows (78) that lack any art; watermark-fresh fetch."""
import os, json, sqlite3, importlib.util, sys
spec = importlib.util.spec_from_file_location("rsart", r"C:\Users\Guilherme\AppData\Local\hermes\projects\compute-fund\scripts\render-sprint-art.py")
R = importlib.util.module_from_spec(spec); spec.loader.exec_module(R)
B = R.build_prompt  # (row) -> (prompt, salt) — uses desc/topics
REPO = r"C:\Users\Guilherme\AppData\Local\hermes\projects\compute-fund"
con = sqlite3.connect(f"file:{REPO}\\app\\compute-fund.db?mode=ro", uri=True)
rows = con.execute("SELECT slug, name, one_liner FROM projects WHERE category IN ('gaming','jev') AND (logo_path IS NULL)").fetchall()
con.close()
plates = os.listdir(R.ART)
todo = [r for r in rows if f"cf-{r[0]}.png" not in plates]
print("todo:", len(todo), "of", len(rows))
ok_n = fail_n = 0
for slug, name, ol in todo:
    try:
        prompt = B({"slug": slug, "name": name, "one_liner": ol})
        R.render_one(slug, prompt, R.seed_for(slug) if hasattr(R, "seed_for") else (abs(hash(slug)) % 10**7))
        ok_n += 1; print(f"  {slug} ok")
    except Exception as e:
        fail_n += 1; print(f"  {slug} FAIL {str(e)[:60]}")
print(f"DONE ok={ok_n} fail={fail_n}")
