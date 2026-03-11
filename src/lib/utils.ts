import { isSolvable, PuzzleState } from './astar';

/** Fisher-Yates shuffle */
function shuffle(arr: number[]): number[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

/** Generate a random solvable 8-puzzle state */
export function randomSolvablePuzzle(): PuzzleState {
    let state: PuzzleState;
    do {
        state = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8]);
    } while (!isSolvable(state));
    return state;
}

/** Default near-goal example puzzle */
export function defaultPuzzle(): PuzzleState {
    return [1, 2, 5, 3, 4, 0, 6, 7, 8];
}

/** Get move direction arrow label */
export function moveLabel(move: string): string {
    const map: Record<string, string> = {
        UP: '↑', DOWN: '↓', LEFT: '←', RIGHT: '→', START: '★',
    };
    return map[move] ?? move;
}

/** Format milliseconds to readable string */
export function formatTime(ms: number): string {
    if (ms < 1) return '<1 ms';
    return `${ms.toFixed(2)} ms`;
}
