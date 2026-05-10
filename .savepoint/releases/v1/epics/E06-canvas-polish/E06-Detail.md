---
id: E06-canvas-polish
status: audited
title: Canvas Polish And UI Testing
---

# E06 — Canvas Polish

## Objective

Fix the last visual defects in the journey canvas and add Playwright coverage for the polished UI surface: node label overflow, node collisions at constrained viewport widths, and regression checks for core interactions and responsive layouts.

## Scope

- Node label truncation/wrapping for long BIAN identifiers (e.g. `PaymentInitiationTransaction`).
- Node layout collision prevention at viewport widths below ~500px center-column width.
- Playwright smoke, interaction, responsive, and visual regression coverage for the explorer shell.
- No behavioural or data changes — visual only.

## Tasks

| Task | Objective | Depends On |
|------|-----------|------------|
| T001 | Fix node label overflow | |
| T002 | Fix node position collisions at narrow viewports | [T001] |
| T003 | Add Playwright foundation and smoke coverage | |
| T004 | Add functional UI regression coverage | [T003] |
| T005 | Add visual regression gates for polished layouts | [T004] |

## Acceptance Criteria

- No node label text visually escapes its node box at any supported viewport.
- No two nodes overlap at 1080px viewport (280px left + 320px right panels).
- Canvas remains functional down to 768px total viewport width.
- Core explorer interactions are covered by Playwright and pass consistently in Chromium.
- Visual snapshots exist for the polished desktop and tablet layouts.

## Implemented As

- Node label containment is implemented in `src/components/canvas/JourneyNode.tsx` with break-word wrapping inside the fixed node width.
- Narrow canvas collision handling is implemented in `src/components/canvas/JourneyCanvas.tsx` with wide and narrow node layout maps selected by measured canvas width.
- Playwright coverage is implemented under `e2e/` with smoke, functional, responsive, and visual specs.
- Visual baselines are stored under `e2e/visual.spec.ts-snapshots/`.
- Final verified gates: `npm run build`, `npm run test:e2e`, and `npm run test:visual`.
