---
id: TASK-2
title: 'Build flowData.js: all static mock data for CR and 3 BQs'
status: Done
assignee: []
created_date: '2026-05-04 09:33'
updated_date: '2026-05-04 09:45'
labels: []
dependencies: []
ordinal: 2000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Create src/data/flowData.js with all static mock data. Read PRD.md section 7 and CLAUDE.md for field selections. Read BIAN-3-PaymentInitiation-10.0.0-resolved.json for exact field names.\n\nRequirements:\n- Export a single array of 4 node objects with shape defined in PRD.md section 7\n- Nodes: cr, compliance, fundingCheck, orderInitiation\n- Each node has: id, label, role, apiPath, fields[], schemaExcerpt (raw JSON string), successPayload, failurePayload\n- CR fields (8): PayerReference, PayerBankReference, PayeeReference, Amount, Currency, PaymentMechanism, PaymentPurpose, DateType\n- Compliance fields (3): PaymentTransactionComplianceCheckType, PaymentTransactionComplianceCheckResult, PaymentTransactionComplianceTaskResult\n- FundingCheck fields (1): PaymentTransactionFundingCheckResult\n- OrderInitiation fields (3): PaymentOrderProcedureInstanceReference, PaymentOrderProcedureInstanceStatus, OrderInitiationTaskResult\n- successPayload: realistic mock values (e.g. Amount: 'GBP 2500.00', PaymentMechanism: 'SWIFT')\n- failurePayload on compliance only: PaymentTransactionComplianceCheckResult: 'FAILED - Sanctions screening hit'\n- schemaExcerpt: copy relevant properties block from BIAN-3-PaymentInitiation-10.0.0-resolved.json as formatted JSON string\n- No runtime imports of the JSON file — all data hardcoded
<!-- SECTION:DESCRIPTION:END -->
