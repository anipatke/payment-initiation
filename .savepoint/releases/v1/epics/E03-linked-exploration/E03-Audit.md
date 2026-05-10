---
type: audit-findings
audited: 2026-05-10
---

# Audit Findings: E03 Linked Exploration

## Main Findings

Applied 6 proposals. E03 is closed as audited.

Resolved findings:

- Search results for operations, schemas, and fields now derive related `nodeId` context in `src/utils/buildSearchIndex.ts`.
- Search result selection now passes `nodeId` into operation/schema selection actions in `src/components/navigation/SearchBox.tsx`, so canvas highlighting updates when a related visual node exists.
- T001 acceptance checkboxes were reconciled.
- `.savepoint/Design.md` now records `last_audited: v1/E03-linked-exploration`.
- `E03-Detail.md` now records the implemented linked-exploration behavior and is marked `status: audited`.
- `AGENTS.md` Codebase Map now calls out search-index helpers under `src/utils/`.

Quality gates:

- `npm.cmd run build` passed.
- `npm.cmd test` passed.

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

Notes:

- The audit fix kept search node derivation centralized in `buildSearchIndex.ts`.
- Residual risk: `SearchBox.tsx` still uses non-null assertions for required result fields, but the result builders now provide the node context needed for E03 behavior.

## Proposed Changes

### Target File
src/utils/buildSearchIndex.ts

### Replace
```ts
export function buildSearchIndex(parsedSpec: ParsedSpec, domainMap: DomainMap): SearchIndex {
  const index: SearchResult[] = []

  for (const node of domainMap.nodes) {
    index.push({ kind: 'node', label: node.label, nodeId: node.id })
  }

  for (const op of parsedSpec.operations.operationList) {
    index.push({
      kind: 'operation',
      label: op.operationId,
      sublabel: `${op.method.toUpperCase()} ${op.path}`,
      path: op.path,
      method: op.method,
    })
  }

  for (const name of Object.keys(parsedSpec.schemas.schemas)) {
    index.push({ kind: 'schema', label: name, schemaName: name })
  }

  for (const [schemaName, schema] of Object.entries(parsedSpec.schemas.schemas)) {
    for (const fieldName of Object.keys(schema.properties)) {
      index.push({
        kind: 'field',
        label: fieldName,
        sublabel: schemaName,
        schemaName,
        fieldName,
      })
    }
  }

  return index
}
```

### With
```ts
export function buildSearchIndex(parsedSpec: ParsedSpec, domainMap: DomainMap): SearchIndex {
  const index: SearchResult[] = []
  const operationToNode = new Map<string, string>()
  const schemaToNode = new Map<string, string>()

  for (const node of domainMap.nodes) {
    index.push({ kind: 'node', label: node.label, nodeId: node.id })

    for (const operationId of node.relatedOperationIds) {
      if (!operationToNode.has(operationId)) operationToNode.set(operationId, node.id)
    }

    for (const schemaName of node.relatedSchemaNames) {
      if (!schemaToNode.has(schemaName)) schemaToNode.set(schemaName, node.id)
    }
  }

  for (const op of parsedSpec.operations.operationList) {
    index.push({
      kind: 'operation',
      label: op.operationId,
      sublabel: `${op.method.toUpperCase()} ${op.path}`,
      nodeId: operationToNode.get(op.operationId),
      path: op.path,
      method: op.method,
    })
  }

  for (const name of Object.keys(parsedSpec.schemas.schemas)) {
    index.push({
      kind: 'schema',
      label: name,
      nodeId: schemaToNode.get(name),
      schemaName: name,
    })
  }

  for (const [schemaName, schema] of Object.entries(parsedSpec.schemas.schemas)) {
    for (const fieldName of Object.keys(schema.properties)) {
      index.push({
        kind: 'field',
        label: fieldName,
        sublabel: schemaName,
        nodeId: schemaToNode.get(schemaName),
        schemaName,
        fieldName,
      })
    }
  }

  return index
}
```

### Target File
src/components/navigation/SearchBox.tsx

### Replace
```tsx
        case 'operation':
          actions.selectOperation(result.path!, result.method!)
          actions.setActiveTab('operations')
          break
        case 'schema':
          actions.selectSchema(result.schemaName!)
          actions.setActiveTab('schema')
          break
        case 'field':
          actions.selectSchema(result.schemaName!)
          actions.selectField(result.fieldName!)
          actions.setActiveTab('schema')
          break
```

### With
```tsx
        case 'operation':
          actions.selectOperation(result.path!, result.method!, result.nodeId)
          actions.setActiveTab('operations')
          break
        case 'schema':
          actions.selectSchema(result.schemaName!, result.nodeId)
          actions.setActiveTab('schema')
          break
        case 'field':
          actions.selectSchema(result.schemaName!, result.nodeId)
          actions.selectField(result.fieldName!)
          actions.setActiveTab('schema')
          break
```

### Target File
.savepoint/releases/v1/epics/E03-linked-exploration/tasks/T001-operation-schema-navigation.md

### Replace
```md
## Acceptance Criteria

- [ ] Clicking `POST /PaymentInitiation/Initiate` highlights PaymentInitiationTransaction and incoming journey context.
- [ ] Clicking RetrieveFundingCheck highlights FundingCheck.
- [ ] Clicking OrderInitiation schema highlights OrderInitiation.
- [ ] Clicking HTTPError shows the reusable error model without requiring a journey node highlight.
```

### With
```md
## Acceptance Criteria

- [x] Clicking `POST /PaymentInitiation/Initiate` highlights PaymentInitiationTransaction and incoming journey context.
- [x] Clicking RetrieveFundingCheck highlights FundingCheck.
- [x] Clicking OrderInitiation schema highlights OrderInitiation.
- [x] Clicking HTTPError shows the reusable error model without requiring a journey node highlight.
```

### Target File
.savepoint/Design.md

### Replace
```yaml
last_audited: v1/E02-static-explorer-shell
```

### With
```yaml
last_audited: v1/E03-linked-exploration
```

### Target File
.savepoint/releases/v1/epics/E03-linked-exploration/E03-Detail.md

### Replace
```md
## Acceptance Criteria

- Selecting an endpoint highlights the corresponding node.
- Selecting a schema highlights related nodes and operations.
- Selecting a field shows where it is used.
- Search finds nodes, endpoints, operation IDs, schemas, and fields.
```

### With
```md
## Acceptance Criteria

- Selecting an endpoint highlights the corresponding node.
- Selecting a schema highlights related nodes and operations.
- Selecting a field shows where it is used.
- Search finds nodes, endpoints, operation IDs, schemas, and fields.

## Implemented As

- Operation and schema navigation share explorer selection state with the canvas, navigation list, and detail tabs.
- Field selection is represented in explorer state and surfaced in schema details with type, reference, enum, and usage context.
- Relationship detail renders parent/child journey edges plus related operations, schemas, and selected-schema fields.
- Search indexing lives in `src/utils/buildSearchIndex.ts` and covers node labels, operation IDs, endpoint paths, schema names, and schema field names.
- Audit found that operation, schema, and field search results need derived `nodeId` context so search-click navigation updates the visual canvas highlight when a related node exists.
```

### Target File
AGENTS.md

### Replace
```md
| `src/utils/` | E01-E05 | Small formatting, grouping, and search helpers. |
```

### With
```md
| `src/utils/` | E01-E05 | Small formatting, grouping, and search-index helpers. |
```
