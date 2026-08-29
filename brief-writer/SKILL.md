---
name: brief-writer
description: "Trigger: write, generate, or evolve a design brief/spec. Convert discovery notes or project context into a self-contained, technically precise brief."
license: Apache-2.0
metadata:
  author: Laumar
  version: "1.3"
---

# Brief Writer

## Activation Contract

Activate when the user asks for a design brief/spec or an evolution from v1 to v2. Produce a self-contained brief, not a loose plan.

## Hard Rules

- Read `../brief-shared/sections-reference.md` before writing; read `../brief-shared/template-guide.md` for examples. For Next.js, read `../brief-shared/references/nextjs.md`.
- Preserve the user's narrative language and follow the resolved identifier-language decision for code, comments, keys, and UI copy.
- Never silently invent a stack, behavior, value, or dependency. Mark writer-selected concrete values `(supuesto — confirmar)` and list them under `Supuestos a confirmar`.
- Every decision needs a project-specific reason. Every applicable section must satisfy its minimum content requirement.
- In evolution mode, verify the previous state against code when available; do not evolve a fiction.
- Use full solution code or contracts-only consistently, and state the selected Code Detail Level in §7.

## Decision Gates

| Condition | Route |
|---|---|
| More than two of Vision, Constraints, Stack, Data, Surface, Goal are unclear | Hand back to `brief-discovery`. |
| New brief | Generate v1; omit Delta Matrix only when the shared reference says it is skipped. |
| Evolution brief | Verify v1/code, include Delta Matrix and decision Status column, and make it self-contained. |
| Backend/CLI | Skip Visual Identity; retain §6 as API/CLI Surface & Contracts. |
| Learning goal | Ask or use resolved full-code vs contracts-only setting; never guess. |

## Execution Steps

1. Ingest discovery notes, conversation, existing brief, codebase, and optional Engram context.
2. Resolve the six pillars, identifier language, goal, and Code Detail Level before snippets.
3. Generate the applicable sections from `sections-reference.md`: header; summary/principle; delta when applicable; stack/constraints plus Agent Constraints; visual identity; surface/layout; data/behavior; interactions/feedback plus Error Taxonomy when needed; out of scope; decisions plus assumptions; structure; roadmap with 3+ verifiable Done-when checks per phase; acceptance/test plan; open questions; glossary when learning.
4. Cross-check names, stack/features, data/UI, roadmap/dependencies, code syntax, and assumption markers.
5. Run the post-generation checklist, show the user assumptions first, and hand off to `brief-audit` before implementation.

## Output Contract

Return the brief artifact path, version/status, Code Detail Level, unresolved questions, assumptions requiring confirmation, audit recommendation, and any Engram persistence outcome.

## References

- `../brief-shared/sections-reference.md` — canonical structure and policy.
- `../brief-shared/template-guide.md` — examples.
- `../brief-shared/references/nextjs.md` — web-specific contracts.
- `references/full-guidance-v1.2.md` — expanded section-writing guidance and checklist.

