import type { Move } from "../types/Core";
import MoveGenerator from "../core/MoveGenerator";
import Eval from "./Eval";
import { MinimaxResult } from "../types/Bot";
import Board from "../core/Board";

/**
 * Minimax algorithm (see https://www.chessprogramming.org/Minimax)
 * @param board
 * @param depth
 * @param isMaximising
 */
export function minimax(
  board: Board,
  depth: number,
  isMaximising: boolean = board.getActiveColour() === "white",
): { score: number; move?: Move } {
  if (depth === 0) {
    return { score: Eval.evaluate(board.getBoard()) };
  }

  board.setActiveColour(isMaximising ? "white" : "black");
  const moves = MoveGenerator.getAllMoves(board);
  let best: MinimaxResult = {
    score: isMaximising ? -Infinity : Infinity,
    move: moves[0],
  };

  for (const move of moves) {
    const newBoard = MoveGenerator.makeMove(board, move);
    const result = minimax(newBoard, depth - 1, !isMaximising);
    if (isMaximising ? result.score > best.score : result.score < best.score) {
      best = { score: result.score, move };
    }
  }

  return best;
}
