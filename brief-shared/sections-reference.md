# Brief Sections Reference — Shared Source of Truth

> Canonical package copy: `brief-shared/sections-reference.md`. Keep this root copy synchronized only for backwards compatibility; installed skills must read the `brief-shared` copy.

This file is the **single canonical definition** of what a design brief must contain. Both `brief-writer` (which generates briefs against this list) and `brief-audit` (which scores briefs against this list) read this file directly instead of keeping their own copies. If you need to add, rename, split, or drop a mandatory section, edit **only this file** — never hardcode a divergent section list inside either skill.

This file also holds the cross-cutting policies (Language Policy, Assumption Marking) referenced by both skills, for the same reason: one definition, read by both.

**Design principle for this file:** every requirement below earns its place by closing a real ambiguity gap for an implementing agent. Requirements that would only matter for large, multi-dev, production-scale projects are marked as *conditional* rather than universal — a personal or learning-scale brief shouldn't carry ceremony it doesn't need. When in doubt, prefer folding a requirement into an existing section over creating a new top-level one; a brief with 15 well-specified sections is easier to use than one with 20 thin ones.

## Mandatory Sections (15)

| # | Section | Severity if Missing | Skip Rule | Minimum Content Requirement |
|---|---------|---------------------|-----------|------------------------------|
| 1 | Header Block | 🔴 Critical — no version/status/stack anchor | Never skip | Version, date, status, stack summary line, build mode |
| 2 | Summary & Guiding Principle | 🔴 Critical — the document has no anchor | Never skip | What it does, what it replaces, developer's goal, one bolded guiding principle |
| 3 | Delta Matrix | 🔴 Critical *(evolution briefs only)* — without it v2 can't be understood without v1 | Skip entirely for v1/new briefs | Every row has a concrete technical reason, not "improved"/"updated" |
| 4 | Stack & Constraints | 🔴 Critical — tech choices are unjustified | Never skip | Stack table with justification column; explicit "not in stack" list; **Agent Constraints block** (see below) |
| 5 | Visual Identity | 🟡 High *(UI projects only)* — UI is ambiguous without concrete tokens | Skip for backend-only/CLI projects | Every color has a hex value, every spacing a dp/px value, every duration a ms value — no "TBD" |
| 6 | Layout & Component Architecture | 🟡 High — UI/surface is ambiguous | Never skip: for backend/CLI use **API/CLI Surface & Contracts** instead | UI: state-hoisting signatures plus empty/error states per screen. Backend/CLI: endpoint/command, inputs, outputs, access, and failure contracts |
| 7 | Data Model & Behavior | 🔴 Critical — the core contract is undefined | Never skip | Entity code, queries/API contracts, reactive pipeline, import/export edge cases in tables; **pre/post-conditions per public function when Code Detail Level = contracts-only** (see below) |
| 8 | Interactions & Feedback | 🟡 High — action→response mapping will be improvised | Never skip | Action→response table for every interactive element; accessibility semantics; **centralized Error Taxonomy subsection** (see below) |
| 9 | Out of Scope | 🟡 High — scope creep is inevitable | Never skip | Minimum 5 items, each with a one-line reason |
| 10 | Closed Decisions Registry | 🔴 Critical — decisions will be questioned and reversed | Never skip | Every decision numbered with a project-specific reason; identifier-language policy as a numbered decision; "Supuestos a confirmar" subsection |
| 11 | Project Structure | 🟢 Medium — helps orientation | Optional for single-file/spike projects | Directory tree with per-file purpose comments (brief artifacts belong in `docs/brief/`); **Naming Dictionary column/subsection when the project has 3+ reusable components or is an evolution brief** (see below) |
| 12 | Implementation Roadmap | 🟡 High — no clear path to execution | Never skip | Each phase lists deliverables (files) and a **"Done when" checklist of 3+ verifiable conditions** (see below) |
| 13 | Acceptance Criteria & Test Plan | 🟡 High — no way to verify completion | Never skip | At least 1 pass/fail criterion per screen + 1 per data flow + 1 per edge-case category; no "works correctly"-style criteria |
| 14 | Open Questions | 🟢 Medium *(only if any remain)* — honest documentation of uncertainty | Omit section if genuinely empty, don't fake-fill it | Each question is answerable, not rhetorical |
| 15 | Glossary | 🔵 Low *(learning projects only)* | Skip for production/portfolio projects | Terms actually used in the brief, concise definitions |

`brief-writer` must generate all applicable sections (respecting the Skip Rule column) and satisfy the Minimum Content Requirement for each. `brief-audit` must check for all applicable sections, verify the minimum content was actually met (not just that the header exists), and use exactly the severities above — not invent new ones.

## Agent Constraints (required content within §4)

Every brief must include a short, explicit block of behavioral rules for whatever agent implements it — human or AI. This is not a new top-level section; it lives inside §4 (Stack & Constraints), right after the "not in stack" list, so it sits next to the other boundaries of the project. Keep it short — this is a reminder of standing rules, not a place to re-litigate them:

```markdown
**Agent Constraints (implementation rules):**
- If it's not in this brief, it does not exist — do not add features, files, or dependencies "because it makes sense."
- If something is ambiguous, do not guess — ask, or mark it as an open question / assumption per this brief's policies.
- Do not add dependencies outside the Stack table without flagging it first.
- Do not create files outside Project Structure without flagging it first.
- Do not rename established identifiers (see Naming Dictionary, if present) without flagging it first.
```

`brief-implementation`'s Scope Guardrail is what *enforces* these at build time — this block is what makes the rule visible even if someone implements the brief without using that skill (a different AI session, a human reading it cold, another tool entirely).

## Definition of Done (required content within §12)

Each roadmap phase must include a "Done when ALL of" checklist with a **minimum of 3 verifiable conditions** — not vague completion language like "UI is polished" or "testable in isolation" on its own. A condition is verifiable if a different person (or agent) could check it without needing to ask the author what they meant.

```markdown
### Phase 2 — Data Layer
**Deliverables:** `AnimeDao.kt`, `AnimeRepository.kt`, `AppDatabase.kt`
**Done when ALL of:**
- [ ] `AnimeDao.getAllCanonical()` returns `Flow<List<AnimeEntity>>` ordered by `(createdAt ASC, id ASC)`
- [ ] Inserting a duplicate name (case-insensitive) is rejected per the dedup rule in §7, not silently allowed
- [ ] No file outside Project Structure (§11) was created
```

This is what `brief-implementation`'s Phase Close mini-audit (Step 5) checks against, and what `brief-audit`'s Structural Completeness scoring verifies exists for every phase.

## Error Taxonomy (required content within §8, when the project has error-prone I/O)

For projects with meaningful error surfaces — file import/export, network calls, storage writes — §8 must include one centralized error table instead of scattering error handling only across per-screen edge-case tables. Small projects with a single error surface (e.g. just file import) can keep this compact; skip entirely only if the project genuinely has no failure-prone operations (e.g. a pure offline calculator with no I/O).

```markdown
**Error Taxonomy**

| Error Type | Trigger | User Response | Technical Handling | Retryable? |
|-----------|---------|----------------|----------------------|------------|
| ImportParseError | Line doesn't match expected format | Snackbar: "N imported (M ignored)" | Log, skip line | No |
| StorageFullException | Local write fails | Dialog: "Storage error" | Retry once, then surface | Yes (1x) |
```

Per-screen edge-case tables (§8's action→response mapping) still exist for UI-specific behavior; this taxonomy is the single place that defines *error types* so the same `ImportParseError` isn't handled three different ways in three different files.

## Naming Dictionary (required content within §11, conditionally)

Required only when the project has **3 or more reusable UI components/entities that could plausibly be confused** (e.g. a card shown in a list vs. the same concept as a DB entity vs. as an export DTO), or when writing an evolution brief where names may have drifted. Single-screen, single-entity projects (like a first learning app) can skip this — the Language Policy and `brief-audit`'s naming-consistency check already cover that scale.

```markdown
**Naming Dictionary**

| Concept | Canonical Term | Used In | Not to be confused with |
|---------|-----------------|---------|----------------------------|
| One anime record in the DB | `AnimeEntity` | Room, DAO, Repository | `AnimeCard` (UI), `AnimeDto` (export) |
| One anime rendered in the list | `AnimeCard` | Compose UI | `AnimeEntity` (DB) |
```

## Pre/Post-Conditions (required content within §7, conditionally)

Required **only when `brief-writer`'s Code Detail Level is "contracts only."** In that mode the function signature alone is not enough to implement deterministically — precondition, postcondition, and emission/error behavior must be spelled out, since there's no full code body to fall back on as the specification:

```kotlin
suspend fun getFilteredAnimes(
    query: String,
    sortOrder: SortOrder
): Flow<List<AnimeEntity>>
// Precondition: query is trimmed, lowercase
// Postcondition: emits on every DB change, sorted by (createdAt ASC, id ASC)
// Empty query returns all records
// Error: never throws; emits empty list on DB error
```

When Code Detail Level is "full solution code," the written-out function body already is the specification — do not also require prose pre/post-conditions for every function, that's documenting the same contract twice for no added clarity.

## Language Policy

Design briefs mix two languages: the **narrative prose** of the document, and the **technical artifacts** (code, identifiers, string resource keys, comments) embedded in it. These follow different rules, and the brief must say so explicitly:

- **Narrative prose** follows the language the user communicates in.
- **Technical artifacts (identifiers, code comments, DB column names, string resource keys)** follow the project's own established convention — not a fixed default. Determine this convention as follows, in order:
  1. If the project has existing code (evolution brief, or migrating an existing app/file), match the identifier language already in use there. Do not silently translate `nombre` to `name` mid-project — that's a breaking rename disguised as a brief update.
  2. If it's a brand-new project, ask the user during `brief-discovery` (Phase 3) which identifier language they want. Don't assume English by default — many solo/learning projects deliberately keep domain vocabulary in the developer's own language.
  3. Only if genuinely unspecified and there's no existing code to match, default to English and mark it as an explicit assumption (see below).
- Whatever is decided, `brief-writer` must state it as an explicit, numbered Closed Decision ("Identifiers in Spanish, matching existing AniLista codebase") — not leave it implicit. This is what lets `brief-audit` verify that every code snippet in the brief actually follows the stated policy, instead of the brief contradicting its own examples.

## Assumption Marking

Any concrete value or decision that appears in the brief **without having been explicitly discussed with the user** during discovery (a specific hex color, a specific dp/ms value, a specific library choice made unilaterally by the writer) must be marked inline where it first appears:

```
Corner radius: 12dp (supuesto — confirmar)
```

...and listed together in a "Supuestos a confirmar" subsection near the Closed Decisions Registry, so the user can scan and approve/reject them in one pass instead of hunting through the document. Once the user confirms a value, remove the marker and it becomes a normal Closed Decision with the user's confirmation as its justification.

This distinction matters because an unmarked assumption reads identically to a decision the user actually made — and an implementing agent (or the user themselves, months later) has no way to tell the difference without this marker.
