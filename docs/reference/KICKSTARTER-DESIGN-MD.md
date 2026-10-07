# Kickstarter DESIGN.md — Extracted Reference (TypeUI, 2026-10-07)

> **Layout law reminder:** this file is ARRANGEMENT/STRUCTURE reference only.
> Kickstarter's colors, fonts, artwork, and copy are NEVER copied into Compute Fund.
> Token lessons (spacing rhythm, state rules, a11y gates, density benchmarks) are adopted;
> identity stays Terminal Commons / Carbon Ledger (see app/app/globals.css).

# Kickstarter

## Mission
Create implementation-ready, token-driven UI guidance for Kickstarter that is optimized for consistency, accessibility, and fast delivery across marketing site.

## Brand
- Product/brand: Kickstarter
- URL: https://www.kickstarter.com/
- Audience: buyers, teams, and decision-makers
- Product surface: marketing site

## Style Foundations
- Visual style: clean, functional, implementation-oriented
- Main font style: font.family.primary=Inter, font.family.stack=Inter, sans-serif, font.size.base=14px, font.weight.base=500, font.lineHeight.base=16px
- Typography scale: font.size.xs=12px, font.size.sm=13px, font.size.md=14px, font.size.lg=16px, font.size.xl=20px, font.size.2xl=21px, font.size.3xl=28px, font.size.4xl=32px
- Color palette: color.text.primary=#4d4d4d, color.text.secondary=#282828, color.text.tertiary=#171717, color.surface.base=#000000, color.surface.muted=#ffffff
- Spacing scale: space.1=6px, space.2=7px, space.3=8px, space.4=11px, space.5=15px, space.6=16px, space.7=18px, space.8=20px
- Radius/shadow/motion tokens: radius.xs=4px, radius.sm=20px | motion.duration.instant=100ms

## Accessibility
- Target: WCAG 2.2 AA
- Keyboard-first interactions required.
- Focus-visible rules required.
- Contrast constraints required.

## Writing Tone
Concise, confident, implementation-focused.

## Rules: Do
- Use semantic tokens, not raw hex values, in component guidance.
- Every component must define states for default, hover, focus-visible, active, disabled, loading, and error.
- Component behavior should specify responsive and edge-case handling.
- Interactive components must document keyboard, pointer, and touch behavior.
- Accessibility acceptance criteria must be testable in implementation.

## Rules: Don't
- Do not allow low-contrast text or hidden focus indicators.
- Do not introduce one-off spacing or typography exceptions.
- Do not use ambiguous labels or non-descriptive actions.
- Do not ship component guidance without explicit state rules.

## Guideline Authoring Workflow
1. Restate design intent in one sentence.
2. Define foundations and semantic tokens.
3. Define component anatomy, variants, interactions, and state behavior.
4. Add accessibility acceptance criteria with pass/fail checks.
5. Add anti-patterns, migration notes, and edge-case handling.
6. End with a QA checklist.

## Required Output Structure
- Context and goals.
- Design tokens and foundations.
- Component-level rules (anatomy, variants, states, responsive behavior).
- Accessibility requirements and testable acceptance criteria.
- Content and tone standards with examples.
- Anti-patterns and prohibited implementations.
- QA checklist.

## Component Rule Expectations
- Include keyboard, pointer, and touch behavior.
- Include spacing and typography token requirements.
- Include long-content, overflow, and empty-state handling.
- Include known page component density: links (1075), cards (1049), buttons (330), navigation (8), lists (8), inputs (5).

- Extraction diagnostics: Audience and product surface inference confidence is low; verify generated brand context.

## Quality Gates
- Every non-negotiable rule must use "must".
- Every recommendation should use "should".
- Every accessibility rule must be testable in implementation.
- Teams should prefer system consistency over local visual exceptions.