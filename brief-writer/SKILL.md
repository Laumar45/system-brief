---
name: brief-writer
description: "Trigger: write, generate, or evolve a design brief/spec. Convert discovery notes or project context into a self-contained, technically precise brief."
license: Apache-2.0
metadata:
  author: Laumar
  version: "1.5"
---

# Brief Writer

## Activation Contract

Activate ONLY when one of these preconditions holds: (a) `docs/brief/discovery-notes.md` (or legacy `./discovery-notes.md`) exists and is available, OR (b) the user provided sufficient structured context (>=4 of the six pillars — Vision, Constraints, Stack, Data, Surface, Goal — evidenced with concrete values), OR (c) it is an explicit evolution of an existing brief v1, OR (d) the user explicitly opts out of discovery (`escribe el brief ya` / `genera el brief sin preguntas` or semantic equivalent). If the user says `quiero empezar a hacer un brief` / `empezar brief` / `crear brief` / `hacer un brief` / `nuevo brief` WITHOUT sufficient context and WITHOUT `docs/brief/discovery-notes.md` (or legacy `./discovery-notes.md`), do NOT activate — hand off to `brief-discovery` (the default entry point for vague intent). Produce a self-contained brief, not a loose plan.

## Hard Rules

- **Discovery-first routing:** Before any writing, check if `docs/brief/discovery-notes.md` (or legacy `./discovery-notes.md`) exists OR if >=4 pillars (Vision, Constraints, Stack, Data, Surface, Goal) are evidenced with concrete values in conversation/files. If neither, STOP and hand back to `brief-discovery` with message: "Falta discovery — voy a hacerte las preguntas primero para que el brief no quede con supuestos inventados". Never invent values to satisfy the gate.
- Read `../brief-shared/sections-reference.md` before writing; read `../brief-shared/template-guide.md` for examples. For Next.js, read `../brief-shared/references/nextjs.md`.
- Preserve the user's narrative language and follow the resolved identifier-language decision for code, comments, keys, and UI copy.
- Never silently invent a stack, behavior, value, or dependency. Mark writer-selected concrete values `(supuesto — confirmar)` and list them under `Supuestos a confirmar`.
- Every decision needs a project-specific reason. Every applicable section must satisfy its minimum content requirement.
- In evolution mode, verify the previous state against code when available; do not evolve a fiction.
- Use full solution code or contracts-only consistently, and state the selected Code Detail Level in §7.

## Decision Gates

| Condition | Route |
|---|---|
| Fewer than 4 of Vision, Constraints, Stack, Data, Surface, Goal are evidenced AND no `docs/brief/discovery-notes.md` (or legacy `./discovery-notes.md`) exists | Hand back to `brief-discovery`. Do NOT generate brief, do NOT invent values. |
| User says `empezar brief` / `quiero hacer un brief` / vague brief intent without structured context | Hand back to `brief-discovery` (default entry point). Writer is NOT the default. |
| New brief | Generate v1; omit Delta Matrix only when the shared reference says it is skipped. |
| Evolution brief | Verify v1/code, include Delta Matrix and decision Status column, and make it self-contained. |
| Backend/CLI | Skip Visual Identity; retain §6 as API/CLI Surface & Contracts. |
| Learning goal | Ask or use resolved full-code vs contracts-only setting; never guess. |

## Execution Steps

1. **Verify routing precondition:** check if `docs/brief/discovery-notes.md` (or legacy `./discovery-notes.md`) exists OR >=4 pillars are evidenced with concrete values OR it is an explicit evolution/opt-out. If neither holds and intent is vague, STOP and hand back to `brief-discovery` before any ingest. Otherwise, ingest discovery notes, conversation, existing brief, codebase, and optional Engram context.
2. Resolve the six pillars, identifier language, goal, and Code Detail Level before snippets.
3. Generate the applicable sections from `sections-reference.md`: header; summary/principle; delta when applicable; stack/constraints plus Agent Constraints; visual identity; surface/layout; data/behavior; interactions/feedback plus Error Taxonomy when needed; out of scope; decisions plus assumptions; structure (including `docs/brief/` for brief artifacts); roadmap with 3+ verifiable Done-when checks per phase; acceptance/test plan; open questions; glossary when learning.
4. Cross-check names, stack/features, data/UI, roadmap/dependencies, code syntax, and assumption markers.
5. Run the post-generation checklist, show the user assumptions first, and hand off to `brief-audit` before implementation.

## Output Contract

Save the brief to `docs/brief/brief.md` (or `docs/brief/brief-v{N}.md` if versioned; respect existing legacy brief path if evolving an existing project). Return the brief artifact path (`docs/brief/brief.md`), version/status, Code Detail Level, unresolved questions, assumptions requiring confirmation, audit recommendation, and any Engram persistence outcome.

## References

- `../brief-shared/sections-reference.md` — canonical structure and policy.
- `../brief-shared/template-guide.md` — examples.
- `../brief-shared/references/nextjs.md` — web-specific contracts.
- `references/full-guidance-v1.2.md` — expanded section-writing guidance and checklist.

