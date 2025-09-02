/** @format */

import { Board } from '../core/board';
import { getAllPseudoLegalMoves } from './pseudoLegalMoves';
import type { Move } from '../types/Core';
import { Colour, Piece, BoardSide } from '../types/enums';

// MoveInfo to store state for undo
interface MoveInfo {
	capturedPiece?: [Piece, Colour];
	previousEnPassant: [number, number] | null;
	previousCastlingRights: any;
	previousHalfmove: number;
}

/**
 * Make a move on the board in place (mutating the board)
 */
function makeMoveInPlace(board: Board, move: Move): MoveInfo {
	const moveInfo: MoveInfo = {
		previousEnPassant: board.getEnPassantSquare(),
		previousCastlingRights: JSON.parse(JSON.stringify(board.getCastlingRights())),
		previousHalfmove: board.getHalfmove()
	};

	// Handle captures
	if (move.isCapture) {
		const capturedPiece = board.getPieceAt(move.to[0], move.to[1], [move.piece.colour === Colour.White ? Colour.Black : Colour.White]);
		if (capturedPiece) {
			moveInfo.capturedPiece = capturedPiece;
			board.removePieceAt(move.to[0], move.to[1]);
		}
	}

	// Move the piece
	const pieceData = board.getPieceAt(move.from[0], move.from[1], [move.piece.colour], [move.piece.type]);
	if (pieceData === null) throw new Error('No piece found at the given position');
	const [piece] = pieceData;

	board.removePieceAt(move.from[0], move.from[1], piece, move.piece.colour);
	if (move.promotion) {
		board.addPieceAt(move.to[0], move.to[1], move.promotion, move.piece.colour);
	} else {
		board.addPieceAt(move.to[0], move.to[1], piece, move.piece.colour);
	}

	// Handle en passant capture
	if (move.isEnPassantCapture) {
		const enPassantSquare = board.getEnPassantSquare();
		if (enPassantSquare) board.removePieceAt(enPassantSquare[0], enPassantSquare[1]);
	}

	// Handle double pawn move
	if (move.isDoublePawnMove) {
		const enPassantSquare: [number, number] | null =
			move.piece.colour === Colour.White ? [move.to[0], move.to[1] + 1] : [move.to[0], move.to[1] - 1];
		board.setEnPassantSquare(enPassantSquare);
	} else {
		board.setEnPassantSquare(null);
	}

	// Handle castling
	if (move.castle !== undefined) {
		const rank = move.piece.colour === Colour.White ? 7 : 0;
		const rookFile = move.castle === BoardSide.King ? 7 : 0;

		board.removePieceAt(rookFile, rank, Piece.Rook, move.piece.colour);

		const newRookFile = move.castle === BoardSide.King ? 5 : 3;
		board.addPieceAt(newRookFile, rank, Piece.Rook, move.piece.colour);
	}

	// Update castling rights for king and rook moves
	const castlingRights = board.getCastlingRights();
	if (move.piece.type === Piece.King) {
		castlingRights[move.piece.colour] = {
			[BoardSide.King]: false,
			[BoardSide.Queen]: false,
		};
	}

	if (move.piece.type === Piece.Rook) {
		const side = move.from[0] === 0 ? BoardSide.Queen : BoardSide.King;
		castlingRights[move.piece.colour][side] = false;
	}

	board.setCastlingRights(castlingRights);

	// Switch active color
	board.setActiveColour(move.piece.colour === Colour.White ? Colour.Black : Colour.White);

	return moveInfo;
}

/**
 * Undo a move on the board
 */
function unmakeMoveInPlace(board: Board, move: Move, moveInfo: MoveInfo): void {
	// Switch active color back
	board.setActiveColour(move.piece.colour);

	// Restore castling rights
	board.setCastlingRights(moveInfo.previousCastlingRights);

	// Restore en passant square
	board.setEnPassantSquare(moveInfo.previousEnPassant);

	// Handle castling undo
	if (move.castle !== undefined) {
		const rank = move.piece.colour === Colour.White ? 7 : 0;
		const rookFile = move.castle === BoardSide.King ? 7 : 0;
		const newRookFile = move.castle === BoardSide.King ? 5 : 3;

		board.removePieceAt(newRookFile, rank, Piece.Rook, move.piece.colour);
		board.addPieceAt(rookFile, rank, Piece.Rook, move.piece.colour);
	}

	// Handle en passant capture undo
	if (move.isEnPassantCapture && moveInfo.previousEnPassant) {
		const capturedPawnColour = move.piece.colour === Colour.White ? Colour.Black : Colour.White;
		board.addPieceAt(moveInfo.previousEnPassant[0], moveInfo.previousEnPassant[1], Piece.Pawn, capturedPawnColour);
	}

	// Move piece back
	const pieceToMove = move.promotion ? move.promotion : move.piece.type;
	board.removePieceAt(move.to[0], move.to[1], pieceToMove, move.piece.colour);
	board.addPieceAt(move.from[0], move.from[1], move.piece.type, move.piece.colour);

	// Restore captured piece
	if (moveInfo.capturedPiece) {
		board.addPieceAt(move.to[0], move.to[1], moveInfo.capturedPiece[0], moveInfo.capturedPiece[1]);
	}
}

/**
 * Fast perft using pseudo-legal moves (no legal move checking during generation)
 */
export function perftFast(board: Board, depth: number): number {
	if (depth === 0) {
		return 1;
	}

	const moves = getAllPseudoLegalMoves(board);
	let nodes = 0;

	for (const move of moves) {
		const moveInfo = makeMoveInPlace(board, move);
		nodes += perftFast(board, depth - 1);
		unmakeMoveInPlace(board, move, moveInfo);
	}

	return nodes;
}