import { BoardType, PieceType } from "../types/Core";

/**
 * Evaluates the board and returns a score.
 * @param board - The chess board to evaluate.
 * @returns The evaluation score.
 */
export function evaluate(board: BoardType): number {
  let score = 0;

  // Loop through the board and add the value of each piece to the score.
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const piece = board[i][j];

      if (piece === null) continue;
      const value = getPieceValue(piece);
      score += piece.colour === "white" ? value : -value;
    }
  }

  return score;
}

/**
 * Returns the value of a chess piece.
 * @param piece - The piece whose value is to be determined.
 * @returns The value assigned to the piece.
 */
function getPieceValue(piece: PieceType): number {
  switch (piece.type) {
    case "P":
      return 1;
    case "N":
    case "B":
      return 3;
    case "R":
      return 5;
    case "Q":
      return 9;
    case "K":
      return 10000;
    default:
      return 0;
  }
}
