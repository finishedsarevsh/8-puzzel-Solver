// BFS Solver for 8-Puzzle (used for algorithm comparison)

import type { PuzzleState, SolveStep, SolveResult } from './astar';
import { isSolvable, manhattanDistance } from './astar';

const GOAL = [1, 2, 3, 4, 5, 6, 7, 8, 0];

interface BFSNode {
    state: PuzzleState;
    parent: BFSNode | null;
    move: string;
    g: number;
}

function isGoal(state: PuzzleState): boolean {
    return state.every((v, i) => v === GOAL[i]);
}

function getNeighbors(node: BFSNode): BFSNode[] {
    const state = node.state;
    const blank = state.indexOf(0);
    const row = Math.floor(blank / 3);
    const col = blank % 3;
    const moves: { dr: number; dc: number; label: string }[] = [
        { dr: -1, dc: 0, label: 'UP' },
        { dr: 1, dc: 0, label: 'DOWN' },
        { dr: 0, dc: -1, label: 'LEFT' },
        { dr: 0, dc: 1, label: 'RIGHT' },
    ];
    const neighbors: BFSNode[] = [];
    for (const { dr, dc, label } of moves) {
        const nr = row + dr, nc = col + dc;
        if (nr < 0 || nr > 2 || nc < 0 || nc > 2) continue;
        const newState = [...state];
        const swapIdx = nr * 3 + nc;
        [newState[blank], newState[swapIdx]] = [newState[swapIdx], newState[blank]];
        neighbors.push({ state: newState, parent: node, move: label, g: node.g + 1 });
    }
    return neighbors;
}

/** BFS – explores states level-by-level, no heuristic */
export function bfsSolve(initial: PuzzleState): SolveResult {
    if (!isSolvable(initial)) {
        return { solvable: false, path: [], statesExplored: 0, timeTaken: 0 };
    }

    // Cap BFS at 150,000 states to avoid browser freeze on hard puzzles
    const MAX_STATES = 150000;
    const startTime = performance.now();
    const startNode: BFSNode = { state: initial, parent: null, move: 'START', g: 0 };
    const queue: BFSNode[] = [startNode];
    const visited = new Set<string>();
    visited.add(initial.join(','));
    let statesExplored = 0;

    while (queue.length > 0) {
        if (statesExplored >= MAX_STATES) break;
        const current = queue.shift()!;
        statesExplored++;

        if (isGoal(current.state)) {
            const timeTaken = performance.now() - startTime;
            const path = reconstructPath(current);
            return { solvable: true, path, statesExplored, timeTaken };
        }

        for (const neighbor of getNeighbors(current)) {
            const key = neighbor.state.join(',');
            if (!visited.has(key)) {
                visited.add(key);
                queue.push(neighbor);
            }
        }
    }

    // Return partial result if capped
    const timeTaken = performance.now() - startTime;
    return { solvable: false, path: [], statesExplored, timeTaken };
}

function reconstructPath(node: BFSNode): SolveStep[] {
    const path: SolveStep[] = [];
    let cur: BFSNode | null = node;
    while (cur) {
        const h = manhattanDistance(cur.state);
        path.unshift({ state: cur.state, move: cur.move, g: cur.g, h, f: cur.g + h });
        cur = cur.parent;
    }
    return path;
}
