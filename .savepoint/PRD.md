---
type: project-prd
status: active
source: PRD2.MD
---

# payment-initiation — Product Vision

## What It Is

An interactive visual explorer for the BIAN Payment Initiation OpenAPI service domain. The core experience is a journey diagram where users move from Customer / User to Channel / Banking App, into the PaymentInitiationTransaction control record, through FundingCheck and Compliance behavior qualifiers, then to OrderInitiation and downstream processing.

## Why

The BIAN OpenAPI specification is precise but hard to understand from raw endpoints and schemas alone. This project turns that spec into a synchronized visual, API, and schema explorer so product users, architects, and engineers can understand the Payment Initiation domain without treating raw JSON as the primary interface.

## Target Users

- Business and product users who need plain-English payment journey context.
- Architects who need to understand BIAN control record and behavior qualifier boundaries.
- Engineers who need endpoint, request, response, schema, field, and error-model details.

## Headline Differentiator

The payment journey is the primary navigation model. Selecting a visual node, endpoint, schema, field, or search result keeps the canvas, navigation, details, relationships, and examples in sync.

## Success Metrics

- Users can identify the PaymentInitiationTransaction control record and all three behavior qualifiers from the first screen.
- Selecting a node shows its business meaning, related operations, related schemas, field groups, relationships, and examples.
- Selecting an operation, schema, field, or search result highlights the related journey node.
- The explorer derives OpenAPI operations, schemas, references, errors, and examples from the local BIAN spec instead of hardcoding them in React components.
- Visual styling can be changed through a central theme/config layer without rewriting parser, state, or domain mapping logic.

## Constraints

- Use the local BIAN Payment Initiation OpenAPI document as the data source.
- Keep parser logic, BIAN domain mapping, explorer state, UI components, and theme tokens separate.
- Use React, TypeScript, Vite, Tailwind CSS, and React Flow or equivalent graph rendering.
- Do not invent backend payment rules, enum values, validation behavior, or rail-specific processing.
- Keep final visual identity configurable. Existing `design.md` is retained only as visual styling reference material.

## Out Of Scope For V1

- Executing real payments.
- Connecting to banking infrastructure.
- Replacing Swagger UI completely.
- Production payment validation.
- Settlement, clearing, and rail-specific processing logic.
- Uploading arbitrary BIAN specs.
- AI-generated descriptions for unknown schemas.
- Mock request execution.
