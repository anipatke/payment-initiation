---
id: TASK-9
title: 'Build ConnectionLine: animated SVG connectors between CR and BQ panels'
status: Done
assignee: []
created_date: '2026-05-04 09:34'
updated_date: '2026-05-04 10:02'
labels: []
dependencies: []
ordinal: 31.25
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Build animated connection lines that pulse during lifecycle. Depends on TASK-6 and TASK-7.\n\nRequirements:\n- src/components/ConnectionLine.jsx\n- Uses SVG line or path between panel elements\n- Props: isActive (bool), isFailed (bool)\n- Idle: thin line, color #1A1A1A (border-quiet)\n- Active: strokeDashoffset animation (travelling dash) in #A4C639, duration 0.8s\n- Failed: static line in red\n- On desktop: render 3 lines from bottom of CRPanel to top of each BQPanel\n- On mobile: render thin horizontal rule between panels (no SVG needed, just styled hr)\n- Use ResizeObserver or refs to compute line endpoints, or use a fixed layout approach with absolute positioning if panel positions are predictable in the grid\n- Keep it simple: if dynamic positioning is complex, use a CSS border-top with animated gradient on mobile, SVG only on desktop lg: breakpoint\n- Verify lines animate in sync with panel glow during lifecycle run
<!-- SECTION:DESCRIPTION:END -->
