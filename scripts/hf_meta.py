#!/usr/bin/env python3
"""HF seed backfill (Compute Fund): for every project whose repo_url is a
Hugging Face model, fetch likes/downloads/license/lastModified from the HF API
and upsert project_github_meta (source='huggingface').

These are SEED signals only - the community layer converts them into the
Compute Fund rating (see docs/ROADMAP.md, CFR section), never the rating itself.
Idempotent: safe to re-run."""
import json
import re
import sqlite3
import urllib.request

DB = r"C:\Users\Guilherme\AppData\Local\hermes\projects\compute-fund\app\compute-fund.db"


def fetch_model(model_id: str) -> dict | None:
    url = f"https://huggingface.co/api/models/{model_id}"
    req = urllib.request.Request(url, headers={"User-Agent": "compute-fund-seed-backfill"})
    try:
        return json.loads(urllib.request.urlopen(req, timeout=30).read())
    except Exception as e:
        print("fetch fail", model_id, repr(e)[:80])
        return None


def main() -> None:
    db = sqlite3.connect(DB, timeout=30)
    rows = db.execute(
        "SELECT slug, repo_url FROM projects "
        "WHERE repo_url LIKE 'https://huggingface.co/%' AND repo_url NOT LIKE '%/datasets/%'"
    ).fetchall()
    print(f"{len(rows)} HF-hosted projects")
    ok = fail = 0
    for slug, url in rows:
        m = re.match(r"https://huggingface\.co/([^/]+/[^/]+)$", url)
        if not m:
            print("skip (shape)", slug)
            continue
        model_id = m.group(1)
        meta = fetch_model(model_id)
        if meta is None:
            fail += 1
            continue
        lic_tags = [t.split(":", 1)[1] for t in meta.get("tags", []) if t.startswith("license:")]
        lic = lic_tags[0] if lic_tags else "NOASSERTION"
        db.execute(
            "INSERT OR REPLACE INTO project_github_meta "
            "(slug, full_name, stars, forks, open_issues, license, language, topics, handle, "
            " owner_type, homepage, pushed_at, fetched_at, source, likes, downloads) "
            "VALUES (:slug, :full_name, 0, 0, 0, :license, :language, :topics, :author, "
            " 'huggingface-org', :hf_url, :last_modified, datetime('now'), 'huggingface', :likes, :downloads)",
            {
                "slug": slug,
                "full_name": model_id,
                "license": lic,
                "language": (meta.get("library_name") or "safetensors"),
                "topics": json.dumps([t for t in meta.get("tags", []) if not t.startswith("license:")][:12]),
                "author": model_id.split("/")[0],
                "hf_url": url,
                "last_modified": meta.get("lastModified", ""),
                "likes": meta.get("likes", 0),
                "downloads": meta.get("downloads", 0),
            },
        )
        ok += 1
        print(f"upserted {slug}: likes={meta.get('likes')} downloads={meta.get('downloads')} license={lic}")
    db.commit()
    print(f"done: ok={ok} fail={fail}")


if __name__ == "__main__":
    main()
