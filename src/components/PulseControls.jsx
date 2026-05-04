export default function PulseControls({ isRunning, isDone, simulateFailure, setSimulateFailure, onRun, onReset }) {
  return (
    <div className="flex items-center gap-4 flex-wrap">
      <button
        onClick={onRun}
        disabled={isRunning}
        className={`font-heading uppercase tracking-widest text-sm px-5 py-2 border transition-colors ${
          isRunning
            ? 'border-gray-700 text-gray-600 bg-transparent cursor-not-allowed'
            : 'border-accent text-accent bg-transparent hover:bg-accent/10 cursor-pointer'
        }`}
      >
        Run Lifecycle
      </button>

      {isDone && (
        <button
          onClick={onReset}
          className="font-heading uppercase tracking-widest text-sm px-5 py-2 border border-border text-text/50 bg-transparent hover:bg-surface-2 transition-colors cursor-pointer"
        >
          Reset
        </button>
      )}

      <label className={`flex items-center gap-2 font-body text-xs select-none ${isRunning ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}>
        <input
          type="checkbox"
          checked={simulateFailure}
          onChange={e => !isRunning && setSimulateFailure(e.target.checked)}
          disabled={isRunning}
          className="accent-[#A4C639] w-3.5 h-3.5"
        />
        <span className="text-gray-400 uppercase tracking-wider">Simulate Compliance Failure</span>
      </label>
    </div>
  );
}
