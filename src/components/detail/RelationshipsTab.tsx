import type { VisualNode, NodeEdge } from '../../types/domainMap'

interface RelationshipsTabProps {
  node: VisualNode
  edges: NodeEdge[]
  allNodes: VisualNode[]
  operationIds: string[]
  schemaNames: string[]
  relatedFields?: string[]
}

export function RelationshipsTab({
  node,
  edges,
  allNodes,
  operationIds,
  schemaNames,
  relatedFields,
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
      {relatedFields && relatedFields.length > 0 && (
        <ReferenceList title="Fields" items={relatedFields} emptyText="" />
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
