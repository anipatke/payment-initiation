# PRD: BIAN Payment Initiation Interactive Explorer (v10.0.0)

## 1. Executive Summary

The **BIAN Payment Initiation (PI) Explorer** is an interactive educational widget that transforms the BIAN Service Domain OpenAPI 3.0 spec into a clickable visual Command Center. Non-technical and technical stakeholders explore the Control Record (CR) and Behavioral Qualifier (BQ) architecture through real-world bank examples.

Source spec: `BIAN-3-PaymentInitiation-10.0.0-resolved.json`

---

## 2. Product Objectives

- **Visualize the Model:** Dynamic connected map of the Service Domain.
- **Educational Drill-down:** Click into CR and BQs to understand roles and data.
- **Interaction Mapping:** Demonstrate payment lifecycle from Intake → Validation → Handoff.

---

## 3. Stack

- React + Vite, Tailwind CSS, Framer Motion
- No backend — all data static in `src/data/flowData.js`
- Deployed as standalone Vercel project, linked from Learning Ledger blog post

---

## 4. Layout: Command Center Grid

### 4.1 Desktop

```
┌─────────────────────────────────────────┐
│  CR — PaymentInitiationTransaction      │  full-width top panel
│  POST /PaymentInitiation/Initiate       │
└─────────────────────────────────────────┘
┌─────────────┐ ┌─────────────┐ ┌─────────────────┐
│  Compliance │ │ FundingCheck│ │ OrderInitiation │  3-col grid
└─────────────┘ └─────────────┘ └─────────────────┘
```

- CR earns full-width top panel (19 fields vs 1–3 per BQ)
- BQs in equal-width 3-column grid below
- Click any panel → inline expansion (Framer `AnimatePresence`, expands downward)

### 4.2 Mobile (`< lg`)

All 4 panels stack vertically. Same inline expansion behavior. No radial layout.

---

## 5. Functional Requirements

### 5.1 Click-to-Explore (Data Drawer)

- Every panel (CR + 3 BQs) clickable
- Click → inline expansion below panel showing real fields from `flowData.js`
- Click again → collapses
- Only one panel open at a time

### 5.2 Lifecycle Simulation ("Run Lifecycle" button)

Fire-and-forget pulse sequence. Reset button appears after completion.

| Step | Event | Visual |
|------|-------|--------|
| 1 | App → POST `/Initiate` | CR panel glows, activates |
| 2 | CR → Compliance + FundingCheck | Both BQ panels flicker simultaneously |
| 3 | Satellites → CR | Results return, panels settle to active state |
| 4 | CR → OrderInitiation | Handoff pulse, OrderInitiation activates |

**Failure mode:** Toggle `Simulate Compliance Failure` before running. Step 2 shows Compliance reject (red state), sequence stops. FundingCheck and OrderInitiation never activate. Shows educational value of the BQ gate.

### 5.3 Schema Inspector

Toggle per panel: "Under the Hood" — shows curated JSON excerpt. Hardcoded in `flowData.js`, not dynamically parsed from spec. 5–8 fields per component, chosen for educational value.

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
| Heading font | `Chakra Petch` |
| Body/UI font | `Space Mono` |

- Headings uppercase, tracked
- Glow treatment: panels lit from within using green accent with transparency
- Scanline overlay: subtle CRT layer over whole widget
- Pulse animation easing: "system booting up" — no bouncy motion
- Hover: internal light / underglow, not outline decoration

---

## 7. Data Architecture

All mock data in `src/data/flowData.js`. Structure per node:

```js
{
  id: 'cr' | 'compliance' | 'fundingCheck' | 'orderInitiation',
  label: string,
  role: string,           // one-line description
  apiPath: string,        // e.g. POST /PaymentInitiation/Initiate
  fields: [               // displayed in data drawer
    { name: string, value: string, type: string }
  ],
  schemaExcerpt: string,  // raw JSON string for schema inspector
  successPayload: object, // mock GET response
  failurePayload: object, // mock failure (Compliance only)
}
```

### Field selections from spec

**CR (PaymentInitiationTransaction):** PayerReference, PayerBankReference, PayeeReference, Amount, Currency, PaymentMechanism, PaymentPurpose, DateType

**Compliance BQ:** PaymentTransactionComplianceCheckType, PaymentTransactionComplianceCheckResult, PaymentTransactionComplianceTaskResult

**FundingCheck BQ:** PaymentTransactionFundingCheckResult

**OrderInitiation BQ:** PaymentOrderProcedureInstanceReference, PaymentOrderProcedureInstanceStatus, OrderInitiationTaskResult

---

## 8. Component Structure

```
src/
  data/
    flowData.js           # all static mock data
  components/
    CommandCenter.jsx     # root layout (grid)
    CRPanel.jsx           # top full-width CR panel
    BQPanel.jsx           # reusable BQ satellite card
    DataDrawer.jsx        # inline expansion content
    SchemaInspector.jsx   # JSON excerpt toggle
    PulseControls.jsx     # Run Lifecycle / Reset / failure toggle
    ConnectionLine.jsx    # animated connector between panels
    ScanlineOverlay.jsx   # CRT effect layer
  hooks/
    useLifecycle.js       # pulse sequence state machine
  App.jsx
```

---

## 9. Success Metrics

- Users identify the 3 BQ checks without reading PDF docs
- Non-tech stakeholders use CR/BQ/Service Domain terminology correctly after use

---

## 10. Out of Scope (v1)

- Pause/skip during lifecycle animation
- Dynamic JSON parsing from spec at runtime
- Multiple failure modes (only Compliance failure in v1)
- iFrame embed / Web Component packaging
- Search or filter
