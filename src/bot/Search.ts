import type { BoardType, Move } from "../types/Core";
import MoveGenerator from "../core/MoveGenerator";
import Minimax from "./Minimax";

/**
 * Search for the best move
 * @param board
 * @param depth
 * @param activeColour
 * @returns the best move
 */
export default function Search(
  board: BoardType,
  depth = 1,
  activeColour: "white" | "black" = "white",
): Move {
  let bestMove: Move = { from: [0, 0], to: [0, 0] };
  let bestScore = -Infinity;

  const moves = MoveGenerator.getAllMoves(board, activeColour);

  for (const move of moves) {
    const newBoard = MoveGenerator.makeMove(board, move);
    // Inverted since we are already at depth 1
    const toMaximise = activeColour !== "white";
    const score = Minimax(newBoard, depth, toMaximise);

    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  return bestMove;
}
