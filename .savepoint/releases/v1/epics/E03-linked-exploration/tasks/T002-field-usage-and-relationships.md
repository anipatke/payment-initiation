---
id: E03-linked-exploration/T002-field-usage-and-relationships
status: done
objective: "Add field-level selection and complete relationship displays for nodes, operations, schemas, and fields."
depends_on: ["E03-linked-exploration/T001-operation-schema-navigation"]
---

# T002 — Field Usage And Relationships

## Context Files

- `src/components/detail/SchemaTab.tsx`
- `src/components/detail/RelationshipsTab.tsx`
- `src/parser/buildSchemaMap.ts`
- `src/state/explorerStore.ts`

## Acceptance Criteria

- [x] Clicking a field shows all schemas where that field is used.
- [x] Field detail includes type, referenced schema if applicable, and usage context.
- [x] Relationships tab shows parent node, child nodes, related operations, related schemas, and related fields where applicable.
- [x] Related elements highlight without hiding unrelated navigation context.

## Implementation Plan

- [x] Add field selection state and actions.
- [x] Add field usage view in Schema and Relationships tabs.
- [x] Add related-field highlighting in schema displays.
- [x] Validate behavior for Amount, Compliance fields, FundingCheck result, and OrderInitiation status fields.
- [x] Run the build gate.

## Context Log

- Files read: SchemaTab.tsx, RelationshipsTab.tsx, buildSchemaMap.ts, explorerStore.tsx, DetailPanel.tsx, SpecProvider.tsx, explorer.ts, T001 task
- Notes: Keep progressive disclosure; do not show every field everywhere by default. Field usage index built once in DetailPanel via useMemo. relatedFields derived from selected schemaName's properties.
