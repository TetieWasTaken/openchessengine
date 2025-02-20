import type {
  BoardData,
  BoardType,
  CastlingRights,
  SingleCastlingRights,
} from "../types/Core";
import { fenToBoard } from "../utils/FEN";
import { DEFAULT_FEN } from "../utils/constants";

/**
 * Represents a chess board
 */
export class Board {
  private board: BoardType = [];

  private castlingRights: CastlingRights = {
    white: { king: true, queen: true },
    black: { king: true, queen: true },
  };

  private enPassantSquare: [number, number] | null = null;

  private activeColour: "black" | "white" = "white";

  private halfmove = 0;

  private fullmove = 1;

  public constructor(data?: BoardData | string) {
    if (data === undefined || typeof data === "string") {
      this.fromFEN(data);
    } else {
      this.board = data.board;
      this.activeColour = data.activeColour;
      this.castlingRights = data.castlingRights;
      this.enPassantSquare = data.enPassant;
      this.halfmove = data.halfmove;
      this.fullmove = data.fullmove;
    }
  }

  /**
   * Create a board from a FEN string.
   *
   * @param fen - The FEN string
   */
  public fromFEN(fen: string | undefined): this {
    let fenString = fen;
    if (fenString === undefined || fenString.trim() === "") {
      fenString = DEFAULT_FEN;
    }

    const [board, activeColour, castling, enPassant, halfmove, fullmove] = fenString
      .split(" ");
    this.board = this.createBoard(board);
    this.activeColour = activeColour === "w" ? "white" : "black";
    this.castlingRights = this.parseCastlingRights(castling);
    this.enPassantSquare = this.parseEnPassantSquare(enPassant);
    this.halfmove = Number.parseInt(halfmove, 10);
    this.fullmove = Number.parseInt(fullmove, 10);
    return this;
  }

  /**
   * Get a piece from the board.
   *
   * @param coords - The coordinates of the piece
   */
  public getPiece(coords: [number, number]): BoardType[number][number] | null {
    const [x, y] = coords;
    return this.board[x][y];
  }

  /**
   * Getter for the board.
   */
  public getBoard(): BoardType {
    return this.board;
  }

  /**
   * Getter for the castling rights.
   *
   * @param side -
   * @returns
   */
  public getCastlingRights(
    side?: "black" | "white",
  ): CastlingRights | SingleCastlingRights {
    if (side !== undefined) {
      return this.castlingRights[side];
    }

    return this.castlingRights;
  }

  /**
   * Get the halfmove clock.
   */
  public getHalfmove(): number {
    return this.halfmove;
  }

  /**
   * Get the fullmove number.
   */
  public getFullmove(): number {
    return this.fullmove;
  }

  /**
   * Get the active colour.
   */
  public getActiveColour(): "black" | "white" {
    return this.activeColour;
  }

  /**
   * Clone the board.
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
   * Set the active colour.
   *
   * @param colour -
   * @param mutate - Whether to mutate the board or return a new one
   */
  public setActiveColour(
    colour: "black" | "white",
    mutate = true,
  ): this {
    if (mutate) {
      this.activeColour = colour;
      return this;
    }

    const newBoard = this.clone();
    newBoard.setActiveColour(colour, true);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
    return newBoard as this;
  }

  public removeCastlingRights(
    side: "black" | "white",
    type?: "king" | "queen",
  ): this {
    if (type === undefined) {
      this.castlingRights[side].king = false;
      this.castlingRights[side].queen = false;
    } else {
      this.castlingRights[side][type] = false;
    }

    return this;
  }

  /**
   * Convert the board to a string.
   */
  public toString(): string {
    let boardStr = "\n";
    /* eslint-disable id-length */
    const pieces = {
      black: { P: "♙", N: "♘", B: "♗", R: "♖", Q: "♕", K: "♔" },
      white: { P: "♟", N: "♞", B: "♝", R: "♜", Q: "♛", K: "♚" },
    };
    /* eslint-enable id-length */

    for (let row = 7; row >= 0; row--) {
      boardStr += `${(row + 1).toString()} `;
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

  /**
   * Create a board from a FEN string.
   *
   * @param fen - The FEN string
   * @internal
   */
  private createBoard(
    fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR",
  ): BoardType {
    return fenToBoard(fen);
  }

  /**
   * Parse castling rights from a FEN string.
   *
   * @param castling - The FEN string
   * @internal
   */
  private parseCastlingRights(castling = ""): CastlingRights {
    return {
      white: {
        king: castling.includes("K"),
        queen: castling.includes("Q"),
      },
      black: {
        king: castling.includes("k"),
        queen: castling.includes("q"),
      },
    };
  }

  /**
   * Get the en passant square.
   */
  public getEnPassantSquare(): [number, number] | null {
    return this.enPassantSquare;
  }

  /**
   * Parse the en passant square from a FEN string.
   *
   * @param data -
   */
  private parseEnPassantSquare(data = ""): [number, number] | null {
    if (data === "-") {
      return null;
    }

    const [file, rank] = data;
    if (!file.codePointAt(0)) {
      throw new Error("Invalid FEN string");
    }

    const fileCode = file.codePointAt(0);
    if (fileCode === undefined) {
      throw new Error("Invalid FEN string");
    }

    return [Number.parseInt(rank, 10) - 1, fileCode - 97];
  }
}
