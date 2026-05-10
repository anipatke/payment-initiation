---
type: release-prd
release: v1
status: active
source: PRD2.MD
---

# payment-initiation — v1 Release Plan

## Release Goal

Ship a journey-first, clickable, synchronized explorer for the BIAN Payment Initiation OpenAPI spec, with parsed endpoint/schema data, visual navigation, search, examples, modes, and guided learning scenarios.

## Epic List

| # | Epic | Status | Purpose |
|---|------|--------|---------|
| E01 | Data Foundation | planned | Normalize the OpenAPI spec, isolated BIAN domain map, derived relationships, example payload generation, and theme contracts. |
| E02 | Static Explorer Shell | planned | Render the three-surface explorer with left navigation, visual journey canvas, detail panel, and node-driven selection. |
| E03 | Linked Exploration | planned | Synchronize navigation from operations, schemas, fields, and search with canvas highlighting and relationship details. |
| E04 | Modes And Examples | planned | Add Business/API/Schema modes, generated examples, error-response display, and friendly/raw JSON toggles. |
| E05 | Guided Journey And Scenarios | planned | Add play-through animation, scenario toggles, branch highlighting, responsive polish, and final quality gates. |
| E06 | Canvas Polish | planned | Fix node label overflow and residual position collisions at constrained viewport widths. |

## Out Of Scope For This Release

- Real payment execution or banking integrations.
- Arbitrary spec upload.
- AI-generated documentation.
- Diagram export.
- Mock API runner.
- Production validation warnings.
