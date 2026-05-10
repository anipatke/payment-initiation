import { useState } from 'react'
import type { ParsedSchema } from '../../parser/buildSchemaMap'

type ViewMode = 'friendly' | 'raw' | 'schema'

export interface ExampleSection {
  label: string
  schemaName: string
  role: 'request' | 'response' | 'schema'
}

interface ExampleJsonTabProps {
  sections: ExampleSection[]
  examples: Record<string, unknown>
  schemas: Record<string, ParsedSchema>
}

function FriendlyValue({ name, value }: { name: string; value: unknown }) {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return (
      <div className="border border-border rounded overflow-hidden">
        <div className="px-3 py-1.5 bg-surface border-b border-border">
          <p className="font-mono text-[10px] text-text/50">{name}</p>
        </div>
        <div className="divide-y divide-border">
          {Object.entries(value as Record<string, unknown>).map(([key, entry]) => (
            <FriendlyValue key={key} name={key} value={entry} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-3 px-3 py-1.5 font-mono text-[10px]">
      <span className="text-text/80 min-w-[8rem] shrink-0">{name}</span>
      <span className="text-text/50 truncate min-w-0">
        {Array.isArray(value) ? '[]' : String(value)}
      </span>
    </div>
  )
}

function SchemaView({ schema }: { schema: ParsedSchema }) {
  const entries = Object.entries(schema.properties)
  if (entries.length === 0) {
    return <p className="font-mono text-[10px] text-text/30 p-3">No properties defined.</p>
  }
  return (
    <div className="divide-y divide-border">
      {entries.map(([name, prop]) => (
        <div key={name} className="flex gap-3 px-3 py-1.5 font-mono text-[10px]">
          <span className="text-text/80 min-w-[8rem] shrink-0">{name}</span>
          <span className="text-accent/70 min-w-[5rem] shrink-0">
            {prop.ref ?? prop.type}{prop.format ? `(${prop.format})` : ''}
          </span>
          {prop.description && (
            <span className="text-text/40 truncate min-w-0">{prop.description}</span>
          )}
        </div>
      ))}
    </div>
  )
}

export function ExampleJsonTab({ sections, examples, schemas }: ExampleJsonTabProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('friendly')

  if (sections.length === 0) {
    return (
      <p className="font-body text-xs text-text/30">No examples available for this node.</p>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-1">
        {(['friendly', 'raw', 'schema'] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className={[
              'px-2 py-1 font-mono text-[10px] uppercase tracking-wider rounded border transition-colors',
              viewMode === mode
                ? 'border-text/60 text-text'
                : 'border-border text-text/30 hover:text-text/60',
            ].join(' ')}
          >
            {mode === 'friendly' ? 'Friendly' : mode === 'raw' ? 'Raw' : 'Schema'}
          </button>
        ))}
      </div>

      {sections.map((section) => {
        const schema = schemas[section.schemaName]
        const example = examples[section.schemaName]
        const hasContent = viewMode === 'schema' ? schema !== undefined : example !== undefined

        return (
          <div
            key={`${section.schemaName}:${section.label}`}
            className="border border-border rounded overflow-hidden"
          >
            <div className="px-3 py-1.5 bg-surface border-b border-border flex items-center gap-2">
              <p className="font-mono text-[10px] text-text/50 uppercase tracking-wider flex-1">
                {section.label}
              </p>
              <span className="font-mono text-[9px] text-text/25 capitalize">{section.role}</span>
            </div>

            {!hasContent ? (
              <p className="font-body text-[10px] text-text/30 p-3">No data available.</p>
            ) : viewMode === 'friendly' ? (
              <FriendlyValue name={section.schemaName} value={example} />
            ) : viewMode === 'raw' ? (
              <pre className="font-mono text-[10px] text-text/70 p-3 overflow-x-auto leading-relaxed max-h-64">
                {JSON.stringify(example, null, 2)}
              </pre>
            ) : schema ? (
              <SchemaView schema={schema} />
            ) : (
              <p className="font-body text-[10px] text-text/30 p-3">Schema not found.</p>
            )}
          </div>
        )
      })}
    </div>
  )
}
