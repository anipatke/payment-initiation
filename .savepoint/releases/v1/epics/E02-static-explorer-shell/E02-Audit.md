---
type: audit-findings
audited: 2026-05-08
---

# Audit Findings: E02 Static Explorer Shell

## Main Findings

1. Resolved: `RelationshipsTab` now lists the related operation IDs and schema names in addition to parent/child links and counts, satisfying T004's relationships-tab acceptance criterion.

2. Remaining process note: T004 still has `status: in_progress` and `stage: build` in `.savepoint/releases/v1/epics/E02-static-explorer-shell/tasks/T004-detail-panel-tabs.md:3-4`. The audit did not change this because the project instructions reserve task completion status changes for the user.

3. Remaining code quality risk: journey node HTTP badges are inferred from operation ID prefixes in `src/components/canvas/JourneyNode.tsx:23-36` instead of the parsed operation metadata. It works for the current BIAN map, but it duplicates API knowledge inside the canvas component and can drift from the OpenAPI parser source of truth.

4. Verified after applying audit proposals: `npm.cmd run build` passed, and `npm.cmd test` passed with parser and domain-map assertions. E02 is closed as audited and the router now points to E03 epic design.

## Code Style Review

- [x] One job per file
- [x] One-sentence functions
- [ ] Test branches
- [x] Types are documentation
- [x] Build, don't speculate
- [x] Errors at boundaries
- [ ] One source of truth
- [x] Comments explain WHY
- [x] Content in data files
- [x] Small diffs

## Proposed Changes

### Target File
src/components/detail/DetailPanel.tsx

### Replace
```tsx
            {state.activeTab === 'relationships' && (
              <RelationshipsTab
                node={node}
                edges={domainMap.edges}
                allNodes={domainMap.nodes}
                operationCount={operationIds.length}
                schemaCount={schemaNames.length}
              />
            )}
```

### With
```tsx
            {state.activeTab === 'relationships' && (
              <RelationshipsTab
                node={node}
                edges={domainMap.edges}
                allNodes={domainMap.nodes}
                operationIds={operationIds}
                schemaNames={schemaNames}
              />
            )}
```

### Target File
src/components/detail/RelationshipsTab.tsx

### Replace
```tsx
import type { VisualNode, NodeEdge } from '../../types/domainMap'

interface RelationshipsTabProps {
  node: VisualNode
  edges: NodeEdge[]
  allNodes: VisualNode[]
  operationCount: number
  schemaCount: number
}

export function RelationshipsTab({
  node,
  edges,
  allNodes,
  operationCount,
  schemaCount,
}: RelationshipsTabProps) {
  const nodeById = Object.fromEntries(allNodes.map((n) => [n.id, n]))

  const parents = edges.filter((e) => e.target === node.id)
  const children = edges.filter((e) => e.source === node.id)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        <Stat label="Operations" value={operationCount} />
        <Stat label="Schemas" value={schemaCount} />
      </div>

      {parents.length > 0 && (
        <EdgeList title="Receives from" edges={parents} nodeById={nodeById} nodeId={node.id} side="source" />
      )}

      {children.length > 0 && (
        <EdgeList title="Sends to" edges={children} nodeById={nodeById} nodeId={node.id} side="target" />
      )}

      {parents.length === 0 && children.length === 0 && (
        <p className="font-body text-xs text-text/30">No direct connections.</p>
      )}
    </div>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="border border-border rounded p-2 text-center">
      <p className="font-heading text-base">{value}</p>
      <p className="font-mono text-[10px] text-text/40 uppercase tracking-wider">{label}</p>
    </div>
  )
}

function EdgeList({
  title,
  edges,
  nodeById,
  nodeId,
  side,
}: {
  title: string
  edges: NodeEdge[]
  nodeById: Record<string, VisualNode>
  nodeId: string
  side: 'source' | 'target'
}) {
  return (
    <div>
      <p className="font-mono text-[10px] text-text/40 uppercase tracking-wider mb-1">{title}</p>
      <div className="space-y-1">
        {edges.map((edge) => {
          const peerId = side === 'source' ? edge.source : edge.target
          const peer = nodeById[peerId]
          return (
            <div key={`${edge.source}-${edge.target}`} className="flex items-center gap-2 font-mono text-[10px]">
              <span className="text-text/70">{peer?.label ?? peerId}</span>
              {edge.label && <span className="text-text/30">— {edge.label}</span>}
            </div>
          )
        })}
      </div>
    </div>
  )
}
```

### With
```tsx
import type { VisualNode, NodeEdge } from '../../types/domainMap'

interface RelationshipsTabProps {
  node: VisualNode
  edges: NodeEdge[]
  allNodes: VisualNode[]
  operationIds: string[]
  schemaNames: string[]
}

export function RelationshipsTab({
  node,
  edges,
  allNodes,
  operationIds,
  schemaNames,
}: RelationshipsTabProps) {
  const nodeById = Object.fromEntries(allNodes.map((n) => [n.id, n]))

  const parents = edges.filter((e) => e.target === node.id)
  const children = edges.filter((e) => e.source === node.id)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        <Stat label="Operations" value={operationIds.length} />
        <Stat label="Schemas" value={schemaNames.length} />
      </div>

      {parents.length > 0 && (
        <EdgeList title="Receives from" edges={parents} nodeById={nodeById} side="source" />
      )}

      {children.length > 0 && (
        <EdgeList title="Sends to" edges={children} nodeById={nodeById} side="target" />
      )}

      {parents.length === 0 && children.length === 0 && (
        <p className="font-body text-xs text-text/30">No direct connections.</p>
      )}

      <ReferenceList title="Operations" items={operationIds} emptyText="No operations for this node." />
      <ReferenceList title="Schemas" items={schemaNames} emptyText="No schemas for this node." />
    </div>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="border border-border rounded p-2 text-center">
      <p className="font-heading text-base">{value}</p>
      <p className="font-mono text-[10px] text-text/40 uppercase tracking-wider">{label}</p>
    </div>
  )
}

function EdgeList({
  title,
  edges,
  nodeById,
  side,
}: {
  title: string
  edges: NodeEdge[]
  nodeById: Record<string, VisualNode>
  side: 'source' | 'target'
}) {
  return (
    <div>
      <p className="font-mono text-[10px] text-text/40 uppercase tracking-wider mb-1">{title}</p>
      <div className="space-y-1">
        {edges.map((edge) => {
          const peerId = side === 'source' ? edge.source : edge.target
          const peer = nodeById[peerId]
          return (
            <div key={`${edge.source}-${edge.target}`} className="flex items-center gap-2 font-mono text-[10px]">
              <span className="text-text/70">{peer?.label ?? peerId}</span>
              {edge.label && <span className="text-text/30">- {edge.label}</span>}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ReferenceList({
  title,
  items,
  emptyText,
}: {
  title: string
  items: string[]
  emptyText: string
}) {
  return (
    <div>
      <p className="font-mono text-[10px] text-text/40 uppercase tracking-wider mb-1">{title}</p>
      {items.length > 0 ? (
        <div className="space-y-1">
          {items.map((item) => (
            <div key={item} className="font-mono text-[10px] text-text/60 break-all">
              {item}
            </div>
          ))}
        </div>
      ) : (
        <p className="font-body text-xs text-text/30">{emptyText}</p>
      )}
    </div>
  )
}
```

### Target File
.savepoint/releases/v1/epics/E02-static-explorer-shell/E02-Detail.md

### Replace
```md
## Acceptance Criteria

- The first screen is the explorer, not a landing page.
- Clicking a journey node updates detail content.
- The layout works on desktop and mobile.
- Visual styling uses the central theme/config layer.
```

### With
```md
## Acceptance Criteria

- The first screen is the explorer, not a landing page.
- Clicking a journey node updates detail content.
- The layout works on desktop and mobile.
- Visual styling uses the central theme/config layer.

## Implemented As

- `src/App.tsx` composes `SpecProvider`, `ExplorerStateProvider`, and `ExplorerShell` as the first rendered experience.
- `src/app/ExplorerLayout.tsx` provides the responsive three-surface shell.
- `src/components/navigation/` renders the mode switcher, operation groups, schema groups, and E03 search placeholder.
- `src/components/canvas/` renders the static journey nodes, edges, and selected/related/muted visual states.
- `src/components/detail/` renders overview, operations, schema, relationships, and generated JSON example tabs.
```

### Target File
.savepoint/Design.md

### Replace
```md
## 5. State Model

Explorer state tracks:
```

### With
```md
## 5. State Model

E02 implemented the state model with React context in `src/state/explorerStore.tsx` and consumes it from the navigation, canvas, and detail surfaces.

Explorer state tracks:
```

### Notes

No `AGENTS.md` Codebase Map replacement is proposed. The existing map already lists the E02 `src/state/`, `src/app/`, `src/components/navigation/`, `src/components/canvas/`, and `src/components/detail/` modules.

Do not audit-apply a task frontmatter status change for T004 unless the user explicitly confirms it should be marked `done`.
