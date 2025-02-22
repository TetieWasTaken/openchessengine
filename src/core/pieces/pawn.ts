/** @format */

import type { Move } from '../../types/core';
import { Colour, Piece } from '../../types/enums';
import type { Board } from '../board';

const isPromotionRow = (row: number) => row === 7 || row === 0;

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
	const direction = colour === Colour.White ? -1 : 1;
	const bitboards = board.getBitboards();
	const [x, y] = position;

	const addPromotionMoves = (to: [number, number], isCapture = false) => {
		moves.push({ from: position, to, promotion: Piece.Queen, piece: { type: Piece.Pawn, colour }, isCapture });
		moves.push({ from: position, to, promotion: Piece.Rook, piece: { type: Piece.Pawn, colour }, isCapture });
		moves.push({ from: position, to, promotion: Piece.Bishop, piece: { type: Piece.Pawn, colour }, isCapture });
		moves.push({ from: position, to, promotion: Piece.Knight, piece: { type: Piece.Pawn, colour }, isCapture });
	};

	// Move forward one square
	if (board.getPieceAt(x, y + direction) === null) {
		const to = [x, y + direction] as [number, number];
		if (isPromotionRow(y + direction)) {
			addPromotionMoves(to);
		} else {
			moves.push({ from: position, to, piece: { type: Piece.Pawn, colour } });
		}
	}

	// Move forward two squares
	if (
		y === (colour === Colour.White ? 6 : 1) &&
		board.getPieceAt(x, y + direction) === null &&
		board.getPieceAt(x, y + direction * 2) === null
	) {
		moves.push({
			from: position,
			to: [x, y + direction * 2],
			isDoublePawnMove: true,
			piece: { type: Piece.Pawn, colour }
		});
	}

	// En passant
	const enPassantSquare = board.getEnPassantSquare();
	if (
		enPassantSquare &&
		(enPassantSquare[0] === x - 1 || enPassantSquare[0] === x + 1) &&
		enPassantSquare[1] === y + direction
	) {
		moves.push({
			from: position,
			to: [enPassantSquare[0], enPassantSquare[1]],
			isEnPassantCapture: true,
			piece: { type: Piece.Pawn, colour }
		});
	}

	// Capture diagonally to the left
	if (y - 1 >= 0 && board.getPieceAt(x - 1, y + direction) !== null && board.getPieceAt(x - 1, y + direction)?.[1] !== colour) {
		const to = [x - 1, y + direction] as [number, number];
		if (isPromotionRow(y + direction)) {
			addPromotionMoves(to, true);
		} else {
			moves.push({
				from: position, to, piece: { type: Piece.Pawn, colour }, isCapture: true
			});
		}
	}

	// Capture diagonally to the right
	if (y + 1 < 8 && board.getPieceAt(x + 1, y + direction) !== null && board.getPieceAt(x + 1, y + direction)?.[1] !== colour) {
		const to = [x + 1, y + direction] as [number, number];
		if (isPromotionRow(y + direction)) {
			addPromotionMoves(to, true);
		} else {
			moves.push({ from: position, to, piece: { type: Piece.Pawn, colour }, isCapture: true });
		}
	}

	return moves;
}
