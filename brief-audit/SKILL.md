---
name: brief-audit
description: "Trigger: audit a brief, compare versions, or check finished code against its brief. Find missing contracts, contradictions, technical errors, scope leaks, and drift; return actionable fixes."
license: Apache-2.0
metadata:
  author: Laumar
  version: "1.3"
---

# Brief Audit

## Activation Contract

Activate for a brief quality review, v1/v2 comparison, pre-implementation gate, or post-implementation brief-vs-code audit. Be adversarial and evidence-based; do not rubber-stamp.

## Hard Rules

- Read `../brief-shared/sections-reference.md` before scoring. For Next.js, read `../brief-shared/references/nextjs.md`.
- Read the complete brief, referenced files, all versions, and actual source when auditing implementation.
- Check section presence **and minimum content**, not headers alone. Use the shared severities; do not invent a section list.
- Distinguish ordinary weakness, unconfirmed assumption, and Implementability Gap. Three critical implementability gaps cap Technical Accuracy at 6/10.
- Verify fast-moving APIs against current primary documentation when approving snippets; state what was verified.
- If Engram is unavailable, continue and report that persistent memory was not consulted.

## Decision Gates

| Evidence | Action |
|---|---|
| Missing critical section or contradictory contract | Critical finding; brief is not implementation-ready. |
| Present but under-filled section | Flag one severity below the shared missing-section severity. |
| 3+ critical implementability gaps | Cap Technical Accuracy at 6/10. |
| Codebase supplied | Add Drift Table and flag undocumented deviations as Critical. |
| Multiple versions supplied | Check split-brain, decision drift, scope inflation, and actual-code baseline. |

## Execution Steps

1. Ingest brief(s), references, code (if supplied), implementation log, and optional Engram context.
2. Audit structural completeness against all applicable sections and minimum requirements.
3. Check contradictions across stack/features, data/UI, decisions/roadmap, names, language policy, and version deltas.
4. Assess technical accuracy, architectural justification, data contracts, edge cases, error taxonomy, and API currency.
5. Assess scope governance: constraints, five concrete out-of-scope items, roadmap leaks, and feature growth.
6. Check assumption markers and walk Data Model, Surface, Interactions, and Roadmap for decisions an implementer would still have to invent.
7. In post-implementation mode, compare decisions, data, out-of-scope items, and implementation log against code.
8. Produce the report and a concrete remediation order; do not edit the brief unless explicitly asked.

## Output Contract

Return: overall assessment; completeness `X/15`; strengths; Critical/High/Improvement findings with location, problem, and fix; contradictions table; assumptions table; implementability gaps; scope analysis; cross-version/drift tables when applicable; five scores and overall score; handoff recommendation.

Score exactly these five dimensions from 1–10: Structural Completeness, Internal Consistency, Technical Accuracy, Scope Governance, and Decision Justification. Use these anchors: `10` = all applicable contracts are substantive and consistent; `7–9` = minor, non-blocking gaps; `4–6` = material omissions or contradictions; `1–3` = implementation-blocking failures. Apply the existing Technical Accuracy cap when three critical implementability gaps exist, and state the evidence behind every score.

## References

- `../brief-shared/sections-reference.md` — canonical scoring basis.
- `../brief-shared/template-guide.md` — formatting examples.
- `../brief-shared/references/nextjs.md` — web audit criteria.
- `references/full-guidance-v1.2.md` — expanded audit protocol and report template.
