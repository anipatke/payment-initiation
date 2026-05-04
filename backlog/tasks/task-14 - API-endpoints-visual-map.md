---
id: TASK-14
title: 'API endpoints visual map — all endpoints, method badges, lifecycle highlighting, inline schema'
status: To Do
assignee: []
created_date: '2026-05-04'
labels: [ui, api]
dependencies: [TASK-12]
---

## Description

Build a new `EndpointsMap` section below the Command Center panels. Shows all 6 BIAN endpoints grouped by CR/BQ, with method badges, paths, and animated highlighting during lifecycle animation. Click any endpoint to expand inline request/response schema.

### Visual structure

```
── API ENDPOINTS ────────────────────────────────────────────

  CR — PaymentInitiationTransaction
  ├─ [POST]  /PaymentInitiation/Initiate                     ▾
  ├─ [PUT]   /PaymentInitiation/{id}/Update
  └─ [GET]   /PaymentInitiation/{id}/Retrieve

  BQ — Compliance
  └─ [GET]   /PaymentInitiation/{id}/Compliance/{id}/Retrieve

  BQ — FundingCheck
  └─ [GET]   /PaymentInitiation/{id}/FundingCheck/{id}/Retrieve

  BQ — OrderInitiation
  └─ [GET]   /PaymentInitiation/{id}/OrderInitiation/{id}/Retrieve
```

### Method badges
- `POST` → accent green (`#A4C639`) border + text
- `PUT`  → orange (`#FC6323`) border + text
- `GET`  → muted white/30 border + text
- Fixed width badge: `w-12 text-center font-heading text-[10px] tracking-wider border px-1 py-0.5`

### Lifecycle highlighting
- When lifecycle runs and a node activates, all endpoints in that node's group get a left-border glow pulse (same NPP Green glow as panel)
- Only the *primary* endpoint (the one used in the lifecycle) gets the animated pulse; others in the group dim slightly to indicate they exist but aren't active in this flow
- `activeNodes` from `useLifecycle` prop passed into EndpointsMap

### Expandable endpoint rows
- Click any endpoint row → AnimatePresence expand (same pattern as panel drawers)
- Expanded content shows two columns:
  - **Request** (if POST/PUT): formatted JSON mock from `operation.mockRequest`
  - **Response**: formatted JSON mock from `operation.mockResponse`
  - Both in `<pre>` blocks, `font-body text-xs text-text/50`, border, bg-surface-2
- If GET with no body: show "No request body" muted label in request column
- Only one endpoint expanded at a time (like panel drawer toggle)

### Group headers
- `CR — PaymentInitiationTransaction` / `BQ — Compliance` etc.
- `font-heading text-xs tracking-[0.18em] text-accent/60 uppercase`
- Clicking group header does nothing (not expandable)

### Section header
- `── API ENDPOINTS ──────────` rendered as a full-width divider with the label embedded
- Same muted style as other section headers

### New component
- `src/components/EndpointsMap.jsx`
- Props: `{ nodes, activeNodes }` where `nodes` = full flowData array, `activeNodes` from lifecycle state

### CommandCenter update
- Add `<EndpointsMap nodes={flowData} activeNodes={activeNodes} />` below the BQ grid, inside the section

### Data dependency
- Requires `operations` array on each node from TASK-11
- Requires `mockRequest` and `mockResponse` on each operation from TASK-11
