import type { PathItem, Operation, Parameter, Reference, Response } from '../types/openapi'
import { isLocalRef, extractRefName } from './resolveRefs'

const HTTP_METHODS = ['get', 'post', 'put', 'patch', 'delete', 'options', 'head', 'trace'] as const

type HttpMethod = typeof HTTP_METHODS[number]

const ERROR_CODES = new Set(['400', '401', '403', '404', '429', '500'])

export interface ParsedOperationResponse {
  description: string
  contentType?: string
  schemaRef?: string
  isError?: boolean
}

export interface ParsedOperation {
  path: string
  method: string
  operationId: string
  tags: string[]
  summary: string
  description: string
  parameters: Parameter[]
  requestBody?: {
    ref?: string
    description?: string
    required?: boolean
    contentType: string
  }
  responses: Record<string, ParsedOperationResponse>
}

function parseOperation(
  path: string,
  method: string,
  operation: Operation,
  componentResponses: Record<string, Response> = {},
): ParsedOperation {
  const parameters = (operation.parameters ?? []).map((p) => {
    if (isLocalRef(p)) {
      return p
    }
    return p as Parameter
  })

  let requestBody: ParsedOperation['requestBody'] = undefined

  if (operation.requestBody) {
    if (isLocalRef(operation.requestBody)) {
      requestBody = {
        contentType: 'application/json',
        ref: extractRefName(operation.requestBody),
      }
    } else {
      const rb = operation.requestBody
      const contentType = Object.keys(rb.content)[0]
      const mediaType = rb.content[contentType]
      const schemaRef = mediaType?.schema
        ? isLocalRef(mediaType.schema)
          ? extractRefName(mediaType.schema)
          : undefined
        : undefined

      requestBody = {
        ref: schemaRef,
        description: rb.description,
        required: rb.required,
        contentType,
      }
    }
  }

  const responses: Record<string, ParsedOperationResponse> = {}
  for (const [code, res] of Object.entries(operation.responses)) {
    const isError = ERROR_CODES.has(code)
    if (isLocalRef(res)) {
      const refName = extractRefName(res)
      const resolved = componentResponses[refName]
      let schemaRef: string | undefined
      let description = ''
      if (resolved) {
        description = resolved.description
        const contentType = resolved.content ? Object.keys(resolved.content)[0] : undefined
        const mediaType = contentType ? resolved.content![contentType] : undefined
        schemaRef = mediaType?.schema && isLocalRef(mediaType.schema)
          ? extractRefName(mediaType.schema)
          : undefined
      } else {
        schemaRef = refName
      }
      responses[code] = { description, schemaRef, isError }
    } else {
      const response = res
      const contentType = response.content
        ? Object.keys(response.content)[0]
        : undefined
      const mediaType = contentType ? response.content![contentType] : undefined
      const schemaRef = mediaType?.schema
        ? isLocalRef(mediaType.schema)
          ? extractRefName(mediaType.schema)
          : undefined
        : undefined

      responses[code] = {
        description: response.description,
        contentType,
        schemaRef: schemaRef ?? undefined,
        isError,
      }
    }
  }

  return {
    path,
    method,
    operationId: operation.operationId ?? `${method}_${path}`,
    tags: operation.tags ?? [],
    summary: operation.summary ?? '',
    description: operation.description ?? '',
    parameters,
    requestBody,
    responses,
  }
}

export interface OperationMap {
  operations: Record<string, ParsedOperation>
  operationList: ParsedOperation[]
}

export function buildOperationMap(
  paths: Record<string, PathItem>,
  componentResponses: Record<string, Response> = {},
): OperationMap {
  const operations: Record<string, ParsedOperation> = {}
  const operationList: ParsedOperation[] = []

  for (const [path, pathItem] of Object.entries(paths)) {
    for (const method of HTTP_METHODS) {
      const operation = pathItem[method]
      if (!operation) continue

      const parsed = parseOperation(path, method, operation, componentResponses)
      operations[parsed.operationId] = parsed
      operationList.push(parsed)
    }
  }

  return { operations, operationList }
}
