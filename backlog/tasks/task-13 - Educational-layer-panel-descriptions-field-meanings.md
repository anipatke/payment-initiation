---
id: TASK-13
title: 'Educational layer — panel descriptions and field plain-English meanings'
status: To Do
assignee: []
created_date: '2026-05-04'
labels: [content, ui]
dependencies: [TASK-12]
---

## Description

Add educational content to every panel so a banker or product person can understand what each section does and what each field means, without reading the BIAN spec.

### Panel-level descriptions

Each CR/BQ panel header area gets a `description` blurb rendered below the title and above the field list. Style: Space Mono, text-xs, text/50, normal case (not uppercase). 2–3 sentences max.

Examples (to use from TASK-11 data):
- **CR**: "The Control Record holds the full payment instruction. It orchestrates the transaction lifecycle by delegating checks and execution to its Behaviour Qualifiers. Every payment starts here."
- **Compliance BQ**: "Runs regulatory checks — sanctions screening, AML, and payment purpose validation — before the payment is cleared to proceed. A rejection here halts the entire transaction."
- **FundingCheck BQ**: "Verifies the payer's account has sufficient funds to cover the payment amount and any applicable fees. Returns a simple pass/fail result."
- **OrderInitiation BQ**: "Converts the validated payment instruction into a live payment order and dispatches it to the payment network. Returns a procedure reference for tracking."

Render location: inside each panel's header div, below the apiPath line, always visible (not inside the drawer). Small, muted — doesn't compete with the title.

### Field-level meanings

Each field row in the drawer (expanded state) gets a third line: `meaning` in italics, text-[10px], text/30.

Example field row:
```
CheckType                    string
PaymentTransactionComplianceCheckType
The type of compliance check performed, e.g. sanctions screening or AML.
```

Pull `meaning` from `field.meaning` (populated in TASK-11 flowData).

### BIAN terminology glossary chip

Small inline chip next to "CR" and "BQ" badges explaining the acronym on first render only (or always, muted):
- `CR` → tooltip/popover: "Control Record — the root entity of this BIAN Service Domain"
- `BQ` → tooltip/popover: "Behaviour Qualifier — a sub-function delegated by the Control Record"

Implementation: simple `title` attribute on the badge span for native tooltip. No custom tooltip component needed.

### Service Domain header description

Below the page title `PAYMENT INITIATION EXPLORER`, below the `BIAN Service Domain v10.0.0` subtitle, add a third line with the service domain description from the JSON `info.description`:
> "This service domain provides a customer payment service. It captures the payer and payee details and other key properties of the payment and orchestrates the transaction. It provides support for repeating/scheduled payments."

Style: Space Mono, text-xs, text/40, normal case, max-w-2xl.

### Files to update
- `src/components/CommandCenter.jsx` — service domain description in header
- `src/components/CRPanel.jsx` — description blurb + field meaning line
- `src/components/BQPanel.jsx` — description blurb + field meaning line
