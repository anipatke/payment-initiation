---
id: E02-static-explorer-shell/T001-explorer-state-and-provider
status: done
objective: "Create the explorer data provider and centralized selection state used by navigation, canvas, and details."
depends_on: ["E01-data-foundation/T004-examples-and-theme-contracts"]
---

# T001 — Explorer State And Provider

## Context Files

- `src/App.jsx`
- `src/parser/parseOpenApi.ts`
- `src/data/paymentInitiationDomainMap.ts`
- `src/theme/explorerTheme.ts`
- `src/types/explorer.ts`

## Acceptance Criteria

- [x] App-level provider exposes normalized spec data, domain map, relationship indexes, examples, theme, and selection state.
- [x] Selection supports selected node, operation, schema, field, active tab, and mode.
- [x] Initial selection focuses the PaymentInitiationTransaction control record.
- [x] State logic is not duplicated across components.

## Implementation Plan

- [x] Add `src/app/SpecProvider.tsx` or equivalent provider composition.
- [x] Add `src/state/explorerStore.ts` using React context.
- [x] Wire `App` to render the provider and explorer shell placeholder.
- [x] Add typed selection update actions.
- [x] Run the build gate.

## Context Log

- Files read: pending
- Estimated input tokens: pending
- Notes: Prefer React context unless Zustand is already added intentionally.
