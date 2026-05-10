---
type: audit-findings
audited: 2026-05-08
---
# Audit Findings: E01 Data Foundation

## Main Findings
- Applied: `components.parameters` are now typed, parsed, exposed from `buildSchemaMap`, and covered by the parser assertion file.
- Applied: E01 assertion files are now runnable through `npm test`, with `tsx` added as a dev dependency.
- Verified: `npm test` passed on 2026-05-08.
- Verified: `npm run build` passed on 2026-05-08.
- E01 is ready to close as audited. Remaining risk is limited to the assertion style itself: the files use `console.assert` rather than a full test runner, which is acceptable for this foundation epic but should be reconsidered if parser/state branches grow.

## Code Style Review
- [x] One job per file
- [x] One-sentence functions
- [x] Test branches
- [x] Types are documentation
- [x] Build, don't speculate
- [x] Errors at boundaries
- [x] One source of truth
- [x] Comments explain WHY
- [x] Content in data files
- [x] Small diffs

## Proposed Changes
### Target File
src/types/openapi.ts

### Replace
```ts
export interface Components {
  schemas?: Record<string, Schema>
  requestBodies?: Record<string, RequestBody>
  responses?: Record<string, Response>
}
```

### With
```ts
export interface Components {
  schemas?: Record<string, Schema>
  requestBodies?: Record<string, RequestBody>
  responses?: Record<string, Response>
  parameters?: Record<string, Parameter | Reference>
}
```

### Target File
src/parser/buildSchemaMap.ts

### Replace
```ts
import type { Schema, Reference, Components, Response, RequestBody as OpenApiRequestBody } from '../types/openapi'
```

### With
```ts
import type {
  Schema,
  Reference,
  Components,
  Response,
  RequestBody as OpenApiRequestBody,
  Parameter,
} from '../types/openapi'
```

### Target File
src/parser/buildSchemaMap.ts

### Replace
```ts
export interface ParsedRequestBody {
  description?: string
  required?: boolean
  contentType: string
  ref?: string
}
```

### With
```ts
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
```

### Target File
src/parser/buildSchemaMap.ts

### Replace
```ts
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
```

### With
```ts
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
```

### Target File
src/parser/buildSchemaMap.ts

### Replace
```ts
export interface SchemaMap {
  schemas: Record<string, ParsedSchema>
  responses: Record<string, ParsedResponse>
  requestBodies: Record<string, ParsedRequestBody>
}
```

### With
```ts
export interface SchemaMap {
  schemas: Record<string, ParsedSchema>
  responses: Record<string, ParsedResponse>
  requestBodies: Record<string, ParsedRequestBody>
  parameters: Record<string, ParsedParameter>
}
```

### Target File
src/parser/buildSchemaMap.ts

### Replace
```ts
export function buildSchemaMap(components: Components): SchemaMap {
  const schemas: Record<string, ParsedSchema> = {}
  const responses: Record<string, ParsedResponse> = {}
  const requestBodies: Record<string, ParsedRequestBody> = {}

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

  return { schemas, responses, requestBodies }
}
```

### With
```ts
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
```

### Target File
src/parser/parser.test.ts

### Replace
```ts
  const { requestBodies } = parsed.schemas
  console.assert(requestBodies['InitiatePaymentInitiationTransactionRequest'] !== undefined, 'requestBody exists')
  console.assert(requestBodies['InitiatePaymentInitiationTransactionRequest'].ref === 'InitiatePaymentInitiationTransactionRequest', 'requestBody schema ref')
```

### With
```ts
  const { requestBodies, parameters } = parsed.schemas
  console.assert(requestBodies['InitiatePaymentInitiationTransactionRequest'] !== undefined, 'requestBody exists')
  console.assert(requestBodies['InitiatePaymentInitiationTransactionRequest'].ref === 'InitiatePaymentInitiationTransactionRequest', 'requestBody schema ref')
  console.assert(parameters['PaymentInitiationID'] !== undefined, 'component parameter exists')
  console.assert(parameters['PaymentInitiationID'].name === 'paymentinitiationId', 'component parameter name')
```

### Target File
package.json

### Replace
```json
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
```

### With
```json
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "test": "tsx src/parser/parser.test.ts && tsx src/parser/domainMap.test.ts",
    "preview": "vite preview"
  },
```

### Target File
package.json

### Replace
```json
    "tailwindcss": "^4.1.10",
    "typescript": "^6.0.3",
    "vite": "^7.0.6"
```

### With
```json
    "tailwindcss": "^4.1.10",
    "tsx": "^4.20.6",
    "typescript": "^6.0.3",
    "vite": "^7.0.6"
```

### Target File
.savepoint/Design.md

### Replace
```md
## 6. Testing Strategy

- Parser and mapping logic should receive focused tests or build-time assertions.
- UI tasks must at minimum pass `npm run build`.
- Add a test script when parser/state behavior becomes complex enough that build-only verification is insufficient.
```

### With
```md
## 6. Testing Strategy

- Parser and mapping logic receive focused assertion files under `src/parser/`.
- UI tasks must at minimum pass `npm run build`.
- When assertion files exist, expose them through `npm test` so task quality gates can verify them directly.
```

### Target File
AGENTS.md

### Replace
```md
| `src/parser/` | E01 | OpenAPI parsing, ref resolution, relationship indexes, and example generation. |
```

### With
```md
| `src/parser/` | E01 | OpenAPI parsing, ref resolution, relationship indexes, example generation, and parser/domain assertion tests. |
```

### Target File
.savepoint/releases/v1/epics/E01-data-foundation/E01-Detail.md

### Replace
```md
## Acceptance Criteria

- OpenAPI parsing and domain mapping are separate modules.
- React components do not own schema, endpoint, or field definitions.
- Generated examples are available for all required request/response schemas.
- Theme tokens are isolated from behavior.
```

### With
```md
## Acceptance Criteria

- OpenAPI parsing and domain mapping are separate modules.
- React components do not own schema, endpoint, or field definitions.
- Generated examples are available for all required request/response schemas.
- Theme tokens are isolated from behavior.

## Implemented As

- Typed OpenAPI, explorer, domain-map, and theme contracts live in `src/types/` and `src/theme/`.
- The local BIAN source spec lives in `src/data/bian-payment-initiation-openapi.json`.
- Payment Initiation journey data lives in `src/data/paymentInitiationDomainMap.ts`.
- Parser modules live in `src/parser/` and cover parsing, local ref names, relationship indexes, example generation, and assertion files.
- Audit identified follow-up fixes for `components.parameters` extraction and for wiring assertion files into `npm test`.
```
