export interface OpenApiSpec {
  openapi: string
  info: Info
  servers?: Server[]
  paths: Record<string, PathItem>
  components: Components
}

export interface Info {
  title: string
  description?: string
  version: string
}

export interface Server {
  url: string
  description?: string
}

export interface PathItem {
  get?: Operation
  post?: Operation
  put?: Operation
  patch?: Operation
  delete?: Operation
  options?: Operation
  head?: Operation
  trace?: Operation
}

export interface Operation {
  tags?: string[]
  summary?: string
  description?: string
  operationId?: string
  parameters?: Parameter[]
  requestBody?: RequestBody | Reference
  responses: Record<string, Response | Reference>
}

export interface Parameter {
  name: string
  in: 'query' | 'header' | 'path' | 'cookie'
  description?: string
  required?: boolean
  schema: Schema
}

export interface RequestBody {
  description?: string
  content: Record<string, MediaType>
  required?: boolean
}

export interface MediaType {
  schema: Schema | Reference
}

export interface Response {
  description: string
  content?: Record<string, MediaType>
}

export interface Reference {
  $ref: string
}

export interface Schema {
  type?: string
  properties?: Record<string, Schema | Reference>
  items?: Schema | Reference
  required?: string[]
  enum?: string[]
  description?: string
  format?: string
  $ref?: string
  allOf?: (Schema | Reference)[]
  oneOf?: (Schema | Reference)[]
  anyOf?: (Schema | Reference)[]
}

export interface Components {
  schemas?: Record<string, Schema>
  requestBodies?: Record<string, RequestBody>
  responses?: Record<string, Response>
  parameters?: Record<string, Parameter | Reference>
}
