import type { ReactNode } from 'react'

interface ExplorerLayoutProps {
  header: ReactNode
  left: ReactNode
  center: ReactNode
  right: ReactNode
  footer: ReactNode
}

export function ExplorerLayout({ header, left, center, right, footer }: ExplorerLayoutProps) {
  return (
    <div className="min-h-screen lg:h-screen flex flex-col bg-bg text-text lg:overflow-hidden">
      <header className="border-b border-border px-6 py-4 shrink-0">
        {header}
      </header>
      <div className="flex flex-1 flex-col lg:flex-row lg:overflow-hidden">
        <aside className="w-full lg:w-[280px] border-b lg:border-b-0 lg:border-r border-border shrink-0 max-h-72 overflow-y-auto lg:max-h-none lg:overflow-x-hidden">
          {left}
        </aside>
        <main className="flex-1 min-h-[300px] lg:min-h-0 overflow-auto">
          {center}
        </main>
        <aside className="w-full lg:w-[320px] border-t lg:border-t-0 lg:border-l border-border shrink-0 lg:overflow-y-auto lg:overflow-x-hidden">
          {right}
        </aside>
      </div>
      <footer className="border-t border-border px-6 py-4 shrink-0">
        {footer}
      </footer>
    </div>
  )
}
