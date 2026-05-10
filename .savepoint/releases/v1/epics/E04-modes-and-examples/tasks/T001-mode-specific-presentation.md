---
id: E04-modes-and-examples/T001-mode-specific-presentation
status: done
objective: "Make Business, API, and Schema modes change labels, visible metadata, and default detail tab emphasis."
depends_on: ["E03-linked-exploration/T003-search-index-and-results"]
---

# T001 — Mode Specific Presentation

## Context Files

- `src/components/navigation/ModeSwitcher.tsx`
- `src/components/detail/DetailPanel.tsx`
- `src/components/canvas/JourneyNode.tsx`
- `src/state/explorerStore.ts`
- `src/data/paymentInitiationDomainMap.ts`

## Acceptance Criteria

- [x] Business mode shows business-friendly labels, plain-English explanations, minimal endpoint detail, and field groups.
- [x] API mode shows HTTP methods, endpoint paths, operation IDs, parameters, request bodies, response bodies, and error links.
- [x] Schema mode shows schema names, field names, field types, references, request/response differences, and field usage.
- [x] Changing mode updates default selected tab without losing the current selected node/operation/schema.

## Implementation Plan

- [x] Extend mode state transitions with default tab rules.
- [x] Add mode-aware display helpers.
- [x] Update node, navigation, and detail components to use mode-aware display data.
- [x] Verify mode behavior for the control record and each BQ.
- [x] Run the build gate.

## Context Log

- Files read: ModeSwitcher.tsx, DetailPanel.tsx, JourneyNode.tsx, explorerStore.tsx, paymentInitiationDomainMap.ts, JourneyCanvas.tsx, OverviewTab.tsx, explorer.ts
- Notes: Created `src/utils/modeDisplay.ts` — single source for MODE_DEFAULT_TAB, MODE_TAB_LABELS, showMethodBadges. No data duplicated; only label strings differ per mode.
