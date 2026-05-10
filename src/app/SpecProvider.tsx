import { createContext, useContext, useMemo, type ReactNode } from 'react'
import type { ParsedSpec } from '../parser/parseOpenApi'
import type { DomainMap, RelationshipIndexes } from '../types/domainMap'
import type { ThemeConfig } from '../theme/themeTypes'
import { parseOpenApi } from '../parser/parseOpenApi'
import { buildRelationshipIndexes } from '../parser/buildRelationshipIndexes'
import { generateExampleJson } from '../parser/generateExampleJson'
import { paymentInitiationDomainMap } from '../data/paymentInitiationDomainMap'
import { explorerTheme } from '../theme/explorerTheme'
import specData from '../data/bian-payment-initiation-openapi.json'

export interface SpecContextValue {
  parsedSpec: ParsedSpec
  domainMap: DomainMap
  relationshipIndexes: RelationshipIndexes
  examples: Record<string, unknown>
  theme: ThemeConfig
}

const SpecContext = createContext<SpecContextValue | null>(null)

export function SpecProvider({ children }: { children: ReactNode }) {
  const value = useMemo<SpecContextValue>(() => {
    const parsedSpec = parseOpenApi(specData as any)
    const domainMap = paymentInitiationDomainMap
    const relationshipIndexes = buildRelationshipIndexes(domainMap, parsedSpec)

    const examples: Record<string, unknown> = {}
    for (const schemaName of Object.keys(parsedSpec.schemas.schemas)) {
      examples[schemaName] = generateExampleJson(
        schemaName,
        parsedSpec.schemas.schemas,
      )
    }

    return { parsedSpec, domainMap, relationshipIndexes, examples, theme: explorerTheme }
  }, [])

  return <SpecContext value={value}>{children}</SpecContext>
}

export function useSpec(): SpecContextValue {
  const ctx = useContext(SpecContext)
  if (!ctx) throw new Error('useSpec must be used within SpecProvider')
  return ctx
}
