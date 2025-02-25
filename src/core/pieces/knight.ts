/** @format */

import type { Move } from '../../types/core';
import { Piece } from '../../types/enums';
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
			const [targetPiece, targetColour] = board.getPieceAt(
				x + dx,
				y + dy,
			) ?? [null, null];

			// If the square is empty or has an enemy piece
			if (targetPiece === null || targetColour !== colour) {
				moves.push({
					from: position,
					to: [x + dx, y + dy],
					piece: {
						type: Piece.Knight,
						colour,
					},
					isCapture: Boolean(targetPiece),
				});
			}
		}
	}

	return moves;
}
