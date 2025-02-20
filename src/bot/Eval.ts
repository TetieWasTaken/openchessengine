import type { Board } from "../core/board";
import type { PieceType } from "../types/core";

/**
 * Evaluates the board and returns a score.
 *
 * @param board - The position to evaluate
 * @returns The evaluation score
 */
export function evaluate(board: Board): number {
  const boardData = board.getBoard();
  let score = 0;
  let whiteKing = false;
  let blackKing = false;

  // Loop through the board and add the value of each piece to the score
  for (const row of boardData) {
    for (const piece of row) {
      if (piece === null) continue; // No piece on this square

      if (piece.type === "K") {
        if (piece.colour === "white") whiteKing = true;
        if (piece.colour === "black") blackKing = true;
      } else {
        const value = getPieceValue(piece);
        score += piece.colour === "white" ? value : -value; // Deduct value for enemy pieces
      }
    }
  }

  if (!whiteKing) return -Infinity;
  else if (!blackKing) return Infinity;

  return score;
}

// see https://www.chessprogramming.org/Evaluation
// see https://en.wikipedia.org/wiki/Chess_piece_relative_value
// see https://www.jsr.org/hs/index.php/path/article/download/4356/1910/26327 (table 4)
// piece values below are based on the average between AlphaZero and Lasker (see wikipedia page)

/**
 * Returns the value of a chess piece.
 *
 * @param piece - The piece whose value is to be determined
 * @returns The value assigned to the piece
 */
function getPieceValue(piece: PieceType): number {
  // eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check -- King is not included
  switch (piece.type) {
    case "P":
      return 1;
    case "N":
      return 3.28;
    case "B":
      return 3.42;
    case "R":
      return 5.44;
    case "Q":
      return 9.75;
    default:
      return 0;
  }
}
