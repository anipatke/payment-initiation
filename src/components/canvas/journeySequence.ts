export interface JourneyEdgePulse {
  from: string
  to: string
}

export interface JourneyStep {
  edges: readonly JourneyEdgePulse[]
}

export const JOURNEY_STEPS: readonly JourneyStep[] = [
  { edges: [{ from: 'user', to: 'channel' }] },
  { edges: [{ from: 'channel', to: 'paymentInitiationTransaction' }] },
  {
    edges: [
      { from: 'paymentInitiationTransaction', to: 'fundingCheck' },
      { from: 'paymentInitiationTransaction', to: 'compliance' },
    ],
  },
  {
    edges: [
      { from: 'fundingCheck', to: 'orderInitiation' },
      { from: 'compliance', to: 'orderInitiation' },
    ],
  },
  { edges: [{ from: 'orderInitiation', to: 'downstream' }] },
]

export const JOURNEY_STEP_DURATION_MS = 1200

export function getVisitedEdgeKeys(stepIndex: number): Set<string> {
  const keys = new Set<string>()
  for (let i = 0; i < stepIndex && i < JOURNEY_STEPS.length; i++) {
    for (const e of JOURNEY_STEPS[i].edges) {
      keys.add(`${e.from}-${e.to}`)
    }
  }
  return keys
}

export function getActiveEdgeKeys(stepIndex: number): Set<string> {
  if (stepIndex < 0 || stepIndex >= JOURNEY_STEPS.length) return new Set()
  const keys = new Set<string>()
  for (const e of JOURNEY_STEPS[stepIndex].edges) {
    keys.add(`${e.from}-${e.to}`)
  }
  return keys
}

export function getAllVisitedEdgeKeys(stepIndex: number): Set<string> {
  const keys = new Set<string>()
  for (let i = 0; i <= stepIndex && i < JOURNEY_STEPS.length; i++) {
    for (const e of JOURNEY_STEPS[i].edges) {
      keys.add(`${e.from}-${e.to}`)
    }
  }
  return keys
}
