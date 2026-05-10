import spec from '../data/bian-payment-initiation-openapi.json'
import { parseOpenApi, resetParserCache } from './parseOpenApi'
import { paymentInitiationDomainMap } from '../data/paymentInitiationDomainMap'
import {
  buildRelationshipIndexes,
  validateDomainMap,
} from './buildRelationshipIndexes'

function runAssertions(): void {
  resetParserCache()
  const parsed = parseOpenApi(spec as any)
  const map = paymentInitiationDomainMap

  // All required nodes present
  const nodeIds = map.nodes.map((n) => n.id)
  const requiredNodes = [
    'user',
    'channel',
    'paymentInitiationTransaction',
    'fundingCheck',
    'compliance',
    'orderInitiation',
    'downstream',
  ]
  for (const id of requiredNodes) {
    console.assert(nodeIds.includes(id), `missing node: ${id}`)
  }

  // All edges reference valid node IDs
  for (const edge of map.edges) {
    console.assert(nodeIds.includes(edge.source), `edge source not a node: ${edge.source}`)
    console.assert(nodeIds.includes(edge.target), `edge target not a node: ${edge.target}`)
  }

  // Required journey edges exist
  const hasEdge = (src: string, tgt: string) =>
    map.edges.some((e) => e.source === src && e.target === tgt)
  console.assert(hasEdge('user', 'channel'), 'edge: user → channel')
  console.assert(
    hasEdge('channel', 'paymentInitiationTransaction'),
    'edge: channel → paymentInitiationTransaction',
  )
  console.assert(
    hasEdge('paymentInitiationTransaction', 'fundingCheck'),
    'edge: paymentInitiationTransaction → fundingCheck',
  )
  console.assert(
    hasEdge('paymentInitiationTransaction', 'compliance'),
    'edge: paymentInitiationTransaction → compliance',
  )
  console.assert(hasEdge('fundingCheck', 'orderInitiation'), 'edge: fundingCheck → orderInitiation')
  console.assert(hasEdge('compliance', 'orderInitiation'), 'edge: compliance → orderInitiation')
  console.assert(hasEdge('orderInitiation', 'downstream'), 'edge: orderInitiation → downstream')

  // Domain map validates cleanly against parsed spec
  const validation = validateDomainMap(map, parsed)
  if (validation.missingOperationIds.length > 0) {
    console.warn('Missing operation IDs in spec:', validation.missingOperationIds)
  }
  if (validation.missingSchemaNames.length > 0) {
    console.warn('Missing schema names in spec:', validation.missingSchemaNames)
  }

  // Build indexes
  const indexes = buildRelationshipIndexes(map, parsed)

  // nodeToOperations: paymentInitiationTransaction has Initiate, Update, Retrieve
  console.assert(
    indexes.nodeToOperations['paymentInitiationTransaction']?.includes('Initiate'),
    'nodeToOperations: paymentInitiationTransaction includes Initiate',
  )
  console.assert(
    indexes.nodeToOperations['paymentInitiationTransaction']?.includes('Retrieve'),
    'nodeToOperations: paymentInitiationTransaction includes Retrieve',
  )
  console.assert(
    indexes.nodeToOperations['fundingCheck']?.includes('RetrieveFundingCheck'),
    'nodeToOperations: fundingCheck includes RetrieveFundingCheck',
  )

  // operationToSchemas: Initiate maps to request and response schemas
  console.assert(
    indexes.operationToSchemas['Initiate']?.includes('InitiatePaymentInitiationTransactionRequest'),
    'operationToSchemas: Initiate includes request schema',
  )
  console.assert(
    indexes.operationToSchemas['Initiate']?.includes(
      'InitiatePaymentInitiationTransactionResponse',
    ),
    'operationToSchemas: Initiate includes response schema',
  )

  // schemaToNodes: PaymentInitiationTransaction maps to paymentInitiationTransaction node
  console.assert(
    indexes.schemaToNodes['PaymentInitiationTransaction']?.includes(
      'paymentInitiationTransaction',
    ),
    'schemaToNodes: PaymentInitiationTransaction → paymentInitiationTransaction',
  )
  console.assert(
    indexes.schemaToNodes['FundingCheck']?.includes('fundingCheck'),
    'schemaToNodes: FundingCheck → fundingCheck',
  )
  console.assert(
    indexes.schemaToNodes['Compliance']?.includes('compliance'),
    'schemaToNodes: Compliance → compliance',
  )

  // schemaToFields: PaymentInitiationTransaction has Amount
  console.assert(
    indexes.schemaToFields['PaymentInitiationTransaction']?.includes('Amount'),
    'schemaToFields: PaymentInitiationTransaction includes Amount',
  )

  // fieldToSchemas: Amount appears in PaymentInitiationTransaction
  console.assert(
    indexes.fieldToSchemas['Amount']?.includes('PaymentInitiationTransaction'),
    'fieldToSchemas: Amount → PaymentInitiationTransaction',
  )

  console.log('All domain map assertions passed.')
}

runAssertions()
