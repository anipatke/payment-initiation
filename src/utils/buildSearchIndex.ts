import type { ParsedSpec } from '../parser/parseOpenApi'
import type { DomainMap } from '../types/domainMap'
import type { SearchResult, SearchResultKind } from '../types/explorer'

export type SearchIndex = SearchResult[]

export const SEARCH_KIND_ORDER: SearchResultKind[] = ['node', 'operation', 'schema', 'field']

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

export function querySearchIndex(index: SearchIndex, query: string): SearchResult[] {
  const q = query.trim().toLowerCase()
  if (!q) return []
  return index.filter(
    (r) =>
      r.label.toLowerCase().includes(q) ||
      (r.sublabel !== undefined && r.sublabel.toLowerCase().includes(q)),
  )
}
