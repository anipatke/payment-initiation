import { useState, useRef, useCallback, useMemo } from 'react'
import { useExplorer } from '../../state/explorerStore'
import { useSpec } from '../../app/SpecProvider'
import {
  buildSearchIndex,
  querySearchIndex,
  SEARCH_KIND_ORDER,
} from '../../utils/buildSearchIndex'
import type { SearchResult, SearchResultKind } from '../../types/explorer'

const KIND_LABELS: Record<SearchResultKind, string> = {
  node: 'Nodes',
  operation: 'Operations',
  schema: 'Schemas',
  field: 'Fields',
}

interface ResultGroup {
  kind: SearchResultKind
  items: Array<{ result: SearchResult; flatIdx: number }>
}

function buildGroups(results: SearchResult[]): ResultGroup[] {
  let idx = 0
  const groups: ResultGroup[] = []
  for (const kind of SEARCH_KIND_ORDER) {
    const kindResults = results.filter((r) => r.kind === kind)
    if (!kindResults.length) continue
    groups.push({
      kind,
      items: kindResults.map((result) => ({ result, flatIdx: idx++ })),
    })
  }
  return groups
}

export function SearchBox() {
  const { parsedSpec, domainMap } = useSpec()
  const { actions } = useExplorer()

  const [query, setQuery] = useState('')
  const [activeIdx, setActiveIdx] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)

  const index = useMemo(
    () => buildSearchIndex(parsedSpec, domainMap),
    [parsedSpec, domainMap],
  )

  const results = useMemo(
    () => querySearchIndex(index, query),
    [index, query],
  )

  const groups = useMemo(() => buildGroups(results), [results])
  const totalResults = results.length

  const selectResult = useCallback(
    (result: SearchResult) => {
      switch (result.kind) {
        case 'node':
          actions.selectNode(result.nodeId!)
          actions.setActiveTab('overview')
          break
        case 'operation':
          actions.selectOperation(result.path!, result.method!, result.nodeId)
          actions.setActiveTab('operations')
          break
        case 'schema':
          actions.selectSchema(result.schemaName!, result.nodeId)
          actions.setActiveTab('schema')
          break
        case 'field':
          actions.selectSchema(result.schemaName!, result.nodeId)
          actions.selectField(result.fieldName!)
          actions.setActiveTab('schema')
          break
      }
      setQuery('')
      setActiveIdx(-1)
      inputRef.current?.blur()
    },
    [actions],
  )

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
    setActiveIdx(-1)
  }, [])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Escape') {
        setQuery('')
        setActiveIdx(-1)
        inputRef.current?.blur()
        return
      }
      if (!totalResults) return
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActiveIdx((prev) => Math.min(prev + 1, totalResults - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActiveIdx((prev) => Math.max(prev - 1, 0))
      } else if (e.key === 'Enter' && activeIdx >= 0) {
        e.preventDefault()
        const flat = groups.flatMap((g) => g.items)
        const entry = flat.find((item) => item.flatIdx === activeIdx)
        if (entry) selectResult(entry.result)
      }
    },
    [totalResults, activeIdx, groups, selectResult],
  )

  const showResults = query.trim().length > 0

  return (
    <div className="relative border-b border-border">
      <div className="p-3">
        <input
          ref={inputRef}
          type="search"
          placeholder="Search nodes, ops, schemas…"
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          spellCheck={false}
          className="w-full bg-surface border border-border rounded px-3 py-1.5 font-body text-xs text-text placeholder-text/40 outline-none focus:border-accent transition-colors"
          aria-label="Search"
          aria-controls={showResults ? 'search-results' : undefined}
          aria-expanded={showResults}
          aria-activedescendant={
            activeIdx >= 0 ? `search-result-${activeIdx}` : undefined
          }
          role="combobox"
          aria-autocomplete="list"
        />
      </div>

      {showResults && (
        <div
          id="search-results"
          role="listbox"
          aria-label="Search results"
          className="absolute left-0 right-0 top-full z-50 max-h-72 overflow-y-auto border-t border-border bg-surface shadow-lg"
        >
          {totalResults === 0 ? (
            <div className="px-3 py-3 font-body text-xs text-text/40">
              No results for &ldquo;{query}&rdquo;
            </div>
          ) : (
            groups.map((group) => (
              <div key={group.kind} role="group" aria-label={KIND_LABELS[group.kind]}>
                <div className="sticky top-0 bg-surface px-3 pb-0.5 pt-2 font-body text-[10px] uppercase tracking-wider text-text/30">
                  {KIND_LABELS[group.kind]}
                </div>
                {group.items.map(({ result, flatIdx }) => {
                  const isActive = flatIdx === activeIdx
                  return (
                    <button
                      key={`${result.kind}-${result.label}-${result.sublabel ?? ''}`}
                      id={`search-result-${flatIdx}`}
                      role="option"
                      aria-selected={isActive}
                      onClick={() => selectResult(result)}
                      onMouseEnter={() => setActiveIdx(flatIdx)}
                      className={`w-full cursor-pointer px-3 py-1.5 text-left font-body text-xs transition-colors ${
                        isActive
                          ? 'bg-accent/15 text-accent'
                          : 'text-text hover:bg-border/30'
                      }`}
                    >
                      <span className="block truncate">{result.label}</span>
                      {result.sublabel && (
                        <span className="block truncate font-body text-[10px] text-text/40">
                          {result.sublabel}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
