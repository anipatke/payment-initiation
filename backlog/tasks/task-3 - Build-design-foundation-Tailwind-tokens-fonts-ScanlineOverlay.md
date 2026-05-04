---
id: TASK-3
title: 'Build design foundation: Tailwind tokens, fonts, ScanlineOverlay'
status: Done
assignee: []
created_date: '2026-05-04 09:33'
updated_date: '2026-05-04 09:48'
labels: []
dependencies: []
ordinal: 500
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Establish Atari-Noir visual foundation. Read design.md and CLAUDE.md for all tokens. Depends on TASK-1 (project scaffold).\n\nRequirements:\n- tailwind.config.js: extend theme with exact hex values from design.md — bg-surface (#0D0D0D), bg-surface2 (#0F0F0F), border-quiet (#1A1A1A), border-subtle (#222222), text-primary (#F0E6DA), accent (#A4C639), text-orange (#FC6323), text-purple (#B1A1DF)\n- index.html: add Google Fonts link for Chakra Petch (weights 400,600,700) and Space Mono (400,700)\n- index.css: set font-family defaults — headings use Chakra Petch, body/UI uses Space Mono\n- Create src/components/ScanlineOverlay.jsx: fixed full-screen div with repeating-linear-gradient scanline pattern, pointer-events-none, opacity ~0.04, z-index 50\n- Add ScanlineOverlay to App.jsx wrapping all content\n- Headings: uppercase, letter-spacing tracked (tracking-widest or tracking-wider)
<!-- SECTION:DESCRIPTION:END -->
