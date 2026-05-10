---
id: E01-data-foundation/T004-examples-and-theme-contracts
status: done
objective: "Generate simple schema examples and define the central explorer theme/config layer."
depends_on: ["E01-data-foundation/T003-domain-map-and-relationships"]
---

# T004 — Examples And Theme Contracts

## Context Files

- `src/parser/buildSchemaMap.ts`
- `src/types/explorer.ts`
- `src/theme/themeTypes.ts`
- `design.md`

## Acceptance Criteria

- [x] Example JSON can be generated for initiate request, initiate response, update request, retrieve payment initiation response, retrieve compliance response, retrieve funding check response, and retrieve order initiation response.
- [x] `$ref` fields recursively generate simple object examples without infinite recursion.
- [x] Theme config includes color, typography, spacing, radius, animation, node, edge, badge, selected, related, and muted tokens.
- [x] Styling tokens are separate from parser, state, and domain mapping logic.

## Implementation Plan

- [x] Add `src/parser/generateExampleJson.ts`.
- [x] Add recursion-depth and circular-reference protection.
- [x] Add `src/theme/explorerTheme.ts` with neutral defaults informed by `design.md` only as visual reference.
- [ ] Add utility formatters for methods and schema names if needed.
- [x] Run the build gate.

## Context Log

- Files read: pending
- Estimated input tokens: pending
- Notes: Keep realistic values out of V1 examples unless source spec provides them.
