import type { Move } from "../../types/core";
import type { Board } from "../board";
import { getDiagonalMoves, getOrthogonalMoves } from "../moveGenerator";

/**
 * Returns all {@link https://www.chessprogramming.org/Move_Generation#Pseudo-legal | pseudo-legal} moves for a queen.
 *
 * @param board - The board to get the moves from
 * @param position - The position of the queen
 * @example
 * ```
 * getQueenMoves(board, [0, 3]);
 * ```
 * @returns An array of pseudo-legal moves
 */
export function getQueenMoves(
  board: Board,
  position: [number, number],
): Move[] {
  return [
    ...getOrthogonalMoves(board, position),
    ...getDiagonalMoves(board, position),
  ];
}
