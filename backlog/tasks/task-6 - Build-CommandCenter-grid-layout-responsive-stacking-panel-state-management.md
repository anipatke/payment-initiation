---
id: TASK-6
title: 'Build CommandCenter: grid layout, responsive stacking, panel state management'
status: Done
assignee: []
created_date: '2026-05-04 09:34'
updated_date: '2026-05-04 09:55'
labels: []
dependencies: []
ordinal: 125
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Assemble all panels into the responsive Command Center grid. Depends on TASK-4, TASK-5.\n\nRequirements:\n- src/components/CommandCenter.jsx is the root layout component\n- Accepts props: lifecycleState (object from useLifecycle hook), simulateFailure (bool)\n- Layout desktop (lg:): CRPanel full-width top row, then 3-col grid of BQPanel below\n- Layout mobile: all 4 panels stacked vertically in single column\n- Tailwind grid: 'grid grid-cols-1 lg:grid-cols-3 gap-4' for BQ row\n- State: tracks which panel is expanded (only one at a time) via expandedId useState\n- Passes isActive and isFailed to each panel derived from lifecycleState\n- lifecycleState shape: { activeNodes: string[], failedNodes: string[] } where values match node ids\n- Section padding: generous (p-6 or p-8), dark background fills full viewport\n- PulseControls component renders above the grid (import from TASK-7)
<!-- SECTION:DESCRIPTION:END -->
