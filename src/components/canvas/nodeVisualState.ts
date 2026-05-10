import type { NodeEdge } from '../../types/domainMap'

export type NodeVisualState = 'selected' | 'related' | 'default' | 'muted'

export function getNodeVisualState(
  nodeId: string,
  selectedNodeId: string | undefined,
  edges: NodeEdge[],
): NodeVisualState {
  if (!selectedNodeId) return 'default'
  if (nodeId === selectedNodeId) return 'selected'
  const isRelated = edges.some(
    (e) =>
      (e.source === selectedNodeId && e.target === nodeId) ||
      (e.target === selectedNodeId && e.source === nodeId),
  )
  return isRelated ? 'related' : 'muted'
}
