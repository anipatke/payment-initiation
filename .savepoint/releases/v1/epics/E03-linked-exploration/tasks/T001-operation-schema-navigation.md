---
id: E03-linked-exploration/T001-operation-schema-navigation
status: done
objective: "Wire operation and schema clicks so left navigation and detail links update canvas selection and highlights."
depends_on: ["E02-static-explorer-shell/T004-detail-panel-tabs"]
---

# T001 — Operation Schema Navigation

## Context Files

- `src/components/navigation/OperationList.tsx`
- `src/components/navigation/SchemaTree.tsx`
- `src/components/detail/OperationsTab.tsx`
- `src/components/detail/SchemaTab.tsx`
- `src/state/explorerStore.ts`

## Acceptance Criteria

- [x] Clicking `POST /PaymentInitiation/Initiate` highlights PaymentInitiationTransaction and incoming journey context.
- [x] Clicking RetrieveFundingCheck highlights FundingCheck.
- [x] Clicking OrderInitiation schema highlights OrderInitiation.
- [x] Clicking HTTPError shows the reusable error model without requiring a journey node highlight.

## Implementation Plan

- [x] Add operation selection action and related-node derivation.
- [x] Add schema selection action and related-node derivation.
- [x] Apply selected/related styles in operation list, schema tree, canvas, and detail panel.
- [x] Preserve selected tab behavior when navigation changes.
- [x] Run the build gate.

## Context Log

- Files read: explorerStore.tsx, OperationList.tsx, SchemaTree.tsx, OperationsTab.tsx, SchemaTab.tsx, DetailPanel.tsx, JourneyCanvas.tsx, paymentInitiationDomainMap.ts, explorer.ts
- Notes: selectOperation/selectSchema accept optional nodeId; OperationList passes node.id; SchemaTree derives nodeId via useMemo reverse-map; OperationsTab/SchemaTab accept selectedX + onSelect props; DetailPanel wires both.
