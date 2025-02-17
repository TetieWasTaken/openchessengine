import Board from "../core/Board";
import type { Move } from "../types/Core";
import { minimaxRoot } from "./Minimax";

/**
 * Search for the best move using the minimaxRoot function.
 * @param board Current board position.
 * @param depth How many moves ahead to search.
 * @param activeColour The side to move ("white" or "black").
 * @returns The best move found.
 */
export default function Search(
  board: Board,
  depth = 3,
  activeColour: "white" | "black" = "white",
): Move {
  const { bestMove } = minimaxRoot(board, depth, activeColour);
  return bestMove;
}
