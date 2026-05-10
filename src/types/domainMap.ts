export type VisualNodeType = 'actor' | 'channel' | 'control-record' | 'behavior-qualifier' | 'external'

export interface FieldGroup {
  id: string
  label: string
  fields: string[]
}

export interface VisualNode {
  id: string
  label: string
  type: VisualNodeType
  description: string
  relatedOperationIds: string[]
  relatedSchemaNames: string[]
  fieldGroups?: FieldGroup[]
}

export interface NodeEdge {
  source: string
  target: string
  label?: string
}

export interface DomainMap {
  nodes: VisualNode[]
  edges: NodeEdge[]
}

export interface RelationshipIndexes {
  nodeToOperations: Record<string, string[]>
  operationToSchemas: Record<string, string[]>
  schemaToNodes: Record<string, string[]>
  schemaToFields: Record<string, string[]>
  fieldToSchemas: Record<string, string[]>
}
