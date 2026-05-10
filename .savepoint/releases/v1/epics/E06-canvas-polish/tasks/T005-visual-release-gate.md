---
id: E06-canvas-polish/T005-visual-release-gate
status: done
objective: "Lock in the polished layouts with visual regression baselines and final release gates."
depends_on:
---

# T005 — Visual Release Gate

## Problem

Functional coverage alone will not catch the small layout shifts that make the explorer feel unfinished. The polished release needs screenshot baselines for the main canvas states at constrained widths.

## Context Files

- `package.json`
- `playwright.config.ts`
- `src/components/canvas/JourneyCanvas.tsx`
- `src/components/canvas/JourneyNode.tsx`
- `src/components/ExplorerShell.tsx`
- `src/styles/index.css`

## Acceptance Criteria

- [x] Screenshot baselines exist for the default desktop explorer, a narrow desktop canvas, and a tablet-width layout.
- [x] Visual tests fail on unapproved layout drift and can be updated intentionally.
- [x] The final E06 gate documents `npm run build`, `npm run test:e2e`, and `npm run test:visual` as the required checks.
- [x] The visual suite is stable in Chromium with animations and time-based UI effects controlled.

## Implementation Plan

- [x] Add visual regression specs with fixed viewports and deterministic test state.
- [x] Stabilize screenshots by disabling or freezing transient motion where needed.
- [x] Capture the polished canvas states that best represent the release quality bar.
- [x] Keep screenshot names and directory structure obvious for future updates.
- [x] Run the visual regression suite after the functional suite passes.

## Release Gate

```
npm run build
npm run test:e2e
npm run test:visual
```

Update baselines intentionally: `npm run test:visual -- --update-snapshots`

Baselines stored under `e2e/visual.spec.ts-snapshots/` (platform-tagged, Chromium).

## Notes

- The goal is to catch accidental polish regressions, not to police every pixel in motion-heavy UI regions.

## Context Log

Files read:

Estimated input tokens:

Notes:

