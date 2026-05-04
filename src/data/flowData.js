export const flowData = [
  {
    id: 'cr',
    label: 'PaymentInitiationTransaction',
    role: 'Control Record',
    apiPath: 'POST /PaymentInitiation/Initiate',
    fields: [
      { name: 'PayerReference', type: 'object' },
      { name: 'PayerBankReference', type: 'object' },
      { name: 'PayeeReference', type: 'object' },
      { name: 'Amount', type: 'string' },
      { name: 'Currency', type: 'string' },
      { name: 'PaymentMechanism', type: 'string' },
      { name: 'PaymentPurpose', type: 'string' },
      { name: 'DateType', type: 'string' },
    ],
    schemaExcerpt: `{
  "properties": {
    "PayerReference": { "type": "object" },
    "PayerBankReference": { "type": "object" },
    "PayeeReference": { "type": "object" },
    "Amount": { "type": "string" },
    "Currency": { "type": "string" },
    "PaymentMechanism": { "type": "string" },
    "PaymentPurpose": { "type": "string" },
    "DateType": { "type": "string" }
  }
}`,
    successPayload: {
      PayerReference: 'PAYER-UK-00483',
      PayerBankReference: 'BANK-SORT-203040',
      PayeeReference: 'PAYEE-DE-00192',
      Amount: 'GBP 2500.00',
      Currency: 'GBP',
      PaymentMechanism: 'SWIFT',
      PaymentPurpose: 'TRADE_SETTLEMENT',
      DateType: 'IMMEDIATE',
    },
    failurePayload: null,
  },
  {
    id: 'compliance',
    label: 'Compliance',
    role: 'Behaviour Qualifier',
    apiPath: 'POST /PaymentInitiation/{crReferenceId}/Compliance/Initiate',
    fields: [
      { name: 'PaymentTransactionComplianceCheckType', type: 'string' },
      { name: 'PaymentTransactionComplianceCheckResult', type: 'string' },
      { name: 'PaymentTransactionComplianceTaskResult', type: 'string' },
    ],
    schemaExcerpt: `{
  "properties": {
    "PaymentTransactionComplianceCheckType": { "type": "string" },
    "PaymentTransactionComplianceCheckResult": { "type": "string" },
    "PaymentTransactionComplianceTaskResult": { "type": "string" }
  }
}`,
    successPayload: {
      PaymentTransactionComplianceCheckType: 'SANCTIONS_SCREENING',
      PaymentTransactionComplianceCheckResult: 'PASSED',
      PaymentTransactionComplianceTaskResult: 'COMPLETED',
    },
    failurePayload: {
      PaymentTransactionComplianceCheckType: 'SANCTIONS_SCREENING',
      PaymentTransactionComplianceCheckResult: 'FAILED - Sanctions screening hit',
      PaymentTransactionComplianceTaskResult: 'HALTED',
    },
  },
  {
    id: 'fundingCheck',
    label: 'FundingCheck',
    role: 'Behaviour Qualifier',
    apiPath: 'POST /PaymentInitiation/{crReferenceId}/FundingCheck/Initiate',
    fields: [
      { name: 'PaymentTransactionFundingCheckResult', type: 'string' },
    ],
    schemaExcerpt: `{
  "properties": {
    "PaymentTransactionFundingCheckResult": { "type": "string" }
  }
}`,
    successPayload: {
      PaymentTransactionFundingCheckResult: 'FUNDS_AVAILABLE',
    },
    failurePayload: null,
  },
  {
    id: 'orderInitiation',
    label: 'OrderInitiation',
    role: 'Behaviour Qualifier',
    apiPath: 'POST /PaymentInitiation/{crReferenceId}/OrderInitiation/Initiate',
    fields: [
      { name: 'PaymentOrderProcedureInstanceReference', type: 'object' },
      { name: 'PaymentOrderProcedureInstanceStatus', type: 'string' },
      { name: 'OrderInitiationTaskResult', type: 'string' },
    ],
    schemaExcerpt: `{
  "properties": {
    "PaymentOrderProcedureInstanceReference": { "type": "object" },
    "PaymentOrderProcedureInstanceStatus": { "type": "string" },
    "OrderInitiationTaskResult": { "type": "string" }
  }
}`,
    successPayload: {
      PaymentOrderProcedureInstanceReference: 'ORDER-REF-2024-88721',
      PaymentOrderProcedureInstanceStatus: 'ACTIVE',
      OrderInitiationTaskResult: 'COMPLETED',
    },
    failurePayload: null,
  },
];
