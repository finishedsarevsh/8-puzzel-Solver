# 🧩 8-Puzzle AI Solver

A modern, interactive web application designed to visualize and solve the classic 8-Puzzle problem using AI search algorithms. Built for educational purposes, this project demonstrates the efficiency of heuristic-based search versus uninformed search.

## 🚀 Features

- **Interactive Puzzle Board**: Edit tiles manually or generate random solvable puzzles.
- **Algorithm Comparison**: Compare **A* Search** (with Manhattan Distance) and **Breadth-First Search (BFS)**.
- **Real-time Visualization**: Watch the algorithm solve the puzzle step-by-step with adjustable playback speed.
- **Detailed Metrics**: Track execution time, nodes explored, path cost ($g$), and heuristic value ($h$).
- **Responsive & Modern UI**: A clean, technical dashboard aesthetic with a strict color palette and smooth transitions.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Logic**: TypeScript
- **State Management**: React Hooks (useState, useEffect, useMemo)

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ 
- npm / yarn / pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🧠 Algorithms

### A* Search
The primary solver uses the A* algorithm with the **Manhattan Distance** heuristic. It balances path cost ($g$) and the estimated cost to the goal ($h$) to find the optimal solution efficiently.

### Breadth-First Search (BFS)
Used as a baseline for comparison. BFS explores all possible states level-by-level, guaranteed to find the shortest path but often exploring significantly more states than A*.

---

*Developed as part of an AI Course Project.*
