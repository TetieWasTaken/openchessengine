import type { BoardType } from "../types/Core";
import fenToBoard from "../utils/FEN";

export default class Board {
  private board: BoardType;

  constructor(fen?: string) {
    this.board = this.createBoard(fen);
  }

  public getPiece([x, y]: [number, number]): BoardType[number][number] | null {
    return this.board[x][y];
  }

  public getBoard(): BoardType {
    return this.board;
  }

  public toString(): string {
    let boardStr = "\n";
    const pieces = {
      black: { P: "♙", N: "♘", B: "♗", R: "♖", Q: "♕", K: "♔" },
      white: { P: "♟", N: "♞", B: "♝", R: "♜", Q: "♛", K: "♚" },
    };

    for (let row = 7; row >= 0; row--) {
      boardStr += `${row + 1} `;
      for (let col = 0; col < 8; col++) {
        const piece = this.board[row][col];
        const square = (row + col) % 2 === 0 ? "◼" : "◻";
        boardStr += piece ? pieces[piece.colour][piece.type] : square;
        boardStr += " ";
      }
      boardStr += "\n";
    }
    boardStr += "  a b c d e f g h\n";
    return boardStr;
  }

  public isCheckmate(): boolean {
    // todo: implement
    return false;
  }

  private createBoard(
    fen: string = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR",
  ): BoardType {
    return fenToBoard(fen);
  }
}
