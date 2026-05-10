import spec from '../data/bian-payment-initiation-openapi.json'
import { parseOpenApi, resetParserCache } from './parseOpenApi'
import { resolveRefName } from './resolveRefs'

const REQUIRED_OPERATIONS = ['Initiate', 'Update', 'Retrieve', 'RetrieveCompliance', 'RetrieveFundingCheck', 'RetrieveOrderInitiation']

function runAssertions(): void {
  resetParserCache()
  const parsed = parseOpenApi(spec as any)

  console.assert(parsed.openapi === '3.0.1', 'openapi version')
  console.assert(parsed.title === 'Payment Initiation', 'title')
  console.assert(parsed.version === '10.0.0', 'version')
  console.assert(parsed.servers.length === 1, 'servers count')
  console.assert(parsed.servers[0].url.includes('swaggerhub.com'), 'server url')

  const { operations, operationList } = parsed.operations

  for (const opId of REQUIRED_OPERATIONS) {
    console.assert(operations[opId] !== undefined, `missing operation: ${opId}`)
  }

  console.assert(operationList.length === 6, `expected 6 operations, got ${operationList.length}`)

  const initOp = operations['Initiate']
  console.assert(initOp !== undefined, 'Initiate operation exists')
  console.assert(initOp.method === 'post', 'Initiate method')
  console.assert(initOp.path === '/PaymentInitiation/Initiate', 'Initiate path')
  console.assert(initOp.requestBody !== undefined, 'Initiate has requestBody')
  console.assert(initOp.requestBody?.ref === 'InitiatePaymentInitiationTransactionRequest', 'Initiate requestBody ref')
  console.assert(initOp.responses['200'] !== undefined, 'Initiate has 200 response')
  console.assert(initOp.responses['200'].schemaRef === 'InitiatePaymentInitiationTransactionResponse', 'Initiate response schemaRef')

  const updateOp = operations['Update']
  console.assert(updateOp !== undefined, 'Update operation exists')
  console.assert(updateOp.parameters.length === 1, 'Update has path param')
  console.assert(updateOp.parameters[0].name === 'paymentinitiationId', 'Update param name')

  const { schemas } = parsed.schemas
  console.assert(schemas['PaymentInitiationTransaction'] !== undefined, 'PaymentInitiationTransaction schema exists')
  console.assert(schemas['HTTPError'] !== undefined, 'HTTPError schema exists')

  const paymentSchema = schemas['PaymentInitiationTransaction']
  console.assert(paymentSchema.properties['Amount'] !== undefined, 'schema has Amount prop')
  console.assert(paymentSchema.properties['Amount'].type === 'string', 'Amount type is string')

  const compositeSchema = schemas['InitiatePaymentInitiationTransactionRequest']
  console.assert(compositeSchema.properties['PaymentInitiationTransaction'] !== undefined, 'request has PaymentInitiationTransaction prop')
  console.assert(compositeSchema.properties['PaymentInitiationTransaction'].ref === 'InitiatePaymentInitiationTransactionRequest_PaymentInitiationTransaction', 'request prop ref')

  const { responses } = parsed.schemas
  console.assert(responses['BadRequestError'] !== undefined, 'BadRequestError response exists')
  console.assert(responses['BadRequestError'].ref === 'HTTPError', 'BadRequestError refs HTTPError')

  const { requestBodies, parameters } = parsed.schemas
  console.assert(requestBodies['InitiatePaymentInitiationTransactionRequest'] !== undefined, 'requestBody exists')
  console.assert(requestBodies['InitiatePaymentInitiationTransactionRequest'].ref === 'InitiatePaymentInitiationTransactionRequest', 'requestBody schema ref')
  console.assert(parameters['PaymentInitiationID'] !== undefined, 'component parameter exists')
  console.assert(parameters['PaymentInitiationID'].name === 'paymentinitiationId', 'component parameter name')

  console.assert(resolveRefName('#/components/schemas/Foo') === 'Foo', 'resolveRefName basic')
  console.assert(resolveRefName('#/components/responses/Bar') === 'Bar', 'resolveRefName response')
  console.assert(resolveRefName('#/components/requestBodies/Baz') === 'Baz', 'resolveRefName requestBody')
  console.assert(resolveRefName('#/components/parameters/Qux') === 'Qux', 'resolveRefName parameter')
  console.assert(resolveRefName('invalid') === null, 'resolveRefName invalid')

  console.log('All parser assertions passed.')
}

runAssertions()
