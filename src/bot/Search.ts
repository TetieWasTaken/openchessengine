/** @format */

import type { Board } from '../core/board';
import type { Move } from '../types/Core';
import { minimax } from './MinimaxOptimized';

/**
 * Search for the best move for the current player using optimized algorithms
 *
 * @param board - Current board position
 * @param depth - How many moves ahead to search
 * @returns The best move found
 */
export function search(board: Board, depth: number): Move | undefined {
	const { move } = minimax(board, depth);
	return move;
}
