import { useSpec } from '../../app/SpecProvider'
import { useExplorer } from '../../state/explorerStore'

const GROUP_NODE_IDS = [
  'paymentInitiationTransaction',
  'compliance',
  'fundingCheck',
  'orderInitiation',
] as const

export function OperationList() {
  const { parsedSpec, domainMap } = useSpec()
  const { state, actions } = useExplorer()

  const groups = GROUP_NODE_IDS
    .map((nodeId) => domainMap.nodes.find((n) => n.id === nodeId))
    .filter((n): n is NonNullable<typeof n> => n !== undefined)
    .map((node) => ({
      node,
      operations: node.relatedOperationIds
        .map((opId) => parsedSpec.operations.operations[opId])
        .filter((op): op is NonNullable<typeof op> => op !== undefined),
    }))
    .filter((g) => g.operations.length > 0)

  return (
    <div className="p-3 space-y-4">
      {groups.map(({ node, operations }) => (
        <div key={node.id}>
          <p className="font-heading text-[10px] uppercase tracking-widest text-text/30 mb-1 px-1">
            {node.label}
          </p>
          {operations.map((op) => {
            const isSelected =
              state.selection.path === op.path && state.selection.method === op.method
            return (
              <button
                key={op.operationId}
                onClick={() => actions.selectOperation(op.path, op.method, node.id)}
                className={[
                  'w-full text-left px-2 py-1.5 rounded font-body text-xs transition-colors flex items-center gap-2 border',
                  isSelected
                    ? 'text-accent bg-accent/10 border-accent/30'
                    : 'text-text/60 hover:text-text hover:bg-surface-2 border-transparent',
                ].join(' ')}
              >
                <span className="font-heading text-[9px] uppercase text-text/30 w-8 shrink-0">
                  {op.method}
                </span>
                <span className="truncate">{op.operationId}</span>
              </button>
            )
          })}
        </div>
      ))}
    </div>
  )
}
