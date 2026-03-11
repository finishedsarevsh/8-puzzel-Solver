'use client';

import React from 'react';

export default function AboutSection() {
    return (
        <section className="about-section">
            <div className="about-card">
                <h2 className="about-title">About This Project</h2>

                <div className="about-grid">
                    <div className="about-block">
                        <h3 className="about-heading">🧩 The 8-Puzzle Problem</h3>
                        <p className="about-text">
                            The 8-puzzle is a classic combinatorial problem consisting of a 3×3 grid with 8 numbered tiles
                            and one blank space. The objective is to rearrange the tiles from an arbitrary initial configuration
                            to a fixed goal state by sliding tiles into the blank space. With 9!/2 = 181,440 reachable states,
                            finding the <em className="text-purple-300">optimal</em> (shortest) solution path makes it an ideal benchmark for AI search algorithms.
                        </p>
                    </div>

                    <div className="about-block">
                        <h3 className="about-heading">🤖 A* Search &amp; Manhattan Distance</h3>
                        <p className="about-text">
                            A* (A-Star) is an informed best-first search algorithm that combines the actual cost from the
                            start <span className="fn-inline">g(n)</span> with a heuristic estimate to the goal <span className="fn-inline">h(n)</span>,
                            giving a total evaluation function <span className="fn-inline">f(n) = g(n) + h(n)</span>. The
                            <em className="text-green-300"> Manhattan distance</em> heuristic sums the horizontal and vertical distances of each tile
                            from its goal position. Since it never overestimates the true cost (admissible), A* with this
                            heuristic is guaranteed to find the <strong className="text-white">optimal solution</strong> while exploring far
                            fewer states than uninformed methods like BFS.
                        </p>
                    </div>
                </div>
            </div>

            <footer className="footer">
                <span>Developed as part of Artificial Intelligence coursework</span>
                <span className="footer-divider">·</span>
                <span>8-Puzzle State Space Search Project</span>
                <span className="footer-divider">·</span>
                <span className="footer-badge">AI · Heuristic Search · A* Algorithm</span>
            </footer>
        </section>

    );
}
