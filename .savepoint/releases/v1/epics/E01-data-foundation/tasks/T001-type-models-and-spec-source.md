---
id: E01-data-foundation/T001-type-models-and-spec-source
status: done
objective: "Add TypeScript explorer models and make the local BIAN OpenAPI spec available from the app data layer."
depends_on: []
---

# T001 — Type Models And Spec Source

## Context Files

- `package.json`
- `vite.config.js`
- `src/main.jsx`
- `src/App.jsx`
- `BIAN-3-PaymentInitiation-10.0.0-resolved.json`

## Acceptance Criteria

- [x] The project can compile TypeScript React source through Vite.
- [x] Explorer, OpenAPI, domain-map, and theme types exist in dedicated files.
- [x] The BIAN OpenAPI JSON is available from `src/data/` without changing its semantic content.
- [x] Existing app entrypoints still render after the file-extension migration.

## Implementation Plan

- [x] Add TypeScript configuration and Vite/React typing support needed by the current stack.
- [x] Rename or bridge app entry files to TypeScript-safe React files.
- [x] Add `src/types/openapi.ts`, `src/types/explorer.ts`, `src/types/domainMap.ts`, and `src/theme/themeTypes.ts`.
- [x] Copy the local BIAN JSON into `src/data/bian-payment-initiation-openapi.json`.
- [x] Run the build gate.

## Context Log

- Files read: pending
- Estimated input tokens: pending
- Notes: Start here before parser or UI changes.
