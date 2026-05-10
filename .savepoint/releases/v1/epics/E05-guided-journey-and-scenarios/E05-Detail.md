---
id: E05-guided-journey-and-scenarios
status: audited
title: Guided Journey And Scenarios
---

# E05 — Guided Journey And Scenarios

## Objective

Add guided learning behavior: play-through journey animation, scenario toggles, branch highlighting, responsive polish, and release-level quality gates.

## Scope

- Play Journey control.
- Pulse sequence across Customer, Channel, PaymentInitiationTransaction, FundingCheck, Compliance, OrderInitiation, and Downstream Processing.
- Scenario toggles for one-off, scheduled, recurring, compliance review, and funding issue.
- Status chips and branch highlights.
- Final responsive and accessibility polish.

## Tasks

| Task | Objective | Depends On |
|------|-----------|------------|
| T001 | Add journey play state and animation layer | [E04/T003] |
| T002 | Add scenario toggles and branch highlighting | [T001] |
| T003 | Final responsive polish and release gates | [T002] |

## Acceptance Criteria

- The flow animation teaches the payment journey without inventing backend rules.
- Scenarios highlight relevant fields and branches.
- The explorer remains usable on desktop and mobile.
- Full quality gates pass before audit.

## Implemented As

- Journey playback state lives in `src/state/explorerStore.tsx`.
- The animation layer lives in `src/components/canvas/FlowAnimationLayer.tsx`.
- The journey pulse sequence lives in `src/components/canvas/journeySequence.ts`.
- Visual-only scenario definitions live in `src/data/scenarios.ts`.
- Scenario highlighting is rendered by `JourneyCanvas`, `JourneyNode`, `DetailPanel`, and `SchemaTab`.
