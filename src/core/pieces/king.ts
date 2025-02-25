/** @format */

import type { Move } from '../../types/core';
import { Colour } from '../../types/enums';
import { BoardSide, Piece } from '../../types/enums';
import type { Board } from '../board';
import { isKingInCheck, makeMove } from '../moveGenerator';

/**
 * Returns all {@link https://www.chessprogramming.org/Move_Generation#Pseudo-legal | pseudo-legal} moves for a king.
 *
 * @param board - The board to get the moves from
 * @param position - The position of the king
 * @param isRecursion - Whether the function is being called recursively
 * @example
 * ```
 * getKingMoves(board, [0, 4]);
 * ```
 * @returns An array of pseudo-legal moves
 */
export function getKingMoves(
	board: Board,
	position: [number, number],
	isRecursion = false,
	colour = board.getActiveColour(),
): Move[] {
	const bitboards = board.getBitboards();
	const moves: Move[] = [];
	const directions = [
		[-1, -1],
		[-1, 0],
		[-1, 1],
		[0, -1],
		[0, 1],
		[1, -1],
		[1, 0],
		[1, 1],
	];

	for (const direction of directions) {
		const [dx, dy] = direction;
		const [x, y] = position;

		// Check if the move is on the board
		if (board.isWithinBounds(x + dx, y + dy)) {
			const [targetPiece, targetColour] = board.getPieceAt(
				x + dx,
				y + dy,
			) ?? [null, null];

			// If the square is empty or has an enemy piece
			if (targetPiece === null || targetColour !== colour) {
				moves.push({
					from: position,
					to: [x + dx, y + dy],
					piece: {
						type: Piece.King,
						colour,
					},
					isCapture: Boolean(targetPiece),
				});
			}
		}
	}

	if (!isRecursion) {
		moves.push(...getCastlingMoves(board, position, colour));
	}

	return moves;
}

/**
 * Returns all possible castling moves for a king.
 *
 * @param board - The board to get the moves from
 * @param position - The position of the king
 * @param colour - The colour of the king
 * @example
 * ```
 * getCastlingMoves(board, [0, 4], 'white');
 * ```
 * @alpha
 */
function getCastlingMoves(board: Board, position: [number, number], colour: Colour): Move[] {
	const moves: Move[] = [];
	const kingInCheck = isKingInCheck(board, colour);

	if (!kingInCheck) {
		const castlingRights = board.getCastlingRights();

		if (castlingRights[colour][BoardSide.King]) {
			const kingSideEmpty =
				board.getPieceAt(position[0] + 1, position[1]) === null &&
				board.getPieceAt(position[0] + 2, position[1]) === null;

			if (kingSideEmpty) {
				const newBoard = makeMove(board, {
					from: position,
					to: [position[0] + 1, position[1]],
					piece: {
						type: Piece.King,
						colour,
					},
				});

				if (!isKingInCheck(newBoard, colour)) {
					const finalBoard = makeMove(newBoard, {
						from: [position[0] + 1, position[1]],
						to: [position[0] + 2, position[1]],
						piece: {
							type: Piece.King,
							colour,
						},
					});

					if (!isKingInCheck(finalBoard, colour)) {
						moves.push({
							from: position,
							to: [position[0] + 2, position[1]],
							castle: BoardSide.King,
							piece: {
								type: Piece.King,
								colour,
							},
						});
					}
				}
			}
		}

		if (castlingRights[colour][BoardSide.Queen]) {
			const queenSideEmpty =
				board.getPieceAt(position[0] - 1, position[1]) === null &&
				board.getPieceAt(position[0] - 2, position[1]) === null &&
				board.getPieceAt(position[0] - 3, position[1]) === null;

			if (queenSideEmpty) {
				const newBoard = makeMove(board, {
					from: position,
					to: [position[0] - 1, position[1]],
					piece: {
						type: Piece.King,
						colour,
					},
				});

				if (!isKingInCheck(newBoard, colour)) {
					const finalBoard = makeMove(newBoard, {
						from: [position[0] - 1, position[1]],
						to: [position[0] - 2, position[1]],
						piece: {
							type: Piece.King,
							colour,
						},
					});

					if (!isKingInCheck(finalBoard, colour)) {
						moves.push({
							from: position,
							to: [position[0] - 2, position[1]],
							castle: BoardSide.Queen,
							piece: {
								type: Piece.King,
								colour,
							},
						});
					}
				}
			}
		}
	}

	return moves;
}
