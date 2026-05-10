import { forwardRef } from 'react'
import type { CSSProperties } from 'react'
import type { VisualNode } from '../../types/domainMap'
import type { ThemeConfig } from '../../theme/themeTypes'
import type { ExplorerMode } from '../../types/explorer'
import type { NodeVisualState } from './nodeVisualState'
import { showMethodBadges } from '../../utils/modeDisplay'

const TYPE_LABEL: Record<string, string> = {
  actor: 'ACTOR',
  channel: 'CHANNEL',
  'control-record': 'CR',
  'behavior-qualifier': 'BQ',
  external: 'EXT',
}

const TYPE_SYMBOL: Record<string, string> = {
  actor: '◎',
  channel: '⬡',
  'control-record': '■',
  'behavior-qualifier': '◆',
  external: '○',
}

const METHOD_PREFIXES: [string, string][] = [
  ['Initiate', 'POST'],
  ['Update', 'PUT'],
  ['Retrieve', 'GET'],
  ['Control', 'PUT'],
  ['Execute', 'POST'],
  ['Exchange', 'POST'],
]

function operationToMethod(opId: string): string {
  for (const [prefix, method] of METHOD_PREFIXES) {
    if (opId.startsWith(prefix)) return method
  }
  return opId
}

interface JourneyNodeProps {
  node: VisualNode
  visualState: NodeVisualState
  theme: ThemeConfig
  mode: ExplorerMode
  onClick: (nodeId: string) => void
  style?: CSSProperties
  isScenarioHighlighted?: boolean
}

export const JourneyNode = forwardRef<HTMLDivElement, JourneyNodeProps>(
  function JourneyNode({ node, visualState, theme, mode, onClick, style, isScenarioHighlighted }, ref) {
    const borderColor =
      visualState === 'selected'
        ? theme.node.selected
        : visualState === 'related'
          ? theme.node.related
          : visualState === 'muted'
            ? theme.node.muted
            : theme.node.border

    const opacity = visualState === 'muted' && !isScenarioHighlighted ? 0.45 : 1
    const scenarioOutline = isScenarioHighlighted
      ? `0 0 0 2px ${theme.colors.accent}`
      : undefined

    const methods = node.relatedOperationIds
      .map(operationToMethod)
      .filter((m, i, arr) => arr.indexOf(m) === i)

    const methodColor: Record<string, string> = {
      POST: theme.colors.accent,
      GET: theme.colors.primary,
      PUT: theme.colors.secondary,
    }

    return (
      <div
        ref={ref}
        role="button"
        tabIndex={0}
        aria-pressed={visualState === 'selected'}
        title={visualState === 'selected' ? `${node.label} — selected` : `Click to inspect ${node.label}`}
        onClick={() => onClick(node.id)}
        onKeyDown={(e) => e.key === 'Enter' && onClick(node.id)}
        style={{
          ...style,
          background: theme.node.background,
          border: `1px solid ${borderColor}`,
          borderRadius: theme.borderRadius,
          padding: `${theme.spacing.sm} ${theme.spacing.md}`,
          cursor: 'pointer',
          transition: `border-color ${theme.animation.durationFast} ${theme.animation.easing}, opacity ${theme.animation.durationFast} ${theme.animation.easing}, box-shadow ${theme.animation.durationFast} ${theme.animation.easing}`,
          boxShadow: scenarioOutline,
          minWidth: '100px',
          maxWidth: '155px',
          opacity,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing.xs,
            marginBottom: theme.spacing.xs,
          }}
        >
          <span
            style={{
              fontFamily: theme.typography.monoFont,
              fontSize: theme.typography.smallSize,
              color: borderColor,
              lineHeight: 1,
            }}
          >
            {TYPE_SYMBOL[node.type]}
          </span>
          <span
            style={{
              fontFamily: theme.typography.fontFamily,
              fontSize: theme.typography.smallSize,
              color: theme.colors.textMuted,
              letterSpacing: '0.12em',
            }}
          >
            {TYPE_LABEL[node.type]}
          </span>
        </div>

        <div
          style={{
            fontFamily: theme.typography.fontFamily,
            fontSize: theme.typography.bodySize,
            color: theme.node.text,
            fontWeight: visualState === 'selected' ? 600 : 400,
            lineHeight: 1.3,
            marginBottom: methods.length > 0 ? theme.spacing.xs : 0,
            overflowWrap: 'break-word',
            wordBreak: 'break-word',
          }}
        >
          {node.label}
        </div>

        {methods.length > 0 && showMethodBadges(mode) && (
          <div style={{ display: 'flex', gap: theme.spacing.xs, flexWrap: 'wrap' }}>
            {methods.map((method) => (
              <span
                key={method}
                style={{
                  fontFamily: theme.typography.monoFont,
                  fontSize: '0.65rem',
                  color: methodColor[method] ?? theme.colors.textMuted,
                  background: theme.badge.background,
                  border: `1px solid ${theme.badge.border}`,
                  borderRadius: theme.borderRadius,
                  padding: '1px 5px',
                }}
              >
                {method}
              </span>
            ))}
          </div>
        )}
      </div>
    )
  },
)
