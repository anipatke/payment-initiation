---
type: audit-findings
audited: 2026-05-10
---
# Audit Findings: E04 Modes And Examples

## Main Findings

- **Resolved:** `HTTPError` links now include the selected schema in the schema tab even when it is outside the current node's `relatedSchemaNames`, so the reusable error model can be inspected after selecting an error response.
- **Resolved:** examples now default to a friendly field/value view, with raw JSON retained as a secondary toggle and schema/source detail retained as a separate view.
- **Documentation reconciled:** `.savepoint/Design.md`, `AGENTS.md`, and the E04 epic detail now reflect mode display helpers, error response normalization, and the E04 implementation reality.
- **Verified passing gates:** `npm test` passed parser and domain-map assertions; `npm run build` completed successfully after applying the audit.

## Code Style Review

- [x] One job per file
- [x] One-sentence functions
- [ ] Test branches
- [x] Types are documentation
- [x] Build, don't speculate
- [x] Errors at boundaries
- [x] One source of truth
- [x] Comments explain WHY
- [x] Content in data files
- [x] Small diffs

## Proposed Changes

### Target File
src/components/detail/DetailPanel.tsx

### Replace
```
  const schemaNames = node?.relatedSchemaNames ?? []
  const schemas = schemaNames
    .map((name) => parsedSpec.schemas.schemas[name])
    .filter(Boolean)
```

### With
```
  const schemaNames = useMemo(() => {
    const names = node?.relatedSchemaNames ?? []
    const selectedSchemaName = state.selection.schemaName
    if (
      selectedSchemaName &&
      parsedSpec.schemas.schemas[selectedSchemaName] &&
      !names.includes(selectedSchemaName)
    ) {
      return [...names, selectedSchemaName]
    }
    return names
  }, [node?.relatedSchemaNames, parsedSpec.schemas.schemas, state.selection.schemaName])

  const schemas = schemaNames
    .map((name) => parsedSpec.schemas.schemas[name])
    .filter(Boolean)
```

### Target File
src/components/detail/ExampleJsonTab.tsx

### Replace
```
type ViewMode = 'generated' | 'schema'
```

### With
```
type ViewMode = 'friendly' | 'raw' | 'schema'
```

### Target File
src/components/detail/ExampleJsonTab.tsx

### Replace
```
function SchemaView({ schema }: { schema: ParsedSchema }) {
```

### With
```
function FriendlyValue({ name, value }: { name: string; value: unknown }) {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return (
      <div className="border border-border rounded overflow-hidden">
        <div className="px-3 py-1.5 bg-surface border-b border-border">
          <p className="font-mono text-[10px] text-text/50">{name}</p>
        </div>
        <div className="divide-y divide-border">
          {Object.entries(value as Record<string, unknown>).map(([key, entry]) => (
            <FriendlyValue key={key} name={key} value={entry} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-3 px-3 py-1.5 font-mono text-[10px]">
      <span className="text-text/80 min-w-[8rem] shrink-0">{name}</span>
      <span className="text-text/50 truncate min-w-0">
        {Array.isArray(value) ? '[]' : String(value)}
      </span>
    </div>
  )
}

function SchemaView({ schema }: { schema: ParsedSchema }) {
```

### Target File
src/components/detail/ExampleJsonTab.tsx

### Replace
```
  const [viewMode, setViewMode] = useState<ViewMode>('generated')
```

### With
```
  const [viewMode, setViewMode] = useState<ViewMode>('friendly')
```

### Target File
src/components/detail/ExampleJsonTab.tsx

### Replace
```
        {(['generated', 'schema'] as const).map((mode) => (
```

### With
```
        {(['friendly', 'raw', 'schema'] as const).map((mode) => (
```

### Target File
src/components/detail/ExampleJsonTab.tsx

### Replace
```
            {mode === 'generated' ? 'Generated' : 'Schema'}
```

### With
```
            {mode === 'friendly' ? 'Friendly' : mode === 'raw' ? 'Raw' : 'Schema'}
```

### Target File
src/components/detail/ExampleJsonTab.tsx

### Replace
```
        const hasContent = viewMode === 'generated' ? example !== undefined : schema !== undefined
```

### With
```
        const hasContent = viewMode === 'schema' ? schema !== undefined : example !== undefined
```

### Target File
src/components/detail/ExampleJsonTab.tsx

### Replace
```
            ) : viewMode === 'generated' ? (
              <pre className="font-mono text-[10px] text-text/70 p-3 overflow-x-auto leading-relaxed max-h-64">
                {JSON.stringify(example, null, 2)}
              </pre>
            ) : schema ? (
              <SchemaView schema={schema} />
```

### With
```
            ) : viewMode === 'friendly' ? (
              <FriendlyValue name={section.schemaName} value={example} />
            ) : viewMode === 'raw' ? (
              <pre className="font-mono text-[10px] text-text/70 p-3 overflow-x-auto leading-relaxed max-h-64">
                {JSON.stringify(example, null, 2)}
              </pre>
            ) : schema ? (
              <SchemaView schema={schema} />
```

### Target File
.savepoint/Design.md

### Replace
```
- Explorer state: stores selected node, operation, schema, field, mode, tab, search, examples, and animation state.
- Presentation: renders left navigation, journey canvas, detail panel, examples, and guided scenarios using theme/config tokens.
```

### With
```
- Explorer state: stores selected node, operation, schema, field, mode, tab, search, examples, and animation state.
- Mode display helpers: centralize mode default tabs, tab labels, and mode-specific visual affordances.
- Presentation: renders left navigation, journey canvas, detail panel, examples, error responses, and guided scenarios using theme/config tokens.
```

### Target File
.savepoint/Design.md

### Replace
```
- Parser and mapping logic receive focused assertion files under `src/parser/`.
- UI tasks must at minimum pass `npm run build`.
```

### With
```
- Parser and mapping logic receive focused assertion files under `src/parser/`.
- Error response parsing must verify reusable response refs resolve to their schema model, including `HTTPError`.
- UI tasks must at minimum pass `npm run build`.
```

### Target File
AGENTS.md

### Replace
```
| `src/parser/` | E01 | OpenAPI parsing, ref resolution, relationship indexes, example generation, and parser/domain assertion tests. |
```

### With
```
| `src/parser/` | E01-E04 | OpenAPI parsing, ref resolution, error response normalization, relationship indexes, example generation, and parser/domain assertion tests. |
```

### Target File
AGENTS.md

### Replace
```
| `src/utils/` | E01-E05 | Small formatting, grouping, and search-index helpers. |
```

### With
```
| `src/utils/` | E01-E05 | Small formatting, grouping, search-index, and mode-display helpers. |
```

### Target File
.savepoint/releases/v1/epics/E04-modes-and-examples/E04-Detail.md

### Replace
```
## Acceptance Criteria

- Business mode emphasizes plain-English explanations and field groups.
- API mode emphasizes endpoints, parameters, request/response bodies, and errors.
- Schema mode emphasizes schema names, fields, types, references, and usage.
- Examples are generated from schema data and are not raw JSON as the main experience.
```

### With
```
## Acceptance Criteria

- Business mode emphasizes plain-English explanations and field groups.
- API mode emphasizes endpoints, parameters, request/response bodies, and errors.
- Schema mode emphasizes schema names, fields, types, references, and usage.
- Examples are generated from schema data and are not raw JSON as the main experience.

## Implemented As

- Mode default tabs and labels are centralized in `src/utils/modeDisplay.ts`.
- API error responses are normalized in `src/parser/buildOperationMap.ts` and displayed from `src/components/detail/OperationsTab.tsx`.
- Example payloads are generated in `src/parser/generateExampleJson.ts` and surfaced through `src/components/detail/ExampleJsonTab.tsx`.
- Audit finding: `HTTPError` selection must include schemas outside the current node's `relatedSchemaNames`.
- Audit finding: examples need a friendly primary view before raw JSON is exposed as a secondary toggle.
```
