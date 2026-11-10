// The served Content Policy page (Kickstarter-style rules page, Gui 11/9).
// Text = lib/policy POLICY_MARKDOWN (single source); rendered as styled mono
// sections, no client JS. Linked from the /start/project agreement gate.
import { POLICY_MARKDOWN, POLICY_VERSION } from "../../../lib/policy";

export const metadata = {
  title: "Content Policy — Compute Fund",
  description: "What's fair game, what's not, and how takedowns work on Compute Fund.",
};

const lines = POLICY_MARKDOWN.split("\n");

function style(line: string): { cls: string; text: string } {
  if (line.startsWith("COMPUTE FUND — CONTENT POLICY") || /^=+$/.test(line.trim())) {
    return { cls: "pl-title", text: line.startsWith("COMPUTE") ? line : "" };
  }
  if (line.startsWith("version:")) return { cls: "pl-version mono", text: line };
  if (/^[A-Z0-9' \-]+$/.test(line.trim()) && line.trim().length > 3) {
    return { cls: "pl-h2", text: line.trim() };
  }
  if (line.startsWith("* ")) return { cls: "pl-li", text: line.slice(2) };
  if (/^\d+\.\s/.test(line.trim())) return { cls: "pl-li", text: line.trim() };
  return { cls: "pl-p", text: line };
}

export default function ContentPolicyPage() {
  return (
    <main className="wrap cf0 cf0-main" style={{ maxWidth: 860 }}>
      <article className="cf0-prose">
        {lines.map((l, i) => {
          const { cls, text } = style(l);
          if (!text) return null;
          if (cls === "pl-title") return <h1 key={i} id="cf0-cath1" className="cf0-cath1 cf0-display" style={{ marginTop: 28 }}>{text}</h1>;
          if (cls === "pl-h2") return <h2 key={i} className="cf0-h2 cf0-display" style={{ marginTop: 30 }}>{text}</h2>;
          if (cls === "pl-version") return <p key={i} className={cls} style={{ opacity: 0.7 }}>{text}</p>;
          if (cls === "pl-li") return <p key={i} className={cls} style={{ marginLeft: 18 }}>• {text}</p>;
          return <p key={i} className={cls} style={{ lineHeight: 1.65, marginTop: 10 }}>{text}</p>;
        })}
        <p className="mono" style={{ marginTop: 34, opacity: 0.75 }}>
          Questions or a takedown? receipts@computefund.dev · verified requests honored in 48h.
        </p>
      </article>
    </main>
  );
}
