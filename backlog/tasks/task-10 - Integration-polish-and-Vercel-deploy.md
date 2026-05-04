---
id: TASK-10
title: 'Integration, polish, and Vercel deploy'
status: Done
assignee: []
created_date: '2026-05-04 09:35'
updated_date: '2026-05-04 10:24'
labels: []
dependencies: []
ordinal: 15.625
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Final integration pass, visual QA, and deploy. Depends on TASK-8 and TASK-9.\n\nRequirements:\n- Wire App.jsx: useLifecycle hook at root, pass all state down to CommandCenter\n- Verify full golden path: page loads → Run Lifecycle → all 4 panels animate in sequence → Reset → repeat\n- Verify failure path: toggle Simulate Compliance Failure → Run Lifecycle → only CR and Compliance activate, Compliance shows red, sequence stops\n- Verify click-to-explore: click CR → drawer opens → click again closes → click BQ → opens → only one open at a time\n- Verify schema inspector: expand any panel → click UNDER THE HOOD → schemaExcerpt JSON displays in pre block\n- Mobile check at 375px: all panels stack, no overflow, drawers expand cleanly\n- Add page title in Chakra Petch uppercase: 'PAYMENT INITIATION EXPLORER' with subtitle 'BIAN Service Domain v10.0.0' in Space Mono muted\n- Add small footer: 'Learning Ledger — anipatke.com' in Space Mono, muted, link to site\n- vercel.json already created in TASK-1, confirm it handles SPA routing\n- Deploy: push to GitHub repo at https://github.com/anipatke/payment-initiation, Vercel auto-deploys\n- Confirm deployed URL loads and all interactions work
<!-- SECTION:DESCRIPTION:END -->
