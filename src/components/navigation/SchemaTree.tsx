import { useMemo } from 'react'
import { useSpec } from '../../app/SpecProvider'
import { useExplorer } from '../../state/explorerStore'

interface SchemaGroup {
  id: string
  label: string
  test: (name: string) => boolean
}

const SCHEMA_GROUPS: SchemaGroup[] = [
  {
    id: 'core',
    label: 'Core',
    test: (n) => !n.includes('Request') && !n.includes('Response') && !n.toLowerCase().includes('error'),
  },
  {
    id: 'requests',
    label: 'Requests',
    test: (n) => n.includes('Request'),
  },
  {
    id: 'responses',
    label: 'Responses',
    test: (n) => n.includes('Response'),
  },
  {
    id: 'errors',
    label: 'Errors',
    test: (n) => n.toLowerCase().includes('error'),
  },
]

export function SchemaTree() {
  const { parsedSpec, domainMap } = useSpec()
  const { state, actions } = useExplorer()

  const schemaToNode = useMemo(() => {
    const map: Record<string, string> = {}
    for (const node of domainMap.nodes) {
      for (const name of (node.relatedSchemaNames ?? [])) {
        map[name] = node.id
      }
    }
    return map
  }, [domainMap])

  const schemaNames = Object.keys(parsedSpec.schemas.schemas)

  return (
    <div className="p-3 space-y-4">
      {SCHEMA_GROUPS.map((group) => {
        const names = schemaNames.filter(group.test)
        if (names.length === 0) return null

        return (
          <div key={group.id}>
            <p className="font-heading text-[10px] uppercase tracking-widest text-text/30 mb-1 px-1">
              {group.label} <span className="text-text/20">({names.length})</span>
            </p>
            {names.map((name) => {
              const isSelected = state.selection.schemaName === name
              return (
                <button
                  key={name}
                  onClick={() => actions.selectSchema(name, schemaToNode[name])}
                  className={[
                    'w-full text-left px-2 py-1.5 rounded font-body text-xs transition-colors truncate border',
                    isSelected
                      ? 'text-accent bg-accent/10 border-accent/30'
                      : 'text-text/60 hover:text-text hover:bg-surface-2 border-transparent',
                  ].join(' ')}
                  title={name}
                >
                  {name}
                </button>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}
