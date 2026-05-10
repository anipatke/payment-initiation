---
id: E01-data-foundation
status: audited
title: Data Foundation
---

# E01 — Data Foundation

## Objective

Create the typed data foundation for the visual explorer: OpenAPI source loading, normalized models, local reference handling, BIAN domain mapping, derived relationships, examples, and theme contracts.

## Scope

- Introduce TypeScript where needed for typed explorer models.
- Move the local BIAN OpenAPI document into the app data layer.
- Parse operations, schemas, parameters, responses, request bodies, and local `$ref` links.
- Isolate the manual Payment Initiation domain journey map from parser logic.
- Generate simple JSON examples from schemas.
- Define a central theme/config contract.

## Out Of Scope

- Rendering the final explorer layout.
- Search UI.
- Animation and scenarios.
- Final visual identity beyond neutral tokens.

## Tasks

| Task | Objective | Depends On |
|------|-----------|------------|
| T001 | Add typed explorer models and spec source | [] |
| T002 | Parse OpenAPI operations and schemas | [T001] |
| T003 | Add Payment Initiation domain map and relationship indexes | [T002] |
| T004 | Add example generation and theme contracts | [T003] |

## Acceptance Criteria

- OpenAPI parsing and domain mapping are separate modules.
- React components do not own schema, endpoint, or field definitions.
- Generated examples are available for all required request/response schemas.
- Theme tokens are isolated from behavior.

## Implemented As

- Typed OpenAPI, explorer, domain-map, and theme contracts live in `src/types/` and `src/theme/`.
- The local BIAN source spec lives in `src/data/bian-payment-initiation-openapi.json`.
- Payment Initiation journey data lives in `src/data/paymentInitiationDomainMap.ts`.
- Parser modules live in `src/parser/` and cover parsing, local ref names, relationship indexes, example generation, and assertion files.
- Audit identified follow-up fixes for `components.parameters` extraction and for wiring assertion files into `npm test`.
