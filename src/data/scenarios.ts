export type ScenarioId =
  | 'one-off'
  | 'scheduled'
  | 'recurring'
  | 'compliance-review'
  | 'funding-issue'

export interface Scenario {
  id: ScenarioId
  label: string
  description: string
  highlightedNodeIds: string[]
  highlightedEdgeKeys: string[]
  highlightedFields: string[]
}

export const SCENARIOS: Scenario[] = [
  {
    id: 'one-off',
    label: 'One-Off Payment',
    description: 'A single immediate payment from payer to payee.',
    highlightedNodeIds: ['user', 'channel', 'paymentInitiationTransaction', 'fundingCheck', 'orderInitiation', 'downstream'],
    highlightedEdgeKeys: [
      'user-channel',
      'channel-paymentInitiationTransaction',
      'paymentInitiationTransaction-fundingCheck',
      'fundingCheck-orderInitiation',
      'orderInitiation-downstream',
    ],
    highlightedFields: [
      'PayerReference',
      'PayerBankReference',
      'PayerProductInstanceReference',
      'PayeeReference',
      'PayeeBankReference',
      'PayeeProductInstanceReference',
      'Amount',
      'Currency',
      'PaymentTransactionType',
      'PaymentTransaction',
      'PaymentMechanism',
      'PaymentPurpose',
    ],
  },
  {
    id: 'scheduled',
    label: 'Scheduled Payment',
    description: 'A payment set to execute on a future date.',
    highlightedNodeIds: ['user', 'channel', 'paymentInitiationTransaction', 'orderInitiation', 'downstream'],
    highlightedEdgeKeys: [
      'user-channel',
      'channel-paymentInitiationTransaction',
      'orderInitiation-downstream',
    ],
    highlightedFields: [
      'DateType',
      'Date',
      'PaymentTransactionType',
      'Amount',
      'Currency',
      'PayerReference',
      'PayeeReference',
    ],
  },
  {
    id: 'recurring',
    label: 'Recurring Payment',
    description: 'A repeating payment on a defined schedule.',
    highlightedNodeIds: ['user', 'channel', 'paymentInitiationTransaction', 'orderInitiation', 'downstream'],
    highlightedEdgeKeys: [
      'user-channel',
      'channel-paymentInitiationTransaction',
      'orderInitiation-downstream',
    ],
    highlightedFields: [
      'RecurringPaymentRecord',
      'RecurringPaymentCustomerReference',
      'RecurringPaymentReference',
      'recurringPaymentIntent',
      'DateType',
      'Date',
    ],
  },
  {
    id: 'compliance-review',
    label: 'Compliance Review',
    description: 'Payment flagged for compliance screening before proceeding.',
    highlightedNodeIds: ['paymentInitiationTransaction', 'compliance', 'orderInitiation'],
    highlightedEdgeKeys: [
      'paymentInitiationTransaction-compliance',
      'compliance-orderInitiation',
    ],
    highlightedFields: [
      'PaymentTransactionComplianceCheckType',
      'PaymentTransactionComplianceCheckResult',
      'PaymentTransactionComplianceTaskResult',
    ],
  },
  {
    id: 'funding-issue',
    label: 'Funding Issue',
    description: 'Payment blocked due to insufficient funds.',
    highlightedNodeIds: ['paymentInitiationTransaction', 'fundingCheck', 'orderInitiation'],
    highlightedEdgeKeys: [
      'paymentInitiationTransaction-fundingCheck',
      'fundingCheck-orderInitiation',
    ],
    highlightedFields: [
      'PaymentTransactionFundingCheckResult',
    ],
  },
]

export function getScenario(id: ScenarioId): Scenario {
  const found = SCENARIOS.find((s) => s.id === id)
  if (!found) throw new Error(`Unknown scenario: ${id}`)
  return found
}
