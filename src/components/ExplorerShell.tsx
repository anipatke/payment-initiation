import ScanlineOverlay from './ScanlineOverlay'
import { ExplorerLayout } from '../app/ExplorerLayout'
import { LeftNavigation } from './navigation/LeftNavigation'
import { JourneyCanvas } from './canvas/JourneyCanvas'
import { DetailPanel } from './detail/DetailPanel'

export default function ExplorerShell() {
  return (
    <>
      <ScanlineOverlay />
      <ExplorerLayout
        header={
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-heading text-lg tracking-[0.22em] uppercase">
                Payment Initiation Explorer
              </h1>
              <p className="font-body text-xs text-text/40 tracking-wider mt-1">
                BIAN Service Domain v10.0.0
              </p>
            </div>
          </div>
        }
        left={<LeftNavigation />}
        center={
          <div className="h-full p-4">
            <JourneyCanvas />
          </div>
        }
        right={<DetailPanel />}
        footer={
          <p className="font-body text-xs text-text/30 tracking-wider text-center">
            <a
              href="https://anipatke.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-text/60 transition-colors"
            >
              Learning Ledger — anipatke.com
            </a>
          </p>
        }
      />
    </>
  )
}
