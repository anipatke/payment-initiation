---
id: E06-canvas-polish/T001-node-label-overflow
status: done
objective: "Prevent long node labels (e.g. PaymentInitiationTransaction) from overflowing the node box boundary."
depends_on:
---

# T001 — Node Label Overflow

## Problem

Long BIAN identifiers such as `PaymentInitiationTransaction` overflow the node box at the current `maxWidth: 155px`. The label div has no overflow constraint, so text runs outside the border.

## Context Files

- `src/components/canvas/JourneyNode.tsx`
- `src/components/canvas/JourneyCanvas.tsx`

## Acceptance Criteria

- [x] All node labels are fully contained within their box border at all zoom levels.
- [x] Labels that are too long are either truncated with ellipsis or wrap to a second line without expanding the node beyond its max-width.
- [x] Node height expansion from wrapping does not break edge connector positions (edges recompute via ResizeObserver).
- [x] `PaymentInitiationTransaction` renders cleanly at `maxWidth: 155px`.

## Implementation Plan

- [x] Add `wordBreak: 'break-word'` or `overflowWrap: 'break-word'` to the label div in `JourneyNode`.
- [x] Confirm `ResizeObserver` in `JourneyCanvas` recomputes edges after any height change.
- [x] Run build gate.

## Notes

- Prefer wrapping over truncation — truncated BIAN names lose meaning.
- If wrapping causes edge misalignment, the `ResizeObserver` on the container already handles recompute.

## Context Log

Files read:

Estimated input tokens:

Notes:
