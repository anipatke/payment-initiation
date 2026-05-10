---
id: E05-guided-journey-and-scenarios/T002-scenarios-and-branch-highlighting
status: done
objective: "Add visual learning scenarios that highlight relevant fields and branches without adding backend business rules."
depends_on: ["E05-guided-journey-and-scenarios/T001-journey-play-animation"]
---

# T002 — Scenarios And Branch Highlighting

## Context Files

- `src/components/canvas/FlowAnimationLayer.tsx`
- `src/components/detail/SchemaTab.tsx`
- `src/data/paymentInitiationDomainMap.ts`
- `src/state/explorerStore.tsx`

## Acceptance Criteria

- [x] One-off payment scenario highlights core payment fields.
- [x] Scheduled payment scenario highlights date fields.
- [x] Recurring payment scenario highlights recurring payment fields.
- [x] Compliance review scenario highlights Compliance branch and fields.
- [x] Funding issue scenario highlights FundingCheck branch and fields.
- [x] Scenario UI makes clear these are visual learning scenarios only.

## Implementation Plan

- [x] Add scenario model and scenario selection state.
- [x] Add scenario selector controls.
- [x] Map scenarios to field groups, nodes, and edges.
- [x] Add branch/status chips using theme tokens.
- [x] Run the build gate.

## Context Log

- Files read: FlowAnimationLayer.tsx, SchemaTab.tsx, paymentInitiationDomainMap.ts, explorerStore.tsx, explorer.ts, JourneyCanvas.tsx, JourneyNode.tsx, DetailPanel.tsx
- Notes: No pass/fail payment logic introduced. Scenario labels clearly marked "VISUAL LEARNING SCENARIOS (no business rules)" in UI.
