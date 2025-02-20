/** @format */

import type { Move } from '../../types/core';
import { Piece } from '../../types/enums';
import type { Board } from '../board';

/**
 * Returns all {@link https://www.chessprogramming.org/Move_Generation#Pseudo-legal | pseudo-legal} moves for a pawn.
 *
 * @param board - The board to get the moves from
 * @param position - The position of the pawn
 * @param colour - The colour of the pawn
 * @example
 * ```
 * getPawnMoves(board, [1, 0]);
 * ```
 * @returns An array of pseudo-legal moves
 */
export function getPawnMoves(board: Board, position: [number, number], colour = board.getActiveColour()): Move[] {
	const moves: Move[] = [];
	const direction = colour === 'white' ? 1 : -1;
	const boardData = board.getBoard();
	const [x, y] = position;

	const addPromotionMoves = (to: [number, number]) => {
		moves.push({ from: position, to, promotion: Piece.Queen });
		moves.push({ from: position, to, promotion: Piece.Rook });
		moves.push({ from: position, to, promotion: Piece.Bishop });
		moves.push({ from: position, to, promotion: Piece.Knight });
	};

	const isPromotionRow = (row: number) => row === 7 || row === 0;

	// Move forward one square
	if (boardData[x + direction][y] === null) {
		const to = [x + direction, y] as [number, number];
		if (isPromotionRow(x + direction)) {
			addPromotionMoves(to);
		} else {
			moves.push({ from: position, to });
		}
	}

	// Move forward two squares
	if (
		x === (colour === 'white' ? 1 : 6) &&
		boardData[x + direction][y] === null &&
		boardData[x + 2 * direction][y] === null
	) {
		moves.push({
			from: position,
			to: [x + 2 * direction, y],
			isDoublePawnMove: true,
		});
	}

	// En passant
	const enPassantSquare = board.getEnPassantSquare();
	if (
		enPassantSquare &&
		enPassantSquare[0] === x + direction &&
		(enPassantSquare[1] === y - 1 || enPassantSquare[1] === y + 1)
	) {
		moves.push({
			from: position,
			to: [enPassantSquare[0], enPassantSquare[1]],
			isEnPassantCapture: true,
		});
	}

	// Capture diagonally to the left
	if (y - 1 >= 0 && boardData[x + direction][y - 1] !== null && boardData[x + direction][y - 1]?.colour !== colour) {
		const to = [x + direction, y - 1] as [number, number];
		if (isPromotionRow(x + direction)) {
			addPromotionMoves(to);
		} else {
			moves.push({ from: position, to });
		}
	}

	// Capture diagonally to the right
	if (y + 1 < 8 && boardData[x + direction][y + 1] !== null && boardData[x + direction][y + 1]?.colour !== colour) {
		const to = [x + direction, y + 1] as [number, number];
		if (isPromotionRow(x + direction)) {
			addPromotionMoves(to);
		} else {
			moves.push({ from: position, to });
		}
	}

	return moves;
}
