import { BoardType, PieceType, SquareType } from "../types/BoardType";

/**
 * Converts a FEN string to a Board
 * @param fen A FEN string
 * @returns A Board
 */
export default function fenToBoard(fen: string): BoardType {
  const board: BoardType = [];
  const rows = fen.split("/");

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const boardRow: SquareType[] = [];

    for (let j = 0; j < row.length; j++) {
      const char = row[j];

      // If the character is a number, add that many empty squares
      if (char.match(/[1-8]/)) {
        const num = parseInt(char);

        for (let k = 0; k < num; k++) {
          boardRow.push(null);
        }
      } else {
        // The character is a piece, add it to the board
        const piece: PieceType = {
          type: char as PieceType["type"],
          colour: char === char.toUpperCase() ? "white" : "black",
        };

        boardRow.push(piece);
      }
    }

    board.push(boardRow);
  }

  return board;
}
