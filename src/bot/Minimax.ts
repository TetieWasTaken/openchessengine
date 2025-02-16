import type { BoardType } from "../types/Core";
import MoveGenerator from "../core/MoveGenerator";
import Eval from "./Eval";

/**
 * Minimax algorithm, see https://www.chessprogramming.org/Minimax
 * @param board
 * @param depth How many moves to look ahead
 * @param isMaximising Whether to maximise or minimise the score (white is maximising, black is minimising)
 * @returns The score of the best move
 */
export default function Minimax(
  board: BoardType,
  depth: number,
  isMaximising: boolean,
): number {
  if (depth === 0) {
    return Eval.evaluate(board);
  }

  const moves = MoveGenerator.getAllMoves(
    board,
    isMaximising ? "white" : "black",
  );

  if (isMaximising) {
    let bestMove = -Infinity;
    for (const move of moves) {
      const newBoard = MoveGenerator.makeMove(board, move);
      const score = Minimax(newBoard, depth - 1, false);
      bestMove = Math.max(bestMove, score);

      if (Number.isNaN(bestMove)) {
        throw new Error("bestMove is NaN");
      }
    }

    return bestMove;
  } else {
    let bestMove = Infinity;
    for (const move of moves) {
      const newBoard = MoveGenerator.makeMove(board, move);
      const score = Minimax(newBoard, depth - 1, true);
      bestMove = Math.min(bestMove, score);

      if (Number.isNaN(bestMove)) {
        throw new Error("bestMove is NaN");
      }
    }

    return bestMove;
  }
}
