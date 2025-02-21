/** @format */

import type { Board } from '../core/board';
import { Colour, Piece, pieceMap } from '../types/enums';

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

	for (const char in bitboards[Colour.White]) {
		const piece = pieceMap[char.toLowerCase()];
		const bitboard = BigInt(bitboards[Colour.White][piece]);
		if (bitboard === 0n) continue;
		const pieceValue = getPieceValue(piece);
		score += pieceValue * bitboard.toString(2).split('1').length;
		if (piece === Piece.King) whiteKing = true;
	}

	if (!whiteKing) return -Infinity;

	let blackKing = false;

	for (const char in bitboards[Colour.Black]) {
		const piece = pieceMap[char.toLowerCase()];
		const bitboard = BigInt(bitboards[Colour.Black][piece]);
		if (bitboard === 0n) continue;
		const pieceValue = getPieceValue(piece);
		score -= pieceValue * bitboard.toString(2).split('1').length;
		if (piece === Piece.King) blackKing = true;
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
