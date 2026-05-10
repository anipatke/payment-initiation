import { useExplorer } from '../../state/explorerStore'
import type { ExplorerMode } from '../../types/explorer'

const MODES: { id: ExplorerMode; label: string }[] = [
  { id: 'business', label: 'Business' },
  { id: 'api', label: 'API' },
  { id: 'schema', label: 'Schema' },
]

export function ModeSwitcher() {
  const { state, actions } = useExplorer()

  return (
    <div className="flex gap-1 p-3 border-b border-border">
      {MODES.map(({ id, label }) => (
        <button
          key={id}
          onClick={() => actions.setMode(id)}
          className={[
            'flex-1 py-1.5 font-heading text-[10px] uppercase tracking-wider rounded border transition-colors',
            state.mode === id
              ? 'border-accent text-accent bg-accent/10'
              : 'border-border text-text/40 hover:text-text/70 hover:border-border-subtle',
          ].join(' ')}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
