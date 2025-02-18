import type {
  BoardData,
  BoardType,
  CastlingRights,
  SingleCastlingRights,
} from "../types/Core";
import { DEFAULT_FEN } from "../utils/constants";
import fenToBoard from "../utils/FEN";

/**
 * Represents a chess board
 */
export default class Board {
  private board: BoardType = [];
  private castlingRights: CastlingRights = {
    white: { king: true, queen: true },
    black: { king: true, queen: true },
  };
  private enPassantSquare: [number, number] | null = null;
  private activeColour: "white" | "black" = "white";
  private halfmove: number = 0;
  private fullmove: number = 0;

  constructor(data?: string | BoardData) {
    if (!data || typeof data === "string") {
      this.fromFEN(data);
    } else if (data) {
      this.board = data.board;
      this.activeColour = data.activeColour;
      this.castlingRights = data.castlingRights;
      this.enPassantSquare = data.enPassant;
      this.halfmove = data.halfmove;
      this.fullmove = data.fullmove;
    }
  }

  /**
   * Create a board from a FEN string
   * @param fen The FEN string
   */
  public fromFEN(fen: string | undefined): Board {
    if (!fen) {
      fen = DEFAULT_FEN;
    }

    const [board, activeColour, castling, enPassant, halfmove, fullmove] = fen
      .split(" ");
    this.board = this.createBoard(board);
    this.activeColour = this.parseActiveColour(fen);
    this.castlingRights = this.parseCastlingRights(fen);
    this.enPassantSquare = this.parseEnPassantSquare(fen);
    this.halfmove = parseInt(halfmove);
    this.fullmove = parseInt(fullmove);
    return this;
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
  ): CastlingRights | SingleCastlingRights {
    if (side) {
      return this.castlingRights[side];
    }
    return this.castlingRights;
  }

  /**
   * Get the halfmove clock
   */
  public getHalfmove(): number {
    return this.halfmove;
  }

  /**
   * Get the fullmove number
   */
  public getFullmove(): number {
    return this.fullmove;
  }

  /**
   * Get the active colour
   */
  public getActiveColour(): "white" | "black" {
    return this.activeColour;
  }

  /**
   * Clone the board
   */
  public clone(): Board {
    return new Board({
      board: this.board.map((row) => [...row]),
      activeColour: this.activeColour,
      castlingRights: {
        white: { ...this.castlingRights.white },
        black: { ...this.castlingRights.black },
      },
      enPassant: this.enPassantSquare,
      halfmove: this.halfmove,
      fullmove: this.fullmove,
    });
  }

  /**
   * Set the active colour
   * @param colour
   * @param mutate Whether to mutate the board or return a new one
   */
  public setActiveColour(
    colour: "white" | "black",
    mutate: boolean = true,
  ): Board {
    if (mutate) {
      this.activeColour = colour;
      return this;
    }
    return this.clone().setActiveColour(colour, true);
  }

  public removeCastlingRights(
    side: "white" | "black",
    type?: "king" | "queen",
  ): Board {
    if (type) {
      this.castlingRights[side][type] = false;
    } else {
      this.castlingRights[side].king = false;
      this.castlingRights[side].queen = false;
    }

    return this;
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
   * Get the active colour
   */
  parseActiveColour(fen: string = ""): "white" | "black" {
    return fen.split(" ")[1] === "w" ? "white" : "black";
  }

  /**
   * Parse castling rights from a FEN string
   * @param fen The FEN string
   * @internal
   */
  private parseCastlingRights(fen: string = ""): CastlingRights {
    // todo: move to FEN.ts and generalise fen parsing
    const castlingPart = fen.split(" ")[2];
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

  /**
   * Get the en passant square
   */
  public getEnPassantSquare(): [number, number] | null {
    return this.enPassantSquare;
  }

  /**
   * Parse the en passant square from a FEN string
   * @param fen
   */
  private parseEnPassantSquare(fen: string = ""): [number, number] | null {
    const enPassantPart = fen.split(" ")[3] || "-";
    if (enPassantPart === "-") {
      return null;
    }

    const [file, rank] = enPassantPart;
    return [parseInt(rank) - 1, file.charCodeAt(0) - 97];
  }
}
