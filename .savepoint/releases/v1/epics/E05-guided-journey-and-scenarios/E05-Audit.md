---
type: audit-findings
audited: 2026-05-10
---

# Audit Findings: E05 Guided Journey And Scenarios

## Main Findings

E05 audit proposals were applied and the epic is closed as audited.

The non-rendering animation step was fixed by aligning the domain map with the journey sequence: FundingCheck and Compliance now connect into OrderInitiation, and parser/domain-map assertions cover those edges.

Scenario branch highlighting was completed by adding `highlightedEdgeKeys` to scenario data and rendering scenario-highlighted canvas edges with theme colors.

Process drift was reconciled: stale task context paths were corrected, E05 implementation notes were added to the epic detail, `.savepoint/Design.md` was updated, and the AGENTS Codebase Map now reflects E05 scenario and journey-sequence modules.

Final quality gates passed after applying proposals: `npm.cmd test` and `npm.cmd run build`.

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
src/data/paymentInitiationDomainMap.ts

### Replace
```
  edges: [
    { source: 'user', target: 'channel' },
    { source: 'channel', target: 'paymentInitiationTransaction', label: 'POST /PaymentInitiation/Initiate' },
    { source: 'paymentInitiationTransaction', target: 'fundingCheck' },
    { source: 'paymentInitiationTransaction', target: 'compliance' },
    { source: 'paymentInitiationTransaction', target: 'orderInitiation' },
    { source: 'orderInitiation', target: 'downstream' },
  ],
```

### With
```
  edges: [
    { source: 'user', target: 'channel' },
    { source: 'channel', target: 'paymentInitiationTransaction', label: 'POST /PaymentInitiation/Initiate' },
    { source: 'paymentInitiationTransaction', target: 'fundingCheck' },
    { source: 'paymentInitiationTransaction', target: 'compliance' },
    { source: 'fundingCheck', target: 'orderInitiation' },
    { source: 'compliance', target: 'orderInitiation' },
    { source: 'orderInitiation', target: 'downstream' },
  ],
```

### Target File
src/parser/domainMap.test.ts

### Replace
```
  console.assert(
    hasEdge('paymentInitiationTransaction', 'orderInitiation'),
    'edge: paymentInitiationTransaction → orderInitiation',
  )
  console.assert(hasEdge('orderInitiation', 'downstream'), 'edge: orderInitiation → downstream')
```

### With
```
  console.assert(hasEdge('fundingCheck', 'orderInitiation'), 'edge: fundingCheck → orderInitiation')
  console.assert(hasEdge('compliance', 'orderInitiation'), 'edge: compliance → orderInitiation')
  console.assert(hasEdge('orderInitiation', 'downstream'), 'edge: orderInitiation → downstream')
```

### Target File
src/data/scenarios.ts

### Replace
```
  highlightedNodeIds: string[]
  highlightedFields: string[]
```

### With
```
  highlightedNodeIds: string[]
  highlightedEdgeKeys: string[]
  highlightedFields: string[]
```

### Target File
src/data/scenarios.ts

### Replace
```
    highlightedNodeIds: ['user', 'channel', 'paymentInitiationTransaction', 'fundingCheck', 'orderInitiation', 'downstream'],
    highlightedFields: [
```

### With
```
    highlightedNodeIds: ['user', 'channel', 'paymentInitiationTransaction', 'fundingCheck', 'orderInitiation', 'downstream'],
    highlightedEdgeKeys: [
      'user-channel',
      'channel-paymentInitiationTransaction',
      'paymentInitiationTransaction-fundingCheck',
      'fundingCheck-orderInitiation',
      'orderInitiation-downstream',
    ],
    highlightedFields: [
```

### Target File
src/data/scenarios.ts

### Replace
```
    id: 'scheduled',
    label: 'Scheduled Payment',
    description: 'A payment set to execute on a future date.',
    highlightedNodeIds: ['user', 'channel', 'paymentInitiationTransaction', 'orderInitiation', 'downstream'],
    highlightedFields: [
```

### With
```
    id: 'scheduled',
    label: 'Scheduled Payment',
    description: 'A payment set to execute on a future date.',
    highlightedNodeIds: ['user', 'channel', 'paymentInitiationTransaction', 'orderInitiation', 'downstream'],
    highlightedEdgeKeys: [
      'user-channel',
      'channel-paymentInitiationTransaction',
      'orderInitiation-downstream',
    ],
    highlightedFields: [
```

### Target File
src/data/scenarios.ts

### Replace
```
    id: 'recurring',
    label: 'Recurring Payment',
    description: 'A repeating payment on a defined schedule.',
    highlightedNodeIds: ['user', 'channel', 'paymentInitiationTransaction', 'orderInitiation', 'downstream'],
    highlightedFields: [
```

### With
```
    id: 'recurring',
    label: 'Recurring Payment',
    description: 'A repeating payment on a defined schedule.',
    highlightedNodeIds: ['user', 'channel', 'paymentInitiationTransaction', 'orderInitiation', 'downstream'],
    highlightedEdgeKeys: [
      'user-channel',
      'channel-paymentInitiationTransaction',
      'orderInitiation-downstream',
    ],
    highlightedFields: [
```

### Target File
src/data/scenarios.ts

### Replace
```
    highlightedNodeIds: ['paymentInitiationTransaction', 'compliance'],
    highlightedFields: [
```

### With
```
    highlightedNodeIds: ['paymentInitiationTransaction', 'compliance', 'orderInitiation'],
    highlightedEdgeKeys: [
      'paymentInitiationTransaction-compliance',
      'compliance-orderInitiation',
    ],
    highlightedFields: [
```

### Target File
src/data/scenarios.ts

### Replace
```
    highlightedNodeIds: ['paymentInitiationTransaction', 'fundingCheck'],
    highlightedFields: [
```

### With
```
    highlightedNodeIds: ['paymentInitiationTransaction', 'fundingCheck', 'orderInitiation'],
    highlightedEdgeKeys: [
      'paymentInitiationTransaction-fundingCheck',
      'fundingCheck-orderInitiation',
    ],
    highlightedFields: [
```

### Target File
src/components/canvas/JourneyCanvas.tsx

### Replace
```
  const scenarioNodeSet = activeScenario
    ? new Set(activeScenario.highlightedNodeIds)
    : null
```

### With
```
  const scenarioNodeSet = activeScenario
    ? new Set(activeScenario.highlightedNodeIds)
    : null
  const scenarioEdgeSet = activeScenario
    ? new Set(activeScenario.highlightedEdgeKeys)
    : null
```

### Target File
src/components/canvas/JourneyCanvas.tsx

### Replace
```
  function edgeIsActive(edge: EdgeLine): boolean {
    return edge.source === selectedNodeId || edge.target === selectedNodeId
  }

  function edgeStroke(edge: EdgeLine): string {
    if (!selectedNodeId) return theme.edge.color
    return edgeIsActive(edge) ? theme.edge.selected : theme.edge.muted
  }
```

### With
```
  function edgeKey(edge: EdgeLine): string {
    return `${edge.source}-${edge.target}`
  }

  function edgeIsActive(edge: EdgeLine): boolean {
    return edge.source === selectedNodeId || edge.target === selectedNodeId
  }

  function edgeIsScenarioHighlighted(edge: EdgeLine): boolean {
    return scenarioEdgeSet?.has(edgeKey(edge)) ?? false
  }

  function edgeStroke(edge: EdgeLine): string {
    if (edgeIsScenarioHighlighted(edge)) return theme.colors.accent
    if (!selectedNodeId) return theme.edge.color
    return edgeIsActive(edge) ? theme.edge.selected : theme.edge.muted
  }
```

### Target File
src/components/canvas/JourneyCanvas.tsx

### Replace
```
            strokeWidth={edgeIsActive(edge) ? 1.5 : 1}
```

### With
```
            strokeWidth={edgeIsScenarioHighlighted(edge) || edgeIsActive(edge) ? 1.5 : 1}
```

### Target File
.savepoint/Design.md

### Replace
```
- Explorer state: stores selected node, operation, schema, field, mode, tab, search, examples, and animation state.
- Mode display helpers: centralize mode default tabs, tab labels, and mode-specific visual affordances.
- Presentation: renders left navigation, journey canvas, detail panel, examples, error responses, and guided scenarios using theme/config tokens.
```

### With
```
- Explorer state: stores selected node, operation, schema, field, mode, tab, search, examples, journey playback, and active scenario state.
- Scenario data: defines visual-only learning scenarios, highlighted nodes, highlighted branches, and highlighted schema fields without adding banking validation rules.
- Mode display helpers: centralize mode default tabs, tab labels, and mode-specific visual affordances.
- Presentation: renders left navigation, journey canvas, detail panel, examples, error responses, journey animation, and guided scenarios using theme/config tokens.
```

### Target File
AGENTS.md

### Replace
```
| `src/data/` | E01 | Local BIAN spec and isolated Payment Initiation domain map. |
```

### With
```
| `src/data/` | E01, E05 | Local BIAN spec, isolated Payment Initiation domain map, and visual-only scenario definitions. |
```

### Target File
AGENTS.md

### Replace
```
| `src/components/canvas/` | E02-E05 | Journey canvas, nodes, edges, and animation layer. |
```

### With
```
| `src/components/canvas/` | E02-E05 | Journey canvas, nodes, edges, journey sequence config, and animation layer. |
```

### Target File
.savepoint/releases/v1/epics/E05-guided-journey-and-scenarios/E05-Detail.md

### Replace
```
## Acceptance Criteria

- The flow animation teaches the payment journey without inventing backend rules.
- Scenarios highlight relevant fields and branches.
- The explorer remains usable on desktop and mobile.
- Full quality gates pass before audit.
```

### With
```
## Acceptance Criteria

- The flow animation teaches the payment journey without inventing backend rules.
- Scenarios highlight relevant fields and branches.
- The explorer remains usable on desktop and mobile.
- Full quality gates pass before audit.

## Implemented As

- Journey playback state lives in `src/state/explorerStore.tsx`.
- The animation layer lives in `src/components/canvas/FlowAnimationLayer.tsx`.
- The journey pulse sequence lives in `src/components/canvas/journeySequence.ts`.
- Visual-only scenario definitions live in `src/data/scenarios.ts`.
- Scenario highlighting is rendered by `JourneyCanvas`, `JourneyNode`, `DetailPanel`, and `SchemaTab`.
```

### Target File
.savepoint/releases/v1/epics/E05-guided-journey-and-scenarios/tasks/T001-journey-play-animation.md

### Replace
```
- `src/components/canvas/JourneyEdge.tsx`
- `src/state/explorerStore.ts`
```

### With
```
- `src/components/canvas/JourneyCanvas.tsx`
- `src/state/explorerStore.tsx`
```

### Target File
.savepoint/releases/v1/epics/E05-guided-journey-and-scenarios/tasks/T002-scenarios-and-branch-highlighting.md

### Replace
```
- `src/state/explorerStore.ts`
```

### With
```
- `src/state/explorerStore.tsx`
```
