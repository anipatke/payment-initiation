---
id: TASK-15
title: 'Live payload injection — panels show JSON exchanged during lifecycle animation'
status: To Do
assignee: []
created_date: '2026-05-04'
labels: [animation, ui]
dependencies: [TASK-12]
---

## Description

During lifecycle animation, each activated panel shows the actual JSON payload that was "sent" or "received" at that step. Makes the animation educational — the user sees what data flows through the service domain in real time.

### Behaviour

**Step 1 — CR activates:**
- CR panel shows `operation.mockRequest` for the Initiate operation (what the client sent)
- Labelled "→ REQUEST" in small accent text

**Step 2 — Compliance + FundingCheck activate (parallel):**
- Compliance shows its mockRequest (the CR delegating the check)
- FundingCheck shows its mockRequest
- Normal path: both show success
- Failure path: Compliance shows `failurePayload` instead; FundingCheck stays idle

**Step 3 — Satellites return results:**
- Compliance and FundingCheck panels update to show "← RESPONSE" with their mockResponse JSON

**Step 4 — OrderInitiation activates:**
- OrderInitiation panel shows its mockRequest then mockResponse

**Reset:**
- All live payload state clears; panels return to idle (no payload shown)

### Implementation

**`useLifecycle.js` changes:**
- Add `livePayloads` state: `{ [nodeId]: { direction: 'request'|'response', data: object } | null }`
- Emit payload objects per step alongside `activeNodes` state updates:
  ```js
  setLivePayloads({ cr: { direction: 'request', data: crNode.operations[0].mockRequest } });
  ```
- Clear on reset

**Panel component changes (CRPanel + BQPanel):**
- Accept new prop: `livePayload` — `{ direction, data } | null`
- When `livePayload` is set AND panel is active:
  - Show a collapsible `LivePayloadBlock` at the bottom of the panel header area (NOT inside the drawer — visible without clicking)
  - Label: `→ REQUEST` or `← RESPONSE` in font-heading text-[10px] accent/GET-muted
  - Content: `<pre>` formatted JSON, max-h-32 overflow-y-auto, font-body text-[10px] text-text/50
  - Framer Motion: fade+slide-up in when payload arrives, fade out on clear
- When panel is idle: nothing shown

**CommandCenter changes:**
- Pass `livePayloads[node.id]` as `livePayload` prop to each panel

**`LivePayloadBlock` component:**
- New small component: `src/components/LivePayloadBlock.jsx`
- Props: `{ direction, data }` 
- Renders label + pre block inside AnimatePresence

### Key constraint
- Live payload block is visible without expanding the drawer — it sits in the panel header zone so the user sees data flowing even without interaction
- Max height capped to avoid panels becoming unwieldy — `max-h-32 overflow-y-auto`
- Auto-clears when `isActive` goes false (Reset pressed)
