import { Board } from "../core/Board";
import type { Move } from "../types/Core";
import { minimax } from "./Minimax";

/**
 * Search for the best move using the minimaxRoot function.
 * @param board Current board position.
 * @param depth How many moves ahead to search.
 * @returns The best move found.
 */
export function search(
  board: Board,
  depth: number,
): Move | undefined {
  const { move } = minimax(board, depth);
  return move;
}
