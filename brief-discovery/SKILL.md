---
name: brief-discovery
description: "Trigger: new project idea, requirements clarification, or pre-coding planning. Run a constraints-first interview using question tool for every phase (options + free-text) and produce discovery notes for brief-writer. Adaptive to existing context and rigorous on contradictions, empty/error states, and data entry/exit."
license: Apache-2.0
metadata:
  author: Laumar
  version: "1.6"
---

# Brief Discovery

## Activation Contract

**Default entry point for any vague brief intent.** Activate for:

- Any vague brief intent without structured details: `quiero empezar un brief` / `empezar un brief` / `crear un brief` / `hacer un brief` / `nuevo brief` / `quiero hacer un brief desde cero` / `quiero empezar a hacer un brief` or semantic equivalents — when the user has NOT provided structured context.
- `quiero planificar antes de codificar` or any request to plan before coding.
- A new project or unclear requirements.
- Any request where the user has NOT provided discovery notes (`docs/brief/discovery-notes.md` or legacy `./discovery-notes.md`) AND has NOT evidenced >=4 of the six pillars (Vision, Constraints, Stack, Data, Surface, Goal) with concrete values.

`brief-discovery` is the DEFAULT for vague intent. `brief-writer` MUST NEVER activate directly in these cases — always route to discovery first. Do not write the final brief; produce `docs/brief/discovery-notes.md`. Every interview phase uses the `question` tool (lossless blocking prompt) with predefined options plus an open free-text alternative; no phase falls back to plain-text-only questioning.

## Hard Rules

- Read `../brief-shared/sections-reference.md` before interviewing.
- Preserve the user's language for narrative notes; resolve identifier language explicitly.
- Ask only questions that current context or files do not already answer — parse wall-of-text, existing code, and Engram context first and ask only gaps.
- Start with constraints before features. Surface contradictions instead of silently resolving them.
- Record unresolved decisions as Open Questions or Needs Assumption; never invent values.
- If Engram is available, search context before questioning and save completed notes afterward. If unavailable, continue with the Markdown artifact.
- **Question tool contract (all phases):** each phase is one `question` call with 1 grouped question containing 3–5 labeled options plus an explicit free-text alternative ("Otra / Other: escribir libre"). Preserve the full choice envelope in order, never summarize or reorder options, and accept only answers within the allowed domain (single-select label match or free text when "Otra" was offered). If the native UI is unavailable or the envelope is unrepresentable, emit the complete envelope as plain chat and STOP — do not choose, infer, or continue. Map ordinal aliases (`N`, `la N`, `opción N`, `first` for 1) to the matching option.
- **Rigor gates:** every interview must explicitly probe negative scope, empty/error states, data entry/exit, scale, platform, and stack-vs-constraint contradictions before closing. A phase that skips these probes is incomplete.

## Decision Gates

| Signal | Action |
|---|---|
| Existing code or brief | Inspect it first; confirm observed conventions and focus on gaps. |
| 10+ proposed features | Ask which three are essential; move the rest to Out of Scope/Future Scope. |
| Stack chosen only because it is popular | Ask what project-specific problem it solves. |
| Learning project | Resolve `full solution code` vs `contracts only`. |
| Existing identifiers | Match their language; ask for confirmation rather than renaming. |
| High uncertainty (≥3 Open Questions) | Keep status `partial`; do not fabricate assumptions to force `complete`. |

## Execution Steps

1. **Context scan (silent, before first question):** inspect workspace, existing briefs, and optional Engram context (`mem_search` if available). If the user dumped a wall of text, parse it and extract answers to Vision/Constraints/Stack/Data/Screens so the interview only covers gaps. If existing code reveals identifier language or stack, record it — do not re-ask it.
2. **Interview adaptively with question tool:** cover Vision, Constraints & Promises, Stack & Architecture, Data Model & Persistence, Screens & Interactions, then Open Questions — in that order, but compress or skip phases whose answers are already evidenced. Each phase is one `question` call; wait for the answer before the next phase so later probes adapt to earlier choices. Every question includes a free-text alternative.
3. **Challenge gaps rigorously:** within or immediately after the relevant phase, probe negative scope, error/empty states, data entry/exit, scale, platform, and developer goal; surface stack-vs-constraint and feature-vs-constraint contradictions explicitly and record the user's resolution.
4. **Classify uncertainty:** put genuinely undecided matters in Open Questions; put concrete values the writer must choose (and might otherwise invent unmarked) in Needs Assumption.
5. **Write and review `docs/brief/discovery-notes.md`:** include Vision, Constraints, Stack with exclusions, Data Model/Data Flow, Screens/Interactions, Decisions Made, Open Questions, Needs Assumption, and Out of Scope.
6. **Handoff:** tell the user to review the notes before invoking `brief-writer`. Do not generate the design brief in this skill.

## Output Contract

Return the artifact path (`docs/brief/discovery-notes.md`), status (`complete` or `partial`), unresolved questions, assumptions needing confirmation, and the handoff to `brief-writer`.

## References

- `../brief-shared/sections-reference.md` — mandatory sections and policies.
- `../brief-shared/template-guide.md` — formatting examples.
- `references/full-guidance-v1.2.md` — expanded interview prompts, question-tool envelopes, and artifact template.
