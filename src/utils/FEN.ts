import type { BoardType, PieceType, SquareType } from "../types/Core";

/**
 * Converts a FEN string to a Board
 * @param fen A FEN string
 * @returns A Board
 */
export default function fenToBoard(fen: string): BoardType {
  const board: BoardType = [];
  const rows = fen.split("/");

  for (let i = rows.length - 1; i >= 0; i--) {
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

export function toFEN(board: BoardType): string {
  return board
    .map((row) => {
      let fen = "";
      let emptyCount = 0;

      for (const square of row) {
        if (square === null) {
          emptyCount++;
        } else {
          if (emptyCount > 0) {
            fen += emptyCount;
            emptyCount = 0;
          }
          fen += pieceToFen(square);
        }
      }

      if (emptyCount > 0) fen += emptyCount;
      return fen;
    })
    .join("/");
}

function pieceToFen(piece: PieceType): string {
  const map: { [key: string]: string } = {
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

type FENParts = {
  board: string;
  activeColour: string;
  castling: string;
  enPassant: string;
  halfmove: string;
  fullmove: string;
};

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
