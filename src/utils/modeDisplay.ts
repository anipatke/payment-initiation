import type { ExplorerMode, ExplorerTab } from '../types/explorer'

export const MODE_DEFAULT_TAB: Record<ExplorerMode, ExplorerTab> = {
  business: 'overview',
  api: 'operations',
  schema: 'schema',
}

export const MODE_TAB_LABELS: Record<ExplorerMode, Record<ExplorerTab, string>> = {
  business: {
    overview: 'Overview',
    operations: 'Activities',
    schema: 'Fields',
    relationships: 'Links',
    examples: 'Preview',
  },
  api: {
    overview: 'Overview',
    operations: 'Ops',
    schema: 'Schema',
    relationships: 'Links',
    examples: 'JSON',
  },
  schema: {
    overview: 'Overview',
    operations: 'Ops',
    schema: 'Fields',
    relationships: 'Links',
    examples: 'Samples',
  },
}

export function showMethodBadges(mode: ExplorerMode): boolean {
  return mode === 'api'
}
