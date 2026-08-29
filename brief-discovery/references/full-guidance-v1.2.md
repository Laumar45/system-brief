> **Historical reference — not a runtime contract.** The sibling SKILL.md v1.4 is authoritative. Use this file only for background, examples, or migration review.

---
name: brief-discovery
description: "Trigger: new project idea, requirements clarification, or pre-coding planning. Run a constraints-first interview using question tool for every phase (options + free-text) and produce discovery notes for brief-writer. Adaptive to existing context and rigorous on contradictions, empty/error states, and data entry/exit."
license: Apache-2.0
metadata:
  author: Laumar
  version: "1.4"
---

## Required references

Before Phase 1, read `../brief-shared/sections-reference.md` relative to this skill directory. Read `../brief-shared/template-guide.md` only when formatting the output artifact.

# Brief Discovery — Structured Technical Interview

Extract everything needed to produce a high-quality design brief through an adaptive, constraints-first conversation. The output is a `discovery-notes.md` artifact that feeds directly into the `brief-writer` skill. Every phase is conducted through the `question` tool — never plain-text-only questions — with predefined options plus an explicit free-text alternative.

## Core Philosophy

The best briefs come from the best questions. This skill does NOT generate the brief itself — it runs a structured interview that forces clarity on the decisions that matter most, surfaces contradictions early, and documents uncertainty honestly instead of hiding it.

**Constraints before features. Always.**

Most people start with what they want to build. Force them to start with what they will NOT build. The "out of scope" section is the most valuable part of any brief — it prevents scope creep before a single line of code exists.

## When to Activate

- User has a new project idea and wants to define it clearly
- User says "I want to build...", "I have an idea for...", "help me plan..."
- User wants to organize their thoughts about a project before coding
- User needs to clarify ambiguous requirements for an existing idea
- User explicitly asks for a brief, spec, or design document for a new project

## Interview Protocol

### Phase 0 — Context Scan (Silent, before first question)

Before asking anything, check:

1. **Engram**: **If the Engram MCP tool is available in this session**, call `mem_search` with keywords from the user's message. If there is prior work on this project, surface it: "I found context from a previous session about X. Should I build on that, or is this a fresh start?" **If Engram is not available**, skip this silently — don't mention its absence unless the user asks about persistence; it's not relevant yet at this stage.
2. **Workspace**: If there are existing files (code, docs, briefs), acknowledge them. The interview adapts to what already exists — don't ask questions that the codebase already answers. If there's existing code, this also determines the identifier-language answer in Phase 3 automatically (see below) — don't ask it if the code already shows the convention.
3. **Wall-of-text parse**: If the user's opening message already contains a long description, extract answers to as many of Phases 1–5 as possible. Record what was evidenced and only launch `question` calls for the remaining gaps — do not re-ask what was already stated.

### How to use the question tool (all phases)

- **One call per phase batch.** Each phase below maps to exactly one `question` tool call containing one grouped question per topic. Do not split a phase into multiple sequential `question` calls in the same turn.
- **Envelope:** every grouped question lists 3–5 labeled options plus one final option that explicitly permits free text (label it "Otra / Other: escribir libre — describe with your own words" or the active conversation language equivalent). Preserve the complete envelope in original order — headers, labels, descriptions, selection mode — and never summarize, reorder, or omit.
- **Domain:** accept only an exact label match (case-insensitive, trimmed, with ordinal aliases `N` / `la N` / `opción N` / `first` for index 1) or free text when the "Otra" option was offered. Reject zero or multiple matches by re-presenting the complete envelope and STOP.
- **Fallback:** if native `question` UI is unavailable, denied, non-interactive, or the envelope is oversized/unrepresentable, emit the COMPLETE envelope as plain chat and STOP. Do not choose, infer, or continue. Include why input blocks progress and the required answer syntax.
- **Language:** match the user's current conversation language for headers/labels/descriptions; keep machine tokens internal and never expose them in labels.

### Phase 1 — Vision & Identity

Goal: Understand the WHAT and the WHO in one pass. One `question` call.

Offer options such as (adapt wording to the user's actual idea):

| Option label | What it captures |
|---|---|
| Resolver un dolor propio / Solve own pain | Replace a manual workflow, spreadsheet, or existing app |
| Producto para otros / Product for others | Tool/service for a team, clients, or the public |
| Aprendizaje / Learning | Portfolio, exercise, or skill acquisition (triggers Code Detail Level) |
| Prototipo / Prototype | Validate an idea quickly, not production-hardened |
| Otra: escribir libre | Free-text vision + who the primary user is |

Follow-up within the same phase: probe developer goal explicitly — "¿Querés que el brief final incluya el código de solución completo, o preferís que solo tenga las firmas/contratos y dejar la lógica como ejercicio para vos?" — as a second grouped question or as part of the same envelope when the goal is still unresolved. This determines `brief-writer`'s Code Detail Level; don't let the writer guess later. If the user is vague, re-offer the envelope rather than inventing a vision.

Adapt based on answers:
- If the user already has a clear vision → compress this phase, move to constraints
- If the user is vague → stay here and sharpen the idea before advancing

### Phase 2 — Constraints & Promises

Goal: Define the walls of the sandbox BEFORE talking about what goes inside. One `question` call.

Options always include negative-scope probes:

| Option label | What it captures |
|---|---|
| Sin backend / No backend | No server, no auth, local-only |
| Sin cuentas / No accounts | No login, no multi-user |
| Sin nube / No cloud sync | Data stays on device |
| Límite de plataforma / Platform limit | e.g. Android only, web only |
| Otra: escribir libre | Free-text constraints, local vs network data, migration sources |

**Anti-pattern detection**: If the user lists 10+ features but can't name 3 things the app won't do, push back inside the same envelope description: "A project without clear boundaries never ships — name 2–3 things this app will NEVER do." Contradictions (e.g. "no backend" + "real-time sync") are surfaced immediately in this phase; do not defer them.

### Phase 3 — Stack & Architecture

Goal: Identify technologies and justify each choice. One `question` call.

| Option label | What it captures |
|---|---|
| Stack ya elegido / Stack already chosen | User names it; probe justification inside description |
| Quiero recomendación / Want recommendation | Skill recommends based on goals + constraints |
| Evitar / Avoid | Technologies the user wants to avoid |
| Aprender / Want to learn | Technologies the user wants to learn |
| Otra: escribir libre | Free-text stack, scale, and identifier-language |

Probes inside this phase:
- **Justification:** if a framework is chosen "because it's popular," the option description must ask what specific problem it solves for THIS project.
- **Scale:** "¿Qué tan grande esperás que crezca esto — uso personal con 200 registros vs producción con muchos usuarios/datos?" Only offer scale options when Phase 1 goal is production or the user mentioned multi-user/growth; otherwise default to small and note assumption.
- **Identifier language:** what language should code identifiers, comments, and string-resource keys use? If existing code was observed in Phase 0, present it as the default option ("Veo que el código usa español — ¿seguimos así?") rather than asking blindly. If brand-new, offer `English identifiers` / `Español` / `Otra`.

**Push-back triggers** remain firm: DI framework, state-management library, or ORM for a simple app → question whether complexity is justified, inside the option description.

### Phase 4 — Data Model & Persistence

Goal: Define what the app stores, how it relates, and what's mutable. One `question` call (two grouped questions when entities and data flow are both unresolved).

| Option label (entities) | What it captures |
|---|---|
| Entidad simple / Simple entity | Name + 2–3 fields (e.g. name, count) |
| Entidad enriquecida / Rich entity | Name, genre, rating, poster, episode count, etc. |
| Relación entre entidades / Related entities | Multiple entities with relationships |
| Importado / Imported | Data comes from external source (file, API, sheet) |
| Otra: escribir libre | Free-text fields, types, which fields are user-editable vs derived |

Second grouped question in the same call — **Data flow**:

| Option label | What it captures |
|---|---|
| Entrada manual / Manual entry | User types data in |
| Importación / Import | Bulk import from file/API |
| Salida exportación / Export | Export/share/sync out |
| Solo lectura / Read-only | App displays, never mutates |
| Otra: escribir libre | Free-text entry/exit specifics |

**Go concrete here.** Don't accept "the app stores anime data." The option descriptions must ask: "What exactly is an anime entry? A name and a watch count? Or name, genre, rating, episode count, poster URL?" If the user picks a vague option, follow up with a free-text probe inside the same phase before advancing.

### Phase 5 — Screens & Interactions

Goal: Map the user-facing surface area. One `question` call.

| Option label | What it captures |
|---|---|
| Una pantalla + modales / Single screen + modals | Minimal navigation |
| Navegación múltiple / Multiple screens | Distinct views with navigation |
| Lista + detalle / List + detail | Master-detail pattern |
| Dashboard / Dashboard | Aggregation/overview first |
| Otra: escribir libre | Free-text screens, primary actions |

Within the same call, force **rigor probes** as a second grouped question:

- "¿Qué ve el usuario al abrir la app? ¿Qué hace primero? ¿Qué pasa con lista vacía / búsqueda sin resultados / operación fallida?" Each empty/error state is an explicit option; at least one must be answered before closing the phase.

### Phase 6 — Open Questions & Uncertainty

Goal: Capture what ISN'T resolved yet. One `question` call.

| Option label | What it captures |
|---|---|
| Nada pendiente / Nothing pending | Interview feels complete |
| Duda de alcance / Scope doubt | Still unsure about a feature boundary |
| Decisión diferida / Deferred decision | Deliberately leaving a choice to implementation |
| Necesito investigar / Need to research | External dependency or unknown |
| Otra: escribir libre | Free-text open questions + what needs assumption |

**Document uncertainty as first-class output.** An open question in the discovery notes is infinitely better than a premature decision that gets baked into the brief and then has to be reversed.

**Distinction for `brief-writer`**: anything genuinely undecided here goes to "Open Questions" in the final brief. Anything the interview didn't get to but that `brief-writer` will need a concrete value for (and might otherwise guess) should be flagged here as "needs an assumption, to be marked and confirmed later" rather than silently left for the writer to invent unmarked.

## Adaptive Behavior

The phases above are a guide, NOT a rigid sequence. The skill must adapt:

- **If the user arrives with a clear vision and stack**: Skip or compress Phases 1–3, dive into data model and interactions — still via `question` calls, but only for the remaining gaps.
- **If the user is exploring**: Spend more time on Phases 1–2, don't rush to stack choices; let each `question` answer influence the next envelope.
- **If the user dumps a wall of text**: Parse it, extract answers to as many phases as possible, then launch `question` calls only about the gaps — never re-ask what was already evidenced.
- **If the user references an existing project**: Check Engram for context (if available), acknowledge what's known, focus on what's new; still use `question` calls for the unresolved parts.
- **Question batching:** one `question` call per phase, never more than one call per turn. Wait for the answer before the next phase. Each answer influences the next envelope.
- **Rigor is non-negotiable:** even in adaptive/compressed runs, the probes for negative scope, empty/error states, data entry/exit, scale, platform, and stack-vs-constraint contradictions must be evidenced before producing the artifact. A compressed interview that skips them stays `partial`.

## Anti-Pattern Detection

Push back (respectfully but firmly) when you detect:

| Signal | Response (inside option description or follow-up envelope) |
|--------|----------|
| 10+ features listed for an MVP | "Which 3 of these are essential for v1? The rest go to 'Future Scope'." |
| No constraints defined | "What will this app NEVER do? Every strong project has clear boundaries." |
| Stack chosen without justification | "Why X specifically? What problem does it solve that Y doesn't?" |
| "I want it to do everything" | "An app that does everything does nothing well. What's the ONE thing it must nail?" |
| Features that contradict constraints | "You said 'no backend', but this feature requires server-side logic. Which gives?" |
| Premature optimization | "You have 200 records. Do you really need pagination, caching, and a CDN?" |
| Vague entity definition | "Be concrete: what fields does one entry have? Name that exact list." |
| No empty/error state considered | "What does the user see when the list is empty / search finds nothing / save fails?" |

## Output Format — `discovery-notes.md`

When the interview is complete (or when the user says "enough, let's write the brief"), produce a structured artifact:

```markdown
# Discovery Notes — [Project Name]

**Date:** YYYY-MM-DD
**Developer goal:** [learning / production / prototype / portfolio]
**Code detail level (if learning):** [full solution code / contracts only]
**Identifier language:** [resolved language, and how it was resolved — matched from existing code / user stated / defaulted+flagged as assumption]
**Status:** [complete / partial — open questions remain]

## Vision
[1-2 paragraphs: what the project does, who it's for, what it replaces]

## Constraints & Promises
- [NEVER: what the app will not do]
- [LOCAL: what stays on device]
- [PLATFORM: target platform(s)]
- [MIGRATION: existing data sources, if any]

## Stack
| Layer | Technology | Justification |
|-------|-----------|---------------|
| ... | ... | ... |

### Explicitly excluded from stack
- [Technology X — why it's not needed]

## Data Model
### Entities
- **[EntityName]**: [field1 (type), field2 (type), ...] — [what it represents]

### Data flow
- **In:** [how data enters: manual, import, API]
- **Out:** [how data leaves: export, share, display]

## Screens & Interactions
### [Screen Name]
- **Purpose:** [what the user does here]
- **Key actions:** [list of primary interactions]
- **Empty state:** [what happens when there's no data]

## Decisions Made
| # | Decision | Reason |
|---|----------|--------|
| 1 | ... | ... |

## Open Questions
- [ ] [Question that wasn't resolved during discovery]
- [ ] [Decision deferred to implementation]

## Needs Assumption (unresolved, brief-writer must mark and flag for confirmation)
- [ ] [Value the interview didn't reach — e.g. exact spacing, exact colors]

## Out of Scope (v1)
- [Feature/capability explicitly excluded and why]
```

## Engram Integration

After producing the discovery notes, **if the Engram MCP tool is available in this session**:

1. **Save to Engram** with `mem_save`:
   - title: "Discovery notes for [ProjectName]"
   - type: architecture
   - topic_key: `brief/[project-name]/discovery`
   - content: Summary of vision, stack, constraints, and key decisions

2. **Capture prompt context** with `mem_save_prompt` so future sessions can recover the interview context.

**If Engram is not available**, skip this step and say so plainly: "Guardé las notas como artifact, pero no en memoria persistente — Engram no está conectado en esta sesión."

## Handoff to brief-writer

After producing `discovery-notes.md`, inform the user:

> "Discovery complete. You can now use the `brief-writer` skill to generate the full design brief from these notes. The notes are saved as an artifact[, and in persistent memory, if Engram was available]."

Do NOT generate the brief yourself. The separation exists so the user can review and refine the discovery notes before committing to a full brief.
