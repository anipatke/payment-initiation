# PRD: BIAN Payment Initiation Interactive Explorer (v10.0.0)

## 1. Executive Summary

The **BIAN Payment Initiation (PI) Explorer** is an interactive educational tool that transforms the full BIAN Service Domain OpenAPI 3.0 spec into an explorable visual interface. Banker and product audiences understand the Control Record (CR) and Behaviour Qualifier (BQ) architecture — what each section does, what data flows through it, and how the API endpoints link together — without reading the BIAN PDF spec.

Source spec: `BIAN-3-PaymentInitiation-10.0.0-resolved.json`

---

## 2. Product Objectives

- **Full Service Domain Coverage:** All 6 endpoints, all schema fields — not just the Initiate flow.
- **Consumability over Accuracy:** Shortened field labels, plain-English descriptions. `PaymentTransactionComplianceCheckType` → `Check Type`.
- **Educational Drill-down:** Each panel explains what this CR/BQ does, what each field means, and why it exists.
- **Lifecycle Simulation:** Animate the Initiate flow with live JSON payloads visible at each step.
- **API Map:** Visual listing of all endpoints showing how data paths in and out of the service domain.

---

## 3. Stack

- React + Vite, Tailwind CSS, Framer Motion
- No backend — all data static in `src/data/flowData.js`
- Deployed as standalone Vercel project, linked from Learning Ledger blog post

---

## 4. Layout

### 4.1 Desktop (`lg+`)

```
Page title: PAYMENT INITIATION EXPLORER
Subtitle:   BIAN Service Domain v10.0.0
Description: "This service domain provides a customer payment service..."

[PulseControls — full width: Run Lifecycle | Reset | Simulate Compliance Failure]

┌──────────────────┬──────────────────────────────────────┐
│  CR Panel        │  Compliance BQ                       │
│  w-1/3           │  FundingCheck BQ                     │
│  sticky top-8    │  OrderInitiation BQ                  │
│  self-start      │  (stacked, gap-4)                    │
└──────────────────┴──────────────────────────────────────┘

── API ENDPOINTS ────────────────────────────────────────
  CR   [POST] /PaymentInitiation/Initiate
       [PUT]  /PaymentInitiation/{id}/Update
       [GET]  /PaymentInitiation/{id}/Retrieve
  BQ   [GET]  /PaymentInitiation/{id}/Compliance/{id}/Retrieve
       [GET]  /PaymentInitiation/{id}/FundingCheck/{id}/Retrieve
       [GET]  /PaymentInitiation/{id}/OrderInitiation/{id}/Retrieve

[Footer: Learning Ledger — anipatke.com]
```

### 4.2 Mobile (`< lg`)

Vertical stack: CR → Compliance BQ → FundingCheck BQ → OrderInitiation BQ → API Endpoints section. Same inline expansion. No radial or grid layout.

---

## 5. Functional Requirements

### 5.1 Panel Cards (CR + 3 BQs)

Every panel always shows:
- Badge: `CR` or `BQ` (with `title` tooltip: "Control Record" / "Behaviour Qualifier")
- Node name (shortened label, e.g. `Compliance`)
- Primary API path
- 2–3 sentence plain-English description of what this section does

Click → inline expansion (AnimatePresence, expand downward):
- Full field list — shortLabel + full BIAN name (muted, smaller) + plain-English meaning
- "Under the Hood" toggle → full JSON schema excerpt
- Click again → collapses. Only one panel open at a time.

During lifecycle animation (while `isActive`):
- Live payload block visible in panel header (no click needed)
- Shows `→ REQUEST` or `← RESPONSE` label + formatted JSON
- Max height capped, scrollable

### 5.2 Lifecycle Simulation

Fire-and-forget pulse sequence. Reset button appears on completion.

| Step | Event | Visual | Payload shown |
|------|-------|--------|---------------|
| 1 | Client → POST `/Initiate` | CR glows green, flicker animation | CR shows REQUEST |
| 2 | CR → Compliance + FundingCheck | Both BQ panels flicker (parallel) | Each shows REQUEST |
| 3 | Satellites → CR | Results return, panels settle | Both BQs show RESPONSE |
| 4 | CR → OrderInitiation | Handoff, OrderInitiation activates | Shows REQUEST then RESPONSE |

**Failure mode:** Toggle `Simulate Compliance Failure`. Step 2 shows Compliance in red (failure payload), sequence halts. FundingCheck and OrderInitiation never activate. Live payload shows the rejection response.

**Reset:** All glow states clear, all live payloads clear, panels return to idle.

### 5.3 API Endpoints Map

Section below the panels. All 6 endpoints grouped by CR / BQ.

Each endpoint row:
- Method badge: `POST` (accent green) / `PUT` (orange) / `GET` (muted)
- Full path
- One-line summary
- Click → expands inline: REQUEST body schema + RESPONSE body schema side-by-side (or stacked mobile)
- During lifecycle: active group's endpoints pulse with left-border glow. Primary endpoint (Initiate) highlighted; others in group dimmed.

### 5.4 Educational Content

**Service domain header:** Description from spec `info.description` shown below page subtitle.

**Panel descriptions (examples):**
- CR: "The Control Record holds the full payment instruction. It orchestrates the lifecycle by delegating checks and execution to its Behaviour Qualifiers. Every payment starts here."
- Compliance: "Runs regulatory checks — sanctions screening and AML — before the payment is cleared to proceed. A rejection here halts the entire transaction."
- FundingCheck: "Verifies the payer's account has sufficient funds to cover the payment amount and applicable fees."
- OrderInitiation: "Converts the validated payment instruction into a live payment order and dispatches it to the payment network."

**Field rows in drawer:**
```
Check Type                         string
PaymentTransactionComplianceCheckType
The type of compliance check performed, e.g. sanctions screening or AML.
```

---

## 6. Design

Follows `design.md` — Atari-Noir system.

| Token | Value |
|-------|-------|
| Background | `#121212` |
| Surface | `#0D0D0D` |
| Border | `#1A1A1A` |
| Primary Text | `#F0E6DA` |
| Accent (Learning Ledger) | `#A4C639` NPP Green |
| Error/Failure | `#EF4444` red |
| Heading font | `Chakra Petch` |
| Body/UI font | `Space Mono` |

- Headings uppercase, tracked
- Glow: panels lit from within, green accent with transparency; red on failure
- Scanline overlay: subtle CRT layer over whole page
- Pulse easing: "system booting up" — no bouncy motion
- Method badges: colored border + text, fixed width

---

## 7. Data Architecture

All data in `src/data/flowData.js`. No runtime JSON parsing.

### Node structure

```js
{
  id: 'cr' | 'compliance' | 'fundingCheck' | 'orderInitiation',
  label: string,               // e.g. 'PaymentInitiationTransaction'
  role: string,                // 'Control Record' | 'Behaviour Qualifier'
  description: string,         // plain-English 2–3 sentence blurb (banker audience)
  primaryPath: string,         // main endpoint for lifecycle pulse display
  operations: [
    {
      operationId: string,     // BIAN verb: 'Initiate' | 'Update' | 'Retrieve' etc.
      method: 'POST' | 'PUT' | 'GET',
      path: string,
      summary: string,         // one-line human-readable description
      mockRequest: object | null,
      mockResponse: object,
    }
  ],
  fields: [
    {
      name: string,            // full BIAN field name
      shortLabel: string,      // shortened display label
      type: string,            // 'string' | 'object'
      meaning: string,         // plain-English explanation of this field
    }
  ],
  schemaExcerpt: string,       // full JSON schema string for "Under the Hood"
  successPayload: object,
  failurePayload: object | null,
}
```

### Field counts (full schema)

| Node | Fields | Operations |
|------|--------|------------|
| CR — PaymentInitiationTransaction | 20 | 3 (Initiate POST, Update PUT, Retrieve GET) |
| BQ — Compliance | 3 | 1 (Retrieve GET) |
| BQ — FundingCheck | 1 | 1 (Retrieve GET) |
| BQ — OrderInitiation | 3 | 1 (Retrieve GET) |

---

## 8. Component Structure

```
src/
  data/
    flowData.js               # all static data — full service domain
  components/
    CommandCenter.jsx         # two-column layout orchestrator
    CRPanel.jsx               # sticky-left CR panel
    BQPanel.jsx               # reusable BQ card (stacked right)
    LivePayloadBlock.jsx      # REQUEST/RESPONSE JSON shown during animation
    EndpointsMap.jsx          # all 6 endpoints, method badges, expandable schema
    PulseControls.jsx         # Run Lifecycle / Reset / failure toggle
    ScanlineOverlay.jsx       # CRT effect layer
  hooks/
    useLifecycle.js           # pulse sequence + livePayloads state machine
  App.jsx
```

**Removed:** `ConnectionLine.jsx` (not rendered — panel glow states carry the animation signal), `DataDrawer.jsx`, `SchemaInspector.jsx` (logic folded into panel components).

---

## 9. Success Metrics

- Banker can name what Compliance BQ does without reading BIAN docs
- User understands CR/BQ/Service Domain terminology after one run of lifecycle
- All 6 API endpoints visible and explorable without external tooling

---

## 10. Out of Scope

- Pause/skip during lifecycle animation
- Dynamic JSON parsing from spec at runtime
- Multiple failure modes beyond Compliance failure
- iFrame embed / Web Component packaging
- Search or filter across fields
- Multiple Service Domains (single domain: Payment Initiation only)
