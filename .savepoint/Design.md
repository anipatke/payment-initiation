---
type: project-design
status: active
last_audited: v1/E06-canvas-polish
source: PRD2.MD
---

# payment-initiation — System Architecture

## 1. Architecture Model

The app is a static React/Vite explorer built around five separated layers:

- OpenAPI parser: reads the local BIAN Payment Initiation OpenAPI document and normalizes operations, schemas, references, parameters, request bodies, responses, and errors.
- Domain map: defines the Payment Initiation journey nodes and their manual BIAN relationships.
- Relationship indexes: derive node-operation-schema-field links for synchronized highlighting.
- Explorer state: stores selected node, operation, schema, field, mode, tab, search, examples, journey playback, and active scenario state.
- Scenario data: defines visual-only learning scenarios, highlighted nodes, highlighted branches, and highlighted schema fields without adding banking validation rules.
- Mode display helpers: centralize mode default tabs, tab labels, and mode-specific visual affordances.
- Presentation: renders left navigation, journey canvas, detail panel, examples, error responses, journey animation, and guided scenarios using theme/config tokens.

## 2. Directory Layout

Expected V1 structure:

```text
src/
├── app/
├── components/
│   ├── canvas/
│   ├── detail/
│   └── navigation/
├── data/
├── parser/
├── state/
├── theme/
├── types/
└── utils/
```

## 3. Data Boundaries

- The local BIAN spec lives in `src/data/`.
- The Payment Initiation domain journey map lives in `src/data/paymentInitiationDomainMap.ts`.
- Parser modules must not know React.
- React components must not hardcode endpoint lists, schema fields, or BIAN relationship rules.
- Theme tokens control visual treatment; behavior modules control selection and relationship logic.

## 4. Visual Styling

Root `design.md` is retained as visual styling reference only. Use it for colors, tone, motion, density, or atmosphere when a task explicitly touches visual presentation.

Final styling must remain configurable through `src/theme/` so visual identity can change without altering parser, data, or state logic.

## 5. State Model

E02 implemented the state model with React context in `src/state/explorerStore.tsx` and consumes it from the navigation, canvas, and detail surfaces.

Explorer state tracks:

- selected node
- selected operation
- selected schema
- selected field
- active mode: Business, API, Schema
- active detail tab
- search query/results
- example display mode
- journey playback/scenario state

## 6. Testing Strategy

- Parser and mapping logic receive focused assertion files under `src/parser/`.
- Error response parsing must verify reusable response refs resolve to their schema model, including `HTTPError`.
- UI tasks must at minimum pass `npm run build`.
- Browser-level UI regressions live under `e2e/` and run through Playwright in Chromium.
- `npm run test:e2e` covers explorer shell smoke, core interactions, responsive tablet interactions, and the visual specs as part of the full browser suite.
- `npm run test:visual` runs the visual release gate for desktop, narrow desktop, and tablet screenshots.
- Visual baselines live under `e2e/visual.spec.ts-snapshots/` and should be updated intentionally with `npm run test:visual -- --update-snapshots`.
- When assertion files exist, expose them through `npm test` so task quality gates can verify them directly.

## 7. Release Gates

Each task must satisfy its acceptance criteria before handoff. Each epic requires a fresh-session audit before the next epic starts.
