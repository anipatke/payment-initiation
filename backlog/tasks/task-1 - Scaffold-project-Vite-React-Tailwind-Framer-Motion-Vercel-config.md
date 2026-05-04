---
id: TASK-1
title: 'Scaffold project: Vite + React + Tailwind + Framer Motion + Vercel config'
status: Done
assignee:
  - Codex
created_date: '2026-05-04 09:33'
updated_date: '2026-05-04 09:45'
labels: []
dependencies: []
documentation:
  - PRD.md
  - CLAUDE.md
  - design.md
ordinal: 1000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Initialize the React+Vite project for the BIAN Payment Initiation Explorer. Read PRD.md and CLAUDE.md for full context.\n\nRequirements:\n- Run: npm create vite@latest . -- --template react\n- Install: tailwindcss, @tailwindcss/vite, framer-motion\n- Configure Tailwind with custom design tokens from design.md (colors: #121212 bg, #0D0D0D surface, #1A1A1A border, #F0E6DA text, #A4C639 accent)\n- Add Google Fonts: Chakra Petch (headings), Space Mono (body/UI)\n- Create vercel.json with static SPA config\n- Create src/ directory structure per PRD.md section 8: components/, data/, hooks/\n- App.jsx renders a placeholder CommandCenter with correct bg color (#121212)\n- Confirm dev server starts and shows dark background
<!-- SECTION:DESCRIPTION:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Scaffold the Vite React app structure in the repo root with the files the PRD expects: `index.html`, `package.json`, `vite.config.*`, `src/` tree, and `vercel.json`.
2. Wire Tailwind v4 for Vite with the Atari-Noir token set from `design.md`: background, surface, border, text, accent, plus Chakra Petch and Space Mono font imports.
3. Create the initial React entry points so `App.jsx` renders a placeholder `CommandCenter` on the dark `#121212` background and the app boots cleanly.
4. Add the project directory structure under `src/components`, `src/data`, and `src/hooks`, plus placeholder component files for the later tasks.
5. Verify the app builds and the dev server starts, then confirm the first screen is the expected dark shell for the explorer.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Scaffolded the Vite React app in the repo root, added Tailwind v4 + Framer Motion dependencies, and wired the Atari-Noir token set in `src/styles/index.css` with Chakra Petch and Space Mono imports.

Added the expected `src/components`, `src/data`, and `src/hooks` structure with a placeholder `CommandCenter` shell plus stub modules for the later feature tasks.

Verified `npm run build` succeeds and started Vite locally on `http://127.0.0.1:4173` during the runtime check.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Implemented the TASK-1 project scaffold for the BIAN Payment Initiation Explorer.

Changed:
- Added `package.json` with Vite, React, Tailwind CSS v4, `@tailwindcss/vite`, `@vitejs/plugin-react`, and `framer-motion`.
- Added `index.html`, `vite.config.js`, `vercel.json`, and `.gitignore` for the SPA/Vercel setup.
- Created the `src/` structure required by the PRD: `components/`, `data/`, and `hooks/`.
- Wired Tailwind theme tokens and font imports in `src/styles/index.css` for the Atari-Noir palette and typography.
- Added a placeholder `CommandCenter` shell and stub component/data/hook modules for the later tasks.

Verification:
- `npm install`
- `npm run build`
- Started Vite locally and confirmed it came up on `http://127.0.0.1:4173` during the runtime check.

Notes:
- The dev-server check required running outside the sandbox because the sandboxed Node/esbuild spawn hit `EPERM`.
<!-- SECTION:FINAL_SUMMARY:END -->
