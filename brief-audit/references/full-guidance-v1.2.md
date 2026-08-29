> **Historical reference — not a runtime contract.** The sibling SKILL.md v1.3 is authoritative. Use this file only for background, examples, or migration review.

---
name: brief-audit
description: "Trigger: audit a brief, compare versions, or check finished code against its brief. Find missing contracts, contradictions, technical errors, scope leaks, and drift; return actionable fixes."
license: Apache-2.0
metadata:
  author: Laumar
  version: "1.2"
---

## Required references

Before Step 2, read `../brief-shared/sections-reference.md` relative to this skill directory. Read `../brief-shared/template-guide.md` when judging formatting examples. For Next.js projects, also read `../brief-shared/references/nextjs.md`.

# Brief Audit — Design Brief Quality Analysis

Perform rigorous, evidence-based audits of existing design briefs. Identify structural gaps, internal contradictions, technical inaccuracies, scope creep risks, and missing specifications. Produce an actionable audit report — not just observations, but concrete fixes.

## Core Philosophy

An audit is not a rubber stamp. The goal is to find what's WRONG, what's MISSING, and what's CONTRADICTORY — then explain HOW to fix each issue. A brief that passes this audit can be handed to any developer or AI agent and produce consistent, predictable results.

**Be honest, not nice. A weakness you don't report is a bug someone else will discover in production.**

## When to Activate

- User asks to review, audit, or analyze an existing design brief
- User presents a brief and asks "is this good?", "what's missing?", "review this"
- User wants to compare two versions of a brief (v1 vs v2)
- User received a brief from someone else and wants a quality assessment
- User wants to validate a brief before starting implementation
- User wants to audit a **finished implementation** against the brief that specified it (post-implementation mode, see Step 9)

## Source of Truth for Structure

This skill does NOT maintain its own list of mandatory sections. The canonical list of the 15 mandatory sections, their required content, and their severity if missing lives in `sections-reference.md` (shared with `brief-writer`). Always read `sections-reference.md` fresh before Step 2 — do not rely on a memorized or cached list, since `brief-writer` may have evolved it.

## Audit Protocol

### Step 1 — Ingest the Brief

Read the complete document. If it references external files, read those too. If there are multiple versions, read all of them. If auditing post-implementation (Step 9), also read the actual source code / repository state.

Before analyzing, check Engram with `mem_search` for prior context on this project, **if the Engram MCP tool is available in this session**. Past sessions may reveal:
- Bugs that were found during implementation (indicating brief gaps)
- Decisions that were reversed (indicating weak justifications)
- Architecture changes that contradicted the brief

**If Engram is not connected in this session**, skip this lookup silently — do not attempt to call `mem_search` on a tool that doesn't exist, and do not block the audit on it. Note at the end of the report: "No se consultó memoria persistente (Engram no está conectado en esta sesión)."

### Step 2 — Structural Completeness Audit

Load the mandatory section list from `sections-reference.md`, including its Minimum Content Requirement column. For each section:
1. Verify it's present, and flag missing ones with the severity defined in that shared reference (do not invent your own severities here — they must match `brief-writer`'s definitions, so a brief that "passes" `brief-writer`'s own completeness checklist is scored consistently by this audit).
2. **A section existing as a header is not the same as satisfying it.** Check the Minimum Content Requirement for that section specifically — e.g. a present-but-empty "Out of Scope" with 2 items instead of the required 5, or a §4 that lists the stack but has no Agent Constraints block, counts as a partial fail, not a pass. Flag these at one severity level below "missing entirely" (e.g. a 🔴 Critical section present but under-filled becomes 🟡 High, not clean).

### Step 3 — Internal Consistency Analysis

Scan for contradictions WITHIN the document:

**Stack vs Features contradictions:**
- Does the brief say "no backend" but describe features requiring server logic?
- Does it say "no external APIs" but reference fetching remote data?
- Does it exclude a library but then describe behavior that requires it?

**Data model vs UI contradictions:**
- Are there UI elements that reference fields not in the data model?
- Are there entity fields that no screen ever displays or edits?
- Does the import/export format match the entity definition?

**Decisions vs Implementation contradictions:**
- Do the roadmap phases contradict the dependency order in the decisions?
- Does the directory structure match the component names in the layout section?
- Are there decisions that contradict each other?

**Naming consistency:**
- Are entities, components, and screens named consistently throughout?
- Does `AnimeCard` in section 5 become `AnimeItem` in section 9?

**Language consistency (see `sections-reference.md` § Language Policy):**
- Does the brief declare an identifier-language policy (e.g. "identifiers in Spanish, matching existing codebase")? If not, flag it — this is a common source of silent rewrites by coding agents.
- Do the code snippets actually follow the policy the brief declares? A brief that says "identifiers in English" but shows `nombre`, `vecesVisto` in its own examples is self-contradictory and must be flagged as 🔴 Critical, not cosmetic — an implementing agent has no way to know which one is authoritative.

### Step 4 — Technical Quality Assessment

Evaluate the technical depth and accuracy:

**Code snippets:**
- Are they syntactically valid for the stated language/framework?
- Are they idiomatic? (e.g., using `Flow` correctly in Kotlin, not mixing Java patterns)
- Do they match the stated architectural patterns?

**Currency check (do not skip):** For any snippet that depends on a library or API that changes quickly across versions (UI framework components, serialization libraries, ORMs, etc.), do not assume your training knowledge is current. If you have any doubt about whether an API signature, default behavior, or recommended pattern is still current, use web search to verify against up-to-date documentation before approving or flagging a snippet. State in the report which snippets were verified this way and which were assessed from general knowledge only.

**Architectural decisions:**
- Is each decision justified with a concrete technical reason?
- Are there decisions based on "best practice" without explaining WHY it's best for THIS project?
- Are there premature optimizations? (e.g., complex caching for 200 records)
- Are there under-specifications? (e.g., "handle errors appropriately" without defining how)

**Data model:**
- Are primary keys, relationships, and constraints defined?
- Is the reactive pipeline (DB → Repository → ViewModel → UI) explicitly mapped?
- Are edge cases in import/export documented in tables?

### Step 5 — Scope Governance Evaluation

Assess how well the brief prevents scope creep:

- **"Out of Scope" strength:** Does it have at least 5 concrete items with reasons? Or is it a vague "we'll add more later"?
- **Feature-to-constraint ratio:** How many features vs how many explicit constraints? A healthy ratio leans toward more constraints than features for an MVP.
- **Implicit scope leaks:** Are there features described in the roadmap that aren't in the main spec? Are there "nice to have" items that should be in "out of scope"?
- **Version discipline:** If this is an evolution brief, does it clearly separate what's inherited vs what's new? Or does it silently expand scope?

### Step 6 — Unconfirmed Assumptions Check

Per `sections-reference.md`, any value or decision the brief states without it having been explicitly discussed with the user during discovery should be marked inline as `(supuesto — confirmar)` and listed in an "Supuestos a confirmar" section. Check whether the brief under audit does this:
- If the brief has zero marked assumptions but reads as if entirely dictated by the user, that's plausible — no flag.
- If the brief contains suspiciously specific unexplained values (exact hex colors, exact dp values, exact timing in ms) with no stated rationale and no assumption marker, flag it as 🟢 Medium: "possible unconfirmed assumption presented as a closed decision."

### Step 7 — Cross-Version Analysis (if multiple versions exist)

When auditing multiple versions of the same brief:

- **Split-Brain risk:** Can v2 be understood without reading v1? If not, there's a documentation dependency that will cause confusion.
- **Decision drift:** Are there decisions in v1 that v2 silently contradicts without acknowledging the change?
- **Scope inflation:** Count the features in v1 vs v2. Is the scope growing without explicit justification?
- **Consolidation recommendation:** Should the versions be merged into a single document? When is the right time to consolidate?
- **Brief vs actual code drift (if v2 is an evolution brief):** Verify that v2's description of "current state (v1)" matches what `brief-writer` Mode 2 should have checked against real source code, not just against the v1 document text. If the v1 document and the actual v1 codebase appear to have diverged (mentioned in commit history, prior Engram entries, or visible in an attached repo), flag this explicitly — it means the evolution brief may be evolving a fiction.

### Step 8 — Agent Implementability Check

This is the audit's core question, asked directly rather than left implicit in the other steps: **could an agent — human or AI — implement each part of this brief without having to decide anything on its own?** Walk the brief section by section (not exhaustively line-by-line, but enough to sample each major area — Data Model, Layout, Interactions, Roadmap) and for each, ask:

- Is there a value here that isn't fully specified, where two competent implementers would reasonably fill it in differently? (e.g. "reasonable spacing," "standard error handling," an unstated sort order for a list that visibly needs one)
- If Code Detail Level is "contracts only" (§ Pre/Post-Conditions), does every public function actually have pre/post-conditions, or are some left as bare signatures that would force an implementer to guess behavior?
- Does every roadmap phase have a "Done when" checklist an implementer could check off without asking the author what they meant (§ Definition of Done)?

List every gap found as **"Implementability Gap"** entries — separate from ordinary Weaknesses, because these are specifically about *decision-making being silently offloaded to whoever builds it*, which is the exact failure mode `brief-implementation`'s Scope Guardrail exists to catch at build time. Finding them here, before implementation starts, is strictly cheaper than catching them mid-build.

**Scoring interaction:** if 3 or more Implementability Gaps are found in critical sections (Data Model, Closed Decisions, Roadmap), cap Technical Accuracy at 6/10 regardless of how clean the code snippets themselves are — a brief can have perfect Kotlin and still fail at being implementable without guesswork.

### Step 9 — Post-Implementation Mode (optional, only when a codebase is provided)

When the user asks to audit finished code against its brief (not just the document):

1. Walk the Closed Decisions Registry and Data Model sections, and for each one, verify the corresponding code exists and matches.
2. Walk the Out of Scope list and verify none of those items were accidentally implemented.
3. Produce a **Drift Table**: `Brief says | Code actually does | Justified deviation? | Action needed`.
4. If an `IMPLEMENTATION_LOG.md` exists (produced by `brief-implementation`), cross-check its documented deviations against what you find — undocumented deviations are a 🔴 Critical finding regardless of whether the deviation itself was reasonable, because undocumented drift is what makes briefs untrustworthy over time.

### Step 10 — Produce Audit Report

Generate a structured report as an artifact:

```markdown
# Audit Report — [Brief Name] v[N]

**Audited:** YYYY-MM-DD
**Auditor context:** [what was checked — Engram history (or "not available"), brief versions, codebase if post-implementation]
**Overall assessment:** [Strong | Adequate | Needs Work | Insufficient]

## Completeness Score

[X/15 mandatory sections present, per sections-reference.md]

### Missing Sections
- 🔴 [Section name] — [why it matters and what to add]

## Strengths
1. [Specific strength with evidence from the document]
2. [Another strength]

## Weaknesses & Required Fixes

### 🔴 Critical
1. **[Issue title]**
   - **Location:** §[section number]
   - **Problem:** [concrete description]
   - **Fix:** [actionable instruction]

### 🟡 High Priority
1. **[Issue title]**
   - **Location:** §[section number]
   - **Problem:** [concrete description]
   - **Fix:** [actionable instruction]

### 🟢 Improvements
1. **[Issue title]**
   - **Location:** §[section number]
   - **Suggestion:** [concrete improvement]

## Internal Contradictions Found
| Location A | Location B | Contradiction | Resolution |
|-----------|-----------|---------------|------------|

## Unconfirmed Assumptions
| Location | Value/Decision | Marked as assumption? | Risk |
|----------|----------------|------------------------|------|

## Implementability Gaps
| Location | What's underspecified | Why two implementers could diverge | Fix |
|----------|--------------------------|--------------------------------------|-----|

## Scope Governance
- **Out of scope items:** [count]
- **Scope creep risks:** [list of features that feel like scope creep]
- **Recommendation:** [consolidate / expand out-of-scope / split into phases]

## Cross-Version Analysis (if applicable)
- **Split-brain risk:** [Yes/No — explanation]
- **Scope inflation:** [v1 had X features, v2 has Y — justified? or creep?]
- **Brief vs code drift:** [Yes/No/Unknown — explanation]
- **Consolidation:** [Recommended / Not needed — why]

## Post-Implementation Drift (if applicable)
| Brief says | Code actually does | Justified deviation? | Action needed |
|-----------|---------------------|------------------------|----------------|

## Summary Table

| Criteria | Score | Notes |
|----------|-------|-------|
| Structural completeness | [X/10] | |
| Internal consistency | [X/10] | |
| Technical accuracy | [X/10] | |
| Scope governance | [X/10] | |
| Decision justification | [X/10] | |
| **Overall** | **[X/10]** | |
```

## Scoring Criteria

### Structural Completeness (X/10)
- 10: All 15 sections present and substantive (per `sections-reference.md`)
- 7-9: Missing 1-2 low/medium severity sections
- 4-6: Missing high severity sections
- 1-3: Missing critical sections

### Internal Consistency (X/10)
- 10: Zero contradictions found
- 7-9: Minor naming inconsistencies only
- 4-6: 1-2 substantive contradictions (stack vs features, data vs UI, language policy)
- 1-3: Multiple contradictions that would cause implementation confusion

### Technical Accuracy (X/10)
- 10: All code snippets valid and idiomatic, architecture sound, currency verified where relevant, zero Implementability Gaps in critical sections
- 7-9: Minor issues in snippets, architecture is solid, 1-2 minor Implementability Gaps
- 4-6: Some snippets have errors or unverified/possibly-stale APIs, architecture has gaps
- 1-3: Significant technical errors that would mislead implementation
- **Hard cap at 6/10** regardless of snippet quality if 3+ Implementability Gaps found in Data Model, Closed Decisions, or Roadmap (Step 8)

### Scope Governance (X/10)
- 10: 5+ out-of-scope items with reasons, no scope leaks, clear constraints
- 7-9: Out-of-scope exists but thin, minor scope leaks
- 4-6: Weak out-of-scope, features expanding without justification
- 1-3: No out-of-scope section, features growing without bounds

### Decision Justification (X/10)
- 10: Every decision has a concrete "why" tied to project context, unconfirmed assumptions clearly marked as such
- 7-9: Most decisions justified, 1-2 lack reasoning
- 4-6: Multiple decisions justified with "best practice" instead of project-specific reasoning, or unmarked assumptions presented as closed decisions
- 1-3: Decisions listed without justification

## Engram Integration

After producing the audit report, **if the Engram MCP tool is available in this session**:

1. **Save findings** with `mem_save`:
   - title: "Audit of [ProjectName] brief v[N]"
   - type: architecture
   - topic_key: `brief/[project-name]/audit`
   - content: Overall score, critical issues found, key recommendations

2. **Cross-reference** with existing project memories to identify whether known bugs or reversed decisions correlate with brief gaps.

**If Engram is not available**, skip this step and say so plainly in the closing message: "No pude guardar este audit en memoria persistente porque Engram no está conectado en esta sesión."

## Handoff

After presenting the audit report, inform the user of next steps:

- **If score ≥ 8/10**: "The brief is solid. You can proceed to `brief-implementation` to start building it phase by phase."
- **If score 5-7/10**: "The brief needs work in [areas]. I can help fix these issues directly, or you can run `brief-writer` in evolution mode to produce an updated version."
- **If score < 5/10**: "This brief isn't ready for implementation. I recommend running `brief-discovery` to fill the gaps, then regenerating with `brief-writer`."
- **If this was a post-implementation audit with drift found**: "There's drift between the brief and the code. Decide per item in the Drift Table whether to update the brief (`brief-writer` evolution mode) to match reality, or fix the code to match the brief."

