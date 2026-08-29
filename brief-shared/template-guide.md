# Brief Writer — Formatting & Quality Examples

> Canonical package copy: `brief-shared/template-guide.md`. Keep this root copy synchronized only for backwards compatibility; installed skills must read the `brief-shared` copy.

> **Note on scope:** this file holds formatting examples and good/bad comparisons only. It is **not** the source of truth for which sections a brief must contain, nor for the language/assumption policies — those live in `sections-reference.md` and are shared by `brief-writer` and `brief-audit`. Read this file for *how to phrase and format* a section; read `sections-reference.md` for *what's mandatory and which conventions apply*.

## Section Templates with Examples

### Header Block

```markdown
# Design Brief — [Project Name]

**Version:** v1
**Date:** 2026-08-10
**Status:** Ready for implementation
**Stack:** Kotlin · Jetpack Compose · Material 3 · Room · DataStore
**Build mode:** Code written by hand. AI assists with architecture review and verification.
```

### Summary & Guiding Principle

Good example (from AniLista):
> App Android nativa para reemplazar una lista de animes que actualmente vive en un archivo de texto plano. El objetivo es sumar las comodidades que un editor de texto no da: ordenar, buscar, editar entradas puntuales, marcar cuántas veces viste algo, y respaldar/restaurar la lista desde un `.txt`.
>
> **Principio rector**: cada pantalla debe ser simple de usar — intuitiva, sin pasos innecesarios, con acciones accesibles sin fricción.

Why it's good:
- States what the app DOES in one sentence
- States what it REPLACES
- Defines a guiding principle that governs every design choice

Bad example:
> "A modern app for managing anime lists with a beautiful UI and great UX."

Why it's bad: Says nothing about constraints, replacement, or governing principles.

### Stack Table

Good example:
```markdown
| Layer | Technology | Why |
|-------|-----------|-----|
| Language | Kotlin | Official Android standard, Compose support |
| UI | Jetpack Compose | Declarative, modern DX |
| Persistence | Room | Reactive queries via Flow, typed SQL |
| Preferences | DataStore | Modern SharedPreferences replacement, exposes Flow |

**Not in the stack (and why):**
- **Retrofit/OkHttp**: No network API exists
- **Hilt/Koin**: Dependency graph is flat, ViewModel factory suffices
- **Navigation Compose**: Single screen with states, no routes needed
```

### Decision Registry

Good example (from AniLista):
```markdown
| # | Decision | Reason | Status |
|---|----------|--------|--------|
| 1 | Query canonical (`createdAt ASC, id ASC`) | Single source of truth; eliminates timestamp collisions | New |
| 2 | Pipeline in memory, not SQL | Canonical numbering requires single ascending source; ~200 items makes memory cost negligible | Replaces v4 #25 |
| 3 | Export .txt non-destructive | Don't mutate user text; .json is the exact backup | Replaces v4 #16 |
```

Why it's good: Numbered, justified with project-specific reasoning (not "best practice"), includes status for evolution briefs.

### Edge Case Tables

Good example:
```markdown
| Case | Behavior |
|------|----------|
| Empty file / 0 valid lines | Snackbar "No entries found in file" |
| M ignored lines among N imported | Snackbar "Imported N (M lines ignored)" |
| Lines without number prefix | Imported anyway (regex is optional) |
| Name with "x" in middle ("Spy x Family") | Preserved as-is, no parsing |
| JSON with `version != 1` | Snackbar "Unsupported schema version: X" |
| Cancel SAF without choosing file | No action, no error shown |
```

Why it's good: Exhaustive, scannable, covers both happy and unhappy paths.

### State Hoisting Signatures

Good example:
```kotlin
@Composable
fun AnimeListTopBar(
    totalCount: Int,
    visibleCount: Int,
    isFilteredOrSearched: Boolean,
    sortOrder: SortOrder,
    onSortOrderChanged: (SortOrder) -> Unit,
    onOpenThemeSheet: () -> Unit,
    modifier: Modifier = Modifier
)
```

Why it's good: Pure inputs (immutable data + event lambdas), no ViewModel dependency, testable in isolation.

### A Note on Identifier Language in These Examples

The examples above use Spanish domain identifiers (`nombre`, `AnimeListTopBar` mixed with Spanish props is not shown here but appears elsewhere in the AniLista brief) because that is AniLista's **resolved** language policy (see `sections-reference.md` § Language Policy) — the project matched its existing codebase, which was already in Spanish. This is not a universal default. When writing a brief for a different project, follow whatever language policy that project resolves to, even if it differs from these examples; copy the *formatting pattern*, not the *specific language choice*.

### Definition of Done per Phase

Good example:
```markdown
### Phase 1 — Project Setup
**Deliverables:** `build.gradle.kts`, empty `MainActivity.kt`, Compose theme scaffold
**Done when ALL of:**
- [ ] App builds and launches to a blank Compose screen with the app's Material theme applied
- [ ] `./gradlew test` runs (even with zero tests) without config errors
- [ ] No file outside the Project Structure (§11) was created
```

Why it's good: every item is checkable by someone who wasn't there when the phase was planned. Compare to the bad version below.

Bad example:
```markdown
### Phase 1 — Project Setup
**Done when:** the project is set up and ready for the next phase.
```

Why it's bad: "set up and ready" means nothing concrete — an agent implementing this decides for itself what counts as ready.

### Agent Constraints Block (within §4)

Good example:
```markdown
**Agent Constraints (implementation rules):**
- If it's not in this brief, it does not exist — do not add features, files, or dependencies "because it makes sense."
- If something is ambiguous, do not guess — ask, or mark it as an open question / assumption per this brief's policies.
- Do not add dependencies outside the Stack table without flagging it first.
- Do not create files outside Project Structure without flagging it first.
- Do not rename established identifiers (see Naming Dictionary, if present) without flagging it first.
```

Why it's good: it's short (5 rules, always the same shape), sits right where the stack boundaries already live, and gives any implementer — including one reading the brief cold, without `brief-implementation`'s runtime guardrail — the same "don't guess, ask" instruction.

### Error Taxonomy (within §8)

Good example:
```markdown
**Error Taxonomy**

| Error Type | Trigger | User Response | Technical Handling | Retryable? |
|-----------|---------|----------------|----------------------|------------|
| ImportParseError | Line doesn't match expected `.txt` format | Snackbar: "N imported (M ignored)" | Log line, skip, continue parsing | No |
| JsonSchemaError | `version != 1` in imported JSON | Snackbar: "Unsupported schema version: X" | Abort import, no partial write | No |
| StorageFullException | Local write fails | Dialog: "Storage error" | Retry once, then surface to user | Yes (1x) |
```

Why it's good: one place defines what each error type *is* and how it's always handled, instead of the same `ImportParseError` being described three different ways across three different per-screen tables.

### Naming Dictionary (within §11, conditional)

Good example (only needed once a project has 3+ related-but-distinct representations of a concept):
```markdown
**Naming Dictionary**

| Concept | Canonical Term | Used In | Not to be confused with |
|---------|-----------------|---------|----------------------------|
| One anime record in the DB | `AnimeEntity` | Room, DAO, Repository | `AnimeCard` (UI), `AnimeDto` (export) |
| One anime rendered in the list | `AnimeCard` | Compose UI | `AnimeEntity` (DB) |
| One anime in the exported JSON | `AnimeDto` | Export/import parser | `AnimeEntity` (DB) |
```

Why it's good: prevents exactly the `AnimeCard` vs `AnimeItem` drift the Common Anti-Patterns table below warns about, by naming the concepts once instead of relying on every section staying consistent by accident.

## Common Anti-Patterns in Briefs

| Anti-Pattern | Why It's Bad | Fix |
|-------------|-------------|-----|
| "Handle errors gracefully" | Means nothing concrete | Specify exact error → UI response mapping |
| Decision without "why" | Will be questioned and reversed | Add project-specific justification |
| "TBD" or "to be decided" | Blocks implementation | Move to Open Questions section |
| Features in roadmap not in spec | Implicit scope creep | Either add to spec or remove from roadmap |
| Stack choice "because it's popular" | Not a reason | Explain what problem it solves for THIS project |
| Empty states not defined | Will be improvised inconsistently | Define text, icon, and actions for every empty state |
| Code snippets as pseudocode | Can't verify correctness | Write real, compilable code (or explicit contracts — see Code Detail Level in `brief-writer`) |
| Unmarked assumption presented as a user decision | Impossible to tell what was actually confirmed | Mark with `(supuesto — confirmar)` per `sections-reference.md` |
| Section list drifting between the brief and its audit | Audits stop being trustworthy | Both always read `sections-reference.md`, never a local copy |
