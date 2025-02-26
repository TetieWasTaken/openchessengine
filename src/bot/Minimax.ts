/** @format */

import type { Board } from '../core/board';
import { getAllMoves, makeMove } from '../core/moveGenerator';
import type { MinimaxResult } from '../types/bot';
import type { Move } from '../types/core';
import { Colour } from '../types/enums';
import { evaluate } from './eval';

/**
 * {@link https://en.wikipedia.org/wiki/Minimax | Minimax} algorithm with
 * {@link https://en.wikipedia.org/wiki/Alpha%E2%80%93beta_pruning | Alpha-Beta pruning}
 * to find the best move in a given position.
 *
 * @param board - The board to evaluate
 * @param depth - How many moves ahead to search
 * @param isMaximising - Whether to maximise or minimise the score
 * @returns The best move and its score
 */
export function minimax(
	board: Board,
	depth: number,
	isMaximising: boolean = board.getActiveColour() === Colour.White,
	initialAlpha = -Infinity,
	initialBeta = Infinity,
): { move?: Move; score: number } {
	if (depth === 0) {
		// Reached the end of the search tree, evaluate the position
		return { score: evaluate(board) };
	}

	const moves = getAllMoves(board);
	let best: MinimaxResult = {
		// Assume the worst possible score for the active player
		score: isMaximising ? -Infinity : Infinity,
		move: moves[0],
	};

	let alpha = initialAlpha;
	let beta = initialBeta;

	for (const move of moves) {
		// Make the move and evaluate the resulting position
		const snapshot = board.createSnapshot();
		makeMove(board, move, true);
		const result = minimax(board, depth - 1, !isMaximising, alpha, beta);
		board.fromSnapshot(snapshot);

		if (isMaximising) {
			if (result.score > best.score) {
				best = { score: result.score, move };
			}

			alpha = Math.max(alpha, result.score);
		} else {
			if (result.score < best.score) {
				best = { score: result.score, move };
			}

			beta = Math.min(beta, result.score);
		}

		if (beta <= alpha) break; // This branch is worse than another already searched branch, so ignore it
	}

	return best;
}
