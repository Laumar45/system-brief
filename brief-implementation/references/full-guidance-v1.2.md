> **Historical reference — not a runtime contract.** The sibling SKILL.md v1.6 is authoritative. Use this file only for background, examples, or migration review.

---
name: brief-implementation
description: "Trigger: implement or resume a project from an existing brief, phase by phase. Guard against silent scope drift and record deviations in docs/brief/IMPLEMENTATION_LOG.md."
license: Apache-2.0
metadata:
  author: Laumar
  version: "1.6"
---

## Required references

Before Step 1, read `../brief-shared/sections-reference.md` relative to this skill directory. For Next.js projects, also read `../brief-shared/references/nextjs.md`.

# Brief Implementation — Guarded, Phase-by-Phase Build

Turn a finished design brief into code without letting the implementation quietly drift away from what the brief actually specifies. This skill does not write brand-new architecture decisions on the fly — it builds exactly what the brief says, phase by phase, and treats any deviation as an event that must be surfaced and recorded, never silently absorbed.

## Core Philosophy

**The brief is the contract. Implementation either follows it or explicitly renegotiates it — it never quietly overrides it.**

The most common failure mode this skill exists to prevent: an agent hits a decision the brief doesn't cover (or a place where following it exactly is awkward), and — under the pressure of "just make it work" — invents a reasonable-sounding fix and moves on. Six months later nobody remembers that decision was ever made, the brief still describes the old behavior, and the next audit (or the next AI session) has no way to know the code and the doc disagree.

This skill's job is to make that failure mode structurally hard: every deviation gets a forced stop-and-ask, and every phase leaves a written trail.

## When to Activate

- User wants to start coding from an existing brief ("empecemos a implementar", "vamos al paso 1", "quiero codear esto ahora")
- User is resuming implementation of a project that already has a brief and possibly an `IMPLEMENTATION_LOG.md` (check `docs/brief/IMPLEMENTATION_LOG.md` or legacy `./IMPLEMENTATION_LOG.md`)
- User wants to check how implementation progress compares to the brief
- User wants to log or resolve a deviation from the brief mid-session

## Prerequisites

This skill requires a finished design brief (ideally one that passed `brief-audit` with a score ≥ 7/10 — see Handoff). If no brief exists, or the brief scores low, redirect:

- No brief at all → suggest `brief-discovery` then `brief-writer`
- Brief exists but is thin/contradictory → suggest running `brief-audit` first, fix critical issues, then return here

Do not attempt to "fill in the gaps" of a bad brief yourself while coding — that's exactly the invisible-decision failure mode this skill exists to prevent. Gaps get fixed in the brief, not papered over in code.

## Implementation Protocol

### Step 1 — Pre-Flight Check

Before writing a single line, confirm with the user:

1. **Which brief version** is being implemented (if multiple versions exist, confirm the latest is intended).
2. **Which phase/step of the roadmap** this session starts at. Check for an existing `docs/brief/IMPLEMENTATION_LOG.md` first (with fallback to legacy `./IMPLEMENTATION_LOG.md`, Step 3) — if one exists, read it and confirm the starting point matches its last recorded state instead of asking from scratch.
3. **Environment state**: does the repo/project already exist, or does it need to be scaffolded from zero? If scaffolding, confirm the project structure (brief §11) will be created as specified before any feature code is written.
4. **Code Detail Level** (per `brief-writer`): if the brief specifies "contracts only" for learning purposes, confirm the user still wants that for this session — sometimes people ask for the full solution mid-project after starting with the exercise mode. If they want to switch, note it in the log (Step 3), don't switch silently.

Do not skip this step even when resuming a familiar project — briefs get updated between sessions, and assuming stale context is how sessions start building against an outdated version.

### Quick Path — Small, isolated changes

Use this path only when the change is limited to an existing behavior, requires no new dependency, public contract, entity field, route, screen, or file outside the current structure, and can be covered by an existing acceptance criterion. Read the relevant brief subsection, make the change, run the targeted check, and record it in `docs/brief/IMPLEMENTATION_LOG.md` (or legacy `./IMPLEMENTATION_LOG.md`). If any boundary changes, return to the full Pre-Flight and Scope Guardrail flow.

### Step 2 — Scope Guardrail (active for the entire implementation session)

This step operationalizes the brief's own **Agent Constraints block** (§4, if the brief includes one per `sections-reference.md`) — treat those five rules as active during the whole session, not just as a note to read once. If the brief has a **Naming Dictionary** (§11), the same guardrail applies to identifier choice: don't introduce a new name for an existing concept, or reuse an existing name for a new concept, without flagging it.

Before writing anything that is **not literally specified** in the brief — an extra helper function with behavior the brief didn't describe, a library not listed in the Stack table, a new entity field, a UI element not in the Layout section, a different error-handling behavior than the brief's Error Taxonomy or Interactions table — **stop and ask**, don't just proceed:

> "Esto no está en el brief — ¿lo agrego al brief primero (`brief-writer` evolution/patch), o lo implemento igual como decisión ad-hoc que documentamos en el log?"

This applies symmetrically in both directions:
- **Something the brief requires turns out to be a bad idea once you're actually building it** (an API doesn't work the way the brief assumed, a library is deprecated, a pattern doesn't compile as specified) → stop, explain the conflict, ask whether to patch the brief or find a workaround that still satisfies the brief's intent.
- **Something outside the brief would obviously improve the result** (a small correctness fix, an edge case the brief missed) → still ask, even if it seems trivial and even if you're confident the user would say yes. Cheap "obviously right" additions are exactly how scope creeps in unnoticed over many small yeses.

**Exception — bugs strictly within a phase's own acceptance criteria:** fixing something that doesn't yet meet the brief's own stated acceptance criteria for the current phase (brief §13) is not a deviation, it's just finishing the phase correctly. No need to stop and ask for those.

Log every deviation and its resolution in `docs/brief/IMPLEMENTATION_LOG.md` (or legacy `./IMPLEMENTATION_LOG.md`, Step 3) regardless of which way it was resolved — even ones the user waves through with "sí, dale, no hace falta actualizar el brief" should be recorded, because that's exactly the kind of thing an audit needs to find later.

### Step 3 — `docs/brief/IMPLEMENTATION_LOG.md`

Maintain this file throughout the implementation (saved in `docs/brief/IMPLEMENTATION_LOG.md`, respecting legacy `./IMPLEMENTATION_LOG.md` if an existing project already uses it), updating it at least at the start and end of every phase, and immediately whenever a deviation from Step 2 is resolved. Create it at the very first session if it doesn't exist yet.

```markdown
# Implementation Log — [Project Name]

**Brief version being implemented:** v[N]
**Code Detail Level:** [full solution / contracts only]

## Phase Progress

| Phase | Status | Started | Completed | Notes |
|-------|--------|---------|-----------|-------|
| 1 — [Phase name] | ✅ Done / 🔶 In progress / ⬜ Not started | YYYY-MM-DD | YYYY-MM-DD | |

## Deviations from the Brief

| # | Phase | What the brief says | What was actually done | Resolution | Brief updated? |
|---|-------|----------------------|--------------------------|------------|-----------------|
| 1 | ... | ... | ... | [Ad-hoc, documented here only / Brief patched to match] | Yes/No |

## Session Notes
- [YYYY-MM-DD] [Free-form notes on what was done this session, blockers hit, anything relevant to resuming later]
```

This file is what lets a future session — yours or a different AI agent's — resume without re-deriving context, and it's what `brief-audit`'s post-implementation mode cross-checks against the actual code (undocumented drift found there is flagged as 🔴 Critical, since the whole point of this log is that drift shouldn't be undocumented).

**Keep the log itself honest.** Don't record a deviation as "Brief updated: Yes" unless the brief file was actually edited in that session — an aspirational note that the brief "should be updated later" is a 🔶 In progress deviation, not a resolved one, and must stay flagged until it's actually done.

### Step 4 — Phase Execution

Within a phase:

1. Re-read the phase's description in the brief roadmap (§12) plus its relevant sections (Data Model, Layout, Interactions) — don't work from memory of the brief if the session has been long; re-fetch the specific subsections being implemented.
2. Implement following the brief's contracts/code exactly as specified (respecting Code Detail Level — if contracts-only, write the signatures the brief specifies and let the user drive the logic, prompting them rather than filling it in yourself unless asked).
3. Apply the Scope Guardrail (Step 2) continuously, not just at phase boundaries.
4. Update `docs/brief/IMPLEMENTATION_LOG.md` (or legacy `./IMPLEMENTATION_LOG.md`) phase status to 🔶 In progress at start.

### Step 5 — Phase Close: Mini-Audit

Before moving to the next phase, check the current phase's own deliverable against its **"Done when ALL of" checklist** (brief §12, per `sections-reference.md` § Definition of Done) and its acceptance criteria (brief §13, filtered to this phase). This is intentionally lightweight — a quick pass/fail check against an already-concrete checklist, not a full `brief-audit` run:

- Walk every item in the phase's "Done when" checklist literally — each one should be checkable without re-interpreting what the brief author meant. If a checklist item turns out to be ambiguous in practice, that's itself a brief gap — flag it rather than deciding on your own how to interpret it.
- Were any deviations from Step 2 left unresolved (marked ad-hoc but not yet decided whether to patch the brief)?
- Update `docs/brief/IMPLEMENTATION_LOG.md` (or legacy `./IMPLEMENTATION_LOG.md`): mark the phase ✅ Done with completion date only when every checklist item passes, or flag specific failing items keeping it 🔶 In progress.

Do not silently start the next phase if the current one's acceptance criteria aren't met — tell the user what's failing and ask whether to fix it now or proceed with it as a known gap (logged as such).

### Step 6 — Project Completion

When all roadmap phases are marked ✅ Done:

1. Do a final pass over `docs/brief/IMPLEMENTATION_LOG.md` (or legacy `./IMPLEMENTATION_LOG.md`) — resolve any deviation still marked "Brief updated? No" by asking the user whether to patch the brief now, before calling the project finished. An unresolved "No" at project completion means the brief no longer matches reality and nobody decided that was okay.
2. Suggest running `brief-audit` in **post-implementation mode** (see that skill's Step 9) — comparing the finished brief against the finished code, using this log as a cross-check — as the natural closing step of the whole discovery → writer → implementation → audit cycle.

## Engram Integration

Throughout implementation, **if the Engram MCP tool is available in this session**:

- At Phase Close (Step 5), save a short progress note with `mem_save`:
  - title: "[ProjectName] — Phase [N] complete"
  - type: architecture
  - topic_key: `brief/[project-name]/implementation`
  - content: What was completed, any deviations logged, current overall status

**If Engram is not available**, rely solely on `docs/brief/IMPLEMENTATION_LOG.md` (or legacy `./IMPLEMENTATION_LOG.md`) as the persistence mechanism and say so if the user asks about cross-session memory: "El progreso está en `docs/brief/IMPLEMENTATION_LOG.md` en el repo — Engram no está conectado en esta sesión, así que no hay respaldo adicional en memoria."

## Handoff

- **Mid-project, resuming later**: "El progreso está en `docs/brief/IMPLEMENTATION_LOG.md`. La próxima sesión puede arrancar leyendo ese archivo sin perder contexto."
- **Deviation found that needs a brief update**: hand off to `brief-writer` (evolution mode) to patch the brief before continuing to code against it.
- **Project complete**: hand off to `brief-audit` (post-implementation mode) for the final brief-vs-code check.
- **Brief turns out too weak to implement against** (discovered mid-session, not just at Pre-Flight): stop, explain what's missing or contradictory, and hand off to `brief-audit` or `brief-writer` rather than continuing to guess.