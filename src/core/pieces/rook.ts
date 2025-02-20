import type { Move } from "../../types/core";
import type { Board } from "../board";
import { getOrthogonalMoves } from "../moveGenerator";

/**
 * Returns all possible moves for a rook.
 *
 * @internal
 */
export function getRookMoves(
  board: Board,
  position: [number, number],
): Move[] {
  return getOrthogonalMoves(board, position);
}
