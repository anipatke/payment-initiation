---
id: E01-data-foundation/T002-openapi-parser
status: done
objective: "Parse the BIAN OpenAPI document into normalized operations, schemas, parameters, request bodies, responses, and local reference links."
depends_on: ["E01-data-foundation/T001-type-models-and-spec-source"]
---

# T002 — OpenAPI Parser

## Context Files

- `src/data/bian-payment-initiation-openapi.json`
- `src/types/openapi.ts`
- `src/types/explorer.ts`

## Acceptance Criteria

- [x] Parser extracts OpenAPI `info`, `servers`, `paths`, and operation metadata.
- [x] Parser extracts `components.schemas`, `components.responses`, `components.parameters`, and `components.requestBodies`.
- [x] Local `$ref` values are resolved to clickable schema/response/request-body names where practical.
- [x] The six required Payment Initiation operations are normalized with method, path, operation ID, parameters, request schema, and response schemas.

## Implementation Plan

- [x] Add `src/parser/resolveRefs.ts`.
- [x] Add `src/parser/parseOpenApi.ts`.
- [x] Add `src/parser/buildOperationMap.ts`.
- [x] Add `src/parser/buildSchemaMap.ts`.
- [x] Add focused parser tests or a build-time assertion fixture if the test stack is not present yet.
- [x] Run the build gate.

## Context Log

- Files read: pending
- Estimated input tokens: pending
- Notes: Keep parser output UI-agnostic.
