---
id: TASK-8
title: 'Wire pulse animation into panels: Framer Motion glow and flicker states'
status: Done
assignee: []
created_date: '2026-05-04 09:34'
updated_date: '2026-05-04 10:02'
labels: []
dependencies: []
ordinal: 62.5
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Connect lifecycle state to panel visual animations. Depends on TASK-6 and TASK-7.\n\nRequirements:\n- In CRPanel and BQPanel, use Framer Motion 'animate' prop on the panel wrapper to transition box-shadow based on isActive/isFailed props\n- Active glow: box-shadow '0 0 24px rgba(164,198,57,0.35), 0 0 8px rgba(164,198,57,0.2)'\n- Failed glow (compliance only): box-shadow '0 0 24px rgba(239,68,68,0.4), 0 0 8px rgba(239,68,68,0.25)'\n- Idle: box-shadow 'none'\n- Transition: duration 0.4s ease\n- Flicker effect during step 2 (processing): use Framer keyframes on opacity [1, 0.6, 1, 0.7, 1] over 0.8s when node transitions to active\n- Flicker only plays once on activation, then settles to steady glow\n- Use Framer Motion 'variants' pattern for clean state management\n- Verify: run lifecycle in browser, all 4 panels animate correctly in sequence, failure mode shows red on compliance only
<!-- SECTION:DESCRIPTION:END -->
