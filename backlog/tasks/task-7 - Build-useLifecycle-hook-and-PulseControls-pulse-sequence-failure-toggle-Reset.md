---
id: TASK-7
title: >-
  Build useLifecycle hook and PulseControls: pulse sequence, failure toggle,
  Reset
status: Done
assignee: []
created_date: '2026-05-04 09:34'
updated_date: '2026-05-04 10:02'
labels: []
dependencies: []
ordinal: 4000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Build the lifecycle state machine and controls UI. Depends on TASK-1, TASK-2. Can be built in parallel with TASK-4, TASK-5, TASK-6.\n\nRequirements:\n\nsrc/hooks/useLifecycle.js:\n- Returns: { lifecycleState, isRunning, isDone, simulateFailure, setSimulateFailure, runLifecycle, resetLifecycle }\n- lifecycleState shape: { activeNodes: string[], failedNodes: string[] }\n- runLifecycle() fires async sequence using setTimeout (wrapped in promises):\n  Step 1 (800ms): activeNodes = ['cr']\n  Step 2 (1200ms): if simulateFailure → failedNodes = ['compliance'], stop. Else activeNodes = ['cr','compliance','fundingCheck']\n  Step 3 (1000ms, success only): activeNodes = ['cr','compliance','fundingCheck'] (settled)\n  Step 4 (1200ms, success only): activeNodes = ['cr','compliance','fundingCheck','orderInitiation']\n- Sets isDone=true after final step\n- resetLifecycle() clears all state back to initial\n\nsrc/components/PulseControls.jsx:\n- 'RUN LIFECYCLE' button (Chakra Petch uppercase, #A4C639 accent, dark bg)\n- Disabled and muted while isRunning=true\n- 'RESET' button appears when isDone=true\n- Toggle: 'SIMULATE COMPLIANCE FAILURE' — checkbox or pill toggle, disabled while isRunning\n- Space Mono for labels\n- Compact horizontal layout
<!-- SECTION:DESCRIPTION:END -->
