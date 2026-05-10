---
id: E06-canvas-polish/T004-functional-ui-regressions
status: done
objective: "Cover the main explorer interactions with Playwright so the polished UI stays usable."
depends_on:
---

# T004 — Functional UI Regressions

## Problem

The explorer has several coordinated interactions that can drift silently: mode switching, search selection, node selection, scenario toggles, and playback controls. Those need browser coverage, not just component-level confidence.

## Context Files

- `src/components/navigation/ModeSwitcher.tsx`
- `src/components/navigation/SearchBox.tsx`
- `src/components/navigation/LeftNavigation.tsx`
- `src/components/canvas/JourneyCanvas.tsx`
- `src/components/canvas/JourneyNode.tsx`
- `src/components/canvas/FlowAnimationLayer.tsx`
- `src/components/detail/DetailPanel.tsx`
- `src/components/ExplorerShell.tsx`
- `src/app/ExplorerLayout.tsx`

## Acceptance Criteria

- [x] Playwright covers mode switching and verifies the visible UI changes in the explorer shell.
- [x] Playwright covers search selection and verifies it drives the expected node or detail panel state.
- [x] Playwright covers journey node selection and scenario toggles on the canvas.
- [x] Playwright covers playback controls and verifies they remain usable after the UI polish changes.
- [x] The functional suite passes at desktop and tablet viewports.

## Implementation Plan

- [x] Add or refine stable labels and test hooks only where role-based selectors are insufficient.
- [x] Write browser tests for the core user flows in a single, readable spec set.
- [x] Assert the detail panel updates in response to canvas and search interactions.
- [x] Assert the responsive shell does not break interaction affordances below the desktop layout.
- [x] Run the functional Playwright suite after the smoke test is green.

## Notes

- Prefer coverage of observable user flows over implementation details; the point is to protect polish, not internal state.

## Context Log

Files read:

Estimated input tokens:

Notes:

