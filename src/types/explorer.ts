export type ExplorerMode = 'business' | 'api' | 'schema'

export type ExplorerTab = 'overview' | 'operations' | 'schema' | 'relationships' | 'examples'

export interface ExplorerSelection {
  nodeId?: string
  path?: string
  method?: string
  schemaName?: string
  fieldName?: string
}

export interface PlaybackState {
  isPlaying: boolean
  stepIndex: number
}

export interface ExplorerState {
  mode: ExplorerMode
  selection: ExplorerSelection
  activeTab: ExplorerTab
  searchQuery?: string
  playback: PlaybackState
  activeScenarioId?: string
}

export type ViewSurface = 'navigation' | 'canvas' | 'detail'

export type SearchResultKind = 'node' | 'operation' | 'schema' | 'field'

export interface SearchResult {
  kind: SearchResultKind
  label: string
  sublabel?: string
  nodeId?: string
  path?: string
  method?: string
  schemaName?: string
  fieldName?: string
}
