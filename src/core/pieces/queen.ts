import type { Move } from "../../types/Core";
import type { Board } from "../Board";
import { getDiagonalMoves, getOrthogonalMoves } from "../MoveGenerator";

/**
 * Returns all possible moves for a queen
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
