import { Move } from "../../types/Core";
import { Board } from "../Board";
import { getOrthogonalMoves } from "../MoveGenerator";

/**
 * Returns all possible moves for a rook
 * @internal
 */
export function getRookMoves(
  board: Board,
  position: [number, number],
  colour: "white" | "black",
): Move[] {
  return getOrthogonalMoves(board, position, colour);
}
