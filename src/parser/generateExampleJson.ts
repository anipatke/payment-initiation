import type { ParsedSchema, ParsedProperty } from './buildSchemaMap'

const MAX_DEPTH = 4

function exampleForPrimitive(prop: ParsedProperty): unknown {
  if (prop.enum && prop.enum.length > 0) return prop.enum[0]
  switch (prop.type) {
    case 'integer': return 0
    case 'number': return 0.0
    case 'boolean': return false
    case 'array': return []
    case 'string':
      switch (prop.format) {
        case 'date-time': return '2024-01-01T00:00:00Z'
        case 'date': return '2024-01-01'
        case 'uuid': return '00000000-0000-0000-0000-000000000000'
        case 'uri': return 'https://example.com'
        default: return prop.name
      }
    default:
      return null
  }
}

function generateFromSchema(
  schema: ParsedSchema,
  schemas: Record<string, ParsedSchema>,
  depth: number,
  visited: Set<string>,
): Record<string, unknown> {
  const result: Record<string, unknown> = {}

  for (const [key, prop] of Object.entries(schema.properties)) {
    if (prop.ref) {
      result[key] = generateExampleJson(prop.ref, schemas, depth + 1, new Set(visited))
    } else {
      result[key] = exampleForPrimitive(prop)
    }
  }

  return result
}

export function generateExampleJson(
  schemaName: string,
  schemas: Record<string, ParsedSchema>,
  depth = 0,
  visited: Set<string> = new Set(),
): unknown {
  if (depth >= MAX_DEPTH) return {}
  if (visited.has(schemaName)) return {}

  const schema = schemas[schemaName]
  if (!schema) return {}

  visited.add(schemaName)
  return generateFromSchema(schema, schemas, depth, visited)
}
