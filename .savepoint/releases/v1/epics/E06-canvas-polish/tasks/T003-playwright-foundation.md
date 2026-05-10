---
id: E06-canvas-polish/T003-playwright-foundation
status: done
objective: "Install Playwright and establish a stable UI test harness for the explorer shell."
depends_on:
---

# T003 — Playwright Foundation

## Problem

The project has build and parser tests, but no browser-level harness to prove the explorer renders, responds to interactions, or stays stable at fixed viewports.

## Context Files

- `package.json`
- `vite.config.js`
- `index.html`
- `src/main.tsx`
- `src/App.tsx`
- `src/components/ExplorerShell.tsx`
- `src/app/ExplorerLayout.tsx`

## Acceptance Criteria

- [x] Playwright is installed and configured for the Vite app.
- [x] A browser smoke test launches the app and verifies the explorer shell renders the header, left navigation, canvas, and detail panel.
- [x] The Playwright harness uses deterministic viewports and a stable local web server configuration.
- [x] `npm run build` and the Playwright smoke test both pass from a clean checkout.

## Implementation Plan

- [x] Add Playwright dev dependencies and npm scripts for the browser test suite.
- [x] Create `playwright.config.ts` with a Chromium-first setup and a Vite web server target.
- [x] Add a first smoke spec under a dedicated e2e test directory.
- [x] Keep selectors role-based where possible so later polish tests can reuse them.
- [x] Run the build gate and the new smoke test.

## Notes

- This task is the foundation for the rest of the E06 UI coverage; keep it minimal and deterministic.

## Context Log

Files read:

Estimated input tokens:

Notes:

