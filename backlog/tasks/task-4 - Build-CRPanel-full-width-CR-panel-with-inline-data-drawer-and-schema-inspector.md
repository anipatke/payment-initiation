---
id: TASK-4
title: >-
  Build CRPanel: full-width CR panel with inline data drawer and schema
  inspector
status: Done
assignee: []
created_date: '2026-05-04 09:33'
updated_date: '2026-05-04 09:51'
labels: []
dependencies: []
ordinal: 250
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Build the top full-width Control Record panel. Depends on TASK-1, TASK-2, TASK-3.\n\nRequirements:\n- src/components/CRPanel.jsx accepts props: node (flowData CR object), isActive (bool, pulse state), isExpanded (bool), onToggle (fn)\n- Layout: full-width dark panel (#0D0D0D surface), 1px border (#1A1A1A), Chakra Petch uppercase label 'CR — PAYMENT INITIATION TRANSACTION'\n- Sub-label: API path in Space Mono, muted text\n- Click anywhere on panel header → calls onToggle\n- isActive=true: apply green glow (box-shadow with #A4C639 at low opacity, e.g. 0 0 20px rgba(164,198,57,0.3))\n- Inline expansion (Framer AnimatePresence + motion.div height animate): shows fields from node.fields as key-value pairs in Space Mono\n- Schema inspector toggle button inside expanded drawer: 'UNDER THE HOOD' label, toggles display of node.schemaExcerpt in a <pre> block\n- Only one section open at a time (parent controls isExpanded state)\n- No external state — fully controlled component
<!-- SECTION:DESCRIPTION:END -->
