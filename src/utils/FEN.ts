import { Board } from "../core/Board";
import type {
  BoardType,
  CastlingRights,
  PieceType,
  SingleCastlingRights,
  SquareType,
} from "../types/Core";

/**
 * Converts a FEN string to a Board
 * @param fen A FEN string
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
      if (/[1-8]/.exec(char)) {
        const num = parseInt(char);

        for (let k = 0; k < num; k++) {
          boardRow.push(null);
        }
      } else {
        // The character is a piece, add it to the board
        const piece: PieceType = {
          type: char.toUpperCase() as PieceType["type"],
          colour: char === char.toUpperCase() ? "white" : "black",
        };

        boardRow.push(piece);
      }
    }

    board.push(boardRow);
  }

  return board;
}

interface FENOptions {
  activeColour: string;
  castling: SingleCastlingRights | CastlingRights;
  enPassant: string;
  halfmove: number;
  fullmove: number;
}

/**
 * Converts a Board to a FEN string
 * @param board
 * @param options
 */
export function toFEN(
  board: Board,
): string {
  const fenParts = [
    _toBoardString(board),
    board.getActiveColour() === "white" ? "w" : "b",
    _toCastlingString(board.getCastlingRights()) || "-",
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
        if (empty) {
          fen += empty.toString();
          empty = 0;
        }

        fen += pieceToFen(square);
      }
    }

    if (empty) {
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
 * Converts a piece to its FEN representation
 * @param piece
 */
function pieceToFen(piece: PieceType): string {
  const map: Record<string, string> = {
    P: "P",
    N: "N",
    B: "B",
    R: "R",
    Q: "Q",
    K: "K",
  };

  return piece.colour === "white"
    ? map[piece.type]
    : map[piece.type].toLowerCase();
}

interface FENParts {
  board: string;
  activeColour: string;
  castling: string;
  enPassant: string;
  halfmove: string;
  fullmove: string;
}

/**
 * Parses a FEN string into its parts
 * @param fen
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
