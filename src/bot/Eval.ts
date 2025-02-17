import { BoardType, PieceType } from "../types/Core";

/**
 * Board evaluation helper class
 */
export default class Eval {
  /**
   * Evaluates the position and returns a score
   * @param board
   */
  static evaluate(board: BoardType): number {
    let score = 0;

    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const piece = board[i][j];
        if (piece === null) {
          continue;
        }

        const value = Eval.getPieceValue(piece);
        score += piece.colour === "white" ? value : -value;
      }
    }

    return score;
  }

  /**
   * Returns the value of a piece
   * @param piece
   */
  private static getPieceValue(piece: PieceType): number {
    switch (piece.type) {
      case "P":
        return 1;
      case "N":
        return 3;
      case "B":
        return 3;
      case "R":
        return 5;
      case "Q":
        return 9;
      case "K":
        return 10000;
    }
  }
}
