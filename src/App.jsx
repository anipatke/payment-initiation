import CommandCenter from './components/CommandCenter';
import ScanlineOverlay from './components/ScanlineOverlay';
import { useLifecycle } from './hooks/useLifecycle';

export default function App() {
  const lifecycle = useLifecycle();

  return (
    <>
      <ScanlineOverlay />
      <CommandCenter lifecycle={lifecycle} />
    </>
  );
}
