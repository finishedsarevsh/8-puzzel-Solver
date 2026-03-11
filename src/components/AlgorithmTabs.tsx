'use client';

import React, { useState } from 'react';
import type { SolveResult } from '@/lib/astar';
import { formatTime } from '@/lib/utils';

interface AlgorithmTabsProps {
    astarResult: SolveResult | null;
    bfsResult: SolveResult | null;
    onRunBFS: () => void;
    isSolved: boolean;
    isRunningBFS: boolean;
}

export default function AlgorithmTabs({
    astarResult, bfsResult, onRunBFS, isSolved, isRunningBFS
}: AlgorithmTabsProps) {
    const [tab, setTab] = useState<'astar' | 'bfs'>('astar');

    const aStates = astarResult?.statesExplored ?? 0;
    const bStates = bfsResult?.statesExplored ?? 0;
    const maxStates = Math.max(aStates, bStates, 1);

    return (
        <div className="card mt-4">
            <h3 className="card-title mb-4">
                Algorithm Comparison
            </h3>

            {/* Tab switcher */}
            <div className="tab-bar mb-4">
                <button
                    onClick={() => setTab('astar')}
                    className={`tab-btn ${tab === 'astar' ? 'tab-active' : ''}`}
                >
                    A* (Manhattan)
                </button>
                <button
                    onClick={() => setTab('bfs')}
                    className={`tab-btn ${tab === 'bfs' ? 'tab-active' : ''}`}
                >
                    BFS (No Heuristic)
                </button>
            </div>

            {/* Tab content */}
            <div className="mt-4 min-h-[140px]">
                {tab === 'astar' ? (
                    <div className="algo-info">
                        <div className="algo-desc">
                            A* uses the Manhattan distance heuristic <span className="text-[#7C3AED]">h(n)</span> to guide the search,
                            dramatically reducing the number of states explored compared to uninformed search.
                        </div>
                        {astarResult && (
                            <div className="grid grid-cols-2 gap-2 mt-3">
                                <div className="stat-card">
                                    <div className="stat-value text-[#7C3AED]">{astarResult.path.length - 1}</div>
                                    <div className="stat-label text-[#F0EEF6]/50">Moves</div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-value text-[#7C3AED]">{astarResult.statesExplored}</div>
                                    <div className="stat-label text-[#F0EEF6]/50">States Explored</div>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="algo-info">
                        <div className="algo-desc">
                            BFS expands states level by level with no heuristic, exploring many more states than A* to find the same solution.
                        </div>
                        {!bfsResult && isSolved && (
                            <button
                                onClick={onRunBFS}
                                disabled={isRunningBFS}
                                className="btn btn-secondary w-full mt-3"
                            >
                                {isRunningBFS ? 'Running BFS...' : 'Run BFS for Comparison'}
                            </button>
                        )}
                        {bfsResult?.solvable && (
                            <div className="grid grid-cols-2 gap-2 mt-3">
                                <div className="stat-card">
                                    <div className="stat-value text-[#F0EEF6]">{bfsResult.path.length - 1}</div>
                                    <div className="stat-label text-[#F0EEF6]/50">Moves</div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-value text-[#F0EEF6]">{bfsResult.statesExplored}</div>
                                    <div className="stat-label text-[#F0EEF6]/50">States Explored</div>
                                </div>
                            </div>
                        )}
                        {bfsResult && !bfsResult.solvable && (
                            <div className="text-xs text-[#F0EEF6]/60 mt-2">BFS hit the 150,000-state cap before finding the goal (puzzle too deep).</div>
                        )}
                    </div>
                )}
            </div>

            {/* Comparison bar chart – show only when both results exist */}
            {astarResult && bfsResult?.solvable && (
                <div className="mt-4">
                    <div className="text-xs text-[#F0EEF6]/50 uppercase tracking-wider mb-2">States Explored Comparison</div>
                    <div className="space-y-2">
                        <div>
                            <div className="flex justify-between text-xs mb-1">
                                <span className="text-[#7C3AED]">A* (Manhattan)</span>
                                <span className="text-[#7C3AED]">{aStates}</span>
                            </div>
                            <div className="bar-bg bg-[#F0EEF6]/10">
                                <div className="bar-fill bg-[#7C3AED]"
                                    style={{ width: `${(aStates / maxStates) * 100}%` }} />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-xs mb-1">
                                <span className="text-[#F0EEF6]/60">BFS</span>
                                <span className="text-[#F0EEF6]/60">{bStates}</span>
                            </div>
                            <div className="bar-bg bg-[#F0EEF6]/10">
                                <div className="bar-fill bg-[#F0EEF6]/40"
                                    style={{ width: `${(bStates / maxStates) * 100}%` }} />
                            </div>
                        </div>
                    </div>
                    <div className="text-[10px] text-[#F0EEF6]/50 mt-2">
                        A* explored <span className="text-[#7C3AED] font-medium">{((bStates - aStates) / bStates * 100).toFixed(0)}%</span> fewer states than BFS
                    </div>
                </div>
            )}
        </div>
    );
}
