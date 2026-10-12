// CFQ lint: the Question Standard as executable schema.
// Fields 2-10 are machine-checkable; field 1 (CFQ id) is platform-assigned.
// Rejection at intake must name the field and the rule that failed.
export type CfqDraft = {
  question: string;
  data_inputs: string;
  method: string;            // JSON array of model/tool names (also the gateway allowlist)
  deliverable: string;
  done_criteria: string;
  falsified_by: string;
  review_process: string;
  budget_credits: number;
  deadline: string;          // ISO date
  assumptions: string;
};

export type LintError = { field: string; rule: string };

export function lintCfq(d: CfqDraft): LintError[] {
  const errors: LintError[] = [];
  const has = (s: string) => typeof s === "string" && s.trim().length > 0;

  // Field 2: one falsifiable sentence with the named pieces.
  if (!has(d.question)) errors.push({ field: "question", rule: "required" });
  else {
    if (!/given .+ does .+ produce/i.test(d.question))
      errors.push({ field: "question", rule: 'must fit "Given <input>, does applying <method> produce <output>?"' });
    if (d.question.trim().split(/\s+/).length > 80)
      errors.push({ field: "question", rule: "keep the question under 80 words; it is one sentence" });
  }
  // Field 3: data inputs must not hedge ("we'll gather some data" is the reject case).
  if (!has(d.data_inputs)) errors.push({ field: "data_inputs", rule: "required" });
  else if (/\b(gather|collect|find) some\b/i.test(d.data_inputs) || !/\b(https?:\/\/|hash|corpus|dataset|repo|file)\b/i.test(d.data_inputs))
    errors.push({ field: "data_inputs", rule: "name the datasets (URL, hash, repo, or named corpus with license); vague sourcing is rejected" });

  // Field 4: method must parse as a JSON array (it doubles as the gateway allowlist).
  let models: string[] = [];
  try { models = JSON.parse(d.method); } catch { /* handled below */ }
  if (!Array.isArray(models) || models.length === 0) errors.push({ field: "method", rule: "must be a JSON array of named models/tools (e.g. [\"qwen3:8b\", \"llama.cpp\"])" });

  if (!has(d.deliverable)) errors.push({ field: "deliverable", rule: "required (named inspectable artifact)" });
  // Field 6: done criteria must contain numbers.
  if (!has(d.done_criteria)) errors.push({ field: "done_criteria", rule: "required" });
  else if (!/\d/.test(d.done_criteria))
    errors.push({ field: "done_criteria", rule: "quantified thresholds required (at least one number)" });
  // Field 7: falsified-by must be a concrete observation, not a shrug.
  if (!has(d.falsified_by)) errors.push({ field: "falsified_by", rule: "required: the observation that would refute this work" });
  else if (/\b(maybe|probably|unlikely|i think|unknown)\b/i.test(d.falsified_by))
    errors.push({ field: "falsified_by", rule: "state the falsifying observation plainly; hedged refutation is not falsifiability" });

  if (!has(d.review_process)) errors.push({ field: "review_process", rule: "required" });
  if (!(typeof d.budget_credits === "number" && d.budget_credits > 0))
    errors.push({ field: "budget_credits", rule: "must be a positive number of credits" });
  if (!/\d{4}-\d{2}-\d{2}/.test(d.deadline ?? ""))
    errors.push({ field: "deadline", rule: "ISO date (YYYY-MM-DD) required" });
  if (!has(d.assumptions)) errors.push({ field: "assumptions", rule: "required" });

  return errors;
}