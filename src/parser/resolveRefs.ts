const LOCAL_REF_PATTERN = /^#\/components\/(schemas|responses|requestBodies|parameters)\/(.+)$/

export function resolveRefName(ref: string): string | null {
  const match = LOCAL_REF_PATTERN.exec(ref)
  return match ? match[2] : null
}

export function isLocalRef(value: unknown): value is { $ref: string } {
  return (
    typeof value === 'object' &&
    value !== null &&
    '$ref' in value &&
    typeof (value as { $ref: string }).$ref === 'string'
  )
}

export function extractRefName(value: { $ref: string }): string {
  const name = resolveRefName(value.$ref)
  if (!name) throw new Error(`Cannot resolve local $ref: ${value.$ref}`)
  return name
}
