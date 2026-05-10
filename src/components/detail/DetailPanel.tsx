import { useMemo } from 'react'
import type { ExplorerTab } from '../../types/explorer'
import { useExplorer } from '../../state/explorerStore'
import { useSpec } from '../../app/SpecProvider'
import { buildFieldUsageIndex } from '../../parser/buildSchemaMap'
import { MODE_TAB_LABELS } from '../../utils/modeDisplay'
import { OverviewTab } from './OverviewTab'
import { OperationsTab } from './OperationsTab'
import { SchemaTab } from './SchemaTab'
import { RelationshipsTab } from './RelationshipsTab'
import { ExampleJsonTab, type ExampleSection } from './ExampleJsonTab'
import { SCENARIOS } from '../../data/scenarios'
import type { ScenarioId } from '../../data/scenarios'

const TAB_IDS: ExplorerTab[] = ['overview', 'operations', 'schema', 'relationships', 'examples']

export function DetailPanel() {
  const { state, actions } = useExplorer()
  const { parsedSpec, domainMap, relationshipIndexes, examples } = useSpec()

  const nodeId = state.selection.nodeId
  const node = nodeId ? domainMap.nodes.find((n) => n.id === nodeId) : undefined

  const operationIds = nodeId ? (relationshipIndexes.nodeToOperations[nodeId] ?? []) : []
  const operations = operationIds
    .map((id) => parsedSpec.operations.operations[id])
    .filter(Boolean)

  const schemaNames = useMemo(() => {
    const names = node?.relatedSchemaNames ?? []
    const selectedSchemaName = state.selection.schemaName
    if (
      selectedSchemaName &&
      parsedSpec.schemas.schemas[selectedSchemaName] &&
      !names.includes(selectedSchemaName)
    ) {
      return [...names, selectedSchemaName]
    }
    return names
  }, [node?.relatedSchemaNames, parsedSpec.schemas.schemas, state.selection.schemaName])

  const schemas = schemaNames
    .map((name) => parsedSpec.schemas.schemas[name])
    .filter(Boolean)

  const fieldUsageIndex = useMemo(
    () => buildFieldUsageIndex(parsedSpec.schemas.schemas),
    [parsedSpec.schemas.schemas],
  )

  const selectedOp = useMemo(
    () =>
      state.selection.path && state.selection.method
        ? operations.find(
            (op) => op.path === state.selection.path && op.method === state.selection.method,
          )
        : undefined,
    [operations, state.selection.path, state.selection.method],
  )

  const exampleSections = useMemo<ExampleSection[]>(() => {
    if (selectedOp) {
      const sections: ExampleSection[] = []
      if (selectedOp.requestBody?.ref) {
        sections.push({
          label: 'Request Body',
          schemaName: selectedOp.requestBody.ref,
          role: 'request',
        })
      }
      for (const [code, response] of Object.entries(selectedOp.responses)) {
        if (response.schemaRef && code.startsWith('2')) {
          sections.push({
            label: `${code} Response`,
            schemaName: response.schemaRef,
            role: 'response',
          })
        }
      }
      return sections
    }
    return schemaNames.map((name) => ({
      label: name,
      schemaName: name,
      role: 'schema' as const,
    }))
  }, [selectedOp, schemaNames])

  const relatedFields = state.selection.schemaName
    ? Object.keys(parsedSpec.schemas.schemas[state.selection.schemaName]?.properties ?? {})
    : []

  const highlightedFields = useMemo<Set<string> | undefined>(() => {
    if (!state.activeScenarioId) return undefined
    const scenario = SCENARIOS.find((s) => s.id === (state.activeScenarioId as ScenarioId))
    return scenario ? new Set(scenario.highlightedFields) : undefined
  }, [state.activeScenarioId])

  return (
    <div className="flex flex-col h-full">
      <div className="flex border-b border-border shrink-0">
        {TAB_IDS.map((tabId) => (
          <button
            key={tabId}
            onClick={() => actions.setActiveTab(tabId)}
            className={[
              'flex-1 px-1 py-2 font-mono text-[10px] uppercase tracking-wider transition-colors',
              state.activeTab === tabId
                ? 'text-text border-b border-text'
                : 'text-text/30 hover:text-text/60',
            ].join(' ')}
          >
            {MODE_TAB_LABELS[state.mode][tabId]}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {!node ? (
          <p className="font-body text-xs text-text/30">Select a node on the canvas.</p>
        ) : (
          <>
            {state.activeTab === 'overview' && <OverviewTab node={node} />}
            {state.activeTab === 'operations' && (
              <OperationsTab
                operations={operations}
                selectedPath={state.selection.path}
                selectedMethod={state.selection.method}
                mode={state.mode}
                onSelect={(path, method) => actions.selectOperation(path, method, nodeId)}
                onSelectSchema={(schemaName) => {
                  actions.selectSchema(schemaName, nodeId)
                  actions.setActiveTab('schema')
                }}
              />
            )}
            {state.activeTab === 'schema' && (
              <SchemaTab
                schemas={schemas}
                selectedSchemaName={state.selection.schemaName}
                onSelect={(schemaName) => actions.selectSchema(schemaName, nodeId)}
                selectedFieldName={state.selection.fieldName}
                onSelectField={(fieldName) => actions.selectField(fieldName)}
                fieldUsageIndex={fieldUsageIndex}
                highlightedFields={highlightedFields}
              />
            )}
            {state.activeTab === 'relationships' && (
              <RelationshipsTab
                node={node}
                edges={domainMap.edges}
                allNodes={domainMap.nodes}
                operationIds={operationIds}
                schemaNames={schemaNames}
                relatedFields={relatedFields}
              />
            )}
            {state.activeTab === 'examples' && (
              <ExampleJsonTab
                sections={exampleSections}
                examples={examples}
                schemas={parsedSpec.schemas.schemas}
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}
