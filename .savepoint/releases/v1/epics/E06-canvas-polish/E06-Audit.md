---
type: audit-findings
audited: 2026-05-10
---
# Audit Findings: E06 Canvas Polish

## Main Findings
- Applied 3 audit proposals. E06 has no must-fix product-code findings.
- E06 acceptance criteria are covered by implementation and passing gates: `npm run build`, `npm run test:e2e`, and `npm run test:visual`.
- Node label containment is implemented in `src/components/canvas/JourneyNode.tsx` with break-word wrapping inside the fixed node width. Edge recomputation remains attached to container and node `ResizeObserver` observations in `src/components/canvas/JourneyCanvas.tsx`.
- Narrow canvas collision handling is implemented in `src/components/canvas/JourneyCanvas.tsx` with separate wide and narrow node layout maps and a `520px` canvas-width threshold. The 1024px narrow-desktop visual baseline exercises the constrained center-column case.
- Playwright coverage exists for shell smoke, mode switching, search selection, node selection, scenario toggles, playback controls, tablet interactions, and desktop/narrow/tablet visual snapshots.
- Documentation drift is resolved: `.savepoint/Design.md`, `AGENTS.md`, and `E06-Detail.md` now document the E06 browser test harness, visual baselines, and canvas polish implementation.
- E06 is closed as audited and the router now points to planning the next epic.

## Code Style Review
- [x] One job per file
- [x] One-sentence functions
- [x] Test branches
- [x] Types are documentation
- [x] Build, don't speculate
- [x] Errors at boundaries
- [x] One source of truth
- [x] Comments explain WHY
- [x] Content in data files
- [x] Small diffs

## Proposed Changes
### Target File
.savepoint/Design.md

### Replace
```
## 6. Testing Strategy

- Parser and mapping logic receive focused assertion files under `src/parser/`.
- Error response parsing must verify reusable response refs resolve to their schema model, including `HTTPError`.
- UI tasks must at minimum pass `npm run build`.
- When assertion files exist, expose them through `npm test` so task quality gates can verify them directly.
```

### With
```
## 6. Testing Strategy

- Parser and mapping logic receive focused assertion files under `src/parser/`.
- Error response parsing must verify reusable response refs resolve to their schema model, including `HTTPError`.
- UI tasks must at minimum pass `npm run build`.
- Browser-level UI regressions live under `e2e/` and run through Playwright in Chromium.
- `npm run test:e2e` covers explorer shell smoke, core interactions, responsive tablet interactions, and the visual specs as part of the full browser suite.
- `npm run test:visual` runs the visual release gate for desktop, narrow desktop, and tablet screenshots.
- Visual baselines live under `e2e/visual.spec.ts-snapshots/` and should be updated intentionally with `npm run test:visual -- --update-snapshots`.
- When assertion files exist, expose them through `npm test` so task quality gates can verify them directly.
```

### Target File
AGENTS.md

### Replace
```
| `src/components/canvas/` | E02-E05 | Journey canvas, nodes, edges, journey sequence config, and animation layer. |
| `src/components/detail/` | E02-E04 | Overview, operations, schema, relationships, and examples panels. |
| `src/utils/` | E01-E05 | Small formatting, grouping, search-index, and mode-display helpers. |
```

### With
```
| `src/components/canvas/` | E02-E06 | Journey canvas, nodes, edges, responsive node layout, journey sequence config, and animation layer. |
| `src/components/detail/` | E02-E04 | Overview, operations, schema, relationships, and examples panels. |
| `src/utils/` | E01-E05 | Small formatting, grouping, search-index, and mode-display helpers. |
| `e2e/` | E06 | Playwright smoke, functional UI regression, responsive interaction, and visual snapshot gates. |
| `playwright.config.ts` | E06 | Chromium-first browser test harness with deterministic viewports and Vite preview server configuration. |
```

### Target File
.savepoint/releases/v1/epics/E06-canvas-polish/E06-Detail.md

### Replace
```
## Acceptance Criteria

- No node label text visually escapes its node box at any supported viewport.
- No two nodes overlap at 1080px viewport (280px left + 320px right panels).
- Canvas remains functional down to 768px total viewport width.
- Core explorer interactions are covered by Playwright and pass consistently in Chromium.
- Visual snapshots exist for the polished desktop and tablet layouts.
```

### With
```
## Acceptance Criteria

- No node label text visually escapes its node box at any supported viewport.
- No two nodes overlap at 1080px viewport (280px left + 320px right panels).
- Canvas remains functional down to 768px total viewport width.
- Core explorer interactions are covered by Playwright and pass consistently in Chromium.
- Visual snapshots exist for the polished desktop and tablet layouts.

## Implemented As

- Node label containment is implemented in `src/components/canvas/JourneyNode.tsx` with break-word wrapping inside the fixed node width.
- Narrow canvas collision handling is implemented in `src/components/canvas/JourneyCanvas.tsx` with wide and narrow node layout maps selected by measured canvas width.
- Playwright coverage is implemented under `e2e/` with smoke, functional, responsive, and visual specs.
- Visual baselines are stored under `e2e/visual.spec.ts-snapshots/`.
- Final verified gates: `npm run build`, `npm run test:e2e`, and `npm run test:visual`.
```
