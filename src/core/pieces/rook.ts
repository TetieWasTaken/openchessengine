/** @format */

import type { Move } from '../../types/core';
import type { Board } from '../board';
import { getOrthogonalMoves } from '../moveGenerator';

/**
 * Returns all {@link https://www.chessprogramming.org/Move_Generation#Pseudo-legal | pseudo-legal} moves for a rook.
 *
 * @param board - The board to get the moves from
 * @param position - The position of the rook
 * @example
 * ```
 * getRookMoves(board, [0, 0]);
 * ```
 * @returns An array of pseudo-legal moves
 */
export function getRookMoves(board: Board, position: [number, number]): Move[] {
	return getOrthogonalMoves(board, position);
}
