---
name: brief-implementation
description: "Trigger: implement or resume a project from an existing brief, phase by phase. Guard against silent scope drift and record deviations in docs/brief/IMPLEMENTATION_LOG.md. Heurística integrada: sugiere SDD (gentle-ai) para cambios sustanciales; si se acepta, usa el flujo SDD completo y desactiva el flujo brief clásico."
license: Apache-2.0
metadata:
  author: Laumar
  version: "1.5"
---

# Brief Implementation

## Activation Contract

Activate when coding from an existing brief, resuming a phase, checking progress, or resolving a deviation. The brief is the contract; code either follows it or explicitly renegotiates it.

**Nuevo**: Antes de ejecutar el flujo brief clásico, la skill evalúa una heurística de "cambio sustancial". Si la puntuación ≥ 4, presenta una **pregunta interactiva** al usuario proponiendo SDD (gentle-ai). Si el usuario acepta, se ejecuta el flujo SDD completo (propose → spec → design → tasks → apply → verify → archive) y **se desactivan** el `docs/brief/IMPLEMENTATION_LOG.md` (o legacy `./IMPLEMENTATION_LOG.md`), decision gates y scope guardrails del flujo brief clásico para esa ejecución. Si el usuario declina o el cambio es menor, continúa con el flujo brief clásico (Quick Path).

## Heurística de Cambio Sustancial (SDD Sugerido)

La skill inspecciona el brief y roadmap actual y calcula una puntuación:

| Señal | Puntos |
|-------|--------|
| Fase nueva en roadmap (pendiente o que añade pantallas/contratos/entidades) | +2 |
| Nuevo contrato público, API, ruta, pantalla, modelo o entidad | +1 |
| Dependencia nueva (librería, servicio externo, cambio de stack) | +1 |
| Estimación > 3 archivos a modificar/crear | +1 |

**Umbral**: Puntuación ≥ 4 → **sugerir SDD** vía pregunta interactiva.

## Hard Rules

- Read `../brief-shared/sections-reference.md` before implementation; for Next.js also read `../brief-shared/references/nextjs.md`.
- Before writing, confirm brief version (inspect `docs/brief/brief.md`, fallback to `docs/brief.md`, `brief.md`, `BRIEF.md`), roadmap phase, environment/scaffolding state, and Code Detail Level.
- Enforce the brief's Agent Constraints, naming policy, stack, project structure, and error taxonomy.
- If a change affects behavior, scope, public contracts, dependencies, entities, routes, screens, or files outside §11, stop and ask whether to patch the brief or document an ad-hoc decision.
- Do not silently mark a deviation resolved. Record every deviation and its resolution in `docs/brief/IMPLEMENTATION_LOG.md` (solo en flujo brief clásico; check `docs/brief/` first, fallback to legacy `./IMPLEMENTATION_LOG.md` if existing).
- Do not close a phase until every Done-when and acceptance criterion passes.
- **Cuando SDD se activa**: el flujo brief clásico (IMPLEMENTATION_LOG.md, decision gates, scope guardrail) se desactiva para esa ejecución. Los artefactos SDD (spec, design, tasks, apply-progress, verify-report, archive-report) son la única trazabilidad.

## Decision Gates

| Change shape | Route |
|---|---|
| No brief or thin/contradictory brief | Hand back to `brief-discovery`, `brief-writer`, or `brief-audit`. |
| Small isolated fix; no new dependency/contract/field/route/screen/file **other than `docs/brief/IMPLEMENTATION_LOG.md`** (or legacy); existing acceptance criterion covers it | Quick Path: targeted read, change, check, and log. |
| **Heurística ≥ 4 (cambio sustancial)** | **Pregunta interactiva: ¿Usar SDD (gentle-ai)? → Sí: flujo SDD completo. No: Quick Path brief.** |
| Requirement is missing or impractical | Stop; ask for brief evolution or an explicitly logged workaround. |
| Current phase incomplete | Keep it In Progress; do not silently start the next phase. |
| All phases complete | Resolve open deviations, then hand off to post-implementation `brief-audit`. |

## Execution Steps

1. **Pre-flight y heurística**: Lee brief (`docs/brief/brief.md` o fallback), roadmap, `docs/brief/IMPLEMENTATION_LOG.md` (o fallback legacy si ya existe). Calcula puntuación de cambio sustancial.
2. **Si puntuación ≥ 4**: Lanza pregunta interactiva (`question` tool) proponiendo SDD.
   - **Usuario acepta**: Ejecuta flujo SDD (ver sección "Flujo SDD Integrado"). **Salta pasos 3-6**.
   - **Usuario declina**: Continúa en paso 3 (flujo brief clásico).
3. **Pre-flight clásico**: Crea/actualiza `docs/brief/IMPLEMENTATION_LOG.md` (o actualiza el existente en raíz si se venía usando) con versión, Code Detail Level, phase status, session notes.
4. Ejecuta solo la fase actual del roadmap. Re-lee deliverables, contracts, Done-when checklist.
5. Aplica Scope Guardrail continuamente. Pregunta antes de cualquier decisión out-of-brief.
6. Al cerrar fase, verifica cada Done-when y acceptance criterion, registra desviaciones, marca Done solo cuando todos pasan.
7. Al completar proyecto, resuelve cada desviación `Brief updated: No` y recomienda auditoría final `brief-audit`.

## Flujo SDD Integrado (cuando usuario acepta)

La skill delega al orquestador SDD (gentle-ai) con el contexto del brief:

1. **Contexto inicial**: Pasa brief version, roadmap phase, stack, constraints, naming policy al orquestador.
2. **Fases SDD** (secuenciales, con preflight de sesión SDD si no existe):
   - `sdd-propose` → propuesta desde brief/roadmap
   - `sdd-spec` → delta specs con requirements y scenarios
   - `sdd-design` → technical design y arquitectura
   - `sdd-tasks` → tasks con delivery_strategy, chain_strategy, review budget
   - `sdd-apply` → implementación por work-unit commits
   - `sdd-verify` → validación contra specs/design/tasks
   - `sdd-archive` → cierre y sync de delta specs
3. **Artefactos SDD** son la única fuente de verdad; no se escribe `IMPLEMENTATION_LOG.md`.
4. **Handoff final**: Devuelve changed files, phase status, checks run, verify-report path, archive-report path, blockers, next handoff.

## Output Contract

**Flujo brief clásico**: Return changed files, phase status, checks run and results, deviations and their resolutions, current log path (`docs/brief/IMPLEMENTATION_LOG.md`), blockers, and the next handoff. If Engram is unavailable, state that the log is the persistence source.

**Flujo SDD**: Return changed files, SDD phase status, checks run and results, verify-report path, archive-report path, blockers, and the next handoff. No IMPLEMENTATION_LOG.md.

## References

- `../brief-shared/sections-reference.md` — Agent Constraints and Done-when requirements.
- `../brief-shared/references/nextjs.md` — web-specific implementation contracts.
- `references/full-guidance-v1.2.md` — expanded guardrails, log template, and phase protocol.
- Gentle AI SDD: `/sdd-new`, `/sdd-ff`, `/sdd-continue`, `/sdd-apply`, `/sdd-verify`, `/sdd-archive` — orchestrated by gentle-ai.

(End of file - total ~120 lines)