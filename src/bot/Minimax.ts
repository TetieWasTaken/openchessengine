/** @format */

import type { Board } from '../core/board';
import { getAllMoves, makeMove } from '../core/moveGenerator';
import type { MinimaxResult } from '../types/Bot';
import type { Move } from '../types/Core';
import { Colour } from '../types/enums';
import { evaluate } from './Eval';

// Simple transposition table entry
interface TranspositionEntry {
	depth: number;
	score: number;
	move?: Move;
	flag: 'exact' | 'lowerbound' | 'upperbound';
}

// Simple transposition table (hash map)
const transpositionTable = new Map<string, TranspositionEntry>();

/**
 * Clear the transposition table (useful for new positions)
 */
export function clearTranspositionTable(): void {
	transpositionTable.clear();
}

/**
 * Get a simple hash of the board position
 * @param board - The board to hash
 * @returns A string hash of the position
 */
function getBoardHash(board: Board): string {
	const bitboards = board.getBitboards();
	const castlingRights = board.getCastlingRights();
	const enPassant = board.getEnPassantSquare();
	const activeColour = board.getActiveColour();
	
	// Create a simple hash from the position
	return JSON.stringify({
		bitboards,
		castlingRights,
		enPassant,
		activeColour
	});
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
	const boardHash = getBoardHash(board);
	
	// Check transposition table
	const ttEntry = transpositionTable.get(boardHash);
	if (ttEntry && ttEntry.depth >= depth) {
		if (ttEntry.flag === 'exact') {
			return { move: ttEntry.move, score: ttEntry.score };
		}
		if (ttEntry.flag === 'lowerbound' && ttEntry.score >= initialBeta) {
			return { move: ttEntry.move, score: ttEntry.score };
		}
		if (ttEntry.flag === 'upperbound' && ttEntry.score <= initialAlpha) {
			return { move: ttEntry.move, score: ttEntry.score };
		}
	}

	if (depth === 0) {
		// Reached the end of the search tree, evaluate the position
		const score = evaluate(board);
		transpositionTable.set(boardHash, {
			depth: 0,
			score,
			flag: 'exact'
		});
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
	let flag: 'exact' | 'lowerbound' | 'upperbound' = 'upperbound';

	for (const move of orderedMoves) {
		// Make the move and evaluate the resulting position
		const newBoard = makeMove(board, move);
		const result = minimax(newBoard, depth - 1, !isMaximising, alpha, beta);

		if (isMaximising) {
			if (result.score > best.score) {
				best = { score: result.score, move };
			}

			alpha = Math.max(alpha, result.score);
			if (alpha >= beta) {
				flag = 'lowerbound';
				break;
			}
		} else {
			if (result.score < best.score) {
				best = { score: result.score, move };
			}

			beta = Math.min(beta, result.score);
			if (beta <= alpha) {
				flag = 'upperbound';
				break;
			}
		}
	}

	if (alpha > initialAlpha && beta < initialBeta) {
		flag = 'exact';
	}

	// Store in transposition table
	transpositionTable.set(boardHash, {
		depth,
		score: best.score,
		move: best.move,
		flag
	});

	return best;
}
