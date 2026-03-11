'use client';

import React, { useState } from 'react';
import { isSolvable } from '@/lib/astar';
import { randomSolvablePuzzle, defaultPuzzle } from '@/lib/utils';

interface ConfigPanelProps {
    initial: number[];
    onChange: (state: number[]) => void;
}

export default function ConfigPanel({ initial, onChange }: ConfigPanelProps) {
    const [tooltip, setTooltip] = useState(false);
    const solvable = isSolvable(initial);
    const allUnique = new Set(initial).size === 9 && initial.every(v => v >= 0 && v <= 8);

    const handleCell = (idx: number, val: string) => {
        const n = parseInt(val);
        if (isNaN(n) || n < 0 || n > 8) return;
        const next = [...initial];
        next[idx] = n;
        onChange(next);
    };

    return (
        <div className="card">
            <h3 className="card-title mb-4">
                Initial Configuration
            </h3>

            {/* 3×3 Grid Input */}
            <div className="grid grid-cols-3 gap-2 mb-4">
                {initial.map((val, idx) => (
                    <input
                        key={idx}
                        type="number"
                        min={0}
                        max={8}
                        value={val}
                        onChange={(e) => handleCell(idx, e.target.value)}
                        className="puzzle-input bg-transparent text-[#F0EEF6]"
                        aria-label={`Cell ${idx}`}
                    />
                ))}
            </div>

            <p className="text-xs text-[#F0EEF6]/60 mb-4">
                Use <span className="font-bold text-[#7C3AED]">0</span> for the blank tile. Each digit 0–8 must appear exactly once.
            </p>



            {/* Buttons */}
            <div className="flex flex-col gap-2 mt-2">
                <button
                    onClick={() => onChange(randomSolvablePuzzle())}
                    className="btn btn-primary"
                >
                    Random Solvable Puzzle
                </button>
                <button
                    onClick={() => onChange(defaultPuzzle())}
                    className="btn btn-secondary"
                >
                    Reset to Default
                </button>
            </div>
        </div>
    );
}
