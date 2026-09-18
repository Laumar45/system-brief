> **Historical reference — not a runtime contract.** The sibling SKILL.md v1.5 is authoritative. Use this file only for background, examples, or migration review.

---
name: brief-writer
description: "Trigger: write, generate, or evolve a design brief/spec. Convert discovery notes or project context into a self-contained, technically precise brief."
license: Apache-2.0
metadata:
  author: Laumar
  version: "1.2"
---

## Required references

Before generation, read `../brief-shared/sections-reference.md` relative to this skill directory. Read `../brief-shared/template-guide.md` for formatting examples. For Next.js projects, also read `../brief-shared/references/nextjs.md`.

# Brief Writer — Technical Design Brief Generator

Generate production-grade design briefs that serve as the single source of truth between a human developer and any AI coding assistant. The output is a self-contained, technically precise document that eliminates ambiguity and prevents scope creep.

## Core Philosophy

A design brief is a CONTRACT, not a wishlist. Every section must earn its place. Every decision must have a "why." Every omission must be intentional and documented.

**The brief exists so that ANY agent — human or AI — can pick it up and build exactly what was intended, without guessing.**

## When to Activate

- User asks to "write the brief", "generate the spec", or "create a design document"
- User has completed a `brief-discovery` session and wants the full document
- User wants to evolve an existing brief to a new version
- User has enough project context (from conversation, existing docs, or Engram) to produce a brief
- User provides or references a `docs/brief/discovery-notes.md` artifact 

## Operating Modes

### Mode 1 — New Brief (from discovery notes or conversation)

Generate a complete v1 design brief saved to `docs/brief/brief.md`. Requires either:
- A `docs/brief/discovery-notes.md` artifact from the `brief-discovery` skill
- Sufficient context from the current conversation
- Existing project context from Engram

### Mode 2 — Evolution Brief (v1 → v2)

Generate a self-contained evolution document. Requires:
- The existing brief (v1)
- A description of what changes and why

**Before writing anything in Mode 2, verify the previous brief still reflects reality.** The v1 *document* describes an intended state, but implementation often diverges from it (ad-hoc fixes, reversed decisions never written back). If the user has a codebase available:
1. Skim the actual source for the areas being evolved (entity definitions, DAO queries, key ViewModel logic).
2. If what you find contradicts what v1's document says, do not silently write the evolution brief against the document's version of events. Tell the user explicitly: "El código actual hace X, pero el brief v1 dice Y — ¿el brief v2 debería documentar X como el estado heredado real, o el código necesita corregirse primero?"
3. Only proceed to write the Delta Matrix once you know which one — document or code — is the accurate "before" state.

If no codebase is available to check, state this as an assumption in the brief itself: "Delta calculado contra el documento v1 (no se verificó contra código fuente)."

**Evolution briefs are NOT diffs.** They are complete, self-contained documents that can be read without referring back to the previous version. They include a delta matrix showing what changed, what was inherited, and what was replaced.

## Pre-Generation Checklist

Before writing a single line, verify you have clarity on these 6 pillars. If any is missing, ask the user — don't invent answers:

1. **Vision**: What problem does this solve? For whom?
2. **Constraints**: What will it NEVER do?
3. **Stack**: What technologies, and why each one?
4. **Data**: What entities exist and how do they flow?
5. **Surface**: What screens/views exist and what actions do they support?
6. **Goal**: Is this for learning, production, prototyping, or portfolio?

If more than 2 pillars are unclear, recommend running `brief-discovery` first instead of generating a weak brief.

Also confirm, if `brief-discovery`'s notes don't already answer it:
- **Identifier language policy** — see `sections-reference.md` § Language Policy. Never default to English silently; resolve it per that policy before writing any code snippet.
- **Code detail level** — for learning-goal projects, ask whether the user wants full solution code in the brief (Data Model, parsers, pipelines fully written out) or contracts/signatures only, leaving implementation as an exercise (see § Code Detail Level below). For production/prototype/portfolio goals, default to full code without asking.

## Brief Structure — Mandatory Sections

The complete, authoritative list of mandatory sections — including severities and skip rules — lives in `sections-reference.md`. Read it before generating a brief; do not rely on a memorized copy of the section list, since it's shared with `brief-audit` and may have been updated independently. What follows here is guidance on *how* to write each section well, not the definition of *which* sections exist.

### 1. Header Block
```markdown
# Design Brief — [Project Name]

**Version:** v[N]
**Date:** YYYY-MM-DD
**Status:** [Draft | Ready for implementation | Evolution of vN-1]
**Stack:** [concise tech list separated by ·]
**Build mode:** [description of how the code is written — by hand, AI-assisted, etc.]
```

### 2. Summary & Guiding Principle
One clear paragraph explaining what the project IS, followed by a bold guiding principle that governs every decision in the document.

Include:
- What the app does (1-2 sentences)
- What it replaces or improves (if applicable)
- The developer's goal (learning, production, etc.)
- The core promise (e.g., "everything is local", "zero configuration", "works offline")

### 3. Delta Matrix (Evolution mode only)
A table comparing the previous version with the current one:

```markdown
| Area | Previous (vN-1) | Current (vN) | Reason |
|------|----------------|--------------|--------|
```

Each row must have a concrete technical reason, not just "improved" or "updated." Per Mode 2 above, this table describes the *verified* previous state, not just what the old document claimed.

### 4. Stack & Constraints
A table of every technology in the stack with a justification column. Followed by an explicit list of what is NOT in the stack and why:

```markdown
| Layer | Technology | Why |
|-------|-----------|-----|

**Not in the stack (and why):**
- [Technology X]: [reason it's excluded]
```

Include environment constraints (min SDK, target platform, test execution rules, CI/CD restrictions).

**Agent Constraints block (required, see `sections-reference.md` § Agent Constraints):** close this section with the short standing-rules block for whatever implements the brief — human or AI. Keep it to the 5 rules defined in the shared reference (don't add unlisted deps/files, don't guess, ask instead, don't silently rename). This is what makes the "don't guess" philosophy visible to an agent even outside `brief-implementation`'s runtime guardrail.

### 5. Visual Identity (if the project has UI)
- Color system with concrete hex values and token names
- Typography hierarchy with specific M3/CSS styles
- Spacing and shape tokens with dp/px values
- Motion system: what animates, what doesn't, and why

Skip this section entirely for backend-only or CLI projects (per `sections-reference.md`).

### 6. Layout & Component Architecture
For each screen or view:
- Hierarchical description (top to bottom, outside to inside)
- Component decomposition with state hoisting signatures
- Empty states and error states (these are NOT optional — they are first-class UI states)

**State Hoisting contracts**: For UI framework projects (Compose, React, SwiftUI), specify the function signatures of key components explicitly. Components receive immutable state and event lambdas — never framework instances like ViewModels or Stores.

```kotlin
// Example: Compose component contract
@Composable
fun ComponentName(
    data: DataType,              // immutable state
    onAction: (ActionType) -> Unit,  // event callback
    modifier: Modifier = Modifier   // styling hook
)
```

### 7. Data Model & Behavior
- Entity definitions with concrete code (not prose descriptions)
- Database queries or API contracts
- Reactive pipeline architecture (how data flows from persistence to UI)
- Import/export formats with parsers and edge cases
- Validation rules

**Be concrete.** Don't write "the app stores user preferences." Write the exact DataStore keys, their types, their defaults, and what happens when a value is missing or corrupted.

**Code detail level:** See § Code Detail Level below — this section is the one most affected by that setting. **When Code Detail Level is "contracts only,"** every public function/method must carry precondition/postcondition/error-behavior comments per `sections-reference.md` § Pre/Post-Conditions — the signature alone isn't a complete contract without a body to fall back on. **When it's "full solution code,"** skip prose pre/post-conditions entirely; the written body is the specification and duplicating it in prose adds noise, not clarity.

### 8. Interactions & Feedback
A table mapping every user action to its system response:

```markdown
| Action | System Response |
|--------|----------------|
```

Include accessibility semantics (screen reader descriptions) for each interactive component.

**Error Taxonomy (required when the project has error-prone I/O, see `sections-reference.md` § Error Taxonomy):** add one centralized table of error types — trigger, user-facing response, technical handling, retryable — separate from the per-screen action tables above. Skip only if the project genuinely has no failure-prone operations.

### 9. Out of Scope
An explicit list of features, platforms, and capabilities that are intentionally excluded. Each item should have a brief reason. This section prevents scope creep — if it's not in the brief, it doesn't get built.

### 10. Closed Decisions Registry
A numbered table of every architectural and design decision with its justification:

```markdown
| # | Decision | Reason |
|---|----------|--------|
```

For evolution briefs, add a "Status" column: `Inherited` | `Replaced` | `New`.

Must include, as numbered decisions, the identifier-language policy (§ Language Policy in `sections-reference.md`) and a "Supuestos a confirmar" subsection listing every value the user hasn't explicitly confirmed yet (§ Assumption Marking in `sections-reference.md`).

### 11. Project Structure
A directory tree showing the file organization. Use comments to explain what each file/directory is responsible for.

**Naming Dictionary (conditional, see `sections-reference.md` § Naming Dictionary):** add it only when the project has 3+ reusable components/entities whose names could plausibly collide (e.g. the same concept as DB entity, UI card, and export DTO), or when this is an evolution brief where names may have drifted. Skip for single-screen, single-entity projects — don't add ceremony the project's scale doesn't need.

### 12. Implementation Roadmap
Ordered phases where each phase:
- Can be completed independently
- Doesn't break the previous phase
- Lists the concepts/patterns the developer will learn (for learning projects)
- **Has a "Done when ALL of" checklist with at least 3 verifiable conditions** (required, see `sections-reference.md` § Definition of Done). "Testable in isolation" describes the phase's property, not its completion — the checklist is what actually lets someone else (or `brief-implementation`'s Phase Close step) confirm the phase is done without asking the author what they meant.

### 13. Acceptance Criteria & Test Plan
- Concrete pass/fail criteria grouped by feature area
- Specific test commands and frameworks
- What to test manually vs automatically

### 14. Open Questions (if any remain)
Questions that weren't resolved during discovery. These are NOT failures — they are honest documentation of uncertainty that will be resolved during implementation. Distinct from "Supuestos a confirmar" (§10): open questions are things nobody has decided yet; assumptions are things the writer guessed and the user hasn't confirmed yet.

### 15. Glossary (for learning projects)
Technical terms used in the brief with concise definitions. Only include this section when the developer's goal is learning.

## Code Detail Level

Resolved once during the Pre-Generation Checklist, this setting controls how much of §6 (State Hoisting) and §7 (Data Model & Behavior) is fully-written code versus contracts/signatures only:

- **Full solution code** (default for production/prototype/portfolio, or when the user asks for it in a learning project): entities, DAOs, parsers, and reactive pipelines are written out completely and are meant to be copyable.
- **Contracts only** (learning projects, when the user wants the roadmap to be a real exercise): write function/class signatures, data class field lists, and DAO method signatures with return types — but leave the *body* of non-trivial logic (parsers, `combine` pipelines, dedup logic) as a prose description of the required behavior plus a reference to which roadmap phase implements it. Do not silently fall back to full code because it's easier to generate — that defeats the purpose the user asked for.

State explicitly at the top of §7 which mode is in effect, so `brief-audit` and any implementing agent know what "complete" means for this specific brief.

## Adaptive Sections

Not every project needs every section. Apply these rules:

| Project Type | Skip These Sections |
|-------------|-------------------|
| Backend API / CLI | Visual Identity; retain §6 as **API/CLI Surface & Contracts** with endpoints or commands, inputs, outputs, errors, and authentication |
| Learning exercise | Add Glossary section with terms to research; consider Contracts-only code detail level |
| Evolution brief | Add Delta Matrix, add Status column to Decisions |
| Prototype / spike | Simplify Roadmap to a single phase, reduce Acceptance Criteria |

## Writing Quality Standards

### Language
- Narrative prose follows the language the user is communicating in.
- Technical artifacts (code, comments, identifiers, UI copy, string resource keys) follow the identifier-language policy resolved in the Pre-Generation Checklist and recorded as Closed Decision — see `sections-reference.md` § Language Policy. There is no fixed default; check the policy before writing the first snippet, and keep it consistent across the entire document, including any benchmark or example code you reference.

### Precision
- No vague statements. "The app handles errors gracefully" is unacceptable. "IOException shows Snackbar with message from R.string.import_error; JsonDecodingException shows Snackbar with R.string.invalid_json" is acceptable.
- Every color has a hex value. Every spacing has a dp/px value. Every duration has milliseconds.
- Code snippets are syntactically valid and idiomatic for the chosen stack. If you're not confident a library API is current (fast-moving UI frameworks, serialization libraries, ORMs), verify with a web search before committing it to the brief — a wrong snippet in a contract document is worse than a missing one.

### Justification
- Every decision has a "why." If you can't justify it, don't include it.
- Tradeoffs are documented explicitly: "We chose X over Y because Z, accepting the tradeoff of W."
- Any value you're choosing on the user's behalf, rather than one the user stated, must be marked as an assumption per `sections-reference.md` § Assumption Marking — not presented as an already-closed decision.

### Completeness
- Edge cases are documented in tables, not hidden in prose.
- Empty states, error states, and loading states are specified for every screen.
- Import/export round-trip behavior is documented.

## Post-Generation Review Cycle

After generating the brief draft, walk the user through a structured review:

1. **Quick scan**: "Here's the brief. Read the Summary and Decisions sections first — do they capture your intent?"
2. **Assumptions pass**: Point the user directly at the "Supuestos a confirmar" list and ask them to confirm or correct each one before anything else.
3. **Section-by-section**: If the user wants to review in detail, go through each section asking "Is this accurate? Anything missing?"
4. **Completeness audit**: Run the completeness checklist (see below), or hand off to `brief-audit` for a full independent audit.
5. **Ready to build**: Once the brief is reviewed (and ideally audited), hand off to `brief-implementation` to start coding against it phase by phase, with guardrails against silent scope drift.

### Completeness Checklist
After generating, verify against `sections-reference.md`:
- [ ] Every applicable mandatory section (per the Skip Rule column) is present
- [ ] Every stack choice has a justification
- [ ] "Out of Scope" has at least 5 items
- [ ] Every screen has empty/error states defined
- [ ] Every decision in the registry has a reason
- [ ] Identifier-language policy is stated as a numbered decision and followed consistently in every snippet
- [ ] Every unconfirmed value is marked `(supuesto — confirmar)` and listed together
- [ ] Data model has concrete code or explicit contracts (per the Code Detail Level setting), not vague prose
- [ ] If Code Detail Level is "contracts only," every public function has pre/post-conditions; if "full solution code," it doesn't need them
- [ ] Import/export edge cases are in tables
- [ ] §4 ends with the Agent Constraints block
- [ ] §8 has a centralized Error Taxonomy table (unless the project has no I/O)
- [ ] §11 has a Naming Dictionary (only if 3+ colliding-name-risk components, or evolution brief)
- [ ] Every roadmap phase has a "Done when ALL of" checklist with 3+ verifiable conditions
- [ ] Roadmap phases are independently completable
- [ ] No section says "TBD" or "to be determined" (use Open Questions instead)

## Engram Integration

After the brief is finalized, **if the Engram MCP tool is available in this session**:

1. **Save decisions** with `mem_save`:
   - title: "Design brief v[N] for [ProjectName]"
   - type: architecture
   - topic_key: `brief/[project-name]/v[N]`
   - content: Summary of vision, stack decisions, key constraints, and architecture choices

2. **For evolution briefs**, update the existing topic:
   - topic_key: `brief/[project-name]/v[N]` (new key for the new version)
   - Reference the previous version in the content

**If Engram is not available**, skip this step and say so plainly: "No pude guardar este brief en memoria persistente porque Engram no está conectado en esta sesión — el documento en sí sigue siendo el registro completo."

## Reference — Brief Quality Benchmark

The AniLista design briefs (v4 and v5) represent the quality standard this skill targets. Key qualities to replicate:

- **Decisions are numbered and justified** — not just listed, but defended with technical reasoning
- **Code snippets are real** — syntactically valid Kotlin/Swift/TypeScript, not pseudocode
- **Constraints govern features** — "no backend" eliminates entire categories of features before they're even considered
- **Edge cases live in tables** — scannable, exhaustive, not buried in paragraphs
- **The roadmap teaches** — each phase exposes new concepts, building on the previous one
- **Uncertainty is documented** — open questions are first-class, not shameful omissions
- **Identifier language matches the project** — AniLista's own code uses Spanish domain terms (`nombre`, `vecesVisto`) consistently, because that was the resolved language policy for that project (see § Language Policy). This is the benchmark for *consistency*, not a claim that Spanish identifiers are the default — a different project with a different resolved policy should look different here, and still match this benchmark's spirit.

