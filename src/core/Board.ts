import type { BoardType } from "../types/Core";
import fenToBoard from "../utils/FEN";

/**
 * Represents a chess board
 */
export default class Board {
  private board: BoardType;
  // todo: separate type
  private castlingRights: {
    white: { king: boolean; queen: boolean };
    black: { king: boolean; queen: boolean };
  };

  constructor(fen?: string) {
    this.board = this.createBoard(fen);
    this.castlingRights = this.parseCastlingRights(fen);
  }

  /**
   * Get a piece from the board
   * @param param0 The coordinates of the piece
   */
  public getPiece([x, y]: [number, number]): BoardType[number][number] | null {
    return this.board[x][y];
  }

  /**
   * Getter for the board
   */
  public getBoard(): BoardType {
    return this.board;
  }

  /**
   * Getter for the castling rights
   * @param side
   * @returns
   */
  public getCastlingRights(
    side?: "white" | "black",
  ): { king: boolean; queen: boolean } | {
    white: { king: boolean; queen: boolean };
    black: { king: boolean; queen: boolean };
  } {
    if (side) {
      return this.castlingRights[side];
    }
    return this.castlingRights;
  }

  /**
   * Convert the board to a string
   */
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

  /**
   * Create a board from a FEN string
   * @param [fen] The FEN string
   * @internal
   */
  private createBoard(
    fen: string = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR",
  ): BoardType {
    return fenToBoard(fen);
  }

  /**
   * Parse castling rights from a FEN string
   * @param fen The FEN string
   * @internal
   */
  private parseCastlingRights(fen: string = ""): {
    white: { king: boolean; queen: boolean };
    black: { king: boolean; queen: boolean };
  } {
    // todo: move to FEN.ts and generalise fen parsing
    const castlingPart = fen.split(" ")[2] || "KQkq";
    return {
      white: {
        king: castlingPart.includes("K"),
        queen: castlingPart.includes("Q"),
      },
      black: {
        king: castlingPart.includes("k"),
        queen: castlingPart.includes("q"),
      },
    };
  }
}
