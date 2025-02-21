/** @format */

import type { CastlingRights, Move } from '../types/core';
import { Colour, Piece } from '../types/enums';
import { Board } from './board';
import { getBishopMoves } from './pieces/bishop';
import { getKingMoves } from './pieces/king';
import { getKnightMoves } from './pieces/knight';
import { getPawnMoves } from './pieces/pawn';
import { getQueenMoves } from './pieces/queen';
import { getRookMoves } from './pieces/rook';

/**
 * Returns all possible moves for a given board and colour.
 */
export function getAllMoves(board: Board, isRecursion = false): Move[] {
	const moves: Move[] = [];
	const bitboards = board.getBitboards();

	for (const colour of Object.values(Colour)) {
		for (const pieceType of Object.values(Piece)) {
			let pieceBitboard = bitboards[colour][pieceType];

			while (pieceBitboard !== 0n) {
				const position = Math.clz32(Number(pieceBitboard & -pieceBitboard));
				const row = Math.floor(position / 8);
				const col = position % 8;

				const pieceMoves = getMoves(board, [row, col], isRecursion);
				moves.push(...pieceMoves);

				pieceBitboard &= pieceBitboard - 1n;
			}
		}
	}

	return moves;
}

/**
 * Returns the number of nodes at a given depth, see {@link https://www.chessprogramming.org/Perft | chessprogramming/Perft}.
 *
 * @param board -
 * @param depth -
 * @internal
 */
export function _perft(board: Board, depth: number): number {
	if (depth === 0) {
		return 1;
	}

	const moves = getAllMoves(board);
	let nodes = 0;

	for (const move of moves) {
		const newBoard = makeMove(board, move);
		nodes += _perft(newBoard, depth - 1);
	}

	return nodes;
}

/**
 * Makes a move on the board and returns the new board.
 */
export function makeMove(board: Board, move: Move): Board {
	const Bitboards = board.getBitboards();

	const capturedPiece = move.isCapture ? board.getPieceAt(move.to[0], move.to[1]) : null;
	if (capturedPiece) board.removePieceAt(move.to[0], move.to[1]);

	const pieceData = board.getPieceAt(move.from[0], move.from[1]);
	if (pieceData == null) throw new Error('No piece found at the given position');
	const [piece, colour] = pieceData;

	board.removePieceAt(move.from[0], move.from[1], piece, move.piece.colour);
	if (move.promotion) board.addPieceAt(move.to[0], move.to[1], move.promotion, move.piece.colour);
	else board.addPieceAt(move.to[0], move.to[1], piece, move.piece.colour);

	if (move.isEnPassantCapture) {
		const enPassantSquare = board.getEnPassantSquare();
		if (enPassantSquare) board.removePieceAt(enPassantSquare[0], enPassantSquare[1]);
	}

	if (move.isDoublePawnMove) {
		const enPassantSquare = move.piece.colour === Colour.White ? [move.to[0] - 1, move.to[1]] : [move.to[0] + 1, move.to[1]];
		board.setEnPassantSquare(enPassantSquare as [number, number] | null);
	} else {
		board.setEnPassantSquare(null);
	}

	return board.setActiveColour(move.piece.colour === Colour.White ? Colour.Black : Colour.White);
}

/**
 * Returns all possible moves for a piece at a given position.
 */
export function getMoves(board: Board, position: [number, number], isRecursion = false): Move[] {
	const bitboards = board.getBitboards();
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

	// Filter out moves that would put the king in check
	return moves.filter((move) => {
		if (isRecursion) return true;
		else {
			const newBoard = makeMove(board, move);
			const inCheck = isKingInCheck(newBoard, colour);
			return !inCheck;
		}
	});
}

/**
 * Checks if the king of the given colour is in check.
 *
 * @internal
 */
export function isKingInCheck(board: Board, colour: Colour): boolean {
	const kingPosition = findKing(board, colour);
	if (!kingPosition) {
		return false;
	}

	const opponentColour = colour === Colour.White ? Colour.Black : Colour.White;
	const opponentMoves = getAllMoves(board.setActiveColour(opponentColour, false), true);

	return opponentMoves.some((move) => move.to[0] === kingPosition[0] && move.to[1] === kingPosition[1]);
}

/**
 * Finds the position of the king of the given colour.
 *
 * @internal
 */
export function findKing(board: Board, colour: Colour): [number, number] | null {
	const bitboards = board.getBitboards();
	const kingBitboard = bitboards[colour][Piece.King];

	if (kingBitboard === 0n) {
		return null;
	}

	const position = Math.clz32(Number(kingBitboard & -kingBitboard));
	const row = Math.floor(position / 8);
	const col = position % 8;

	return [row, col];
}

/**
 * Returns all possible orthogonal moves for a piece.
 *
 * @internal
 */
export function getOrthogonalMoves(board: Board, position: [number, number], colour = board.getActiveColour()): Move[] {
	const bitboards = board.getBitboards();
	const moves: Move[] = [];
	const directions = [
		[-1, 0],
		[0, -1],
		[0, 1],
		[1, 0],
	];

	for (const direction of directions) {
		const [dx, dy] = direction;
		let [x, y] = position;

		while (true) {
			x += dx;
			y += dy;

			// Check if the move is on the board
			if (x < 0 || x >= 8 || y < 0 || y >= 8) {
				break;
			}

			const targetPieceData = board.getPieceAt(x, y);
			const [targetPiece, targetColour] = targetPieceData || [null, null];

			const selectedPieceData = board.getPieceAt(position[0], position[1]);
			if (selectedPieceData === null) {
				throw new Error('No piece found at the given position / getOrthogonalMoves / b');
			}

			const [selectedPiece, selectedColour] = selectedPieceData;

			if (targetPiece === null) {
				moves.push({
					from: position,
					to: [x, y],
					piece: {
						type: selectedPiece,
						colour: selectedColour,
					},
				});
			} else if (targetColour === selectedColour) {
				break;
			} else {
				moves.push({
					from: position,
					to: [x, y],
					piece: {
						type: selectedPiece,
						colour: selectedColour
					},
				});

				break;
			}
		}
	}

	return moves;
}

/**
 * Returns all possible diagonal moves for a piece.
 *
 * @internal
 */
export function getDiagonalMoves(board: Board, position: [number, number], colour = board.getActiveColour()): Move[] {
	const bitboards = board.getBitboards();
	const moves: Move[] = [];
	const directions = [
		[-1, -1],
		[-1, 1],
		[1, -1],
		[1, 1],
	];

	for (const direction of directions) {
		const [dx, dy] = direction;
		let [x, y] = position;

		while (true) {
			x += dx;
			y += dy;

			// Check if the move is on the board
			if (x < 0 || x >= 8 || y < 0 || y >= 8) {
				break;
			}

			const targetPieceData = board.getPieceAt(x, y);
			const [targetPiece, targetColour] = targetPieceData || [null, null];

			const selectedPieceData = board.getPieceAt(position[0], position[1]);
			if (selectedPieceData === null) {
				throw new Error('No piece found at the given position / getDiagonalMoves / b');
			}

			const [selectedPiece, selectedColour] = selectedPieceData;

			if (targetPiece === null) {
				moves.push({
					from: position,
					to: [x, y],
					piece: {
						type: selectedPiece,
						colour: selectedColour,
					},
				});
			} else if (targetColour === selectedColour) {
				break;
			} else {
				moves.push({
					from: position,
					to: [x, y],
					piece: {
						type: selectedPiece,
						colour: selectedColour
					},
				});

				break;
			}
		}
	}

	return moves;
}
