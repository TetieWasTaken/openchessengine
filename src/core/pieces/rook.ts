import type { Move } from "../../types/Core";
import type { Board } from "../Board";
import { getOrthogonalMoves } from "../MoveGenerator";

/**
 * Returns all possible moves for a rook
 *
 * @internal
 */
export function getRookMoves(
  board: Board,
  position: [number, number],
  colour: "black" | "white",
): Move[] {
  return getOrthogonalMoves(board, position, colour);
}
