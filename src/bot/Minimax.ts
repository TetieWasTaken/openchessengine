import { Board } from "../core/Board";
import { getAllMoves, makeMove } from "../core/MoveGenerator";
import { MinimaxResult } from "../types/Bot";
import type { Move } from "../types/Core";

import { evaluate } from "./Eval";

/**
 * Minimax algorithm (see https://chessprogramming.org/Minimax)
 * @param board
 * @param depth
 * @param alpha
 * @param beta
 * @param isMaximising
 */
export function minimax(
  board: Board,
  depth: number,
  alpha = -Infinity,
  beta = Infinity,
  isMaximising: boolean = board.getActiveColour() === "white",
): { score: number; move?: Move } {
  if (depth === 0) {
    return { score: evaluate(board.getBoard()) };
  }

  board.setActiveColour(isMaximising ? "white" : "black");
  const moves = getAllMoves(board);
  let best: MinimaxResult = {
    score: isMaximising ? -Infinity : Infinity,
    move: moves[0],
  };

  for (const move of moves) {
    const newBoard = makeMove(board, move);
    const result = minimax(newBoard, depth - 1, alpha, beta, !isMaximising);
    if (isMaximising) {
      if (result.score > best.score) {
        best = { score: result.score, move };
      }
      alpha = Math.max(alpha, result.score);
    } else {
      if (result.score < best.score) {
        best = { score: result.score, move };
      }
      beta = Math.min(beta, result.score);
    }
    if (beta <= alpha) {
      break;
    }
  }

  return best;
}
