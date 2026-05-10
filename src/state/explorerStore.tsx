import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { ExplorerMode, ExplorerTab, ExplorerSelection, ExplorerState } from '../types/explorer'
import { MODE_DEFAULT_TAB } from '../utils/modeDisplay'

const INITIAL_SELECTION: ExplorerSelection = {
  nodeId: 'paymentInitiationTransaction',
}

const INITIAL_STATE: ExplorerState = {
  mode: 'business',
  selection: INITIAL_SELECTION,
  activeTab: 'overview',
  playback: { isPlaying: false, stepIndex: -1 },
}

export interface ExplorerActions {
  setMode: (mode: ExplorerMode) => void
  selectNode: (nodeId: string) => void
  selectOperation: (path: string, method: string, nodeId?: string) => void
  selectSchema: (schemaName: string, nodeId?: string) => void
  selectField: (fieldName: string) => void
  setSearchQuery: (query: string) => void
  setActiveTab: (tab: ExplorerTab) => void
  resetSelection: () => void
  startPlay: () => void
  stopPlay: () => void
  advancePlayStep: () => void
  resetPlay: () => void
  setScenario: (scenarioId: string | undefined) => void
}

export interface ExplorerContextValue {
  state: ExplorerState
  actions: ExplorerActions
}

const ExplorerStateContext = createContext<ExplorerContextValue | null>(null)

export function ExplorerStateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ExplorerState>(INITIAL_STATE)

  const setMode = useCallback((mode: ExplorerMode) => {
    setState((prev) => ({ ...prev, mode, activeTab: MODE_DEFAULT_TAB[mode] }))
  }, [])

  const selectNode = useCallback((nodeId: string) => {
    setState((prev) => ({
      ...prev,
      selection: {
        nodeId,
        path: undefined,
        method: undefined,
        schemaName: undefined,
        fieldName: undefined,
      },
    }))
  }, [])

  const selectOperation = useCallback((path: string, method: string, nodeId?: string) => {
    setState((prev) => ({
      ...prev,
      selection: {
        ...prev.selection,
        ...(nodeId !== undefined ? { nodeId } : {}),
        path,
        method,
        schemaName: undefined,
        fieldName: undefined,
      },
    }))
  }, [])

  const selectSchema = useCallback((schemaName: string, nodeId?: string) => {
    setState((prev) => ({
      ...prev,
      selection: {
        ...prev.selection,
        ...(nodeId !== undefined ? { nodeId } : {}),
        schemaName,
        fieldName: undefined,
      },
    }))
  }, [])

  const selectField = useCallback((fieldName: string) => {
    setState((prev) => ({
      ...prev,
      selection: { ...prev.selection, fieldName },
    }))
  }, [])

  const setSearchQuery = useCallback((query: string) => {
    setState((prev) => ({ ...prev, searchQuery: query }))
  }, [])

  const setActiveTab = useCallback((tab: ExplorerTab) => {
    setState((prev) => ({ ...prev, activeTab: tab }))
  }, [])

  const resetSelection = useCallback(() => {
    setState((prev) => ({
      ...prev,
      selection: INITIAL_SELECTION,
      activeTab: 'overview',
    }))
  }, [])

  const startPlay = useCallback(() => {
    setState((prev) => ({ ...prev, playback: { isPlaying: true, stepIndex: 0 } }))
  }, [])

  const stopPlay = useCallback(() => {
    setState((prev) => ({ ...prev, playback: { ...prev.playback, isPlaying: false } }))
  }, [])

  const advancePlayStep = useCallback(() => {
    setState((prev) => ({
      ...prev,
      playback: { ...prev.playback, stepIndex: prev.playback.stepIndex + 1 },
    }))
  }, [])

  const resetPlay = useCallback(() => {
    setState((prev) => ({ ...prev, playback: { isPlaying: false, stepIndex: -1 } }))
  }, [])

  const setScenario = useCallback((scenarioId: string | undefined) => {
    setState((prev) => ({ ...prev, activeScenarioId: scenarioId }))
  }, [])

  const value: ExplorerContextValue = {
    state,
    actions: {
      setMode,
      selectNode,
      selectOperation,
      selectSchema,
      selectField,
      setSearchQuery,
      setActiveTab,
      resetSelection,
      startPlay,
      stopPlay,
      advancePlayStep,
      resetPlay,
      setScenario,
    },
  }

  return (
    <ExplorerStateContext value={value}>{children}</ExplorerStateContext>
  )
}

export function useExplorer(): ExplorerContextValue {
  const ctx = useContext(ExplorerStateContext)
  if (!ctx) throw new Error('useExplorer must be used within ExplorerStateProvider')
  return ctx
}
