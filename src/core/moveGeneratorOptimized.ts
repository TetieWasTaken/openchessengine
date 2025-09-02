/** @format */

import type { Move } from '../types/Core';
import { Colour, Piece } from '../types/enums';
import type { Board } from './board';
import { getBishopMoves } from './pieces/bishop';
import { getKingMoves } from './pieces/king';
import { getKnightMoves } from './pieces/knight';
import { getPawnMoves } from './pieces/pawn';
import { getQueenMoves } from './pieces/queen';
import { getRookMoves } from './pieces/rook';

// deBruijn multiplier | https://www.chessprogramming.org/BitScan#De_Bruijn_Multiplication
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
 * Fast check to see if a square is attacked by the opponent
 * This is much faster than generating all moves
 */
function isSquareAttacked(board: Board, square: [number, number], byColour: Colour): boolean {
	const [x, y] = square;
	const bitboards = board.getBitboards();
	const squareBit = 1n << BigInt(y * 8 + x);

	// Check for pawn attacks
	const pawnBitboard = bitboards[byColour][Piece.Pawn];
	if (pawnBitboard !== 0n) {
		if (byColour === Colour.White) {
			// White pawns attack diagonally up
			const leftAttack = (pawnBitboard & 0xfefefefefefefefen) << 9n; // Not H file, shift up-left
			const rightAttack = (pawnBitboard & 0x7f7f7f7f7f7f7f7fn) << 7n; // Not A file, shift up-right
			if ((leftAttack | rightAttack) & squareBit) return true;
		} else {
			// Black pawns attack diagonally down
			const leftAttack = (pawnBitboard & 0x7f7f7f7f7f7f7f7fn) >> 9n; // Not A file, shift down-left
			const rightAttack = (pawnBitboard & 0xfefefefefefefefen) >> 7n; // Not H file, shift down-right
			if ((leftAttack | rightAttack) & squareBit) return true;
		}
	}

	// Check for knight attacks
	const knightBitboard = bitboards[byColour][Piece.Knight];
	if (knightBitboard !== 0n) {
		let knights = knightBitboard;
		while (knights !== 0n) {
			const knightSquare = bitScanForward(knights);
			const knightX = knightSquare % 8;
			const knightY = Math.floor(knightSquare / 8);
			
			const dx = Math.abs(x - knightX);
			const dy = Math.abs(y - knightY);
			if ((dx === 2 && dy === 1) || (dx === 1 && dy === 2)) {
				return true;
			}
			
			knights &= knights - 1n; // Clear the least significant bit
		}
	}

	// Check for king attacks
	const kingBitboard = bitboards[byColour][Piece.King];
	if (kingBitboard !== 0n) {
		const kingSquare = bitScanForward(kingBitboard);
		const kingX = kingSquare % 8;
		const kingY = Math.floor(kingSquare / 8);
		
		const dx = Math.abs(x - kingX);
		const dy = Math.abs(y - kingY);
		if (dx <= 1 && dy <= 1 && (dx !== 0 || dy !== 0)) {
			return true;
		}
	}

	// Check for sliding piece attacks (rook, bishop, queen)
	const rookQueen = bitboards[byColour][Piece.Rook] | bitboards[byColour][Piece.Queen];
	const bishopQueen = bitboards[byColour][Piece.Bishop] | bitboards[byColour][Piece.Queen];

	// Horizontal and vertical attacks (rook + queen)
	if (rookQueen !== 0n) {
		// Check rank (horizontal)
		const rank = y;
		for (let file = 0; file < 8; file++) {
			if (file === x) continue;
			const checkSquare = 1n << BigInt(rank * 8 + file);
			if (rookQueen & checkSquare) {
				// Check if path is clear
				let blocked = false;
				const minFile = Math.min(x, file);
				const maxFile = Math.max(x, file);
				for (let f = minFile + 1; f < maxFile; f++) {
					const pathSquare = 1n << BigInt(rank * 8 + f);
					let occupied = false;
					for (const colour of [Colour.White, Colour.Black]) {
						for (const piece of Object.values(Piece)) {
							if (bitboards[colour][piece] & pathSquare) {
								occupied = true;
								break;
							}
						}
						if (occupied) break;
					}
					if (occupied) {
						blocked = true;
						break;
					}
				}
				if (!blocked) return true;
			}
		}

		// Check file (vertical)
		const file = x;
		for (let r = 0; r < 8; r++) {
			if (r === y) continue;
			const checkSquare = 1n << BigInt(r * 8 + file);
			if (rookQueen & checkSquare) {
				// Check if path is clear
				let blocked = false;
				const minRank = Math.min(y, r);
				const maxRank = Math.max(y, r);
				for (let rank = minRank + 1; rank < maxRank; rank++) {
					const pathSquare = 1n << BigInt(rank * 8 + file);
					let occupied = false;
					for (const colour of [Colour.White, Colour.Black]) {
						for (const piece of Object.values(Piece)) {
							if (bitboards[colour][piece] & pathSquare) {
								occupied = true;
								break;
							}
						}
						if (occupied) break;
					}
					if (occupied) {
						blocked = true;
						break;
					}
				}
				if (!blocked) return true;
			}
		}
	}

	// Diagonal attacks (bishop + queen)
	if (bishopQueen !== 0n) {
		// Check all four diagonal directions
		const directions = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
		for (const [dx, dy] of directions) {
			for (let i = 1; i < 8; i++) {
				const checkX = x + dx * i;
				const checkY = y + dy * i;
				if (checkX < 0 || checkX >= 8 || checkY < 0 || checkY >= 8) break;
				
				const checkSquare = 1n << BigInt(checkY * 8 + checkX);
				
				// Check if there's a bishop or queen here
				if (bishopQueen & checkSquare) {
					return true;
				}
				
				// Check if square is occupied (blocking the diagonal)
				let occupied = false;
				for (const colour of [Colour.White, Colour.Black]) {
					for (const piece of Object.values(Piece)) {
						if (bitboards[colour][piece] & checkSquare) {
							occupied = true;
							break;
						}
					}
					if (occupied) break;
				}
				if (occupied) break; // Path is blocked
			}
		}
	}

	return false;
}

/**
 * Fast check to see if the king is in check
 */
export function isKingInCheckFast(board: Board, colour: Colour): boolean {
	const bitboards = board.getBitboards();
	const kingBitboard = bitboards[colour][Piece.King];
	
	if (kingBitboard === 0n) return false;
	
	const kingSquare = bitScanForward(kingBitboard);
	const kingX = kingSquare % 8;
	const kingY = Math.floor(kingSquare / 8);
	
	const opponentColour = colour === Colour.White ? Colour.Black : Colour.White;
	return isSquareAttacked(board, [kingX, kingY], opponentColour);
}

/**
 * Returns all possible moves for a given board and colour (optimized version).
 */
export function getAllMovesOptimized(board: Board, isRecursion = false, colour = board.getActiveColour()): Move[] {
	const moves: Move[] = [];
	const bitboards = board.getBitboards();

	for (const pieceType of Object.values(Piece)) {
		let pieceBitboard = bitboards[colour][pieceType];

		while (pieceBitboard !== 0n) {
			const lsb = pieceBitboard & -pieceBitboard;
			const position = bitScanForward(lsb);
			const row = Math.floor(position / 8);
			const col = position % 8;

			const pieceMoves = getMovesOptimized(board, [col, row], isRecursion);
			moves.push(...pieceMoves);

			pieceBitboard &= pieceBitboard - 1n;
		}
	}

	return moves;
}

/**
 * Optimized move generation that uses fast check detection
 */
export function getMovesOptimized(board: Board, position: [number, number], isRecursion = false): Move[] {
	const pieceInfo = board.getPieceAt(position[0], position[1]);
	if (pieceInfo === null) {
		return [];
	}

	const [piece, colour] = pieceInfo;

	let moves: Move[] = [];

	switch (piece) {
		case Piece.Pawn:
			moves = getPawnMoves(board, position);
			break;
		case Piece.Knight:
			moves = getKnightMoves(board, position);
			break;
		case Piece.Bishop:
			moves = getBishopMoves(board, position);
			break;
		case Piece.Rook:
			moves = getRookMoves(board, position);
			break;
		case Piece.Queen:
			moves = getQueenMoves(board, position);
			break;
		case Piece.King:
			moves = getKingMoves(board, position, isRecursion);
			break;
	}

	// Filter out moves that would put the king in check (but use fast check detection)
	if (!isRecursion) {
		return moves.filter((move) => {
			// Simulate the move quickly by temporarily modifying the bitboards
			return !wouldMoveLeaveKingInCheck(board, move, colour);
		});
	}

	return moves;
}

/**
 * Fast check to see if a move would leave the king in check
 */
function wouldMoveLeaveKingInCheck(board: Board, move: Move, colour: Colour): boolean {
	// This is a simplified check - for a full implementation, we'd need to 
	// temporarily apply the move and check if the king is in check
	// For now, let's use the existing method but optimize where possible
	
	// Special case: if moving the king, check if the destination square is attacked
	if (move.piece.type === Piece.King) {
		const opponentColour = colour === Colour.White ? Colour.Black : Colour.White;
		return isSquareAttacked(board, move.to, opponentColour);
	}
	
	// For other pieces, we need to simulate the move
	// This is still expensive but better than generating all opponent moves
	const tempBoard = board.clone();
	
	// Apply the move
	const capturedPiece = move.isCapture
		? tempBoard.getPieceAt(move.to[0], move.to[1], [colour === Colour.White ? Colour.Black : Colour.White])
		: null;
	if (capturedPiece) {
		tempBoard.removePieceAt(move.to[0], move.to[1]);
	}
	
	tempBoard.removePieceAt(move.from[0], move.from[1], move.piece.type, colour);
	tempBoard.addPieceAt(move.to[0], move.to[1], move.promotion || move.piece.type, colour);
	
	return isKingInCheckFast(tempBoard, colour);
}