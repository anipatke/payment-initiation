---
id: E02-static-explorer-shell/T002-layout-and-left-navigation
status: done
objective: "Build the responsive explorer layout and left navigation with modes, operations, schemas, and search input."
depends_on: ["E02-static-explorer-shell/T001-explorer-state-and-provider"]
---

# T002 — Layout And Left Navigation

## Context Files

- `src/app/SpecProvider.tsx`
- `src/state/explorerStore.ts`
- `src/theme/explorerTheme.ts`
- `src/styles/index.css`

## Acceptance Criteria

- [x] Desktop layout has left navigation, central canvas, and right detail panel.
- [x] Mobile layout stacks surfaces without text overlap.
- [x] Mode switcher exposes Business, API, and Schema modes.
- [x] Operation list groups operations by PaymentInitiationTransaction, Compliance, FundingCheck, and OrderInitiation.
- [x] Schema tree groups Core, Requests, Responses, and Errors.

## Implementation Plan

- [x] Add `src/app/ExplorerLayout.tsx`.
- [x] Add `src/components/navigation/LeftNavigation.tsx`.
- [x] Add `ModeSwitcher`, `OperationList`, `SchemaTree`, and `SearchBox`.
- [x] Use stable responsive dimensions and theme tokens.
- [x] Run the build gate.

## Context Log

- Files read: pending
- Estimated input tokens: pending
- Notes: Search input can be visually present but behavior lands in E03.
