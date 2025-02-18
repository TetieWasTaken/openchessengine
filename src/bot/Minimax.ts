import type { Move } from "../types/Core";
import MoveGenerator from "../core/MoveGenerator";
import { evaluate } from "./Eval";
import { MinimaxResult } from "../types/Bot";
import Board from "../core/Board";

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
  const moves = MoveGenerator.getAllMoves(board);
  let best: MinimaxResult = {
    score: isMaximising ? -Infinity : Infinity,
    move: moves[0],
  };

  for (const move of moves) {
    const newBoard = MoveGenerator.makeMove(board, move);
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
