---
id: E03-linked-exploration/T003-search-index-and-results
status: done
objective: "Add search over node labels, endpoint paths, operation IDs, schema names, and field names with clickable results."
depends_on: ["E03-linked-exploration/T002-field-usage-and-relationships"]
---

# T003 — Search Index And Results

## Context Files

- `src/components/navigation/SearchBox.tsx`
- `src/state/explorerStore.ts`
- `src/types/explorer.ts`
- `src/parser/buildSchemaMap.ts`

## Acceptance Criteria

- [x] Search finds node labels.
- [x] Search finds endpoint paths and operation IDs.
- [x] Search finds schema names.
- [x] Search finds field names.
- [x] Clicking a result selects the related item, updates detail panel, and highlights the related visual node when one exists.

## Implementation Plan

- [x] Add `src/utils/buildSearchIndex.ts`.
- [x] Add typed search result model.
- [x] Render grouped search results in the left navigation.
- [x] Add keyboard-safe and mobile-safe result interactions.
- [x] Run the build gate.

## Context Log

- Files read: pending
- Estimated input tokens: pending
- Notes: Keep search local and deterministic.
