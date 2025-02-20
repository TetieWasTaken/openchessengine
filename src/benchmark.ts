/** @format */

import { Board } from './core/board';
import { _perft } from './core/moveGenerator';

// Positions 1 through 6 from https://www.chessprogramming.org/Perft_Results
const positions = [
	'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
	'r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1',
	'8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1',
	'r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1',
	'rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8',
	'r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10',
];

const maxDepth = 4;

const results = [];

for (const position of positions) {
	for (let depth = 1; depth <= maxDepth; depth++) {
		const board = new Board(position);
		const start = performance.now();
		const nodes = _perft(board, depth);
		const end = performance.now();
		results.push({
			Position: position,
			Depth: depth,
			Nodes: nodes,
			'Time (ms)': (end - start).toFixed(2),
		});
	}
}

console.table(results);
