'use client';

import React, { useMemo } from 'react';
import type { SolveStep } from '@/lib/astar';
import { formatTime } from '@/lib/utils';

interface MetricsPanelProps {
    step: SolveStep | null;
    totalMoves: number;
    statesExplored: number;
    timeTaken: number;
    initialH: number;
    allSteps: SolveStep[];
}

export default function MetricsPanel({
    step, totalMoves, statesExplored, timeTaken, initialH, allSteps
}: MetricsPanelProps) {
    // Build mini SVG chart data for h(n) and f(n)
    const chartData = useMemo(() => {
        if (allSteps.length === 0) return null;
        const hVals = allSteps.map(s => s.h);
        const fVals = allSteps.map(s => s.f);
        const maxVal = Math.max(...fVals, 1);
        const W = 260, H = 80, n = allSteps.length;
        const xStep = W / Math.max(n - 1, 1);

        const toSvgY = (v: number) => H - (v / maxVal) * (H - 4) - 2;

        const hPath = hVals.map((v, i) => `${i === 0 ? 'M' : 'L'}${i * xStep},${toSvgY(v)}`).join(' ');
        const fPath = fVals.map((v, i) => `${i === 0 ? 'M' : 'L'}${i * xStep},${toSvgY(v)}`).join(' ');

        return { hPath, fPath, W, H };
    }, [allSteps]);

    const hasData = step !== null && totalMoves > 0;

    return (
        <div className="card">
            <h3 className="card-title mb-4">
                Search Metrics
            </h3>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="stat-card flex-1">
                    <div className="stat-label mb-1">Initial Heuristic (h)</div>
                    <div className="stat-value text-[#7C3AED]">{hasData ? initialH : '—'}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">{hasData ? statesExplored : '—'}</div>
                    <div className="stat-label">States Explored</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">{hasData ? totalMoves : '—'}</div>
                    <div className="stat-label">Optimal Moves</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">{hasData ? formatTime(timeTaken) : '—'}</div>
                    <div className="stat-label">Time Taken</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value text-[#7C3AED]">{hasData ? initialH : '—'}</div>
                    <div className="stat-label">Initial h(n)</div>
                </div>
            </div>

            {/* Current Step Badges */}
            {step && (
                <div className="mb-4">
                    <div className="text-xs text-[#F0EEF6]/60 mb-2 uppercase tracking-wider">Current Step Values</div>
                    <div className="flex gap-2">
                        <div className="fn-badge bg-[#7C3AED]/20 text-[#F0EEF6]" title="Moves made so far from start">
                            <div className="fn-label text-[#F0EEF6]/60">g(n)</div>
                            <div className="fn-value text-[#F0EEF6]">{step.g}</div>
                            <div className="fn-desc text-[#F0EEF6]/60">moves so far</div>
                        </div>
                        <div className="fn-badge bg-[#7C3AED]/20 text-[#F0EEF6]" title="Manhattan distance to goal">
                            <div className="fn-label text-[#F0EEF6]/60">h(n)</div>
                            <div className="fn-value text-[#F0EEF6]">{step.h}</div>
                            <div className="fn-desc text-[#F0EEF6]/60">heuristic</div>
                        </div>
                        <div className="fn-badge bg-[#7C3AED]/20 text-[#F0EEF6]" title="Total estimated cost = g + h">
                            <div className="fn-label text-[#F0EEF6]/60">f(n)</div>
                            <div className="fn-value text-[#F0EEF6]">{step.f}</div>
                            <div className="fn-desc text-[#F0EEF6]/60">g + h</div>
                        </div>
                    </div>
                </div>
            )}

            {/* Mini Chart */}
            {chartData && allSteps.length > 1 && (
                <div>
                    <div className="text-xs text-[#F0EEF6]/60 mb-1 uppercase tracking-wider">Cost Over Steps</div>
                    <svg width={chartData.W} height={chartData.H} className="w-full" viewBox={`0 0 ${chartData.W} ${chartData.H}`}>
                        <path d={chartData.fPath} fill="none" stroke="#7C3AED" strokeWidth="1.5" strokeOpacity="1" />
                        <path d={chartData.hPath} fill="none" stroke="#F0EEF6" strokeWidth="1.5" strokeOpacity="0.6" />
                    </svg>
                    <div className="flex gap-4 text-[10px] text-[#F0EEF6]/60 mt-1">
                        <span><span className="inline-block w-3 h-1 bg-[#7C3AED] mr-1 rounded" />f(n)</span>
                        <span><span className="inline-block w-3 h-1 bg-[#F0EEF6]/60 mr-1 rounded" />h(n)</span>
                    </div>
                </div>
            )}

            {/* Legend */}
            <div className="mt-4 p-3 rounded-lg bg-transparent">
                <div className="text-xs text-[#F0EEF6]/70 space-y-1">
                    <div><span className="text-[#F0EEF6] font-medium">g(n)</span> – actual cost from start to current node</div>
                    <div><span className="text-[#F0EEF6] font-medium">h(n)</span> – Manhattan distance estimate to goal</div>
                    <div><span className="text-[#7C3AED] font-medium">f(n) = g + h</span> – total estimated solution cost</div>
                </div>
            </div>
        </div>
    );
}
