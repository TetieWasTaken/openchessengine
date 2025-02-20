import type { Move } from "../../types/core";
import type { Board } from "../board";
import { getDiagonalMoves } from "../moveGenerator";

/**
 * Returns all possible moves for a bishop.
 *
 * @internal
 */
export function getBishopMoves(
  board: Board,
  position: [number, number],
  colour: "black" | "white",
): Move[] {
  return getDiagonalMoves(board, position, colour);
}
