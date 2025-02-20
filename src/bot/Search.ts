import type { Board } from "../core/board";
import type { Move } from "../types/core";
import { minimax } from "./minimax";

/**
 * Search for the best move for the current player
 *
 * @param board - Current board position
 * @param depth - How many moves ahead to search
 * @returns The best move found
 */
export function search(board: Board, depth: number): Move | undefined {
  const { move } = minimax(board, depth);
  return move;
}
