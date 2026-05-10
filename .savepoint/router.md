# Agent State Machine

Read this file at the start of every session.

## Current State

```yaml
state: epic-design
release: v1
epic: ""
task: ""
next_action: Plan next epic
```

## Read Order

1. `AGENTS.md`
2. This router
3. `.savepoint/releases/v1/v1-PRD.md`
4. Active epic detail: `.savepoint/releases/v1/epics/{epic}/E##-Detail.md`
5. Active task file
6. Only the files listed in the task's `## Context Files`

Read `.savepoint/PRD.md` for product vision changes. Read `.savepoint/Design.md` for project architecture or audit closeout. Read root `design.md` only for visual styling reference.

## State Rules

- `pre-implementation`: define or repair the release plan and epic list only.
- `epic-design`: write or repair the active epic detail only.
- `epic-task-breakdown`: write or repair task files only.
- `task-building`: implement the active task only.
- `audit-pending`: write the audit artifact for the active epic only.

## Task Status

- Valid `status`: `planned`, `in_progress`, `done`.
- When `status: in_progress`, `stage` is required and must be `build`, `test`, or `audit`.
- Agents may set a task to `in_progress` when starting implementation.
- Only the user may set a task to `done` or retreat a task to an earlier status.

## Implementation Gate

When starting a task:

1. Read the task's context files only.
2. Update task frontmatter to `status: in_progress` and `stage: build`.
3. Implement the task checklist.
4. Tick completed checklist items.
5. Run quality gates.
6. Update router to the next task or `audit-pending`.
7. Stop for user review.

## Audit Gate

The agent that built an epic must not audit it. Audit in a fresh session.

Write exactly one audit file:

`.savepoint/releases/v1/epics/{E##-slug}/E##-Audit.md`

Required visible sections:

- `## Main Findings`
- `## Code Style Review`

Admin/apply details belong under:

- `## Proposed Changes`

## CLI Rules

Never run `savepoint` commands. Edit Savepoint markdown files directly.
