````markdown
# Implementation Spec: Visual BIAN Payment Initiation Explorer

## 1. Product Summary

Build an interactive visual explorer for the **BIAN Payment Initiation Domain** OpenAPI spec.

The tool should let users understand the API through the shape of a payment journey:

```text
User → Channel/App → PaymentInitiationTransaction → FundingCheck / Compliance → OrderInitiation
````

The diagram is not decorative. It is the primary navigation model. Users should click parts of the journey to reveal the relevant business meaning, API endpoints, schemas, fields, and example payloads.

The source spec is an OpenAPI 3.0.1 document for the **Payment Initiation** service domain. It defines operations for initiating, updating, and retrieving payment initiation transactions, plus retrieve operations for the child behaviour qualifiers: **Compliance**, **FundingCheck**, and **OrderInitiation**.

---

## 2. Goals

### 2.1 Primary Goal

Create a **journey-first OpenAPI explorer** that helps users understand the BIAN Payment Initiation domain visually.

### 2.2 Secondary Goals

The app should allow users to:

* Explore the payment journey from customer action to payment order initiation.
* Click visual nodes to inspect related API operations.
* View schemas and fields in a human-friendly structure.
* Switch between business, API, and schema perspectives.
* Understand how BIAN concepts like **Control Record** and **Behavior Qualifier** map to actual API endpoints and schemas.
* View example request and response payloads.

---

## 3. Non-Goals

The app should **not**:

* Execute real payments.
* Connect to banking infrastructure.
* Replace Swagger UI entirely.
* Validate production payment rules.
* Provide settlement, clearing, or rail-specific processing logic.
* Assume field values or enum values not present in the spec.
* Present raw JSON as the main user experience.

This is an **explainer and explorer**, not a payment engine.

---

## 4. Target Users

### 4.1 Business / Product Users

Need to understand:

* What the payment initiation domain does.
* What happens when a user makes a payment.
* What checks occur before payment order creation.

### 4.2 Architects

Need to understand:

* Domain boundaries.
* BIAN Control Record and Behavior Qualifier structure.
* How endpoints map to business capabilities.

### 4.3 Engineers

Need to understand:

* API paths.
* Request and response schemas.
* Path parameters.
* Reusable components.
* Error response models.

---

## 5. Core Conceptual Model

The visual model should be based on this structure:

```text
PaymentInitiationTransaction
├── FundingCheck
├── Compliance
└── OrderInitiation
```

### 5.1 Main Control Record

The main Control Record is:

```text
PaymentInitiationTransaction
```

It represents the payment instruction. It includes payer, payee, amount, currency, payment mechanism, payment purpose, recurring payment details, and supporting document fields.

### 5.2 Behavior Qualifiers

The supporting Behavior Qualifiers are:

| Behavior Qualifier | Purpose                                                                     |
| ------------------ | --------------------------------------------------------------------------- |
| `FundingCheck`     | Checks whether the payment can be funded                                    |
| `Compliance`       | Captures compliance check type, result, and task result                     |
| `OrderInitiation`  | Represents initiation or tracking of the downstream payment order procedure |

---

## 6. Information Architecture

The app should have three synchronized exploration surfaces.

```text
┌──────────────────────┬──────────────────────────────────────┬──────────────────────┐
│ Left Nav             │ Main Visual Canvas                    │ Right Detail Panel   │
│                      │                                      │                      │
│ Modes                │ Payment Journey Diagram               │ Overview             │
│ Operations           │ Clickable Nodes                       │ Operations           │
│ Schemas              │ Highlighted Relationships             │ Schema Fields        │
│ Search               │ Animated Flow                         │ Examples             │
└──────────────────────┴──────────────────────────────────────┴──────────────────────┘
```

---

## 7. Main Screen Layout

### 7.1 Left Navigation Panel

The left panel should include:

#### Mode Switcher

* Business Mode
* API Mode
* Schema Mode

#### Operation List

Group operations by domain object.

```text
PaymentInitiationTransaction
- POST Initiate
- PUT Update
- GET Retrieve

Compliance
- GET RetrieveCompliance

FundingCheck
- GET RetrieveFundingCheck

OrderInitiation
- GET RetrieveOrderInitiation
```

#### Schema Tree

Show major schemas:

```text
Core
- PaymentInitiationTransaction
- FundingCheck
- Compliance
- OrderInitiation

Requests
- InitiatePaymentInitiationTransactionRequest
- UpdatePaymentInitiationTransactionRequest

Responses
- InitiatePaymentInitiationTransactionResponse
- UpdatePaymentInitiationTransactionResponse
- RetrievePaymentInitiationTransactionResponse
- RetrieveComplianceResponse
- RetrieveFundingCheckResponse
- RetrieveOrderInitiationResponse

Errors
- HTTPError
```

---

### 7.2 Main Visual Canvas

The central canvas should show the payment journey.

```text
[User]
   |
   v
[Channel / Banking App]
   |
   | POST /PaymentInitiation/Initiate
   v
+------------------------------------------------+
|        PaymentInitiationTransaction             |
|------------------------------------------------|
| Parties | Payment Details | Recurring | Docs   |
+------------------------------------------------+
      |                 |                    |
      v                 v                    v
+-------------+   +-------------+   +------------------+
| FundingCheck|   | Compliance  |   | OrderInitiation  |
+-------------+   +-------------+   +------------------+
                                          |
                                          v
                          [Downstream Payment Processing]
```

### 7.3 Right Detail Panel

The right panel should update based on the selected visual node, endpoint, or schema.

Tabs:

1. **Overview**
2. **Operations**
3. **Schema**
4. **Relationships**
5. **Example JSON**

---

## 8. Interaction Requirements

### 8.1 Clickable Visual Nodes

Each main visual node should be clickable.

Required nodes:

| Node                         | Behaviour                                                 |
| ---------------------------- | --------------------------------------------------------- |
| User                         | Shows customer action context                             |
| Channel / App                | Shows how payment details are submitted                   |
| PaymentInitiationTransaction | Shows main CR details, fields, endpoints                  |
| FundingCheck                 | Shows funding check schema and retrieve endpoint          |
| Compliance                   | Shows compliance schema and retrieve endpoint             |
| OrderInitiation              | Shows order initiation schema and retrieve endpoint       |
| Downstream Processing        | Explains that this is outside the Payment Initiation spec |

---

### 8.2 Dual Highlighting

When a user selects an item, the app should highlight related elements across all views.

Example:

When user clicks `Compliance`:

* Highlight the `Compliance` visual node.
* Highlight the endpoint:

```http
GET /PaymentInitiation/{paymentinitiationId}/Compliance/{complianceId}/Retrieve
```

* Highlight related schemas:

  * `Compliance`
  * `RetrieveComplianceResponse`
  * `RetrieveComplianceResponse_Compliance`
  * `RetrieveComplianceResponse_PaymentInitiationTransaction`

---

### 8.3 Reverse Navigation

The user should also be able to click from the left navigation and have the canvas update.

Examples:

| User Action                              | Expected Result                                                         |
| ---------------------------------------- | ----------------------------------------------------------------------- |
| Click `POST /PaymentInitiation/Initiate` | Highlight `PaymentInitiationTransaction` and the incoming journey arrow |
| Click `RetrieveFundingCheck`             | Highlight `FundingCheck`                                                |
| Click `OrderInitiation` schema           | Highlight `OrderInitiation` node                                        |
| Click `HTTPError`                        | Show reusable error model, no journey node highlight required           |

---

### 8.4 Progressive Disclosure

Do not display all fields by default.

Use this depth model:

#### Level 1 — Conceptual

Plain English explanation.

Example:

> FundingCheck checks whether the payer has sufficient funds for the payment.

#### Level 2 — API

Show endpoint, method, operation ID, parameters, request body, response body.

#### Level 3 — Schema

Show fields, types, related schemas, and examples.

---

## 9. Modes

### 9.1 Business Mode

Audience: product, process, executive.

Show:

* Business-friendly labels.
* Plain English explanations.
* Minimal endpoint detail.
* Flow animation.
* Field groups instead of raw schema names.

Hide:

* `$ref`
* raw schema object names unless expanded
* HTTP response details unless selected

---

### 9.2 API Mode

Audience: architects and engineers.

Show:

* HTTP methods.
* Endpoint paths.
* Operation IDs.
* Path parameters.
* Request bodies.
* Response bodies.
* Error responses.

---

### 9.3 Schema Mode

Audience: engineers, data modellers, API designers.

Show:

* Schema names.
* Field names.
* Field types.
* Schema references.
* Request/response schema differences.
* Field usage across operations.

---

## 10. Visual Node Specifications

## 10.1 User Node

### Label

```text
Customer / User
```

### Description

The customer starts the journey by entering payment details.

### Fields to Display

This node does not map directly to a schema. Instead, show user-supplied concepts:

* payer
* payee
* amount
* currency
* payment date
* purpose
* recurring payment intent
* supporting documents

### Connected To

```text
Channel / Banking App
```

---

## 10.2 Channel / App Node

### Label

```text
Channel / Banking App
```

### Description

Represents the front-end or API client that submits the payment initiation request.

### Primary Operation

```http
POST /PaymentInitiation/Initiate
```

### Connected To

```text
PaymentInitiationTransaction
```

---

## 10.3 PaymentInitiationTransaction Node

### Label

```text
PaymentInitiationTransaction
```

### BIAN Role

```text
Control Record
```

### Description

The main payment initiation record. It captures the instruction details required to initiate and manage a payment.

### Related Operations

```http
POST /PaymentInitiation/Initiate
PUT /PaymentInitiation/{paymentinitiationId}/Update
GET /PaymentInitiation/{paymentinitiationId}/Retrieve
```

### Field Groups

#### Parties

* `CustomerReference`
* `PayerReference`
* `PayerBankReference`
* `PayerProductInstanceReference`
* `PayeeReference`
* `PayeeBankReference`
* `PayeeProductInstanceReference`

#### Payment Details

* `PaymentTransactionType`
* `PaymentTransaction`
* `Amount`
* `Currency`
* `DateType`
* `Date`
* `PaymentFeesOrCharges`
* `PaymentMechanism`
* `PaymentPurpose`

#### Recurring / Scheduled Payments

* `RecurringPaymentRecord`
* `RecurringPaymentCustomerReference`
* `RecurringPaymentReference`

#### Documents

* `DocumentDirectoryEntryInstanceReference`
* `DocumentContent`

---

## 10.4 FundingCheck Node

### Label

```text
FundingCheck
```

### BIAN Role

```text
Behavior Qualifier
```

### Description

Represents the funds availability check for the payment.

### Related Operation

```http
GET /PaymentInitiation/{paymentinitiationId}/FundingCheck/{fundingcheckId}/Retrieve
```

### Schema Fields

* `PaymentTransactionFundingCheckResult`

### Connected To

```text
PaymentInitiationTransaction
```

---

## 10.5 Compliance Node

### Label

```text
Compliance
```

### BIAN Role

```text
Behavior Qualifier
```

### Description

Represents compliance checking for the payment transaction.

### Related Operation

```http
GET /PaymentInitiation/{paymentinitiationId}/Compliance/{complianceId}/Retrieve
```

### Schema Fields

* `PaymentTransactionComplianceCheckType`
* `PaymentTransactionComplianceCheckResult`
* `PaymentTransactionComplianceTaskResult`

### Connected To

```text
PaymentInitiationTransaction
```

---

## 10.6 OrderInitiation Node

### Label

```text
OrderInitiation
```

### BIAN Role

```text
Behavior Qualifier
```

### Description

Represents the hand-off into the payment order procedure.

### Related Operation

```http
GET /PaymentInitiation/{paymentinitiationId}/OrderInitiation/{orderinitiationId}/Retrieve
```

### Schema Fields

* `PaymentOrderProcedureInstanceReference`
* `PaymentOrderProcedureInstanceStatus`
* `OrderInitiationTaskResult`

### Connected To

```text
PaymentInitiationTransaction
Downstream Payment Processing
```

---

## 11. Endpoint Mapping

The app should parse and display the following operations.

| Operation                 | Method | Path                                                                                    | Visual Node                    |
| ------------------------- | -----: | --------------------------------------------------------------------------------------- | ------------------------------ |
| `Initiate`                | `POST` | `/PaymentInitiation/Initiate`                                                           | `PaymentInitiationTransaction` |
| `Update`                  |  `PUT` | `/PaymentInitiation/{paymentinitiationId}/Update`                                       | `PaymentInitiationTransaction` |
| `Retrieve`                |  `GET` | `/PaymentInitiation/{paymentinitiationId}/Retrieve`                                     | `PaymentInitiationTransaction` |
| `RetrieveCompliance`      |  `GET` | `/PaymentInitiation/{paymentinitiationId}/Compliance/{complianceId}/Retrieve`           | `Compliance`                   |
| `RetrieveFundingCheck`    |  `GET` | `/PaymentInitiation/{paymentinitiationId}/FundingCheck/{fundingcheckId}/Retrieve`       | `FundingCheck`                 |
| `RetrieveOrderInitiation` |  `GET` | `/PaymentInitiation/{paymentinitiationId}/OrderInitiation/{orderinitiationId}/Retrieve` | `OrderInitiation`              |

---

## 12. Data Model for the App

Use a normalized internal model rather than binding the UI directly to raw OpenAPI JSON.

### 12.1 Visual Node Model

```ts
type VisualNode = {
  id: string;
  label: string;
  type: "actor" | "channel" | "control-record" | "behavior-qualifier" | "external";
  description: string;
  relatedOperationIds: string[];
  relatedSchemaNames: string[];
  fieldGroups?: FieldGroup[];
};
```

### 12.2 Field Group Model

```ts
type FieldGroup = {
  id: string;
  label: string;
  fields: string[];
};
```

### 12.3 Operation Model

```ts
type ApiOperation = {
  id: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  summary?: string;
  description?: string;
  tags: string[];
  parameters: ApiParameter[];
  requestBodySchema?: string;
  responseSchemas: Record<string, string>;
  relatedNodeId: string;
};
```

### 12.4 Schema Model

```ts
type ApiSchema = {
  name: string;
  type: string;
  properties: ApiField[];
  relatedNodeIds: string[];
};
```

### 12.5 Field Model

```ts
type ApiField = {
  name: string;
  type: string;
  ref?: string;
  description?: string;
  required?: boolean;
  usedInSchemas: string[];
};
```

### 12.6 Selection State

```ts
type ExplorerSelection = {
  selectedNodeId?: string;
  selectedOperationId?: string;
  selectedSchemaName?: string;
  selectedFieldName?: string;
  mode: "business" | "api" | "schema";
};
```

---

## 13. OpenAPI Parsing Requirements

### 13.1 Required Parser Behaviour

The parser should:

1. Load the OpenAPI JSON file.
2. Extract `info`.
3. Extract `servers`.
4. Extract all `paths`.
5. Extract operations under each path.
6. Extract:

   * method
   * path
   * operation ID
   * tags
   * summary
   * description
   * parameters
   * request body schema reference
   * response schema references
7. Extract `components.schemas`.
8. Extract `components.responses`.
9. Extract `components.parameters`.
10. Extract `components.requestBodies`.
11. Resolve local `$ref` values where practical.

### 13.2 Reference Handling

The app should support local references such as:

```json
"$ref": "#/components/schemas/InitiatePaymentInitiationTransactionRequest"
```

The resolver should convert these into clickable links inside the UI.

### 13.3 Required Derived Mappings

The parser should derive:

```ts
nodeToOperations
operationToSchemas
schemaToNodes
schemaToFields
fieldToSchemas
```

---

## 14. Manual Domain Mapping

Because the OpenAPI spec does not explicitly describe the visual journey, create a domain mapping file.

Example:

```ts
export const paymentInitiationDomainMap = {
  nodes: [
    {
      id: "user",
      label: "Customer / User",
      type: "actor",
      relatedOperationIds: [],
      relatedSchemaNames: []
    },
    {
      id: "channel",
      label: "Channel / Banking App",
      type: "channel",
      relatedOperationIds: ["Initiate"],
      relatedSchemaNames: ["InitiatePaymentInitiationTransactionRequest"]
    },
    {
      id: "paymentInitiationTransaction",
      label: "PaymentInitiationTransaction",
      type: "control-record",
      relatedOperationIds: ["Initiate", "Update", "Retrieve"],
      relatedSchemaNames: [
        "PaymentInitiationTransaction",
        "InitiatePaymentInitiationTransactionRequest",
        "InitiatePaymentInitiationTransactionResponse",
        "UpdatePaymentInitiationTransactionRequest",
        "UpdatePaymentInitiationTransactionResponse",
        "RetrievePaymentInitiationTransactionResponse"
      ]
    },
    {
      id: "fundingCheck",
      label: "FundingCheck",
      type: "behavior-qualifier",
      relatedOperationIds: ["RetrieveFundingCheck"],
      relatedSchemaNames: [
        "FundingCheck",
        "RetrieveFundingCheckResponse",
        "RetrieveFundingCheckResponse_FundingCheck",
        "RetrieveFundingCheckResponse_PaymentInitiationTransaction"
      ]
    },
    {
      id: "compliance",
      label: "Compliance",
      type: "behavior-qualifier",
      relatedOperationIds: ["RetrieveCompliance"],
      relatedSchemaNames: [
        "Compliance",
        "RetrieveComplianceResponse",
        "RetrieveComplianceResponse_Compliance",
        "RetrieveComplianceResponse_PaymentInitiationTransaction"
      ]
    },
    {
      id: "orderInitiation",
      label: "OrderInitiation",
      type: "behavior-qualifier",
      relatedOperationIds: ["RetrieveOrderInitiation"],
      relatedSchemaNames: [
        "OrderInitiation",
        "RetrieveOrderInitiationResponse",
        "RetrieveOrderInitiationResponse_OrderInitiation",
        "RetrieveOrderInitiationResponse_PaymentInitiationTransaction"
      ]
    }
  ]
};
```

This mapping should be deliberately isolated so future BIAN domains can have their own visual map.

---

## 15. Component Architecture

### 15.1 Recommended Front-End Stack

Use:

* React
* TypeScript
* Vite
* React Flow or equivalent for diagram rendering
* Tailwind CSS for styling
* Zustand or React context for explorer state

### 15.2 Component Tree

```text
App
├── SpecProvider
├── ExplorerLayout
│   ├── LeftNavigation
│   │   ├── ModeSwitcher
│   │   ├── OperationList
│   │   ├── SchemaTree
│   │   └── SearchBox
│   ├── JourneyCanvas
│   │   ├── PaymentJourneyGraph
│   │   ├── JourneyNode
│   │   ├── JourneyEdge
│   │   └── FlowAnimationLayer
│   └── DetailPanel
│       ├── OverviewTab
│       ├── OperationsTab
│       ├── SchemaTab
│       ├── RelationshipsTab
│       └── ExampleJsonTab
└── RawSpecModal
```

---

## 16. Key Components

### 16.1 `ExplorerLayout`

Responsible for arranging the page.

Requirements:

* Three-column layout on desktop.
* Collapsible side panels.
* Responsive stacked layout on mobile.
* Main canvas remains the focal point.

---

### 16.2 `ModeSwitcher`

Allows users to switch between:

```text
Business
API
Schema
```

Changing mode should update:

* node labels
* detail panel emphasis
* visible metadata
* default selected tab

---

### 16.3 `JourneyCanvas`

Responsible for rendering the visual journey.

Requirements:

* Display all primary nodes.
* Support node click.
* Support edge highlighting.
* Support selected state.
* Support related state.
* Support inactive/muted state.
* Support zoom/pan if using a graph library.

---

### 16.4 `JourneyNode`

Each node should support:

* title
* subtitle
* role badge
* method badges
* selected state
* related state
* warning/info badge where useful

Example badges:

```text
CR
BQ
POST
GET
PUT
```

---

### 16.5 `DetailPanel`

The detail panel updates based on current selection.

Required tabs:

#### Overview

Shows plain English explanation.

#### Operations

Shows related endpoints.

Each operation card should include:

* method
* path
* operation ID
* summary
* description
* parameters
* request body
* response schemas

#### Schema

Shows related schema fields.

Fields should show:

* field name
* type
* referenced schema if applicable
* usage context

#### Relationships

Shows:

* parent node
* child nodes
* related operations
* related schemas

#### Example JSON

Shows generated example payloads.

---

## 17. Example Payload Generation

The app should generate simple example JSON from schemas.

### 17.1 String Fields

For fields of type `string`, generate:

```json
"FieldName": "string"
```

### 17.2 Object Fields

For fields of type `object`, generate:

```json
"FieldName": {}
```

### 17.3 `$ref` Fields

For referenced schemas, recursively generate a simple object.

### 17.4 Example

For `FundingCheck`:

```json
{
  "PaymentTransactionFundingCheckResult": "string"
}
```

### 17.5 Friendly Example Layer

Later enhancement: add realistic sample values, but clearly mark them as illustrative because the source spec does not define enums or validation values.

---

## 18. Search Requirements

Add a search box that can find:

* node labels
* endpoint paths
* operation IDs
* schema names
* field names

Search result examples:

```text
Amount
Found in:
- PaymentInitiationTransaction
- InitiatePaymentInitiationTransactionRequest_PaymentInitiationTransaction
- UpdatePaymentInitiationTransactionRequest_PaymentInitiationTransaction
```

Clicking a result should:

* select the related item
* update the detail panel
* highlight the related visual node

---

## 19. Visual Design Guidelines

The implementation must support externally supplied visual design guidelines.

The developer should not hardcode final colours, typography, spacing, iconography, or brand treatment into core logic. Instead, visual styling should be isolated into theme/config files so design guidelines can be applied or replaced without changing explorer behaviour.

### 19.1 Design Config Requirements

Create a design configuration layer that can control:

* colour tokens
* typography tokens
* spacing tokens
* border radius
* shadows/elevation
* node styles
* edge styles
* badge styles
* selected/highlight states
* muted/inactive states
* animation timing
* panel layout density

### 19.2 Required Theme Token Structure

Use a theme file similar to:

```ts
export const explorerTheme = {
  colors: {
    background: "",
    surface: "",
    surfaceAlt: "",
    border: "",
    textPrimary: "",
    textSecondary: "",
    accent: "",
    controlRecord: "",
    behaviorQualifier: "",
    actor: "",
    channel: "",
    external: "",
    success: "",
    warning: "",
    error: "",
    selected: "",
    related: "",
    muted: ""
  },
  typography: {
    fontFamily: "",
    headingWeight: "",
    bodyWeight: "",
    monoFontFamily: ""
  },
  spacing: {
    xs: "",
    sm: "",
    md: "",
    lg: "",
    xl: ""
  },
  radius: {
    sm: "",
    md: "",
    lg: "",
    xl: ""
  },
  animation: {
    fast: "",
    normal: "",
    slow: "",
    pulseDuration: ""
  }
};
```

### 19.3 Design Separation Rule

The implementation should separate:

```text
Explorer behaviour
from
visual presentation
```

For example:

* node selection logic belongs in explorer state
* node colour belongs in theme/config
* relationship highlighting logic belongs in data mapping
* highlight appearance belongs in theme/config

### 19.4 Placeholder Styling

Until final visual guidelines are provided, use minimal neutral styling only.

Avoid:

* overdesigned colours
* brand-specific assumptions
* heavy gradients
* hardcoded visual identity
* dense visual clutter

---

## 20. Animation Requirements

Animation should be useful, not flashy.

### 20.1 Payment Flow Animation

On “Play Journey”:

1. Pulse starts at `Customer / User`.
2. Moves to `Channel / Banking App`.
3. Moves to `PaymentInitiationTransaction`.
4. Branches to `FundingCheck`.
5. Branches to `Compliance`.
6. If both pass, moves to `OrderInitiation`.
7. Ends at `Downstream Payment Processing`.

### 20.2 Scenario Toggles

Support simple scenarios:

| Scenario          | Behaviour                           |
| ----------------- | ----------------------------------- |
| One-off payment   | Highlights core payment fields      |
| Scheduled payment | Highlights date fields              |
| Recurring payment | Highlights recurring payment fields |
| Compliance review | Highlights Compliance branch        |
| Funding issue     | Highlights FundingCheck branch      |

Do not invent backend rules. These are visual learning scenarios only.

---

## 21. Error Handling UX

The spec defines standard error responses using a reusable `HTTPError` schema.

The app should include an error response section in API Mode.

For each operation, show common error responses:

* `400 Bad Request`
* `401 Unauthorized`
* `403 Forbidden`
* `404 Not Found`
* `429 Too Many Requests`
* `500 Internal Server Error`

Each should link to the `HTTPError` schema.

---

## 22. Implementation Phases

## Phase 1 — Static Explorer

Build the core UI using a local copy of the OpenAPI JSON.

Scope:

* Load spec.
* Render journey diagram.
* Render left nav.
* Render detail panel.
* Click nodes to update details.
* Show operation mappings.
* Show schema fields.

No animation yet.

---

## Phase 2 — Linked Exploration

Add synchronized highlighting.

Scope:

* Click operation → highlight node.
* Click schema → highlight node.
* Click field → show where used.
* Add relationship tab.
* Add search.

---

## Phase 3 — Example Payloads

Add generated examples.

Scope:

* Generate request examples.
* Generate response examples.
* Resolve local `$ref`.
* Toggle friendly/raw JSON view.

---

## Phase 4 — Modes

Add mode-specific views.

Scope:

* Business Mode.
* API Mode.
* Schema Mode.
* Mode-specific labels and detail defaults.

---

## Phase 5 — Animation and Scenarios

Add guided learning.

Scope:

* Play payment journey.
* Scenario selector.
* Animated pulse.
* Branch highlighting.
* Status chips.

---

## 23. Acceptance Criteria

### 23.1 Core Journey

The app must show the visual journey:

```text
Customer / User
→ Channel / Banking App
→ PaymentInitiationTransaction
→ FundingCheck / Compliance
→ OrderInitiation
→ Downstream Payment Processing
```

### 23.2 Node Selection

Clicking `PaymentInitiationTransaction` must show:

* business explanation
* related operations
* grouped fields
* related schemas

### 23.3 BQ Selection

Clicking `FundingCheck`, `Compliance`, or `OrderInitiation` must show:

* business explanation
* retrieve endpoint
* schema fields
* parent relationship to `PaymentInitiationTransaction`

### 23.4 Endpoint Selection

Clicking an endpoint must:

* show method and path
* show operation ID
* show request schema if present
* show response schemas
* highlight the corresponding node

### 23.5 Schema Selection

Clicking a schema must:

* show schema properties
* show field types
* show related node
* show related operations where possible

### 23.6 Example Payloads

The app must generate simple JSON examples for:

* initiate request
* initiate response
* update request
* retrieve payment initiation response
* retrieve compliance response
* retrieve funding check response
* retrieve order initiation response

### 23.7 Error Responses

The app must display standard error responses and link them to `HTTPError`.

### 23.8 Theme Config

The app must allow visual styling to be changed through a central theme/config layer without rewriting parser, state, or domain mapping logic.

---

## 24. Suggested File Structure

```text
src/
├── app/
│   ├── App.tsx
│   └── ExplorerLayout.tsx
├── data/
│   ├── bian-payment-initiation-openapi.json
│   └── paymentInitiationDomainMap.ts
├── parser/
│   ├── parseOpenApi.ts
│   ├── resolveRefs.ts
│   ├── buildOperationMap.ts
│   ├── buildSchemaMap.ts
│   └── generateExampleJson.ts
├── state/
│   └── explorerStore.ts
├── theme/
│   ├── explorerTheme.ts
│   └── themeTypes.ts
├── components/
│   ├── navigation/
│   │   ├── LeftNavigation.tsx
│   │   ├── ModeSwitcher.tsx
│   │   ├── OperationList.tsx
│   │   ├── SchemaTree.tsx
│   │   └── SearchBox.tsx
│   ├── canvas/
│   │   ├── JourneyCanvas.tsx
│   │   ├── JourneyNode.tsx
│   │   ├── JourneyEdge.tsx
│   │   └── FlowAnimationLayer.tsx
│   └── detail/
│       ├── DetailPanel.tsx
│       ├── OverviewTab.tsx
│       ├── OperationsTab.tsx
│       ├── SchemaTab.tsx
│       ├── RelationshipsTab.tsx
│       └── ExampleJsonTab.tsx
├── types/
│   ├── openapi.ts
│   ├── explorer.ts
│   └── domainMap.ts
└── utils/
    ├── formatMethod.ts
    ├── formatSchemaName.ts
    └── groupFields.ts
```

---

## 25. Engineering Principles

Use these as build guardrails:

* Keep the OpenAPI parser separate from the UI.
* Keep the BIAN domain mapping separate from parser logic.
* Keep visual design tokens separate from behavioural logic.
* Do not hardcode schema fields inside React components.
* Use typed models for operations, schemas, fields, visual nodes, and theme config.
* Keep visual state centralized.
* Prefer small components with one job.
* Make future BIAN domains pluggable by swapping:

  * OpenAPI file
  * domain map
  * field grouping config
  * visual theme config

---

## 26. Future Enhancements

Potential later improvements:

* Upload any BIAN OpenAPI spec and generate a first-pass visual explorer.
* Add AI-generated business descriptions for unknown schemas.
* Compare two BIAN specs side by side.
* Export diagram as PNG/SVG.
* Export selected node documentation as Markdown.
* Add mock API request runner.
* Add validation warnings for weak schemas, missing enums, or missing required fields.
* Generate implementation backlog from selected endpoints.

---

## 27. Summary

Build this as a **visual OpenAPI explorer** where the payment journey is the primary interface.

The main mental model should be:

```text
One payment instruction record
with three supporting child processes:
funding check,
compliance check,
and order initiation.
```

The design must remain configurable. The user will provide final visual design guidelines separately, so the implementation must isolate visual styling into a replaceable theme/config layer.

The core product should be:

```text
A journey-first, clickable, synchronized explorer for the BIAN Payment Initiation OpenAPI spec.
```

```
```
