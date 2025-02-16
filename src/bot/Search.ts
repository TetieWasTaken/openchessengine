import type { BoardType, Move } from "../types/Core";
import MoveGenerator from "../core/MoveGenerator";
import Minimax from "./Minimax";

export default function Search(
  board: BoardType,
  depth = 3,
  activeColour: "white" | "black" = "white",
): Move {
  let bestMove: Move = { from: [0, 0], to: [0, 0] };
  let bestScore = -Infinity;

  const moves = MoveGenerator.getAllMoves(board, activeColour);

  for (const move of moves) {
    const newBoard = MoveGenerator.makeMove(board, move);
    const toMaximise = activeColour !== "white";
    const score = Minimax(newBoard, depth, toMaximise);

    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  return bestMove;
}
