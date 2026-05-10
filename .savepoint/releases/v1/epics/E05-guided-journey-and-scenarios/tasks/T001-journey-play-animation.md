---
id: E05-guided-journey-and-scenarios/T001-journey-play-animation
status: done
objective: "Add journey play state and an animation layer that pulses through the required payment initiation path."
depends_on: ["E04-modes-and-examples/T003-error-responses"]
---

# T001 — Journey Play Animation

## Context Files

- `src/components/canvas/JourneyCanvas.tsx`
- `src/state/explorerStore.tsx`
- `src/theme/explorerTheme.ts`

## Acceptance Criteria

- [x] Play Journey pulses from Customer / User to Channel / Banking App.
- [x] Pulse continues to PaymentInitiationTransaction.
- [x] Pulse branches to FundingCheck and Compliance.
- [x] Pulse moves to OrderInitiation and ends at Downstream Payment Processing.
- [x] Animation timing and selected/highlight appearances use theme/config tokens.

## Implementation Plan

- [x] Add animation/playback state and reset action.
- [x] Add `src/components/canvas/FlowAnimationLayer.tsx`.
- [x] Add play/reset controls in the explorer surface.
- [x] Ensure user selections remain coherent during and after playback.
- [x] Run the build gate.

## Context Log

- Files read: JourneyCanvas.tsx, explorerStore.tsx, explorerTheme.ts, explorer.ts (types), ExplorerShell.tsx, themeTypes.ts
- Notes: Animation should be useful, restrained, and interruptible.

## Drift Notes

- Created `src/components/canvas/journeySequence.ts` (new file not in codebase map) — holds step config and edge-key helpers. Added to canvas/ module.
- `JourneyEdge.tsx` referenced in task context files does not exist; edge rendering lives directly in JourneyCanvas.
