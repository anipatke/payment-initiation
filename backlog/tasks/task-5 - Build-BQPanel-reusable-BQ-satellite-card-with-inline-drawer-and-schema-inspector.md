---
id: TASK-5
title: >-
  Build BQPanel: reusable BQ satellite card with inline drawer and schema
  inspector
status: Done
assignee: []
created_date: '2026-05-04 09:33'
updated_date: '2026-05-04 09:55'
labels: []
dependencies: []
ordinal: 3000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Build the reusable Behavioral Qualifier card. Depends on TASK-1, TASK-2, TASK-3.\n\nRequirements:\n- src/components/BQPanel.jsx accepts props: node (flowData BQ object), isActive (bool), isFailed (bool), isExpanded (bool), onToggle (fn)\n- Layout: dark panel (#0D0D0D), 1px border (#1A1A1A), Chakra Petch uppercase label (e.g. 'BQ — COMPLIANCE')\n- Sub-label: node.role in Space Mono muted text\n- API path label below role\n- isActive=true: green glow identical to CRPanel\n- isFailed=true: red glow (box-shadow with red at low opacity), red accent text on result field value\n- Click header → onToggle\n- Inline expansion identical pattern to CRPanel: Framer AnimatePresence, fields list, schema inspector toggle\n- Component is identical for all 3 BQs — node prop drives all content differences\n- Export as default
<!-- SECTION:DESCRIPTION:END -->
