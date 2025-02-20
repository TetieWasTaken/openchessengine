import type { Move } from "../../types/core";
import type { Board } from "../board";
import { getDiagonalMoves, getOrthogonalMoves } from "../moveGenerator";

/**
 * Returns all possible moves for a queen.
 *
 * @internal
 */
export function getQueenMoves(
  board: Board,
  position: [number, number],
  colour: "black" | "white",
): Move[] {
  return [
    ...getOrthogonalMoves(board, position, colour),
    ...getDiagonalMoves(board, position, colour),
  ];
}
