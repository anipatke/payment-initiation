import { useState } from 'react';
import { flowData } from '../data/flowData';
import CRPanel from './CRPanel';
import BQPanel from './BQPanel';
import PulseControls from './PulseControls';
import ConnectionLine from './ConnectionLine';

const crNode = flowData.find((n) => n.id === 'cr');
const bqNodes = flowData.filter((n) => n.id !== 'cr');

export default function CommandCenter({ lifecycle = {} }) {
  const [expandedId, setExpandedId] = useState(null);

  const {
    lifecycleState = { activeNodes: [], failedNodes: [] },
    isRunning = false,
    isDone = false,
    simulateFailure = false,
    setSimulateFailure = () => {},
    runLifecycle = () => {},
    resetLifecycle = () => {},
  } = lifecycle;

  const { activeNodes = [], failedNodes = [] } = lifecycleState;

  const toggle = (id) => setExpandedId(expandedId === id ? null : id);

  return (
    <main className="min-h-screen bg-bg text-text flex flex-col">
      <section className="mx-auto w-full max-w-7xl px-6 py-8 flex flex-col gap-4 flex-1">
        {/* Page title */}
        <div className="mb-2">
          <h1 className="font-heading text-lg tracking-[0.22em] text-text uppercase">
            Payment Initiation Explorer
          </h1>
          <p className="font-body text-xs text-text/40 tracking-wider mt-1">
            BIAN Service Domain v10.0.0
          </p>
        </div>

        <PulseControls
          isRunning={isRunning}
          isDone={isDone}
          simulateFailure={simulateFailure}
          setSimulateFailure={setSimulateFailure}
          onRun={runLifecycle}
          onReset={resetLifecycle}
        />

        <CRPanel
          node={crNode}
          isActive={activeNodes.includes('cr')}
          isExpanded={expandedId === 'cr'}
          onToggle={() => toggle('cr')}
        />

        {/* Desktop connectors */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-4">
          {bqNodes.map((node) => (
            <ConnectionLine
              key={node.id}
              isActive={activeNodes.includes(node.id)}
              isFailed={failedNodes.includes(node.id)}
            />
          ))}
        </div>
        {/* Mobile separator */}
        <div className="lg:hidden h-px bg-[#1A1A1A]" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {bqNodes.map((node) => (
            <BQPanel
              key={node.id}
              node={node}
              isActive={activeNodes.includes(node.id)}
              isFailed={failedNodes.includes(node.id)}
              isExpanded={expandedId === node.id}
              onToggle={() => toggle(node.id)}
            />
          ))}
        </div>
      </section>

      <footer className="w-full px-6 py-4 border-t border-border">
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
      </footer>
    </main>
  );
}
