---
id: E06-canvas-polish/T002-node-collision-layout
status: done
objective: "Eliminate residual node position collisions at viewport widths where the center column is narrower than ~500px."
depends_on: ["E06-canvas-polish/T001-node-label-overflow"]
---

# T002 — Node Collision Layout

## Problem

At 1078px total viewport, the center canvas column is ~478px. With 3 nodes across the top row at 25% spacing, gaps are ~119px. After T001 resolves label-driven height changes (which can affect visual density), some collisions may remain depending on final node dimensions.

## Context Files

- `src/components/canvas/JourneyCanvas.tsx`
- `src/components/canvas/JourneyNode.tsx`

## Acceptance Criteria

- [x] Top row (user → channel → paymentInitiationTransaction) has no overlap at 1080px viewport.
- [x] Bottom row (fundingCheck → compliance → orderInitiation) has no overlap at 1080px viewport.
- [x] Canvas does not introduce a horizontal scrollbar in the center column at 1080px viewport.
- [x] Layout degrades gracefully (scroll, not broken) below 768px.

## Implementation Plan

- [x] Audit final node dimensions after T001 (label wrapping may increase height, not width).
- [x] Adjust `NODE_LAYOUT` percentages if gaps are still insufficient.
- [x] Consider a responsive two-row layout for the top three nodes below a canvas-width threshold.
- [x] Run build gate.

## Notes

- Current positions calibrated to 25% gap (~119px at 478px). This just clears `minWidth: 100px` nodes.
- If T001 causes nodes to grow taller, the gap math for horizontal collision is unchanged.
- Responsive two-row approach: paymentInitiationTransaction drops to its own row at narrow widths.

## Context Log

Files read:

Estimated input tokens:

Notes:
