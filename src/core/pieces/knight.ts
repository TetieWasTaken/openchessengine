/** @format */

import type { Move } from '../../types/core';
import type { Board } from '../board';

/**
 * Returns all {@link https://www.chessprogramming.org/Move_Generation#Pseudo-legal | pseudo-legal} moves for a knight.
 *
 * @param board - The board to get the moves from
 * @param position - The position of the knight
 * @param colour - The colour of the knight
 * @example
 * ```
 * getKnightMoves(board, [0, 1]);
 * ```
 * @returns An array of pseudo-legal moves
 */
export function getKnightMoves(board: Board, position: [number, number], colour = board.getActiveColour()): Move[] {
	const boardData = board.getBoard();
	const moves: Move[] = [];
	const directions = [
		[-2, -1],
		[-2, 1],
		[-1, -2],
		[-1, 2],
		[1, -2],
		[1, 2],
		[2, -1],
		[2, 1],
	];

	for (const direction of directions) {
		const [dx, dy] = direction;
		const [x, y] = position;

		// Check if the move is on the board
		if (board.isWithinBounds(x + dx, y + dy)) {
			const piece = boardData[x + dx][y + dy];

			if (piece === null || piece.colour !== colour) {
				moves.push({
					from: position,
					to: [x + dx, y + dy],
				});
			}
		}
	}

	return moves;
}
