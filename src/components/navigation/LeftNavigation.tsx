import { useExplorer } from '../../state/explorerStore'
import { ModeSwitcher } from './ModeSwitcher'
import { SearchBox } from './SearchBox'
import { OperationList } from './OperationList'
import { SchemaTree } from './SchemaTree'

export function LeftNavigation() {
  const { state } = useExplorer()

  return (
    <div className="flex flex-col h-full">
      <ModeSwitcher />
      <SearchBox />
      <div className="flex-1 overflow-y-auto">
        {state.mode === 'schema' ? <SchemaTree /> : <OperationList />}
      </div>
    </div>
  )
}
