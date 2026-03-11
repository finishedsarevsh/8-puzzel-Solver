'use client';

import React from 'react';

interface ControlsPanelProps {
    onSolve: () => void;
    onPrev: () => void;
    onNext: () => void;
    onPlay: () => void;
    onPause: () => void;
    onJumpStart: () => void;
    onJumpGoal: () => void;
    isPlaying: boolean;
    isSolved: boolean;
    isSolving: boolean;
    canSolve: boolean;
    currentStep: number;
    totalSteps: number;
    speed: number;
    onSpeedChange: (v: number) => void;
}

export default function ControlsPanel({
    onSolve, onPrev, onNext, onPlay, onPause, onJumpStart, onJumpGoal,
    isPlaying, isSolved, isSolving, canSolve,
    currentStep, totalSteps,
    speed, onSpeedChange,
}: ControlsPanelProps) {
    return (
        <div className="card mt-4">
            <h2 className="card-title">
                Playback Controls
            </h2>

            {/* Solve Button */}
            <button
                onClick={onSolve}
                disabled={!canSolve || isSolving}
                className="btn btn-solve w-full mb-4"
            >
                {isSolving ? (
                    <span className="flex items-center justify-center gap-2">
                        <span className="spinner" /> Solving…
                    </span>
                ) : (
                    'Solve with A*'
                )}
            </button>

            {/* Step navigator */}
            {isSolved && (
                <>
                    <div className="flex items-center justify-between gap-1 mb-3">
                        <button onClick={onJumpStart} className="ctrl-btn" title="Jump to Start">|&lt;</button>
                        <button onClick={onPrev} className="ctrl-btn" title="Previous Step" disabled={currentStep === 0}>&lt;</button>
                        <button
                            onClick={isPlaying ? onPause : onPlay}
                            className="ctrl-btn ctrl-btn-main"
                            title={isPlaying ? 'Pause' : 'Play'}
                            disabled={currentStep === totalSteps - 1}
                        >
                            {isPlaying ? 'Pause' : 'Play'}
                        </button>
                        <button onClick={onNext} className="ctrl-btn" title="Next Step" disabled={currentStep === totalSteps - 1}>&gt;</button>
                        <button onClick={onJumpGoal} className="ctrl-btn" title="Jump to Goal">&gt;|</button>
                    </div>

                    {/* Progress bar */}
                    <div className="progress-wrap">
                        <div
                            className="progress-bar"
                            style={{ width: `${totalSteps > 1 ? (currentStep / (totalSteps - 1)) * 100 : 100}%` }}
                        />
                    </div>
                    <div className="flex justify-between text-xs text-[#F0EEF6]/40 mt-1 mb-4">
                        <span>Step {currentStep} / {totalSteps - 1}</span>
                        <span>{currentStep === totalSteps - 1 ? 'Goal' : currentStep === 0 ? 'Start' : ''}</span>
                    </div>

                    {/* Speed slider */}
                    <div>
                        <label className="text-xs text-[#F0EEF6]/50 mb-1 block">
                            Speed: {speed < 400 ? 'Fast' : speed < 900 ? 'Medium' : 'Slow'}
                        </label>
                        <input
                            type="range"
                            min={100}
                            max={1500}
                            step={100}
                            value={speed}
                            onChange={(e) => onSpeedChange(Number(e.target.value))}
                            className="speed-slider w-full"
                        />
                        <div className="flex justify-between text-[10px] text-[#F0EEF6]/30 mt-1">
                            <span>100ms</span>
                            <span>1500ms</span>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
