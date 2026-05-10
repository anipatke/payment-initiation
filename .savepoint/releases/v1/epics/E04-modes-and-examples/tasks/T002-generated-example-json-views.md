---
id: E04-modes-and-examples/T002-generated-example-json-views
status: done
objective: "Complete generated example JSON views for all required request and response schemas with friendly/raw display support."
depends_on: ["E04-modes-and-examples/T001-mode-specific-presentation"]
---

# T002 — Generated Example JSON Views

## Context Files

- `src/parser/generateExampleJson.ts`
- `src/components/detail/ExampleJsonTab.tsx`
- `src/state/explorerStore.ts`
- `src/types/explorer.ts`

## Acceptance Criteria

- [x] Examples render for initiate request and response.
- [x] Examples render for update request.
- [x] Examples render for retrieve payment initiation response.
- [x] Examples render for retrieve compliance response.
- [x] Examples render for retrieve funding check response.
- [x] Examples render for retrieve order initiation response.
- [x] Users can switch between friendly generated examples and raw schema/source references where available.

## Implementation Plan

- [x] Map selected node/operation/schema to available examples.
- [x] Add friendly/raw toggle state.
- [x] Render formatted JSON with stable sizing and accessible controls.
- [x] Add empty states when an item has no example.
- [x] Run the build gate.

## Context Log

- Files read: `generateExampleJson.ts`, `ExampleJsonTab.tsx`, `explorerStore.tsx`, `explorer.ts`, `DetailPanel.tsx`, `SpecProvider.tsx`, `parseOpenApi.ts`, `buildOperationMap.ts`, `buildSchemaMap.ts`
- Notes: Examples remain illustrative and schema-derived. Operation selection drives request/response section breakdown.
