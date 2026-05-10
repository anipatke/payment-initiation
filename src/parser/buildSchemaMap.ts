import type {
  Schema,
  Reference,
  Components,
  Response,
  RequestBody as OpenApiRequestBody,
  Parameter,
} from '../types/openapi'
import { isLocalRef, extractRefName } from './resolveRefs'

export interface ParsedProperty {
  name: string
  type: string
  ref?: string
  description?: string
  format?: string
  enum?: string[]
}

export interface ParsedSchema {
  name: string
  type: string
  description?: string
  properties: Record<string, ParsedProperty>
  required?: string[]
}

export interface ParsedResponse {
  description: string
  contentType?: string
  ref?: string
}

export interface ParsedRequestBody {
  description?: string
  required?: boolean
  contentType: string
  ref?: string
}

export interface ParsedParameter {
  name: string
  in: Parameter['in']
  description?: string
  required?: boolean
  schemaType?: string
  schemaRef?: string
}

function parseSchemaOrRef(schemaOrRef: Schema | Reference, name: string): ParsedSchema {
  if (isLocalRef(schemaOrRef)) {
    return {
      name,
      type: 'object',
      properties: {},
    }
  }

  const schema = schemaOrRef as Schema
  const properties: Record<string, ParsedProperty> = {}

  if (schema.properties) {
    for (const [propName, propValue] of Object.entries(schema.properties)) {
      if (isLocalRef(propValue)) {
        properties[propName] = {
          name: propName,
          type: 'object',
          ref: extractRefName(propValue),
        }
      } else {
        const prop = propValue as Schema
        properties[propName] = {
          name: propName,
          type: prop.type ?? 'object',
          description: prop.description,
          format: prop.format,
          enum: prop.enum,
        }
      }
    }
  }

  return {
    name,
    type: schema.type ?? 'object',
    description: schema.description,
    properties,
    required: schema.required,
  }
}

function parseResponse(res: Response | Reference, name: string): ParsedResponse {
  if (isLocalRef(res)) {
    return {
      description: '',
      ref: extractRefName(res),
    }
  }

  const response = res as Response
  const contentType = response.content
    ? Object.keys(response.content)[0]
    : undefined
  const mediaType = contentType ? response.content![contentType] : undefined
  const schemaRef = mediaType?.schema
    ? isLocalRef(mediaType.schema)
      ? extractRefName(mediaType.schema)
      : undefined
    : undefined

  return {
    description: response.description,
    contentType,
    ref: schemaRef,
  }
}

function parseRequestBody(body: OpenApiRequestBody | Reference, name: string): ParsedRequestBody {
  if (isLocalRef(body)) {
    return {
      contentType: 'application/json',
      ref: extractRefName(body),
    }
  }

  const reqBody = body as OpenApiRequestBody
  const contentType = Object.keys(reqBody.content)[0]
  const mediaType = reqBody.content[contentType]
  const schemaRef = mediaType?.schema
    ? isLocalRef(mediaType.schema)
      ? extractRefName(mediaType.schema)
      : undefined
    : undefined

  return {
    description: reqBody.description,
    required: reqBody.required,
    contentType,
    ref: schemaRef,
  }
}

function parseParameter(param: Parameter | Reference, name: string): ParsedParameter {
  if (isLocalRef(param)) {
    return {
      name,
      in: 'path',
      schemaRef: extractRefName(param),
    }
  }

  const schemaRef = isLocalRef(param.schema)
    ? extractRefName(param.schema)
    : undefined

  return {
    name: param.name,
    in: param.in,
    description: param.description,
    required: param.required,
    schemaType: isLocalRef(param.schema) ? undefined : param.schema.type,
    schemaRef,
  }
}

export interface SchemaMap {
  schemas: Record<string, ParsedSchema>
  responses: Record<string, ParsedResponse>
  requestBodies: Record<string, ParsedRequestBody>
  parameters: Record<string, ParsedParameter>
}

export function buildFieldUsageIndex(schemas: Record<string, ParsedSchema>): Record<string, string[]> {
  const index: Record<string, string[]> = {}
  for (const [schemaName, schema] of Object.entries(schemas)) {
    for (const fieldName of Object.keys(schema.properties)) {
      if (!index[fieldName]) index[fieldName] = []
      index[fieldName].push(schemaName)
    }
  }
  return index
}

export function buildSchemaMap(components: Components): SchemaMap {
  const schemas: Record<string, ParsedSchema> = {}
  const responses: Record<string, ParsedResponse> = {}
  const requestBodies: Record<string, ParsedRequestBody> = {}
  const parameters: Record<string, ParsedParameter> = {}

  if (components.schemas) {
    for (const [name, schema] of Object.entries(components.schemas)) {
      schemas[name] = parseSchemaOrRef(schema, name)
    }
  }

  if (components.responses) {
    for (const [name, response] of Object.entries(components.responses)) {
      responses[name] = parseResponse(response, name)
    }
  }

  if (components.requestBodies) {
    for (const [name, body] of Object.entries(components.requestBodies)) {
      requestBodies[name] = parseRequestBody(body, name)
    }
  }

  if (components.parameters) {
    for (const [name, param] of Object.entries(components.parameters)) {
      parameters[name] = parseParameter(param, name)
    }
  }

  return { schemas, responses, requestBodies, parameters }
}
