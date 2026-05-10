import { useEffect, useRef } from 'react'
import type { ThemeConfig } from '../../theme/themeTypes'
import {
  JOURNEY_STEPS,
  JOURNEY_STEP_DURATION_MS,
  getVisitedEdgeKeys,
  getActiveEdgeKeys,
  getAllVisitedEdgeKeys,
} from './journeySequence'

export interface EdgeLine {
  x1: number
  y1: number
  x2: number
  y2: number
  source: string
  target: string
}

interface FlowAnimationLayerProps {
  edgeLines: EdgeLine[]
  stepIndex: number
  isPlaying: boolean
  theme: ThemeConfig
  onAdvance: () => void
  onStop: () => void
}

export function FlowAnimationLayer({
  edgeLines,
  stepIndex,
  isPlaying,
  theme,
  onAdvance,
  onStop,
}: FlowAnimationLayerProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!isPlaying) return
    timerRef.current = setTimeout(() => {
      if (stepIndex + 1 >= JOURNEY_STEPS.length) {
        onStop()
      } else {
        onAdvance()
      }
    }, JOURNEY_STEP_DURATION_MS)
    return () => {
      if (timerRef.current !== null) clearTimeout(timerRef.current)
    }
  }, [isPlaying, stepIndex, onAdvance, onStop])

  if (stepIndex < 0) return null

  const activeKeys = isPlaying ? getActiveEdgeKeys(stepIndex) : new Set<string>()
  const visitedKeys = isPlaying ? getVisitedEdgeKeys(stepIndex) : getAllVisitedEdgeKeys(stepIndex)

  const visitedLines = edgeLines.filter(
    (l) => visitedKeys.has(`${l.source}-${l.target}`) && !activeKeys.has(`${l.source}-${l.target}`),
  )
  const activeLines = edgeLines.filter((l) => activeKeys.has(`${l.source}-${l.target}`))

  return (
    <>
      {visitedLines.map((line) => (
        <line
          key={`visited-${line.source}-${line.target}`}
          x1={line.x1}
          y1={line.y1}
          x2={line.x2}
          y2={line.y2}
          stroke={theme.colors.primary}
          strokeWidth={1.5}
          opacity={0.3}
          pointerEvents="none"
          markerEnd="url(#jc-arrow)"
        />
      ))}
      {activeLines.map((line) => (
        <line
          key={`pulse-${line.source}-${line.target}`}
          x1={line.x1}
          y1={line.y1}
          x2={line.x2}
          y2={line.y2}
          stroke={theme.colors.primary}
          strokeWidth={2}
          strokeDasharray="8 6"
          pointerEvents="none"
          markerEnd="url(#jc-arrow-pulse)"
          style={{ animation: 'fal-pulse 500ms linear infinite' }}
        />
      ))}
    </>
  )
}
