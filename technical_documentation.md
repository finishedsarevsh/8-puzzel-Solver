# Technical Documentation: 8-Puzzle Solver

This document provides a deep dive into the technical implementation of the 8-Puzzle solver.

## 1. Problem Representation

### State Space
The puzzle is represented as a 1D array of 9 integers (`number[]`), where values 1-8 represent the tiles and `0` represents the blank space.
- **Initial State**: Any valid permutation of $\{0, 1, ..., 8\}$.
- **Goal State**: `[1, 2, 3, 4, 5, 6, 7, 8, 0]`

### Solvability check
A puzzle is solvable if and only if the number of **inversions** is even. An inversion is a pair of tiles $(a, b)$ such that $a > b$ but $a$ appears before $b$ in the state (excluding the blank).

## 2. Heuristic Logic: Manhattan Distance

We use Manhattan Distance as the heuristic for A* search. For each tile $i$ at its current position $(r_i, c_i)$ and its goal position $(gr_i, gc_i)$, the distance is calculated as:
$$h(n) = \sum |r_i - gr_i| + |c_i - gc_i|$$

It is **admissible** (never overestimates the cost to the goal) and **consistent**, ensuring that A* finds the optimal solution.

## 3. Search Algorithms

### A* Search (`src/lib/astar.ts`)
- **Evaluation Function**: $f(n) = g(n) + h(n)$
- **Implementation**: Uses a Priority Queue (simulated via sorted array) to always expand the node with the lowest $f(n)$.
- **Time Complexity**: $O(b^d)$ where $b$ is the branching factor and $d$ is the depth, but significantly reduced by the heuristic.

### Breadth-First Search (`src/lib/bfs.ts`)
- **Mechanism**: Explores nodes level-by-level using a FIFO queue.
- **Constraint**: Capped at 150,000 states in this implementation to prevent browser resource exhaustion on complex states.
- **Guarantee**: Guaranteed to find the solution with the minimum number of moves.

## 4. UI Architecture

The application is built with a modular component-based architecture:

- **`PuzzleBoard.tsx`**: Renders the 3x3 grid and handles manual tile swaps.
- **`AlgorithmTabs.tsx`**: Allows switching between A* and BFS and displays their respective metrics.
- **`ControlsPanel.tsx`**: Provides playback controls (Play, Pause, Reset, Step) and speed adjustment.
- **`MetricsPanel.tsx`**: Visualizes the search progress and result statistics.
- **`StepTimeline.tsx`**: A scrollable history of moves made to reach the solution.

---
*Technical documentation for AI coursework.*
