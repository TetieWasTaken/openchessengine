/** @format */

import type { Move } from '../../types/core';
import type { Board } from '../board';
import { getDiagonalMoves } from '../moveGenerator';

/**
 * Returns all {@link https://www.chessprogramming.org/Move_Generation#Pseudo-legal | pseudo-legal} moves for a bishop.
 *
 * @param board - The board to get the moves from
 * @param position - The position of the bishop
 * @example
 * ```
 * getBishopMoves(board, [0, 2]);
 * ```
 * @returns An array of pseudo-legal moves
 */
export function getBishopMoves(board: Board, position: [number, number]): Move[] {
	return getDiagonalMoves(board, position);
}
