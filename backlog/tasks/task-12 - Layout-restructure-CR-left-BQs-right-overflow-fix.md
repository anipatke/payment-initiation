---
id: TASK-12
title: 'Layout restructure — CR left panel, BQs right, overflow fix'
status: To Do
assignee: []
created_date: '2026-05-04'
labels: [layout, ui]
dependencies: [TASK-11]
---

## Description

Restructure the Command Center from the current top/bottom grid to a two-column desktop layout. Fix text overflow from long BIAN field names. Display shortened labels as primary text with full BIAN name as muted secondary.

### Layout spec

**Desktop (lg+):**
```
┌──────────────────┬──────────────────────────────────────┐
│  CR Panel        │  Compliance BQ                       │
│  (w-1/3)         │  FundingCheck BQ                     │
│  sticky top      │  OrderInitiation BQ                  │
│                  │  (stacked, w-2/3)                    │
└──────────────────┴──────────────────────────────────────┘
```
- CR panel: `w-1/3`, `sticky top-8`, full height of viewport
- BQ panels: `w-2/3`, vertically stacked with `gap-4`
- ConnectionLine: draw as a vertical line on the left edge of the BQ column connecting to CR, with horizontal branches to each BQ card — OR remove ConnectionLine and rely on panel glow state only (simpler, less clutter)

**Mobile (<lg):**
- Vertical stack: CR top, BQs below (existing behaviour, unchanged)

**Overflow fix:**
- All field name cells: `break-words overflow-wrap-anywhere`
- Field row structure:
  ```
  shortLabel (accent, text-xs)        type (muted, text-xs)
  Full BIAN name (text-text/30, text-[10px], italic)
  Plain-English meaning — added in TASK-13, layout reserved here
  ```
- BQ card width is now 2/3 of viewport → more space, but still need wrapping for long names

**PulseControls:**
- Move to top of page above the two-column split (full-width bar)
- Still contains: Run Lifecycle, Reset (when done), Simulate Compliance Failure toggle

**CommandCenter changes:**
- New two-column wrapper: `flex flex-col lg:flex-row gap-6`
- CR panel gets `lg:w-1/3 lg:sticky lg:top-8 lg:self-start`
- BQ column gets `lg:w-2/3 flex flex-col gap-4`

**CRPanel + BQPanel field rendering:**
- `shortLabel` as primary label (from TASK-11 data)
- Full `name` as secondary in muted smaller text below
- Reserve space for `meaning` (to be populated in TASK-13)
- Grid: `grid-cols-1` always (no 2-col within panel — too narrow now)

**ConnectionLine:**
- Simplify or remove entirely. The glow animation on panels is sufficient visual feedback. If keeping, draw as thin vertical accent line between the two columns, not SVG per-card.
- Decision: remove ConnectionLine component from render tree. Glow states carry the animation.

### Files to update
- `src/components/CommandCenter.jsx` — layout restructure
- `src/components/CRPanel.jsx` — field rendering update, shortLabel + fullName
- `src/components/BQPanel.jsx` — field rendering update, shortLabel + fullName
- `src/components/ConnectionLine.jsx` — remove from CommandCenter render (keep file for potential reuse)
