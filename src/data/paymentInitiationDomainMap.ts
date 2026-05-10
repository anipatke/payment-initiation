import type { DomainMap } from '../types/domainMap'

export const paymentInitiationDomainMap: DomainMap = {
  nodes: [
    {
      id: 'user',
      label: 'Customer / User',
      type: 'actor',
      description: 'The customer starts the journey by entering payment details.',
      relatedOperationIds: [],
      relatedSchemaNames: [],
      fieldGroups: [
        {
          id: 'user-intent',
          label: 'Payment Intent',
          fields: [
            'payer',
            'payee',
            'amount',
            'currency',
            'paymentDate',
            'purpose',
            'recurringPaymentIntent',
            'supportingDocuments',
          ],
        },
      ],
    },
    {
      id: 'channel',
      label: 'Channel / Banking App',
      type: 'channel',
      description:
        'Represents the front-end or API client that submits the payment initiation request.',
      relatedOperationIds: ['Initiate'],
      relatedSchemaNames: ['InitiatePaymentInitiationTransactionRequest'],
    },
    {
      id: 'paymentInitiationTransaction',
      label: 'PaymentInitiationTransaction',
      type: 'control-record',
      description:
        'The main payment initiation record. It captures the instruction details required to initiate and manage a payment.',
      relatedOperationIds: ['Initiate', 'Update', 'Retrieve'],
      relatedSchemaNames: [
        'PaymentInitiationTransaction',
        'InitiatePaymentInitiationTransactionRequest',
        'InitiatePaymentInitiationTransactionRequest_PaymentInitiationTransaction',
        'InitiatePaymentInitiationTransactionResponse',
        'UpdatePaymentInitiationTransactionRequest',
        'UpdatePaymentInitiationTransactionRequest_PaymentInitiationTransaction',
        'UpdatePaymentInitiationTransactionResponse',
        'RetrievePaymentInitiationTransactionResponse',
      ],
      fieldGroups: [
        {
          id: 'parties',
          label: 'Parties',
          fields: [
            'CustomerReference',
            'PayerReference',
            'PayerBankReference',
            'PayerProductInstanceReference',
            'PayeeReference',
            'PayeeBankReference',
            'PayeeProductInstanceReference',
          ],
        },
        {
          id: 'payment-details',
          label: 'Payment Details',
          fields: [
            'PaymentTransactionType',
            'PaymentTransaction',
            'Amount',
            'Currency',
            'DateType',
            'Date',
            'PaymentFeesOrCharges',
            'PaymentMechanism',
            'PaymentPurpose',
          ],
        },
        {
          id: 'recurring',
          label: 'Recurring / Scheduled Payments',
          fields: [
            'RecurringPaymentRecord',
            'RecurringPaymentCustomerReference',
            'RecurringPaymentReference',
          ],
        },
        {
          id: 'documents',
          label: 'Documents',
          fields: ['DocumentDirectoryEntryInstanceReference', 'DocumentContent'],
        },
      ],
    },
    {
      id: 'fundingCheck',
      label: 'FundingCheck',
      type: 'behavior-qualifier',
      description: 'Represents the funds availability check for the payment.',
      relatedOperationIds: ['RetrieveFundingCheck'],
      relatedSchemaNames: [
        'FundingCheck',
        'RetrieveFundingCheckResponse',
        'RetrieveFundingCheckResponse_FundingCheck',
        'RetrieveFundingCheckResponse_PaymentInitiationTransaction',
      ],
      fieldGroups: [
        {
          id: 'funding-fields',
          label: 'Funding Check Fields',
          fields: ['PaymentTransactionFundingCheckResult'],
        },
      ],
    },
    {
      id: 'compliance',
      label: 'Compliance',
      type: 'behavior-qualifier',
      description: 'Represents compliance checking for the payment transaction.',
      relatedOperationIds: ['RetrieveCompliance'],
      relatedSchemaNames: [
        'Compliance',
        'RetrieveComplianceResponse',
        'RetrieveComplianceResponse_Compliance',
        'RetrieveComplianceResponse_PaymentInitiationTransaction',
      ],
      fieldGroups: [
        {
          id: 'compliance-fields',
          label: 'Compliance Fields',
          fields: [
            'PaymentTransactionComplianceCheckType',
            'PaymentTransactionComplianceCheckResult',
            'PaymentTransactionComplianceTaskResult',
          ],
        },
      ],
    },
    {
      id: 'orderInitiation',
      label: 'OrderInitiation',
      type: 'behavior-qualifier',
      description: 'Represents the hand-off into the payment order procedure.',
      relatedOperationIds: ['RetrieveOrderInitiation'],
      relatedSchemaNames: [
        'OrderInitiation',
        'RetrieveOrderInitiationResponse',
        'RetrieveOrderInitiationResponse_OrderInitiation',
        'RetrieveOrderInitiationResponse_PaymentInitiationTransaction',
      ],
      fieldGroups: [
        {
          id: 'order-fields',
          label: 'Order Initiation Fields',
          fields: [
            'PaymentOrderProcedureInstanceReference',
            'PaymentOrderProcedureInstanceStatus',
            'OrderInitiationTaskResult',
          ],
        },
      ],
    },
    {
      id: 'downstream',
      label: 'Downstream Payment Processing',
      type: 'external',
      description:
        'Downstream payment processing is outside the Payment Initiation service domain.',
      relatedOperationIds: [],
      relatedSchemaNames: [],
    },
  ],
  edges: [
    { source: 'user', target: 'channel' },
    { source: 'channel', target: 'paymentInitiationTransaction', label: 'POST /PaymentInitiation/Initiate' },
    { source: 'paymentInitiationTransaction', target: 'fundingCheck' },
    { source: 'paymentInitiationTransaction', target: 'compliance' },
    { source: 'fundingCheck', target: 'orderInitiation' },
    { source: 'compliance', target: 'orderInitiation' },
    { source: 'orderInitiation', target: 'downstream' },
  ],
}
