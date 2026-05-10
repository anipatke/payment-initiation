---
id: E04-modes-and-examples/T003-error-responses
status: done
objective: "Display standard error responses for operations and link each error response to the HTTPError schema."
depends_on: ["E04-modes-and-examples/T002-generated-example-json-views"]
---

# T003 — Error Responses

## Context Files

- `src/components/detail/OperationsTab.tsx`
- `src/components/navigation/SchemaTree.tsx`
- `src/parser/parseOpenApi.ts`
- `src/state/explorerStore.ts`

## Acceptance Criteria

- [x] API mode displays 400, 401, 403, 404, 429, and 500 responses where present in the spec.
- [x] Each standard error response links to the `HTTPError` schema.
- [x] Selecting `HTTPError` shows the reusable error model.
- [x] Error display is not shown as primary content in Business mode unless selected.

## Implementation Plan

- [x] Normalize operation error responses if parser output needs refinement.
- [x] Add error response section to operation cards.
- [x] Wire error schema links into schema selection.
- [x] Verify all six operations show the expected error response behavior.
- [x] Run the build gate.

## Context Log

- Files read: OperationsTab.tsx, parseOpenApi.ts, buildOperationMap.ts, explorerStore.tsx, SchemaTree.tsx, DetailPanel.tsx, openapi.ts
- Notes: Parser resolved `$ref: components/responses/*` → HTTPError. Added `isError` flag to ParsedOperationResponse. OperationsTab splits success/error rows; errors hidden in business mode. Clicking error schema name selects schema and switches to schema tab.
