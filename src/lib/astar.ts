// A* Search Algorithm for 8-Puzzle with Manhattan Distance Heuristic

export type PuzzleState = number[]; // 9-element array, 0 = blank

export interface SolveStep {
  state: PuzzleState;
  move: string; // "START" | "UP" | "DOWN" | "LEFT" | "RIGHT"
  g: number;
  h: number;
  f: number;
}

export interface SolveResult {
  solvable: boolean;
  path: SolveStep[];
  statesExplored: number;
  timeTaken: number;
}

const GOAL = [1, 2, 3, 4, 5, 6, 7, 8, 0];

/** Count inversions to check solvability */
export function isSolvable(state: PuzzleState): boolean {
  const tiles = state.filter((x) => x !== 0);
  let inversions = 0;
  for (let i = 0; i < tiles.length; i++) {
    for (let j = i + 1; j < tiles.length; j++) {
      if (tiles[i] > tiles[j]) inversions++;
    }
  }
  return inversions % 2 === 0;
}

/** Manhattan distance heuristic */
export function manhattanDistance(state: PuzzleState): number {
  let dist = 0;
  for (let i = 0; i < 9; i++) {
    const val = state[i];
    if (val === 0) continue;
    const goalIdx = GOAL.indexOf(val);
    const curRow = Math.floor(i / 3), curCol = i % 3;
    const goalRow = Math.floor(goalIdx / 3), goalCol = goalIdx % 3;
    dist += Math.abs(curRow - goalRow) + Math.abs(curCol - goalCol);
  }
  return dist;
}

function stateToKey(state: PuzzleState): string {
  return state.join(',');
}

function isGoal(state: PuzzleState): boolean {
  return state.every((v, i) => v === GOAL[i]);
}

interface Node {
  state: PuzzleState;
  g: number;
  h: number;
  f: number;
  parent: Node | null;
  move: string;
}

function getNeighbors(node: Node): Node[] {
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
  const neighbors: Node[] = [];
  for (const { dr, dc, label } of moves) {
    const nr = row + dr, nc = col + dc;
    if (nr < 0 || nr > 2 || nc < 0 || nc > 2) continue;
    const newState = [...state];
    const swapIdx = nr * 3 + nc;
    [newState[blank], newState[swapIdx]] = [newState[swapIdx], newState[blank]];
    const g = node.g + 1;
    const h = manhattanDistance(newState);
    neighbors.push({ state: newState, g, h, f: g + h, parent: node, move: label });
  }
  return neighbors;
}

/** A* Search – returns full solution path with per-step g, h, f */
export function aStarSolve(initial: PuzzleState): SolveResult {
  if (!isSolvable(initial)) {
    return { solvable: false, path: [], statesExplored: 0, timeTaken: 0 };
  }

  const startTime = performance.now();
  const startH = manhattanDistance(initial);
  const startNode: Node = { state: initial, g: 0, h: startH, f: startH, parent: null, move: 'START' };

  // Min-heap via sorted array (fine for 8-puzzle scale)
  const open: Node[] = [startNode];
  const closed = new Set<string>();
  const gScore = new Map<string, number>();
  gScore.set(stateToKey(initial), 0);

  let statesExplored = 0;

  while (open.length > 0) {
    // Sort by f, then h for tie-breaking
    open.sort((a, b) => a.f !== b.f ? a.f - b.f : a.h - b.h);
    const current = open.shift()!;
    const key = stateToKey(current.state);

    if (closed.has(key)) continue;
    closed.add(key);
    statesExplored++;

    if (isGoal(current.state)) {
      const timeTaken = performance.now() - startTime;
      const path = reconstructPath(current);
      return { solvable: true, path, statesExplored, timeTaken };
    }

    for (const neighbor of getNeighbors(current)) {
      const nKey = stateToKey(neighbor.state);
      if (closed.has(nKey)) continue;
      const existingG = gScore.get(nKey) ?? Infinity;
      if (neighbor.g < existingG) {
        gScore.set(nKey, neighbor.g);
        open.push(neighbor);
      }
    }
  }

  return { solvable: false, path: [], statesExplored, timeTaken: performance.now() - startTime };
}

function reconstructPath(node: Node): SolveStep[] {
  const path: SolveStep[] = [];
  let cur: Node | null = node;
  while (cur) {
    path.unshift({ state: cur.state, move: cur.move, g: cur.g, h: cur.h, f: cur.f });
    cur = cur.parent;
  }
  return path;
}
