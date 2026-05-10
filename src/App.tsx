import { SpecProvider } from './app/SpecProvider'
import { ExplorerStateProvider } from './state/explorerStore'
import ExplorerShell from './components/ExplorerShell'

export default function App() {
  return (
    <SpecProvider>
      <ExplorerStateProvider>
        <ExplorerShell />
      </ExplorerStateProvider>
    </SpecProvider>
  )
}
