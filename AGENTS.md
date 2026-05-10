<!-- SAVEPOINT:BEGIN -->
# Agents Guide

## Project Direction

This project now builds the product described in `PRD2.MD`: a journey-first visual explorer for the BIAN Payment Initiation OpenAPI service domain.

The canonical planning files are:

- Product vision: `.savepoint/PRD.md`
- Release plan: `.savepoint/releases/v1/v1-PRD.md`
- Router: `.savepoint/router.md`
- Epic/task backlog: `.savepoint/releases/v1/epics/`

Root `design.md` is retained only as visual styling reference. Do not treat it as product scope or architecture.

## Workflow

1. Read `.savepoint/router.md`.
2. Read the active release plan.
3. Read the active epic detail.
4. Read the active task file.
5. Read only the files listed under that task's `## Context Files`.
6. Implement only the active task.
7. Run quality gates.
8. Update the router to the next task or audit state.
9. Stop for user review.

## Skill Activation

| State | Skill |
|-------|-------|
| pre-implementation | savepoint-draft-prd |
| epic-design | savepoint-system-design |
| epic-task-breakdown | savepoint-create-task |
| task-building | savepoint-build-task |
| audit-pending | savepoint-audit |

Use the `skill` tool when available. If the skill is not available, read `agent-skills/{skill}/SKILL.md` directly and follow it as the active workflow.

## Task Status

- `status` must be `planned`, `in_progress`, or `done`.
- `stage` is required when `status: in_progress` and must be `build`, `test`, or `audit`.
- Agents may set a task to `in_progress` when starting implementation.
- Only the user may set a task to `done` or retreat a task to an earlier status.
- Never use `todo`, `doing`, `blocked`, `review`, or `audit` as task status values.

## Implementation Rules

- Do not start implementation without an active task selected in the router.
- When starting implementation, update task frontmatter to `status: in_progress` and `stage: build`.
- Execute the task checklist in order and tick completed checkboxes.
- Verify every acceptance criterion with a passing test, build result, or observable outcome.
- Keep OpenAPI parser logic, BIAN domain mapping, explorer state, UI components, and theme tokens separate.
- Do not hardcode schema fields, endpoint lists, or visual styling inside React components when they belong in data/config.
- Do not invent payment rules, enum values, validation behavior, or banking integrations.
- Append `## Drift Notes` to the task file if implementation changes architecture or adds files/modules missing from the Codebase Map.

## Audit Handoff

The agent that builds an epic must not audit it. Start a fresh session for audit.

Write exactly one audit file:

`.savepoint/releases/{release}/epics/{E##-slug}/E##-Audit.md`

The TUI renders only:

- `## Main Findings`
- `## Code Style Review`

Keep apply/admin details under:

- `## Proposed Changes`

## Code Style

- **One job per file** — split files when responsibilities mix.
- **One job per function** — small, named, testable units.
- **Test branches** — cover meaningful conditionals and edge cases.
- **Types document intent** — prefer explicit types over comments.
- **Build only what is needed** — no speculative abstractions.
- **Handle errors at boundaries** — validate inputs, APIs, IO, and external data.
- **One source of truth** — no duplicated rules, constants, state, or config.
- **Comments explain why** — not what the code already says.
- **Content lives in data** — keep copy/config out of logic.
- **Small diffs** — minimal, reviewable, behavior-preserving changes.

## Build

Use the project scripts:

```bash
npm run build
```

If a test script is added, run it as part of the task quality gate.

## Codebase Map

| Module | Epic | Purpose |
|--------|------|---------|
| `src/types/` | E01 | Shared OpenAPI, explorer, domain-map, and theme contracts. |
| `src/data/` | E01, E05 | Local BIAN spec, isolated Payment Initiation domain map, and visual-only scenario definitions. |
| `src/parser/` | E01-E04 | OpenAPI parsing, ref resolution, error response normalization, relationship indexes, example generation, and parser/domain assertion tests. |
| `src/theme/` | E01 | Replaceable explorer theme/config tokens. |
| `src/state/` | E02-E05 | Centralized explorer selection, mode, search, and animation state. |
| `src/app/` | E02 | App provider and three-surface explorer layout. |
| `src/components/navigation/` | E02-E04 | Mode switcher, operation list, schema tree, and search UI. |
| `src/components/canvas/` | E02-E06 | Journey canvas, nodes, edges, responsive node layout, journey sequence config, and animation layer. |
| `src/components/detail/` | E02-E04 | Overview, operations, schema, relationships, and examples panels. |
| `src/utils/` | E01-E05 | Small formatting, grouping, search-index, and mode-display helpers. |
| `e2e/` | E06 | Playwright smoke, functional UI regression, responsive interaction, and visual snapshot gates. |
| `playwright.config.ts` | E06 | Chromium-first browser test harness with deterministic viewports and Vite preview server configuration. |

## Context Budget

- Read only what the active task names.
- Do not glob, explore, or inspect unrelated files during task-building unless the task explicitly requires it.
- Before reading a file, ask whether it is needed to complete the current task.

## CLI Rules

Never run `savepoint` commands. The CLI is for the human. Edit Savepoint markdown files directly.
<!-- SAVEPOINT:END -->
