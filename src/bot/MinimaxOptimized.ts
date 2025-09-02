/** @format */

import type { Board } from '../core/board';
import { getAllMoves } from '../core/moveGenerator';
import type { MinimaxResult } from '../types/Bot';
import type { Move } from '../types/Core';
import { Colour, Piece, BoardSide } from '../types/enums';
import { evaluate } from './Eval';

// MoveInfo to store state for undo
interface MoveInfo {
	capturedPiece?: [Piece, Colour];
	previousEnPassant: [number, number] | null;
	previousCastlingRights: any;
	previousHalfmove: number;
}

/**
 * Simple move ordering - prioritize captures and checks
 * @param moves - Array of moves to sort
 * @returns Sorted array of moves
 */
function orderMoves(moves: Move[]): Move[] {
	return moves.sort((a, b) => {
		// Prioritize captures
		if (a.isCapture && !b.isCapture) return -1;
		if (!a.isCapture && b.isCapture) return 1;
		
		// Prioritize promotions
		if (a.promotion && !b.promotion) return -1;
		if (!a.promotion && b.promotion) return 1;
		
		return 0;
	});
}

/**
 * Make a move on the board in place (mutating the board)
 * @param board - The board to modify
 * @param move - The move to make
 * @returns Information needed to undo the move
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

			// Handle rook captures affecting castling rights
			if (capturedPiece[0] === Piece.Rook) {
				const isOriginalRook =
					(capturedPiece[1] === Colour.White && (move.to[0] === 0 || move.to[0] === 7) && move.to[1] === 7) ||
					(capturedPiece[1] === Colour.Black && (move.to[0] === 0 || move.to[0] === 7) && move.to[1] === 0);

				if (isOriginalRook) {
					const side = move.to[0] === 0 ? BoardSide.Queen : BoardSide.King;
					const castlingRights = board.getCastlingRights();
					castlingRights[capturedPiece[1]][side] = false;
					board.setCastlingRights(castlingRights);
				}
			}
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

	// Update move counters
	board.setHalfmove(move.isCapture || move.piece.type === Piece.Pawn ? 0 : board.getHalfmove() + 1);
	if (move.piece.colour === Colour.Black) {
		board.setFullmove(board.getFullmove() + 1);
	}

	// Switch active color
	board.setActiveColour(move.piece.colour === Colour.White ? Colour.Black : Colour.White);

	return moveInfo;
}

/**
 * Undo a move on the board (mutating it back to previous state)
 * @param board - The board to modify
 * @param move - The move to undo
 * @param moveInfo - Information about the move to undo
 */
function unmakeMoveInPlace(board: Board, move: Move, moveInfo: MoveInfo): void {
	// Switch active color back
	board.setActiveColour(move.piece.colour);

	// Restore move counters
	board.setHalfmove(moveInfo.previousHalfmove);
	if (move.piece.colour === Colour.Black) {
		board.setFullmove(board.getFullmove() - 1);
	}

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
 * {@link https://en.wikipedia.org/wiki/Minimax | Minimax} algorithm with
 * {@link https://en.wikipedia.org/wiki/Alpha%E2%80%93beta_pruning | Alpha-Beta pruning}
 * to find the best move in a given position.
 *
 * @param board - The board to evaluate
 * @param depth - How many moves ahead to search
 * @param isMaximising - Whether to maximise or minimise the score
 * @returns The best move and its score
 */
export function minimax(
	board: Board,
	depth: number,
	isMaximising: boolean = board.getActiveColour() === Colour.White,
	initialAlpha = -Infinity,
	initialBeta = Infinity,
): { move?: Move; score: number } {
	if (depth === 0) {
		// Reached the end of the search tree, evaluate the position
		const score = evaluate(board);
		return { score };
	}

	const moves = getAllMoves(board);
	const orderedMoves = orderMoves(moves);
	let best: MinimaxResult = {
		// Assume the worst possible score for the active player
		score: isMaximising ? -Infinity : Infinity,
		move: orderedMoves[0],
	};

	let alpha = initialAlpha;
	let beta = initialBeta;

	for (const move of orderedMoves) {
		// Make the move in place and evaluate the resulting position
		const moveInfo = makeMoveInPlace(board, move);
		const result = minimax(board, depth - 1, !isMaximising, alpha, beta);
		unmakeMoveInPlace(board, move, moveInfo);

		if (isMaximising) {
			if (result.score > best.score) {
				best = { score: result.score, move };
			}

			alpha = Math.max(alpha, result.score);
			if (alpha >= beta) {
				break;
			}
		} else {
			if (result.score < best.score) {
				best = { score: result.score, move };
			}

			beta = Math.min(beta, result.score);
			if (beta <= alpha) {
				break;
			}
		}
	}

	return best;
}