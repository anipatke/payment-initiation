import type { ThemeConfig } from './themeTypes'

export const explorerTheme: ThemeConfig = {
  colors: {
    background: '#121212',
    surface: '#0D0D0D',
    primary: '#A4C639',
    secondary: '#B1A1DF',
    accent: '#FC6323',
    text: '#F0E6DA',
    textMuted: '#6B6560',
    border: '#1A1A1A',
    error: '#E05252',
    success: '#A4C639',
  },
  typography: {
    fontFamily: '"Chakra Petch", system-ui, sans-serif',
    monoFont: '"Space Mono", "Courier New", monospace',
    headingSize: '1rem',
    bodySize: '0.875rem',
    smallSize: '0.75rem',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '40px',
  },
  borderRadius: '4px',
  animation: {
    durationFast: '120ms',
    durationNormal: '240ms',
    durationSlow: '480ms',
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  node: {
    background: '#0F0F0F',
    border: '#222222',
    selected: '#A4C639',
    related: '#B1A1DF',
    muted: '#2A2A2A',
    text: '#F0E6DA',
  },
  edge: {
    color: '#222222',
    selected: '#A4C639',
    muted: '#1A1A1A',
    width: '1px',
  },
  badge: {
    background: '#1A1A1A',
    text: '#F0E6DA',
    border: '#222222',
  },
}
