/** @format */

import type { Move } from '../types/Core';
import { Piece } from '../types/enums';
import type { Board } from './board';
import { getBishopMoves } from './pieces/bishop';
import { getKingMoves } from './pieces/king';
import { getKnightMoves } from './pieces/knight';
import { getPawnMoves } from './pieces/pawn';
import { getQueenMoves } from './pieces/queen';
import { getRookMoves } from './pieces/rook';

// deBruijn multiplier
const debruijn64 = 0x03f79d71b4cb0a89n;
const index64 = [
	0, 1, 48, 2, 57, 49, 28, 3, 61, 58, 50, 42, 38, 29, 17, 4, 62, 55, 59, 36, 53, 51, 43, 22, 45, 39, 33, 30, 24, 18, 12,
	5, 63, 47, 56, 27, 60, 41, 37, 16, 54, 35, 52, 21, 44, 32, 23, 11, 46, 26, 40, 15, 34, 20, 31, 10, 25, 14, 19, 9, 13,
	8, 7, 6,
];

function bitScanForward(bb: bigint): number {
	if (bb === 0n) return -1;
	const isolatedLSB = bb & -bb;
	const product = (isolatedLSB * debruijn64) & ((1n << 64n) - 1n);
	const index = Number(product >> 58n);
	return index64[index];
}

/**
 * Generate pseudo-legal moves only (no check filtering) - much faster for perft
 */
function getPseudoLegalMoves(board: Board, position: [number, number]): Move[] {
	const pieceInfo = board.getPieceAt(position[0], position[1]);
	if (pieceInfo === null) {
		return [];
	}

	const [piece] = pieceInfo;

	switch (piece) {
		case Piece.Pawn:
			return getPawnMoves(board, position);
		case Piece.Knight:
			return getKnightMoves(board, position);
		case Piece.Bishop:
			return getBishopMoves(board, position);
		case Piece.Rook:
			return getRookMoves(board, position);
		case Piece.Queen:
			return getQueenMoves(board, position);
		case Piece.King:
			return getKingMoves(board, position, true); // Use recursion=true to skip check validation
		default:
			return [];
	}
}

/**
 * Generate all pseudo-legal moves for a given colour (no legal move filtering)
 */
export function getAllPseudoLegalMoves(board: Board, colour = board.getActiveColour()): Move[] {
	const moves: Move[] = [];
	const bitboards = board.getBitboards();

	for (const pieceType of Object.values(Piece)) {
		let pieceBitboard = bitboards[colour][pieceType];

		while (pieceBitboard !== 0n) {
			const lsb = pieceBitboard & -pieceBitboard;
			const position = bitScanForward(lsb);
			const row = Math.floor(position / 8);
			const col = position % 8;

			const pieceMoves = getPseudoLegalMoves(board, [col, row]);
			moves.push(...pieceMoves);

			pieceBitboard &= pieceBitboard - 1n;
		}
	}

	return moves;
}