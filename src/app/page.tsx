'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import ShaderBackground from '@/components/ui/shader-background';
import ConfigPanel from '@/components/ConfigPanel';
import PuzzleBoard from '@/components/PuzzleBoard';
import ControlsPanel from '@/components/ControlsPanel';
import MetricsPanel from '@/components/MetricsPanel';
import StepTimeline from '@/components/StepTimeline';
import AlgorithmTabs from '@/components/AlgorithmTabs';
import { aStarSolve, isSolvable, manhattanDistance } from '@/lib/astar';
import type { SolveResult, SolveStep } from '@/lib/astar';
import { bfsSolve } from '@/lib/bfs';
import { defaultPuzzle } from '@/lib/utils';

export default function Home() {
  const [initial, setInitial] = useState<number[]>(defaultPuzzle());
  const [result, setResult] = useState<SolveResult | null>(null);
  const [bfsResult, setBfsResult] = useState<SolveResult | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSolving, setIsSolving] = useState(false);
  const [isRunningBFS, setIsRunningBFS] = useState(false);
  const [speed, setSpeed] = useState(600);
  const [error, setError] = useState<string | null>(null);
  const playRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const allUnique = new Set(initial).size === 9 && initial.every(v => v >= 0 && v <= 8);
  const solvable = allUnique && isSolvable(initial);
  const steps = result?.path ?? [];
  const currentStepData: SolveStep | null = steps[currentStep] ?? null;

  // Autoplay
  useEffect(() => {
    if (isPlaying) {
      playRef.current = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, speed);
    }
    return () => { if (playRef.current) clearInterval(playRef.current); };
  }, [isPlaying, speed, steps.length]);

  const handleSolve = useCallback(() => {
    if (!allUnique || !solvable) {
      setError('This puzzle configuration is mathematically unsolvable.');
      return;
    }
    setError(null);
    setIsSolving(true);
    setIsPlaying(false);
    setResult(null);
    setBfsResult(null);
    setCurrentStep(0);

    // Defer to allow UI to show spinner
    setTimeout(() => {
      const res = aStarSolve(initial);
      setResult(res);
      setIsSolving(false);
      if (!res.solvable) {
        setError('Could not find a solution (this should not happen for a solvable puzzle).');
      }
    }, 10);
  }, [initial, allUnique, solvable]);

  const handleRunBFS = useCallback(() => {
    setIsRunningBFS(true);
    setTimeout(() => {
      const res = bfsSolve(initial);
      setBfsResult(res);
      setIsRunningBFS(false);
    }, 10);
  }, [initial]);

  const handleInitialChange = (state: number[]) => {
    setInitial(state);
    setResult(null);
    setBfsResult(null);
    setCurrentStep(0);
    setIsPlaying(false);
    setError(null);
  };

  const isSolved = result?.solvable === true && steps.length > 0;

  return (
    <main className="relative min-h-screen">
      {/* WebGL animated background — renders at z-index -10 */}
      <ShaderBackground />

      {/* All 8-puzzle UI panels sit above the background */}
      <div className="relative z-10">
        {/* Header */}
        <header className="app-header">
          <div className="header-inner">
            <div>
              <div className="header-title">8-Puzzle Solver – A* Search with Manhattan Distance</div>
              <div className="header-sub">AI State Space Search Visualizer · Enter a puzzle, check solvability, and watch A* compute the optimal path</div>
            </div>
          </div>
        </header>

        {/* Main 3-column layout */}
        <main className="main-layout">
          {/* ── LEFT: Config + Controls ── */}
          <div className="col-left">
            <ConfigPanel initial={initial} onChange={handleInitialChange} />
            <ControlsPanel
              onSolve={handleSolve}
              onPrev={() => { setIsPlaying(false); setCurrentStep(s => Math.max(0, s - 1)); }}
              onNext={() => { setIsPlaying(false); setCurrentStep(s => Math.min(steps.length - 1, s + 1)); }}
              onPlay={() => { if (currentStep === steps.length - 1) setCurrentStep(0); setIsPlaying(true); }}
              onPause={() => setIsPlaying(false)}
              onJumpStart={() => { setIsPlaying(false); setCurrentStep(0); }}
              onJumpGoal={() => { setIsPlaying(false); setCurrentStep(steps.length - 1); }}
              isPlaying={isPlaying}
              isSolved={isSolved}
              isSolving={isSolving}
              canSolve={allUnique && solvable}
              currentStep={currentStep}
              totalSteps={steps.length}
              speed={speed}
              onSpeedChange={setSpeed}
            />

            {/* Error alert */}
            {error && <div className="alert-error">{error}</div>}
          </div>

          {/* ── CENTER: Board + Timeline ── */}
          <div className="center-board">
            <div className="card w-full">
              <h2 className="card-title">
                Puzzle Board
                {isSolved && (
                  <span className="ml-auto text-xs font-normal">
                    {currentStep === steps.length - 1
                      ? <span className="text-[#7C3AED]">Goal State</span>
                      : `Step ${currentStep} of ${steps.length - 1}`}
                  </span>
                )}
              </h2>
              <div className="flex justify-center py-4">
                <PuzzleBoard
                  state={currentStepData?.state ?? initial}
                  prevState={currentStep > 0 ? steps[currentStep - 1]?.state : undefined}
                  highlightGoal={isSolved}
                />
              </div>

              {/* Move direction indicator */}
              {isSolved && currentStepData && currentStepData.move !== 'START' && (
                <div className="flex items-center justify-center gap-2 mt-2 pb-1">
                  <span className="text-xs text-white/50">Blank moved:</span>
                  <span className="badge badge-purple text-sm font-mono">
                    {currentStepData.move === 'UP' ? 'UP' :
                      currentStepData.move === 'DOWN' ? 'DOWN' :
                        currentStepData.move === 'LEFT' ? 'LEFT' : 'RIGHT'}
                  </span>
                </div>
              )}
            </div>

            {/* Step Timeline */}
            {isSolved && (
              <div className="w-full">
                <StepTimeline
                  steps={steps}
                  currentStep={currentStep}
                  onStepClick={(idx) => { setIsPlaying(false); setCurrentStep(idx); }}
                />
              </div>
            )}
          </div>

          {/* ── RIGHT: Metrics + Algorithm Tabs ── */}
          <div className="col-right">
            <MetricsPanel
              step={currentStepData}
              totalMoves={isSolved ? steps.length - 1 : 0}
              statesExplored={result?.statesExplored ?? 0}
              timeTaken={result?.timeTaken ?? 0}
              initialH={allUnique ? manhattanDistance(initial) : 0}
              allSteps={steps}
            />
            <AlgorithmTabs
              astarResult={result}
              bfsResult={bfsResult}
              onRunBFS={handleRunBFS}
              isSolved={isSolved}
              isRunningBFS={isRunningBFS}
            />
          </div>
        </main>

        <footer className="footer">
          <div className="flex flex-col items-center gap-2">
            <div className="text-[#F0EEF6]/30 text-[10px] tracking-[0.2em] font-bold uppercase">8-Puzzle Solver</div>
            <div className="flex gap-3">
              <span className="footer-badge">AI</span>
              <span className="footer-badge">Heuristic Search</span>
              <span className="footer-badge">A* Algorithm</span>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
