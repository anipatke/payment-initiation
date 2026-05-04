import { useState, useRef } from 'react';

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function useLifecycle() {
  const [lifecycleState, setLifecycleState] = useState({ activeNodes: [], failedNodes: [] });
  const [isRunning, setIsRunning] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [simulateFailure, setSimulateFailure] = useState(false);
  const cancelledRef = useRef(false);

  async function runLifecycle() {
    if (isRunning) return;
    cancelledRef.current = false;
    setIsRunning(true);
    setIsDone(false);
    setLifecycleState({ activeNodes: [], failedNodes: [] });

    // Step 1
    await delay(800);
    if (cancelledRef.current) return;
    setLifecycleState({ activeNodes: ['cr'], failedNodes: [] });

    // Step 2
    await delay(1200);
    if (cancelledRef.current) return;
    if (simulateFailure) {
      setLifecycleState({ activeNodes: ['cr'], failedNodes: ['compliance'] });
      setIsRunning(false);
      setIsDone(true);
      return;
    }
    setLifecycleState({ activeNodes: ['cr', 'compliance', 'fundingCheck'], failedNodes: [] });

    // Step 3
    await delay(1000);
    if (cancelledRef.current) return;
    setLifecycleState({ activeNodes: ['cr', 'compliance', 'fundingCheck'], failedNodes: [] });

    // Step 4
    await delay(1200);
    if (cancelledRef.current) return;
    setLifecycleState({ activeNodes: ['cr', 'compliance', 'fundingCheck', 'orderInitiation'], failedNodes: [] });

    setIsRunning(false);
    setIsDone(true);
  }

  function resetLifecycle() {
    cancelledRef.current = true;
    setLifecycleState({ activeNodes: [], failedNodes: [] });
    setIsRunning(false);
    setIsDone(false);
  }

  return { lifecycleState, isRunning, isDone, simulateFailure, setSimulateFailure, runLifecycle, resetLifecycle };
}
