import type { ParsedSchema } from '../../parser/buildSchemaMap'

interface SchemaTabProps {
  schemas: ParsedSchema[]
  selectedSchemaName?: string
  onSelect?: (schemaName: string) => void
  selectedFieldName?: string
  onSelectField?: (fieldName: string) => void
  fieldUsageIndex?: Record<string, string[]>
  highlightedFields?: Set<string>
}

export function SchemaTab({
  schemas,
  selectedSchemaName,
  onSelect,
  selectedFieldName,
  onSelectField,
  fieldUsageIndex,
  highlightedFields,
}: SchemaTabProps) {
  if (schemas.length === 0) {
    return <p className="font-body text-xs text-text/30">No schemas for this node.</p>
  }

  return (
    <div className="space-y-5">
      {schemas.map((schema) => {
        const isSelected = schema.name === selectedSchemaName
        return (
          <div
            key={schema.name}
            role={onSelect ? 'button' : undefined}
            tabIndex={onSelect ? 0 : undefined}
            onClick={() => onSelect?.(schema.name)}
            onKeyDown={(e) => e.key === 'Enter' && onSelect?.(schema.name)}
            className={[
              'border rounded p-3 space-y-2 transition-colors',
              onSelect ? 'cursor-pointer' : '',
              isSelected
                ? 'border-accent/50 bg-accent/5'
                : 'border-border hover:border-border/80',
            ].join(' ')}
          >
            <div>
              <p className="font-heading text-xs tracking-wider uppercase">{schema.name}</p>
              {schema.description && (
                <p className="font-body text-[10px] text-text/50 mt-0.5">{schema.description}</p>
              )}
            </div>

            {Object.keys(schema.properties).length > 0 ? (
              <div className="space-y-1">
                <p className="font-mono text-[10px] text-text/40 uppercase tracking-wider">Fields</p>
                {Object.values(schema.properties).map((prop) => {
                  const isFieldSelected = prop.name === selectedFieldName
                  const isScenarioHighlighted = highlightedFields?.has(prop.name) ?? false
                  const usedIn = fieldUsageIndex?.[prop.name] ?? []
                  return (
                    <div key={prop.name}>
                      <div
                        role={onSelectField ? 'button' : undefined}
                        tabIndex={onSelectField ? 0 : undefined}
                        onClick={(e) => {
                          e.stopPropagation()
                          onSelectField?.(prop.name)
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.stopPropagation()
                            onSelectField?.(prop.name)
                          }
                        }}
                        className={[
                          'flex items-start gap-2 font-mono text-[10px] rounded px-1 py-0.5 -mx-1 transition-colors',
                          onSelectField ? 'cursor-pointer' : '',
                          isFieldSelected
                            ? 'bg-accent/10 text-text'
                            : isScenarioHighlighted
                              ? 'bg-accent/5 text-text ring-1 ring-accent/30'
                              : 'hover:bg-accent/5',
                        ].join(' ')}
                      >
                        <span className={['min-w-[120px] truncate', isFieldSelected ? 'text-text' : 'text-text/80'].join(' ')}>
                          {prop.name}
                          {schema.required?.includes(prop.name) && (
                            <span className="text-red-400/70 ml-0.5">*</span>
                          )}
                        </span>
                        <span className="text-text/40 min-w-[60px]">
                          {prop.ref ?? prop.type}
                          {prop.format && <span className="text-text/30">({prop.format})</span>}
                        </span>
                        {prop.description && !isFieldSelected && (
                          <span className="text-text/30 truncate min-w-0">{prop.description}</span>
                        )}
                      </div>

                      {isFieldSelected && (
                        <div className="ml-1 mt-1 mb-1 pl-2 border-l border-accent/30 space-y-0.5">
                          {prop.description && (
                            <p className="font-body text-[10px] text-text/50">{prop.description}</p>
                          )}
                          {prop.ref && (
                            <p className="font-mono text-[10px] text-text/40">
                              ref: <span className="text-accent/70">{prop.ref}</span>
                            </p>
                          )}
                          {prop.enum && prop.enum.length > 0 && (
                            <p className="font-mono text-[10px] text-text/40">
                              enum: {prop.enum.join(' | ')}
                            </p>
                          )}
                          {fieldUsageIndex && (
                            <p className="font-mono text-[10px] text-text/30 truncate" title={usedIn.join(', ')}>
                              used in: {usedIn.length === 0 ? 'none' : usedIn.join(', ')}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="font-mono text-[10px] text-text/30">No properties.</p>
            )}
          </div>
        )
      })}
    </div>
  )
}
