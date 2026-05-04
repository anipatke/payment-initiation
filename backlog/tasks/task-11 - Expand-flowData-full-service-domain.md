---
id: TASK-11
title: 'Expand flowData.js to full service domain'
status: To Do
assignee: []
created_date: '2026-05-04'
labels: [data]
dependencies: []
---

## Description

Replace the current curated 8-field flowData.js with a complete service domain data model covering all 6 BIAN endpoints, all schema fields, and rich metadata for educational rendering and API map display.

### Requirements

**Node structure — each node must have:**
- `id`, `label`, `role` (existing)
- `description` — 2–3 sentence plain-English explanation of what this CR/BQ does (banker audience, no jargon). Research BIAN spec meaning, not just the JSON description.
- `apiPath` → rename to `primaryPath` (the Initiate/main endpoint shown in the pulse)
- `operations` array — one entry per endpoint for this node:
  ```js
  {
    operationId: 'Initiate',          // BIAN verb
    method: 'POST',                    // HTTP method
    path: '/PaymentInitiation/Initiate',
    summary: 'Initiate a payment transaction',  // human-readable
    requestFields: [...],              // field list for request body
    responseFields: [...],             // field list for response body
    mockRequest: { ... },              // realistic mock JSON
    mockResponse: { ... },             // realistic mock JSON
  }
  ```
- `fields` — COMPLETE list from JSON schema (not curated subset), each field:
  ```js
  { name: 'PaymentTransactionComplianceCheckType', shortLabel: 'Check Type', type: 'string', meaning: 'The type of compliance check performed, e.g. sanctions screening or AML.' }
  ```
- `schemaExcerpt` — full schema JSON for "Under the Hood" (existing)
- `successPayload`, `failurePayload` (existing, expand to full field set)

**CR node — PaymentInitiationTransaction:**
- Operations: Initiate (POST), Update (PUT), Retrieve (GET)
- Full fields from `PaymentInitiationTransaction` schema (20 fields): PaymentTransactionType, RecurringPaymentRecord, RecurringPaymentCustomerReference, RecurringPaymentReference, CustomerReference, PaymentTransaction, PayerReference, PayerBankReference, PayerProductInstanceReference, PayeeReference, PayeeBankReference, PayeeProductInstanceReference, Amount, Currency, DateType, Date, PaymentFeesOrCharges, PaymentMechanism, PaymentPurpose, DocumentDirectoryEntryInstanceReference, DocumentContent
- shortLabels: TransactionType, RecurringRecord, RecurringCustomerRef, RecurringRef, CustomerRef, Transaction, PayerRef, PayerBankRef, PayerAccountRef, PayeeRef, PayeeBankRef, PayeeAccountRef, Amount, Currency, DateType, Date, FeesOrCharges, Mechanism, Purpose, DocumentRef, DocumentContent
- Plain-English meanings for each field

**BQ nodes — Compliance, FundingCheck, OrderInitiation:**
- Operations: Retrieve (GET) only — path already in JSON
- Full fields from respective schemas
- shortLabels and meanings

**Mock data — make realistic:**
- Use UK banking context (GBP, SWIFT, sort codes)
- Compliance: SANCTIONS_SCREENING check
- FundingCheck: FUNDS_AVAILABLE result
- OrderInitiation: ORDER-REF-2024-XXXXX reference

**Failure payloads:**
- Compliance: FAILED — Sanctions screening hit, HALTED status
- Others: null (no failure scenario in current scope)

### Output
Updated `src/data/flowData.js` only. No component changes in this task.
