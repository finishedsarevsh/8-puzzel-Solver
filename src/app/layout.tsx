import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '8-Puzzle Solver – A* Search with Manhattan Distance',
  description: 'AI State Space Search Visualizer. Enter a puzzle, check solvability, and watch A* search compute the optimal solution path using Manhattan Distance heuristic.',
  keywords: ['8-puzzle', 'A* search', 'Manhattan distance', 'AI', 'heuristic search', 'state space'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-transparent text-white overflow-x-hidden">{children}</body>
    </html>
  );
}

