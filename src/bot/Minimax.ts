import type { BoardType, Move } from "../types/Core";
import MoveGenerator from "../core/MoveGenerator";
import Eval from "./Eval";
import { MinimaxResult } from "../types/Bot";

/**
 * Recursive minimax evaluation, see https://www.chessprogramming.org/Minimax
 * @param board
 * @param depth remaining depth to search
 * @param isMaximising whether the algorithm should maximise or minimise the score
 * @returns the score of the best move found
 */
export function minimaxScore(
  board: BoardType,
  depth: number,
  isMaximising: boolean,
): number {
  if (depth === 0) {
    // Reached the end of the search, evaluate the position!
    return Eval.evaluate(board);
  }

  const moves = MoveGenerator.getAllMoves(
    board,
    isMaximising ? "white" : "black",
  );

  if (isMaximising) {
    let bestScore = -Infinity;

    for (const move of moves) {
      const newBoard = MoveGenerator.makeMove(board, move);
      const score = minimaxScore(newBoard, depth - 1, false);
      bestScore = Math.max(bestScore, score);
    }

    return bestScore;
  } else {
    let bestScore = Infinity;

    for (const move of moves) {
      const newBoard = MoveGenerator.makeMove(board, move);
      const score = minimaxScore(newBoard, depth - 1, true);
      bestScore = Math.min(bestScore, score);
    }

    return bestScore;
  }
}

/**
 * Top-level minimax function that selects the best move
 * @param board
 * @param depth total search depth
 * @param activeColour the colour to move
 * @returns the best move and its score
 */
export function minimaxRoot(
  board: BoardType,
  depth: number,
  activeColour: "white" | "black",
): MinimaxResult {
  const moves = MoveGenerator.getAllMoves(board, activeColour);
  let bestMove: Move = moves[0];
  let bestScore = activeColour === "white" ? -Infinity : Infinity;

  for (const move of moves) {
    const newBoard = MoveGenerator.makeMove(board, move);
    // Note: at root, switch the maximisation flag
    const score = minimaxScore(newBoard, depth - 1, activeColour !== "white");

    if (
      (activeColour === "white" && score > bestScore) ||
      (activeColour === "black" && score < bestScore)
    ) {
      bestScore = score;
      bestMove = move;
    }
  }

  return { bestMove, bestScore };
}
