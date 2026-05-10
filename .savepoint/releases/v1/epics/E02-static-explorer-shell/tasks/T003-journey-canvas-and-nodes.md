---
id: E02-static-explorer-shell/T003-journey-canvas-and-nodes
status: done
objective: "Render the visual payment journey canvas with all required clickable nodes and selected/related/inactive states."
depends_on: ["E02-static-explorer-shell/T001-explorer-state-and-provider"]
---

# T003 — Journey Canvas And Nodes

## Context Files

- `src/app/SpecProvider.tsx`
- `src/data/paymentInitiationDomainMap.ts`
- `src/state/explorerStore.ts`
- `src/theme/explorerTheme.ts`

## Acceptance Criteria

- [x] Canvas shows Customer / User, Channel / Banking App, PaymentInitiationTransaction, FundingCheck, Compliance, OrderInitiation, and Downstream Processing.
- [x] Node clicks update selected node state.
- [x] Node badges show role and relevant HTTP methods where useful.
- [x] Selected, related, and muted visual states come from theme/config.

## Implementation Plan

- [x] Add `src/components/canvas/JourneyCanvas.tsx`.
- [x] Add `JourneyNode` and `JourneyEdge`.
- [x] Use React Flow or a simple equivalent if adding a dependency is unnecessary for V1 static layout.
- [x] Wire node click handlers into explorer state.
- [x] Run the build gate.

## Context Log

- Files read: SpecProvider.tsx, explorerStore.tsx, explorerTheme.ts, paymentInitiationDomainMap.ts, themeTypes.ts, domainMap.ts, explorer.ts, ExplorerShell.tsx, ExplorerLayout.tsx, index.css
- Notes: No extra deps needed. Pure CSS absolute-position layout + ResizeObserver-driven SVG edges. context-stroke on arrowhead marker for dynamic color. Main canvas remains focal point.
