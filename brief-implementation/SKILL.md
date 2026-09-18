---
name: brief-implementation
description: "Trigger: implement or resume a project from an existing brief, phase by phase. Guard against silent scope drift and record deviations in docs/brief/IMPLEMENTATION_LOG.md."
license: Apache-2.0
metadata:
  author: Laumar
  version: "1.6"
---

# Brief Implementation

## Activation Contract

Activate when coding from an existing brief, resuming a phase, checking progress, or resolving a deviation. The brief is the contract; code either follows it or explicitly renegotiates it.

## Hard Rules

- Read `../brief-shared/sections-reference.md` before implementation; for Next.js also read `../brief-shared/references/nextjs.md`.
- Before writing, confirm brief version (inspect `docs/brief/brief.md`, fallback to `docs/brief.md`, `brief.md`, `BRIEF.md`), roadmap phase, environment/scaffolding state, and Code Detail Level.
- Enforce the brief's Agent Constraints, naming policy, stack, project structure, and error taxonomy.
- If a change affects behavior, scope, public contracts, dependencies, entities, routes, screens, or files outside §11, stop and ask whether to patch the brief or document an ad-hoc decision.
- Do not silently mark a deviation resolved. Record every deviation and its resolution in `docs/brief/IMPLEMENTATION_LOG.md` (check `docs/brief/` first, fallback to legacy `./IMPLEMENTATION_LOG.md` if existing).
- Do not close a phase until every Done-when and acceptance criterion passes.

## Decision Gates

| Change shape | Route |
|---|---|
| No brief or thin/contradictory brief | Hand back to `brief-discovery`, `brief-writer`, or `brief-audit`. |
| Small isolated fix; no new dependency/contract/field/route/screen/file **other than `docs/brief/IMPLEMENTATION_LOG.md`** (or legacy); existing acceptance criterion covers it | Quick Path: targeted read, change, check, and log. |
| Requirement is missing or impractical | Stop; ask for brief evolution or an explicitly logged workaround. |
| Current phase incomplete | Keep it In Progress; do not silently start the next phase. |
| All phases complete | Resolve open deviations, then hand off to post-implementation `brief-audit`. |

## Execution Steps

1. **Pre-flight**: Lee brief (`docs/brief/brief.md` o fallback), roadmap, y crea/actualiza `docs/brief/IMPLEMENTATION_LOG.md` (o fallback legacy si ya existe) con versión, Code Detail Level, phase status y session notes.
2. Ejecuta solo la fase actual del roadmap. Re-lee deliverables, contracts y Done-when checklist.
3. Aplica Scope Guardrail continuamente. Pregunta antes de cualquier decisión out-of-brief.
4. Al cerrar fase, verifica cada Done-when y acceptance criterion, registra desviaciones y marca Done solo cuando todos pasan.
5. Al completar proyecto, resuelve cada desviación `Brief updated: No` y recomienda auditoría final `brief-audit`.

## Output Contract

Return changed files, phase status, checks run and results, deviations and their resolutions, current log path (`docs/brief/IMPLEMENTATION_LOG.md`), blockers, and the next handoff. If Engram is unavailable, state that the log is the persistence source.

## References

- `../brief-shared/sections-reference.md` — Agent Constraints and Done-when requirements.
- `../brief-shared/references/nextjs.md` — web-specific implementation contracts.
- `references/full-guidance-v1.2.md` — expanded guardrails, log template, and phase protocol.