
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
| Desktop layout | CR sticky-left (1/3) + BQs stacked-right (2/3) | Long BIAN field names overflow 3-col grid; left panel gives CR room |
| Mobile layout | Vertical stack (all 4 panels) | Same as before; no change |
| Animation | Framer Motion | `useAnimate` + stagger for Atari-Noir easing; fire-and-forget + Reset button |
| Data drawer | Inline expansion | Framer `AnimatePresence`; same behavior on all breakpoints |
| Field labels | shortLabel primary, full BIAN name secondary | Consumability over accuracy; `PaymentTransactionComplianceCheckType` → `Check Type` |
| Schema inspector | Full schema from flowData, all fields | Extended from curated excerpts to complete field set |
| Failure simulation | Compliance-only toggle | Short-circuits pulse at step 2; high educational value, bounded scope |
| Accent color | NPP Green `#A4C639` | Learning Ledger pillar |
| Stack | React + Vite + Tailwind + Framer Motion | No backend; all data static in `src/data/flowData.js` |
| Scope | Full service domain — all 6 endpoints | Not just Initiate flow; covers CR Initiate/Update/Retrieve + all 3 BQ Retrieves |
| Educational layer | Panel descriptions + field meanings in flowData | Banker audience; plain-English blurbs hardcoded in flowData.js |
| Live payloads | Emitted per lifecycle step from useLifecycle | Panels show REQUEST/RESPONSE JSON during animation |
| API map | EndpointsMap component, all 6 endpoints | Visual linking of paths in/out of service domain; method badges + expandable schema |
| ConnectionLine | Removed from render tree | Glow states on panels carry animation; connector lines add clutter not clarity |

### Layout: CR-Left + BQs-Right (Desktop)

```
┌──────────────────┬──────────────────────────────────┐
│  CR Panel        │  Compliance BQ                   │
│  (w-1/3)         │  FundingCheck BQ                 │
│  sticky top      │  OrderInitiation BQ              │
│                  │  (stacked, w-2/3)                │
└──────────────────┴──────────────────────────────────┘
── API ENDPOINTS ─────────────────────────────────────
  CR   [POST] /PaymentInitiation/Initiate
       [PUT]  /PaymentInitiation/{id}/Update
       [GET]  /PaymentInitiation/{id}/Retrieve
  BQ   [GET]  /PaymentInitiation/{id}/Compliance/{id}/Retrieve
       [GET]  /PaymentInitiation/{id}/FundingCheck/{id}/Retrieve
       [GET]  /PaymentInitiation/{id}/OrderInitiation/{id}/Retrieve
```

### Lifecycle Pulse Sequence

1. App → POST `/Initiate` — CR panel lights up, shows REQUEST payload
2. CR → Compliance + FundingCheck — both BQ panels flicker, show their REQUEST
3. Satellites → CR — panels show RESPONSE, settle to active state
4. CR → OrderInitiation — handoff pulse, shows REQUEST then RESPONSE

With `simulateFailure=true`: step 2 shows Compliance reject (red glow, failure payload), sequence stops.

### Data Shape (from JSON) — Full Service Domain

**flowData.js node structure:**
```js
{
  id, label, role,
  description,        // plain-English 2–3 sentence blurb (banker audience)
  primaryPath,        // main endpoint used in lifecycle pulse
  operations: [{ operationId, method, path, summary, mockRequest, mockResponse }],
  fields: [{ name, shortLabel, type, meaning }],  // ALL fields from schema
  schemaExcerpt,      // full JSON schema string
  successPayload, failurePayload,
}
```

**CR (PaymentInitiationTransaction):** 20 fields, 3 operations (Initiate POST, Update PUT, Retrieve GET)
**Compliance BQ:** 3 fields, 1 operation (Retrieve GET)
**FundingCheck BQ:** 1 field, 1 operation (Retrieve GET)
**OrderInitiation BQ:** 3 fields, 1 operation (Retrieve GET)
