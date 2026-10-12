"use client";
import { useEffect, useState, Suspense } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import LiveProjectPanel from "../../../components/LiveProjectPanel";

type Meta = { cfq_id: string; name: string; question: string; deliverable: string; done_criteria: string; falsified_by: string; deadline: string };

// Renders a DB-born project (created through the CFQ form). Seed projects keep their
// hand-built pages under /project/[slug]; both link types coexist during the sprint.
function DbProjectInner() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug;
  const [meta, setMeta] = useState<Meta | null>(null);
  const [missing, setMissing] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [me, setMe] = useState<{ display_name: string } | null>(null);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/pubproj/${slug}`).then(r => r.json()).then(d => {
      if (d.error) { setMissing(true); return; }
      setMeta(d);
    });
    fetch("/api/auth/me").then(r => r.json()).then(d => setMe(d.user));
  }, [slug]);

  useEffect(() => {
    if (!me || !meta || !slug) return;
    fetch("/api/ownerof", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ slug }) })
      .then(r => r.json()).then(d => setIsOwner(!!d.owner));
  }, [me, meta, slug]);

  if (missing) return <main className="wrap"><p className="onedim">Unknown project.</p></main>;
  if (!meta) return <main className="wrap"><p className="onedim">loading…</p></main>;

  return (
    <main className="wrap">
      <section className="phero" style={{ display: "block" }}>
        <p className="ptitle">{meta.cfq_id}</p>
        <h1>{meta.name}</h1>
      </section>
      <section className="cfq">
        <div className="cfqhead"><span>THE QUESTION</span><span className="cfqid">{meta.cfq_id}</span></div>
        <p className="cfqq">{meta.question}</p>
        <div className="cfqhead"><span>DELIVERABLE</span></div>
        <p className="cfqf">{meta.deliverable}</p>
        <div className="cfqhead"><span>DONE CRITERIA</span></div>
        <p className="cfqf">{meta.done_criteria}</p>
        <div className="cfqhead"><span>FALSIFIED BY</span></div>
        <p className="cfqf">{meta.falsified_by}</p>
      </section>
      <LiveProjectPanel slug={String(slug ?? "")} isOwner={isOwner} />
      <p className="backline"><Link href="/">← the fund</Link></p>
    </main>
  );
}

export default function DbProjectPage() {
  return (
    <Suspense fallback={<main className="wrap"><p className="onedim">loading…</p></main>}>
      <DbProjectInner />
    </Suspense>
  );
}
