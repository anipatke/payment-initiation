import type { VisualNode } from '../../types/domainMap'

const NODE_TYPE_LABEL: Record<string, string> = {
  'actor': 'Actor',
  'channel': 'Channel',
  'control-record': 'Control Record',
  'behavior-qualifier': 'Behavior Qualifier',
  'external': 'External',
}

interface OverviewTabProps {
  node: VisualNode
}

export function OverviewTab({ node }: OverviewTabProps) {
  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h2 className="font-heading text-sm tracking-widest uppercase">{node.label}</h2>
          <span className="font-mono text-[10px] px-1.5 py-0.5 rounded border border-border text-text/50">
            {NODE_TYPE_LABEL[node.type] ?? node.type}
          </span>
        </div>
        {node.description && (
          <p className="font-body text-xs text-text/70 leading-relaxed">{node.description}</p>
        )}
      </div>

      {node.fieldGroups && node.fieldGroups.length > 0 && (
        <div className="space-y-3">
          {node.fieldGroups.map((group) => (
            <div key={group.id}>
              <p className="font-mono text-[10px] text-text/40 uppercase tracking-wider mb-1">
                {group.label}
              </p>
              <div className="flex flex-wrap gap-1">
                {group.fields.map((field) => (
                  <span
                    key={field}
                    className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-surface border border-border text-text/60"
                  >
                    {field}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
