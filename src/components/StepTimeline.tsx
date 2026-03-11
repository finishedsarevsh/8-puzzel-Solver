'use client';

import React, { useState } from 'react';
import type { SolveStep } from '@/lib/astar';
import { moveLabel } from '@/lib/utils';

interface StepTimelineProps {
    steps: SolveStep[];
    currentStep: number;
    onStepClick: (idx: number) => void;
}

function MiniGrid({ state }: { state: number[] }) {
    return (
        <div className="mini-grid">
            {state.map((v, i) => (
                <div key={i} className={`mini-cell ${v === 0 ? 'mini-blank' : 'mini-tile'}`}>
                    {v !== 0 ? v : ''}
                </div>
            ))}
        </div>
    );
}

export default function StepTimeline({ steps, currentStep, onStepClick }: StepTimelineProps) {
    const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

    if (steps.length === 0) return null;

    return (
        <div className="card mt-4">
            <h3 className="card-title mb-4">
                Solution Path
                <span className="ml-auto text-xs text-slate-400 font-normal">{steps.length - 1} moves</span>
            </h3>

            <div className="max-h-40 overflow-y-auto scroll-smooth flex flex-wrap gap-2 pb-4">
                {steps.map((step, idx) => (
                    <div
                        key={idx}
                        className="relative"
                    >
                        <button
                            onClick={() => onStepClick(idx)}
                            className={`flex flex-col items-center justify-center w-12 h-14 text-xs bg-transparent cursor-pointer rounded-md ${
                                idx === currentStep ? 'text-[#F0EEF6] bg-[#7C3AED]/20' : 'text-[#F0EEF6]/60'
                            }`}
                        >
                            <span className={idx === currentStep ? 'text-[#F0EEF6]/70 text-[10px]' : 'text-[#F0EEF6]/40 text-[10px]'}>
                                #{idx}
                            </span>
                            <span className={idx === currentStep ? 'text-[#F0EEF6] text-base' : 'text-[#F0EEF6] text-base'}>
                                {moveLabel(step.move)}
                            </span>
                            <span className={idx === currentStep ? 'text-[#7C3AED] text-[10px]' : 'text-[#7C3AED] text-[10px]'}>
                                f={step.f}
                            </span>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
