'use client';

import React, { useEffect, useRef } from 'react';

interface PuzzleBoardProps {
    state: number[];
    prevState?: number[];
    highlightGoal?: boolean;
}

const TILE_COLORS = Array(9).fill('bg-[#7C3AED]');

const GOAL = [1, 2, 3, 4, 5, 6, 7, 8, 0];

export default function PuzzleBoard({ state, prevState, highlightGoal }: PuzzleBoardProps) {
    const isGoal = state.every((v, i) => v === GOAL[i]);

    return (
        <div className="puzzle-board-wrap">
            <div className="puzzle-grid">
                {state.map((val, idx) => {
                    const row = Math.floor(idx / 3);
                    const col = idx % 3;
                    const isCorrect = val !== 0 && val === GOAL[idx];

                    // Basic animation direction based on previous state
                    let animClass = '';
                    if (prevState && prevState[idx] !== val) {
                        const prevIdx = prevState.indexOf(val);
                        if (prevIdx !== -1) {
                            const pRow = Math.floor(prevIdx / 3);
                            const pCol = prevIdx % 3;
                            if (pRow > row) animClass = 'animate-slide-up';
                            else if (pRow < row) animClass = 'animate-slide-down';
                            else if (pCol > col) animClass = 'animate-slide-left';
                            else if (pCol < col) animClass = 'animate-slide-right';
                        }
                    }

                    return (
                        <div
                            key={`${val}-${idx}`}
                            className={`tile ${val === 0 ? 'tile-blank' : 'tile-filled'} ${animClass}`}
                        >
                            {val !== 0 && (
                                <span className="tile-number">{val}</span>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Goal achieved indicator */}
            {isGoal && highlightGoal && (
                <div className="goal-badge mt-2 bg-[#7C3AED]/30 text-[#F0EEF6]">
                    Goal State Reached!
                </div>
            )}
        </div>
    );
}
