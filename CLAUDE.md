
<!-- BACKLOG.MD MCP GUIDELINES START -->

<CRITICAL_INSTRUCTION>

## BACKLOG WORKFLOW INSTRUCTIONS

This project uses Backlog.md MCP for all task and project management activities.

**CRITICAL GUIDANCE**

- If your client supports MCP resources, read `backlog://workflow/overview` to understand when and how to use Backlog for this project.
- If your client only supports tools or the above request fails, call `backlog.get_backlog_instructions()` to load the tool-oriented overview. Use the `instruction` selector when you need `task-creation`, `task-execution`, or `task-finalization`.

- **First time working here?** Read the overview resource IMMEDIATELY to learn the workflow
- **Already familiar?** You should have the overview cached ("## Backlog.md Overview (MCP)")
- **When to read it**: BEFORE creating tasks, or when you're unsure whether to track work

These guides cover:
- Decision framework for when to create tasks
- Search-first workflow to avoid duplicates
- Links to detailed guides for task creation, execution, and finalization
- MCP tools reference

You MUST read the overview resource to understand the complete workflow. The information is NOT summarized here.

</CRITICAL_INSTRUCTION>

<!-- BACKLOG.MD MCP GUIDELINES END -->

## Project: BIAN Payment Initiation Explorer

Full spec in `PRD.md`. Design tokens in `design.md`. Source data in `BIAN-3-PaymentInitiation-10.0.0-resolved.json`.

### Architectural Decisions (locked)

| Decision | Choice | Reason |
|----------|--------|--------|
| Deploy | Standalone Vercel project | Independent of main site, link from Learning Ledger post |
| Desktop layout | Command Center Grid | CR top full-width, 3 BQ cards below in grid |
| Mobile layout | Vertical stack (all 4 panels) | Radial/grid breaks below 600px |
| Animation | Framer Motion | `useAnimate` + stagger for Atari-Noir easing; fire-and-forget + Reset button |
| Data drawer | Inline expansion | Framer `AnimatePresence`; same behavior on all breakpoints |
| Schema inspector | v1, hardcoded curated excerpts | Static in `flowData.js`; no runtime JSON parsing |
| Failure simulation | Compliance-only toggle | Short-circuits pulse at step 2; high educational value, bounded scope |
| Accent color | NPP Green `#A4C639` | Learning Ledger pillar |
| Stack | React + Vite + Tailwind + Framer Motion | No backend; all data static in `src/data/flowData.js` |

### Layout: Command Center Grid

```
┌─────────────────────────────────────────┐
│  CR — PaymentInitiationTransaction      │  ← full-width top panel, clickable
│  POST /PaymentInitiation/Initiate       │
└─────────────────────────────────────────┘
┌─────────────┐ ┌─────────────┐ ┌─────────────────┐
│  Compliance │ │ FundingCheck│ │ OrderInitiation │  ← 3-col grid, clickable
│  BQ         │ │ BQ          │ │ BQ              │
└─────────────┘ └─────────────┘ └─────────────────┘
```

### Lifecycle Pulse Sequence

1. App → POST `/Initiate` — CR panel lights up
2. CR → Compliance + FundingCheck — both satellite panels flicker (parallel)
3. Satellites → CR — results return, panels settle
4. CR → OrderInitiation — handoff pulse

With `simulateFailure=true`: step 2 shows Compliance reject, sequence stops.

### Data Shape (from JSON)

- **CR**: 19 fields — PayerReference, PayeeReference, Amount, Currency, PaymentMechanism, PaymentPurpose, RecurringPayment*, DateType, Fees, Docs
- **Compliance BQ**: PaymentTransactionComplianceCheckType, PaymentTransactionComplianceCheckResult, PaymentTransactionComplianceTaskResult
- **FundingCheck BQ**: PaymentTransactionFundingCheckResult (1 field)
- **OrderInitiation BQ**: PaymentOrderProcedureInstanceReference, PaymentOrderProcedureInstanceStatus, OrderInitiationTaskResult
