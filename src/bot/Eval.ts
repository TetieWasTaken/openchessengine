/** @format */

import type { Board } from '../core/board';
import { Colour, Piece } from '../types/enums';

/**
 * Fast bit counting using Brian Kernighan's algorithm
 * @param n - The bigint to count bits in
 * @returns The number of set bits
 */
function popcount(n: bigint): number {
	let count = 0;
	while (n !== 0n) {
		n &= n - 1n; // Clear the lowest set bit
		count++;
	}
	return count;
}

/**
 * Evaluates the board and returns a score.
 *
 * @param board - The position to evaluate
 * @returns The evaluation score
 */
export function evaluate(board: Board): number {
	const bitboards = board.getBitboards();
	let score = 0;
	let whiteKing = false;
	let blackKing = false;

	// Evaluate white pieces
	for (const piece of Object.values(Piece)) {
		const bitboard = bitboards[Colour.White][piece];
		if (bitboard === 0n) continue;
		
		const pieceCount = popcount(bitboard);
		if (pieceCount > 0) {
			const pieceValue = getPieceValue(piece);
			score += pieceValue * pieceCount;
			if (piece === Piece.King) whiteKing = true;
		}
	}

	if (!whiteKing) return -Infinity;

	// Evaluate black pieces
	for (const piece of Object.values(Piece)) {
		const bitboard = bitboards[Colour.Black][piece];
		if (bitboard === 0n) continue;
		
		const pieceCount = popcount(bitboard);
		if (pieceCount > 0) {
			const pieceValue = getPieceValue(piece);
			score -= pieceValue * pieceCount;
			if (piece === Piece.King) blackKing = true;
		}
	}

	if (!blackKing) return Infinity;

	return score;
}

// see https://www.chessprogramming.org/Evaluation
// see https://en.wikipedia.org/wiki/Chess_piece_relative_value
// see https://www.jsr.org/hs/index.php/path/article/download/4356/1910/26327 (table 4)
// piece values below are based on the average between AlphaZero and Lasker (see wikipedia page)

/**
 * Returns the value of a chess piece.
 *
 * @param piece - The piece whose value is to be determined
 * @returns The value assigned to the piece
 */
function getPieceValue(piece: Piece): number {
	// eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check -- King is not included
	switch (piece) {
		case Piece.Pawn:
			return 1;
		case Piece.Knight:
			return 3.28;
		case Piece.Bishop:
			return 3.42;
		case Piece.Rook:
			return 5.44;
		case Piece.Queen:
			return 9.75;
		default:
			return 0;
	}
}
