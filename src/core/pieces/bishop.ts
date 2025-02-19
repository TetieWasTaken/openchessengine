import type { Move } from "../../types/Core";
import type { Board } from "../Board";
import { getDiagonalMoves } from "../MoveGenerator";

/**
 * Returns all possible moves for a bishop
 * @internal
 */
export function getBishopMoves(
  board: Board,
  position: [number, number],
  colour: "white" | "black",
): Move[] {
  return getDiagonalMoves(board, position, colour);
}
