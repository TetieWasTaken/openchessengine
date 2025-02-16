import type { BoardType, Move } from "../types/Core";
import MoveGenerator from "../core/MoveGenerator";
import Minimax from "./Minimax";

export default function Search(board: BoardType): Move {
  let bestMove: Move = { from: [0, 0], to: [0, 0] };
  let bestScore = -Infinity;

  const moves = MoveGenerator.getAllMoves(board, "white");

  for (const move of moves) {
    const newBoard = MoveGenerator.makeMove(board, move);
    const score = Minimax(newBoard, 3, false);

    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  return bestMove;
}
