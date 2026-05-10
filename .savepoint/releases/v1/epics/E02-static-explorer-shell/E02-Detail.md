---
id: E02-static-explorer-shell
status: audited
title: Static Explorer Shell
---

# E02 — Static Explorer Shell

## Objective

Build the primary three-surface explorer experience: left navigation, central payment journey canvas, and right detail panel, with node selection driving visible business, API, schema, relationship, and example sections.

## Scope

- Explorer layout and responsive panel behavior.
- Canvas rendering for all required journey nodes.
- Detail panel tabs.
- Left navigation mode switcher, operation list, schema tree, and search input placeholder.
- Centralized selection state.

## Out Of Scope

- Full search behavior.
- Reverse navigation from every item.
- Animation scenarios.

## Tasks

| Task | Objective | Depends On |
|------|-----------|------------|
| T001 | Build explorer state and data provider | [E01/T004] |
| T002 | Build three-column explorer layout and left navigation | [T001] |
| T003 | Build journey canvas and clickable nodes | [T001] |
| T004 | Build detail panel tabs | [T002, T003] |

## Acceptance Criteria

- The first screen is the explorer, not a landing page.
- Clicking a journey node updates detail content.
- The layout works on desktop and mobile.
- Visual styling uses the central theme/config layer.

## Implemented As

- `src/App.tsx` composes `SpecProvider`, `ExplorerStateProvider`, and `ExplorerShell` as the first rendered experience.
- `src/app/ExplorerLayout.tsx` provides the responsive three-surface shell.
- `src/components/navigation/` renders the mode switcher, operation groups, schema groups, and E03 search placeholder.
- `src/components/canvas/` renders the static journey nodes, edges, and selected/related/muted visual states.
- `src/components/detail/` renders overview, operations, schema, relationships, and generated JSON example tabs.
