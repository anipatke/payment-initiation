---
id: E01-data-foundation/T003-domain-map-and-relationships
status: done
objective: "Add the isolated Payment Initiation journey map and derived indexes that connect nodes, operations, schemas, and fields."
depends_on: ["E01-data-foundation/T002-openapi-parser"]
---

# T003 — Domain Map And Relationships

## Context Files

- `src/parser/parseOpenApi.ts`
- `src/parser/buildOperationMap.ts`
- `src/parser/buildSchemaMap.ts`
- `src/types/domainMap.ts`
- `src/types/explorer.ts`

## Acceptance Criteria

- [x] Domain map defines Customer / User, Channel / Banking App, PaymentInitiationTransaction, FundingCheck, Compliance, OrderInitiation, and Downstream Processing.
- [x] Domain map includes required operation and schema links from `PRD2.MD`.
- [x] Derived indexes include `nodeToOperations`, `operationToSchemas`, `schemaToNodes`, `schemaToFields`, and `fieldToSchemas`.
- [x] Domain mapping remains replaceable for future BIAN domains.

## Implementation Plan

- [x] Add `src/data/paymentInitiationDomainMap.ts`.
- [x] Add relationship-building utilities under `src/parser/` or `src/utils/`.
- [x] Include field groups for PaymentInitiationTransaction and BQ schema fields.
- [x] Add checks that mapped operation IDs and schema names exist in parser output.
- [x] Run the build gate.

## Context Log

- Files read: src/types/domainMap.ts, src/types/explorer.ts, src/parser/parseOpenApi.ts, src/parser/buildOperationMap.ts, src/parser/buildSchemaMap.ts, PRD2.MD, src/parser/parser.test.ts
- Notes: Do not embed domain copy inside React components.
