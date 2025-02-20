import type { Board } from "../core/board";
import type {
  BoardType,
  CastlingRights,
  PieceType,
  SingleCastlingRights,
  SquareType,
} from "../types/core";

/**
 * Converts a FEN string to a Board.
 *
 * @param fen - A FEN string
 * @returns A Board
 */
export function fenToBoard(fen: string): BoardType {
  const board: BoardType = [];
  const rows = fen.split(" ")[0].split("/");

  for (let i = rows.length - 1; i >= 0; i--) {
    const row = rows[i];
    const boardRow: SquareType[] = [];

    for (const char of row) {
      // If the character is a number, add that many empty squares
      if (/[1-8]/.test(char)) {
        const num = Number.parseInt(char, 10);

        for (let k = 0; k < num; k++) {
          boardRow.push(null);
        }
      } else if (isPieceType(char.toUpperCase())) {
        // The character is a piece, add it to the board
        const piece: PieceType = {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- Not sure why eslint is complaining
          type: char.toUpperCase() as PieceType["type"],
          colour: char === char.toUpperCase() ? "white" : "black",
        };

        boardRow.push(piece);
      } else {
        throw new Error(`Invalid piece type: ${char}`);
      }
    }

    board.push(boardRow);
  }

  return board;
}

type FENOptions = {
  activeColour: string;
  castling: CastlingRights | SingleCastlingRights;
  enPassant: string;
  fullmove: number;
  halfmove: number;
};

/**
 * Converts a Board to a FEN string.
 *
 * @param board -
 */
export function toFEN(board: Board): string {
  const fenParts = [
    _toBoardString(board),
    board.getActiveColour() === "white" ? "w" : "b",
    _toCastlingString(board.getCastlingRights()) === ""
      ? "-"
      : _toCastlingString(board.getCastlingRights()),
    board.getEnPassantSquare() ? board.getEnPassantSquare() : "-",
    board.getHalfmove().toString(),
    board.getFullmove().toString(),
  ];

  return fenParts.join(" ");
}

function _toBoardString(board: Board): string {
  let fen = "";

  for (let i = board.getBoard().length - 1; i >= 0; i--) {
    const row = board.getBoard()[i];
    let empty = 0;

    for (const square of row) {
      if (square === null) {
        empty++;
      } else {
        if (empty !== 0) {
          fen += empty.toString();
          empty = 0;
        }

        fen += pieceToFen(square);
      }
    }

    if (empty !== 0) {
      fen += empty.toString();
    }

    if (i !== 0) {
      fen += "/";
    }
  }

  return fen;
}

function _toCastlingString(castling: FENOptions["castling"]): string {
  if ("white" in castling) {
    return `${castling.white.king ? "K" : ""}${
      castling.white.queen ? "Q" : ""
    }${castling.black.king ? "k" : ""}${castling.black.queen ? "q" : ""}`;
  }

  return `${castling.king ? "K" : ""}${castling.queen ? "Q" : ""}`;
}

/**
 * Converts a piece to its FEN representation.
 *
 * @param piece -
 */
function pieceToFen(piece: PieceType): string {
  /* eslint-disable id-length */
  const map: Record<string, string> = {
    P: "P",
    N: "N",
    B: "B",
    R: "R",
    Q: "Q",
    K: "K",
  };
  /* eslint-enable id-length */

  return piece.colour === "white"
    ? map[piece.type]
    : map[piece.type].toLowerCase();
}

type FENParts = {
  activeColour: string;
  board: string;
  castling: string;
  enPassant: string;
  fullmove: string;
  halfmove: string;
};

/**
 * Checks if a character is a valid piece type.
 *
 * @param char -
 */
function isPieceType(char: string): char is PieceType["type"] {
  return ["P", "N", "B", "R", "Q", "K"].includes(char);
}

/**
 * Parses a FEN string into its parts.
 *
 * @param fen -
 */
export function parseFEN(fen: string): FENParts {
  const parts = fen.split(" ");
  return {
    board: parts[0],
    activeColour: parts[1],
    castling: parts[2],
    enPassant: parts[3],
    halfmove: parts[4],
    fullmove: parts[5],
  };
}
