import type { ParsedOperation } from '../../parser/buildOperationMap'
import type { ExplorerMode } from '../../types/explorer'

const METHOD_COLOR: Record<string, string> = {
  get: 'text-emerald-400 border-emerald-400/40',
  post: 'text-blue-400 border-blue-400/40',
  put: 'text-amber-400 border-amber-400/40',
  patch: 'text-orange-400 border-orange-400/40',
  delete: 'text-red-400 border-red-400/40',
}

function MethodBadge({ method }: { method: string }) {
  const color = METHOD_COLOR[method.toLowerCase()] ?? 'text-text/50 border-border'
  return (
    <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded border ${color} uppercase`}>
      {method}
    </span>
  )
}

interface OperationsTabProps {
  operations: ParsedOperation[]
  selectedPath?: string
  selectedMethod?: string
  mode?: ExplorerMode
  onSelect?: (path: string, method: string) => void
  onSelectSchema?: (schemaName: string) => void
}

export function OperationsTab({
  operations,
  selectedPath,
  selectedMethod,
  mode = 'api',
  onSelect,
  onSelectSchema,
}: OperationsTabProps) {
  if (operations.length === 0) {
    return <p className="font-body text-xs text-text/30">No operations for this node.</p>
  }

  const showErrors = mode === 'api' || mode === 'schema'

  return (
    <div className="space-y-5">
      {operations.map((op) => {
        const isSelected = op.path === selectedPath && op.method === selectedMethod

        const successResponses = Object.entries(op.responses).filter(([, r]) => !r.isError)
        const errorResponses = Object.entries(op.responses).filter(([, r]) => r.isError)

        return (
          <div
            key={op.operationId}
            role={onSelect ? 'button' : undefined}
            tabIndex={onSelect ? 0 : undefined}
            onClick={() => onSelect?.(op.path, op.method)}
            onKeyDown={(e) => e.key === 'Enter' && onSelect?.(op.path, op.method)}
            className={[
              'border rounded p-3 space-y-2 transition-colors',
              onSelect ? 'cursor-pointer' : '',
              isSelected
                ? 'border-accent/50 bg-accent/5'
                : 'border-border hover:border-border/80',
            ].join(' ')}
          >
            <div className="flex items-center gap-2 flex-wrap">
              <MethodBadge method={op.method} />
              <span className="font-mono text-xs text-text/70 break-all">{op.path}</span>
            </div>

            <p className="font-mono text-[10px] text-text/40">{op.operationId}</p>

            {op.summary && (
              <p className="font-body text-xs text-text/70">{op.summary}</p>
            )}

            {op.parameters.length > 0 && (
              <div>
                <p className="font-mono text-[10px] text-text/40 uppercase tracking-wider mb-1">Parameters</p>
                <div className="space-y-1">
                  {op.parameters.map((param, i) => {
                    const p = param as { name: string; in: string; required?: boolean; description?: string }
                    return (
                      <div key={i} className="flex items-start gap-2 font-mono text-[10px]">
                        <span className="text-text/70 min-w-[80px]">{p.name}</span>
                        <span className="text-text/40 min-w-[40px]">{p.in}</span>
                        {p.required && <span className="text-red-400/70">required</span>}
                        {p.description && (
                          <span className="text-text/40 truncate">{p.description}</span>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {op.requestBody && (
              <div>
                <p className="font-mono text-[10px] text-text/40 uppercase tracking-wider mb-1">Request Body</p>
                <p className="font-mono text-[10px] text-text/60">
                  {op.requestBody.ref ?? op.requestBody.contentType}
                  {op.requestBody.required && <span className="text-red-400/70 ml-1">required</span>}
                </p>
              </div>
            )}

            {successResponses.length > 0 && (
              <div>
                <p className="font-mono text-[10px] text-text/40 uppercase tracking-wider mb-1">Responses</p>
                <div className="space-y-0.5">
                  {successResponses.map(([code, res]) => (
                    <div key={code} className="flex items-start gap-2 font-mono text-[10px]">
                      <span className="min-w-[32px] text-emerald-400">{code}</span>
                      <span className="text-text/60 truncate">{res.schemaRef ?? res.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {showErrors && errorResponses.length > 0 && (
              <div onClick={(e) => e.stopPropagation()}>
                <p className="font-mono text-[10px] text-text/40 uppercase tracking-wider mb-1">Errors</p>
                <div className="space-y-0.5">
                  {errorResponses.map(([code, res]) => (
                    <div key={code} className="flex items-start gap-2 font-mono text-[10px]">
                      <span className="min-w-[32px] text-red-400/70">{code}</span>
                      <span className="text-text/50 min-w-[120px] truncate">{res.description}</span>
                      {res.schemaRef && onSelectSchema && (
                        <button
                          onClick={() => onSelectSchema(res.schemaRef!)}
                          className="text-accent/70 hover:text-accent transition-colors underline underline-offset-2"
                        >
                          {res.schemaRef}
                        </button>
                      )}
                      {res.schemaRef && !onSelectSchema && (
                        <span className="text-accent/50">{res.schemaRef}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
