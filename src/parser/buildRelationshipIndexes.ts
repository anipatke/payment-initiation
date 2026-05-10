import type { DomainMap, RelationshipIndexes } from '../types/domainMap'
import type { ParsedSpec } from './parseOpenApi'

export interface DomainMapValidationResult {
  missingOperationIds: string[]
  missingSchemaNames: string[]
}

export function validateDomainMap(
  domainMap: DomainMap,
  spec: ParsedSpec,
): DomainMapValidationResult {
  const missingOperationIds: string[] = []
  const missingSchemaNames: string[] = []
  const seenOpIds = new Set<string>()
  const seenSchemaNames = new Set<string>()

  for (const node of domainMap.nodes) {
    for (const opId of node.relatedOperationIds) {
      if (!seenOpIds.has(opId)) {
        seenOpIds.add(opId)
        if (!spec.operations.operations[opId]) {
          missingOperationIds.push(opId)
        }
      }
    }
    for (const schemaName of node.relatedSchemaNames) {
      if (!seenSchemaNames.has(schemaName)) {
        seenSchemaNames.add(schemaName)
        if (!spec.schemas.schemas[schemaName]) {
          missingSchemaNames.push(schemaName)
        }
      }
    }
  }

  return { missingOperationIds, missingSchemaNames }
}

export function buildRelationshipIndexes(
  domainMap: DomainMap,
  spec: ParsedSpec,
): RelationshipIndexes {
  const nodeToOperations: Record<string, string[]> = {}
  for (const node of domainMap.nodes) {
    nodeToOperations[node.id] = [...node.relatedOperationIds]
  }

  const operationToSchemas: Record<string, string[]> = {}
  for (const node of domainMap.nodes) {
    for (const opId of node.relatedOperationIds) {
      if (opId in operationToSchemas) continue
      const op = spec.operations.operations[opId]
      if (!op) continue
      const schemas: string[] = []
      if (op.requestBody?.ref) schemas.push(op.requestBody.ref)
      for (const res of Object.values(op.responses)) {
        if (res.schemaRef) schemas.push(res.schemaRef)
      }
      operationToSchemas[opId] = [...new Set(schemas)]
    }
  }

  const schemaToNodes: Record<string, string[]> = {}
  for (const node of domainMap.nodes) {
    for (const schemaName of node.relatedSchemaNames) {
      if (!schemaToNodes[schemaName]) schemaToNodes[schemaName] = []
      if (!schemaToNodes[schemaName].includes(node.id)) {
        schemaToNodes[schemaName].push(node.id)
      }
    }
  }

  const schemaToFields: Record<string, string[]> = {}
  for (const [name, schema] of Object.entries(spec.schemas.schemas)) {
    schemaToFields[name] = Object.keys(schema.properties)
  }

  const fieldToSchemas: Record<string, string[]> = {}
  for (const [schemaName, fields] of Object.entries(schemaToFields)) {
    for (const field of fields) {
      if (!fieldToSchemas[field]) fieldToSchemas[field] = []
      fieldToSchemas[field].push(schemaName)
    }
  }

  return { nodeToOperations, operationToSchemas, schemaToNodes, schemaToFields, fieldToSchemas }
}
