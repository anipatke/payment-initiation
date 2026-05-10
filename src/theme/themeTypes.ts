export interface ThemeColors {
  background: string
  surface: string
  primary: string
  secondary: string
  accent: string
  text: string
  textMuted: string
  border: string
  error: string
  success: string
}

export interface ThemeTypography {
  fontFamily: string
  monoFont: string
  headingSize: string
  bodySize: string
  smallSize: string
}

export interface ThemeSpacing {
  xs: string
  sm: string
  md: string
  lg: string
  xl: string
}

export interface ThemeAnimation {
  durationFast: string
  durationNormal: string
  durationSlow: string
  easing: string
}

export interface ThemeNode {
  background: string
  border: string
  selected: string
  related: string
  muted: string
  text: string
}

export interface ThemeEdge {
  color: string
  selected: string
  muted: string
  width: string
}

export interface ThemeBadge {
  background: string
  text: string
  border: string
}

export interface ThemeConfig {
  colors: ThemeColors
  typography: ThemeTypography
  spacing: ThemeSpacing
  borderRadius: string
  animation: ThemeAnimation
  node: ThemeNode
  edge: ThemeEdge
  badge: ThemeBadge
}
