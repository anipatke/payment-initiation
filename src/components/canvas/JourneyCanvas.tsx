import { useRef, useLayoutEffect, useState, useCallback } from 'react'
import type { ThemeConfig } from '../../theme/themeTypes'
import { useSpec } from '../../app/SpecProvider'
import { useExplorer } from '../../state/explorerStore'
import { getNodeVisualState } from './nodeVisualState'
import { JourneyNode } from './JourneyNode'
import { FlowAnimationLayer, type EdgeLine } from './FlowAnimationLayer'
import { SCENARIOS, getScenario } from '../../data/scenarios'
import type { ScenarioId } from '../../data/scenarios'

function CanvasLegend({ theme }: { theme: ThemeConfig }) {
  const items: Array<{ color: string; label: string }> = [
    { color: theme.node.selected, label: 'SELECTED' },
    { color: theme.node.related, label: 'RELATED' },
    { color: theme.node.muted, label: 'INACTIVE' },
  ]
  return (
    <div
      style={{
        position: 'absolute',
        bottom: '12px',
        left: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        fontFamily: theme.typography.monoFont,
        fontSize: '0.6rem',
        color: theme.colors.textMuted,
        pointerEvents: 'none',
        userSelect: 'none',
      }}
    >
      <span style={{ letterSpacing: '0.08em' }}>CLICK NODE TO INSPECT</span>
      {items.map(({ color, label }) => (
        <span key={label} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span
            style={{
              display: 'inline-block',
              width: '8px',
              height: '8px',
              borderRadius: '2px',
              border: `1.5px solid ${color}`,
              flexShrink: 0,
            }}
          />
          <span style={{ letterSpacing: '0.08em' }}>{label}</span>
        </span>
      ))}
    </div>
  )
}

function PlayControls({
  isPlaying,
  stepIndex,
  theme,
  onPlay,
  onStop,
  onReset,
}: {
  isPlaying: boolean
  stepIndex: number
  theme: ThemeConfig
  onPlay: () => void
  onStop: () => void
  onReset: () => void
}) {
  const isIdle = stepIndex < 0
  const isDone = !isPlaying && stepIndex >= 0

  return (
    <div
      style={{
        position: 'absolute',
        top: '12px',
        right: '16px',
        display: 'flex',
        gap: '8px',
        zIndex: 10,
      }}
    >
      {!isPlaying && (
        <button
          onClick={onPlay}
          style={{
            fontFamily: theme.typography.monoFont,
            fontSize: '0.6rem',
            letterSpacing: '0.08em',
            color: theme.colors.primary,
            background: 'transparent',
            border: `1px solid ${theme.colors.primary}`,
            borderRadius: theme.borderRadius,
            padding: '4px 10px',
            cursor: 'pointer',
            transition: `opacity ${theme.animation.durationFast} ${theme.animation.easing}`,
          }}
        >
          {isIdle ? '▶ PLAY JOURNEY' : '▶ REPLAY'}
        </button>
      )}
      {isPlaying && (
        <button
          onClick={onStop}
          style={{
            fontFamily: theme.typography.monoFont,
            fontSize: '0.6rem',
            letterSpacing: '0.08em',
            color: theme.colors.accent,
            background: 'transparent',
            border: `1px solid ${theme.colors.accent}`,
            borderRadius: theme.borderRadius,
            padding: '4px 10px',
            cursor: 'pointer',
          }}
        >
          ■ STOP
        </button>
      )}
      {isDone && (
        <button
          onClick={onReset}
          style={{
            fontFamily: theme.typography.monoFont,
            fontSize: '0.6rem',
            letterSpacing: '0.08em',
            color: theme.colors.textMuted,
            background: 'transparent',
            border: `1px solid ${theme.colors.textMuted}`,
            borderRadius: theme.borderRadius,
            padding: '4px 10px',
            cursor: 'pointer',
          }}
        >
          ↺ RESET
        </button>
      )}
    </div>
  )
}

function ScenarioSelector({
  activeScenarioId,
  theme,
  onSelect,
}: {
  activeScenarioId: string | undefined
  theme: ThemeConfig
  onSelect: (id: string | undefined) => void
}) {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: '40px',
        right: '16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '4px',
        zIndex: 10,
      }}
    >
      <span
        style={{
          fontFamily: theme.typography.monoFont,
          fontSize: '0.55rem',
          color: theme.colors.textMuted,
          letterSpacing: '0.1em',
          marginBottom: '2px',
        }}
      >
        VISUAL LEARNING SCENARIOS (no business rules)
      </span>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', justifyContent: 'flex-end' }}>
        {SCENARIOS.map((scenario) => {
          const isActive = scenario.id === activeScenarioId
          return (
            <button
              key={scenario.id}
              title={scenario.description}
              onClick={() => onSelect(isActive ? undefined : scenario.id)}
              style={{
                fontFamily: theme.typography.monoFont,
                fontSize: '0.6rem',
                letterSpacing: '0.06em',
                color: isActive ? theme.colors.accent : theme.colors.textMuted,
                background: isActive ? `${theme.colors.accent}14` : 'transparent',
                border: `1px solid ${isActive ? theme.colors.accent : theme.colors.textMuted}`,
                borderRadius: theme.borderRadius,
                padding: '3px 8px',
                cursor: 'pointer',
                transition: `all ${theme.animation.durationFast} ${theme.animation.easing}`,
              }}
            >
              {scenario.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// Wide layout (canvas ≥ 520px): 3-across rows. Gaps of 28%+ ensure nodes at
// maxWidth 155px (JourneyNode) don't overlap at the ~520px threshold.
const WIDE_NODE_LAYOUT: Record<string, { left: number; top: number }> = {
  user: { left: 2, top: 8 },
  channel: { left: 30, top: 8 },
  paymentInitiationTransaction: { left: 58, top: 8 },
  fundingCheck: { left: 4, top: 58 },
  compliance: { left: 34, top: 58 },
  orderInitiation: { left: 64, top: 58 },
  downstream: { left: 68, top: 78 },
}

// Narrow layout (canvas < 520px): 2-across to prevent collision.
// paymentInitiationTransaction drops to its own row; orderInitiation + downstream
// share the bottom row. Gaps of ~48% at 448px canvas = ~215px > maxWidth 155px.
const NARROW_NODE_LAYOUT: Record<string, { left: number; top: number }> = {
  user: { left: 2, top: 5 },
  channel: { left: 50, top: 5 },
  paymentInitiationTransaction: { left: 2, top: 33 },
  fundingCheck: { left: 2, top: 58 },
  compliance: { left: 50, top: 58 },
  orderInitiation: { left: 2, top: 80 },
  downstream: { left: 50, top: 80 },
}

const NARROW_THRESHOLD = 520

function getBorderPoint(
  cx: number,
  cy: number,
  dx: number,
  dy: number,
  hw: number,
  hh: number,
): [number, number] {
  if (dx === 0 && dy === 0) return [cx, cy]
  const scaleX = hw / Math.abs(dx)
  const scaleY = hh / Math.abs(dy)
  const scale = Math.min(scaleX, scaleY)
  return [cx + dx * scale, cy + dy * scale]
}

export function JourneyCanvas() {
  const containerRef = useRef<HTMLDivElement>(null)
  const nodeRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const [edgeLines, setEdgeLines] = useState<EdgeLine[]>([])
  const [canvasWidth, setCanvasWidth] = useState<number>(9999)

  const nodeLayout = canvasWidth < NARROW_THRESHOLD ? NARROW_NODE_LAYOUT : WIDE_NODE_LAYOUT

  const { domainMap, theme } = useSpec()
  const { state, actions } = useExplorer()
  const selectedNodeId = state.selection.nodeId
  const { isPlaying, stepIndex } = state.playback

  const activeScenario = state.activeScenarioId
    ? getScenario(state.activeScenarioId as ScenarioId)
    : undefined
  const scenarioNodeSet = activeScenario
    ? new Set(activeScenario.highlightedNodeIds)
    : null
  const scenarioEdgeSet = activeScenario
    ? new Set(activeScenario.highlightedEdgeKeys)
    : null

  const computeEdges = useCallback(() => {
    const container = containerRef.current
    if (!container) return
    setCanvasWidth(container.offsetWidth)
    const cr = container.getBoundingClientRect()
    const lines: EdgeLine[] = []

    for (const edge of domainMap.edges) {
      const srcEl = nodeRefs.current[edge.source]
      const tgtEl = nodeRefs.current[edge.target]
      if (!srcEl || !tgtEl) continue

      const sr = srcEl.getBoundingClientRect()
      const tr = tgtEl.getBoundingClientRect()

      const sx = sr.left + sr.width / 2 - cr.left
      const sy = sr.top + sr.height / 2 - cr.top
      const tx = tr.left + tr.width / 2 - cr.left
      const ty = tr.top + tr.height / 2 - cr.top

      const rawDx = tx - sx
      const rawDy = ty - sy
      const len = Math.hypot(rawDx, rawDy) || 1
      const ndx = rawDx / len
      const ndy = rawDy / len

      const [x1, y1] = getBorderPoint(sx, sy, ndx, ndy, sr.width / 2, sr.height / 2)
      const [x2, y2] = getBorderPoint(tx, ty, -ndx, -ndy, tr.width / 2, tr.height / 2)

      lines.push({ x1, y1, x2, y2, source: edge.source, target: edge.target })
    }

    setEdgeLines(lines)
  }, [domainMap])

  useLayoutEffect(() => {
    computeEdges()
    const ro = new ResizeObserver(computeEdges)
    const container = containerRef.current
    if (container) ro.observe(container)
    for (const el of Object.values(nodeRefs.current)) {
      if (el) ro.observe(el)
    }
    return () => ro.disconnect()
  }, [computeEdges])

  function edgeKey(edge: EdgeLine): string {
    return `${edge.source}-${edge.target}`
  }

  function edgeIsActive(edge: EdgeLine): boolean {
    return edge.source === selectedNodeId || edge.target === selectedNodeId
  }

  function edgeIsScenarioHighlighted(edge: EdgeLine): boolean {
    return scenarioEdgeSet?.has(edgeKey(edge)) ?? false
  }

  function edgeStroke(edge: EdgeLine): string {
    if (edgeIsScenarioHighlighted(edge)) return theme.colors.accent
    if (!selectedNodeId) return theme.edge.color
    return edgeIsActive(edge) ? theme.edge.selected : theme.edge.muted
  }

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: '400px',
      }}
    >
      <PlayControls
        isPlaying={isPlaying}
        stepIndex={stepIndex}
        theme={theme}
        onPlay={actions.startPlay}
        onStop={actions.stopPlay}
        onReset={actions.resetPlay}
      />

      <svg
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          overflow: 'visible',
        }}
      >
        <style>{`@keyframes fal-pulse { from { stroke-dashoffset: 28; } to { stroke-dashoffset: 0; } }`}</style>
        <defs>
          {/* context-stroke lets each line's stroke color flow into the arrowhead fill */}
          <marker
            id="jc-arrow"
            markerWidth="8"
            markerHeight="6"
            refX="8"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 8 3, 0 6" fill="context-stroke" />
          </marker>
          <marker
            id="jc-arrow-pulse"
            markerWidth="8"
            markerHeight="6"
            refX="8"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 8 3, 0 6" fill={theme.colors.primary} />
          </marker>
        </defs>

        {edgeLines.map((edge) => (
          <line
            key={`${edge.source}-${edge.target}`}
            x1={edge.x1}
            y1={edge.y1}
            x2={edge.x2}
            y2={edge.y2}
            stroke={edgeStroke(edge)}
            strokeWidth={edgeIsScenarioHighlighted(edge) || edgeIsActive(edge) ? 1.5 : 1}
            markerEnd="url(#jc-arrow)"
            style={{
              transition: `stroke ${theme.animation.durationFast} ${theme.animation.easing}`,
            }}
          />
        ))}

        <FlowAnimationLayer
          edgeLines={edgeLines}
          stepIndex={stepIndex}
          isPlaying={isPlaying}
          theme={theme}
          onAdvance={actions.advancePlayStep}
          onStop={actions.stopPlay}
        />
      </svg>

      {domainMap.nodes.map((node) => {
        const pos = nodeLayout[node.id]
        if (!pos) return null
        const visualState = getNodeVisualState(node.id, selectedNodeId, domainMap.edges)
        return (
          <JourneyNode
            key={node.id}
            ref={(el) => {
              nodeRefs.current[node.id] = el
            }}
            node={node}
            visualState={visualState}
            theme={theme}
            mode={state.mode}
            onClick={actions.selectNode}
            isScenarioHighlighted={scenarioNodeSet ? scenarioNodeSet.has(node.id) : undefined}
            style={{
              position: 'absolute',
              left: `${pos.left}%`,
              top: `${pos.top}%`,
            }}
          />
        )
      })}

      <ScenarioSelector
        activeScenarioId={state.activeScenarioId}
        theme={theme}
        onSelect={actions.setScenario}
      />

      <CanvasLegend theme={theme} />
    </div>
  )
}
