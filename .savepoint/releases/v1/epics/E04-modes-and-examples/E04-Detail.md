---
id: E04-modes-and-examples
status: audited
title: Modes And Examples
---

# E04 — Modes And Examples

## Objective

Add the three perspective modes and complete the API/schema/example detail experience, including standard error responses linked to `HTTPError`.

## Scope

- Business, API, and Schema modes.
- Mode-specific detail defaults and metadata emphasis.
- Example JSON display for required request/response schemas.
- Friendly/raw JSON toggle.
- Error response section in API mode.

## Tasks

| Task | Objective | Depends On |
|------|-----------|------------|
| T001 | Add mode-specific presentation behavior | [E03/T003] |
| T002 | Complete generated example JSON views | [T001] |
| T003 | Add error response display and HTTPError links | [T002] |

## Acceptance Criteria

- Business mode emphasizes plain-English explanations and field groups.
- API mode emphasizes endpoints, parameters, request/response bodies, and errors.
- Schema mode emphasizes schema names, fields, types, references, and usage.
- Examples are generated from schema data and are not raw JSON as the main experience.

## Implemented As

- Mode default tabs and labels are centralized in `src/utils/modeDisplay.ts`.
- API error responses are normalized in `src/parser/buildOperationMap.ts` and displayed from `src/components/detail/OperationsTab.tsx`.
- Example payloads are generated in `src/parser/generateExampleJson.ts` and surfaced through `src/components/detail/ExampleJsonTab.tsx`.
- Audit resolution: selected schemas outside the current node's `relatedSchemaNames`, including `HTTPError`, are included in the schema tab.
- Audit resolution: examples now open in a friendly primary view, with raw JSON exposed as a secondary toggle.
