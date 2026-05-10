import type { OpenApiSpec } from '../types/openapi'
import { buildSchemaMap } from './buildSchemaMap'
import { buildOperationMap } from './buildOperationMap'
import type { SchemaMap } from './buildSchemaMap'
import type { OperationMap } from './buildOperationMap'

export interface ParsedSpec {
  openapi: string
  title: string
  description: string
  version: string
  servers: Array<{ url: string; description?: string }>
  schemas: SchemaMap
  operations: OperationMap
}

let cached: ParsedSpec | null = null

export function parseOpenApi(spec: OpenApiSpec): ParsedSpec {
  if (cached) return cached

  const schemas = buildSchemaMap(spec.components)
  const operations = buildOperationMap(spec.paths, spec.components.responses ?? {})

  const result: ParsedSpec = {
    openapi: spec.openapi,
    title: spec.info.title,
    description: spec.info.description ?? '',
    version: spec.info.version,
    servers: (spec.servers ?? []).map((s) => ({
      url: s.url,
      description: s.description,
    })),
    schemas,
    operations,
  }

  cached = result
  return result
}

export function resetParserCache(): void {
  cached = null
}
