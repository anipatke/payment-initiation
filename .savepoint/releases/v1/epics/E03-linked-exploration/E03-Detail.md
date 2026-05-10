---
id: E03-linked-exploration
status: audited
title: Linked Exploration
---

# E03 — Linked Exploration

## Objective

Make every exploration surface synchronized: operations, schemas, fields, search results, canvas nodes, detail tabs, and highlights all reflect the same selected concept.

## Scope

- Reverse navigation from operation and schema lists.
- Field usage selection.
- Search indexing and result navigation.
- Relationship tab completeness.
- Dual highlighting across canvas, navigation, and detail sections.

## Tasks

| Task | Objective | Depends On |
|------|-----------|------------|
| T001 | Wire operation and schema reverse navigation | [E02/T004] |
| T002 | Add field usage and relationship navigation | [T001] |
| T003 | Add search index and search result navigation | [T002] |

## Acceptance Criteria

- Selecting an endpoint highlights the corresponding node.
- Selecting a schema highlights related nodes and operations.
- Selecting a field shows where it is used.
- Search finds nodes, endpoints, operation IDs, schemas, and fields.

## Implemented As

- Operation and schema navigation share explorer selection state with the canvas, navigation list, and detail tabs.
- Field selection is represented in explorer state and surfaced in schema details with type, reference, enum, and usage context.
- Relationship detail renders parent/child journey edges plus related operations, schemas, and selected-schema fields.
- Search indexing lives in `src/utils/buildSearchIndex.ts` and covers node labels, operation IDs, endpoint paths, schema names, and schema field names.
- Audit applied derived `nodeId` context for operation, schema, and field search results so search-click navigation updates the visual canvas highlight when a related node exists.
