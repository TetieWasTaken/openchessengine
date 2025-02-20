import type { BoardType, CastlingRights, Move } from "../types/core";
import { Board } from "./board";
import { getBishopMoves } from "./pieces/bishop";
import { getKingMoves } from "./pieces/king";
import { getKnightMoves } from "./pieces/knight";
import { getPawnMoves } from "./pieces/pawn";
import { getQueenMoves } from "./pieces/queen";
import { getRookMoves } from "./pieces/rook";

/**
 * Returns all possible moves for a given board and colour.
 */
export function getAllMoves(
  board: Board,
  isRecursion = false,
): Move[] {
  const moves: Move[] = [];
  const boardData = board.getBoard();

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (
        boardData[i][j] !== null &&
        boardData[i][j]?.colour === board.getActiveColour()
      ) {
        moves.push(...getMoves(board, [i, j], isRecursion));
      }
    }
  }

  return moves;
}

/**
 * Returns the number of nodes at a given depth, see {@link https://www.chessprogramming.org/Perft | chessprogramming/Perft}.
 *
 * @param board -
 * @param depth -
 * @internal
 */
export function _perft(board: Board, depth: number): number {
  if (depth === 0) {
    return 1;
  }

  const moves = getAllMoves(board);
  let nodes = 0;

  for (const move of moves) {
    const newBoard = makeMove(board, move);
    nodes += _perft(newBoard, depth - 1);
  }

  return nodes;
}

/**
 * Makes a move on the board and returns the new board.
 */
export function makeMove(board: Board, move: Move): Board {
  const boardData = board.getBoard();
  const newBoard = boardData.map((row) => row.slice());

  const capturedPiece = newBoard[move.to[0]][move.to[1]];

  const piece = newBoard[move.from[0]][move.from[1]];
  newBoard[move.from[0]][move.from[1]] = null;

  // Checking for pawn should be superfluous, but good for robustness
  if (move.promotion !== undefined && piece?.type === "P") {
    newBoard[move.to[0]][move.to[1]] = {
      type: move.promotion,
      colour: piece.colour,
    };
  } else {
    newBoard[move.to[0]][move.to[1]] = piece;
  }

  // Castling rights
  let newCastlingRights: CastlingRights = {
    white: { king: false, queen: false },
    black: { king: false, queen: false },
  };
  const castlingRights = board.getCastlingRights();
  newCastlingRights = { ...newCastlingRights, ...castlingRights };

  if (capturedPiece && capturedPiece.type === "R") {
    if (capturedPiece.colour === "white") {
      if (move.to[0] === 0 && move.to[1] === 0) {
        newCastlingRights = {
          ...newCastlingRights,
          white: { ...newCastlingRights.white, queen: false },
        };
      } else if (move.to[0] === 0 && move.to[1] === 7) {
        newCastlingRights = {
          ...newCastlingRights,
          white: { ...newCastlingRights.white, king: false },
        };
      }
    } else if (move.to[0] === 7 && move.to[1] === 0) {
      newCastlingRights = {
        ...newCastlingRights,
        black: { ...newCastlingRights.black, queen: false },
      };
    } else if (move.to[0] === 7 && move.to[1] === 7) {
      newCastlingRights = {
        ...newCastlingRights,
        black: { ...newCastlingRights.black, king: false },
      };
    }
  }

  if (move.castle !== undefined) {
    const kingSide = move.castle === "K";
    const rookFrom = kingSide ? [move.to[0], 7] : [move.to[0], 0];
    const rookTo = kingSide ? [move.to[0], 5] : [move.to[0], 3];

    newBoard[rookTo[0]][rookTo[1]] = newBoard[rookFrom[0]][rookFrom[1]];
    newBoard[rookFrom[0]][rookFrom[1]] = null;
  }

  if (piece?.type === "K") {
    newCastlingRights = {
      ...newCastlingRights,
      [piece.colour]: {
        king: false,
        queen: false,
      },
    };
  } else if (piece?.type === "R") {
    if (piece.colour === "white") {
      if (move.from[0] === 0 && move.from[1] === 0) {
        newCastlingRights = {
          ...newCastlingRights,
          white: {
            ...newCastlingRights.white,
            queen: false,
          },
        };
      } else if (move.from[0] === 0 && move.from[1] === 7) {
        newCastlingRights = {
          ...newCastlingRights,
          white: {
            ...newCastlingRights.white,
            king: false,
          },
        };
      }
    } else if (move.from[0] === 7 && move.from[1] === 0) {
      newCastlingRights = {
        ...newCastlingRights,
        black: {
          ...newCastlingRights.black,
          queen: false,
        },
      };
    } else if (move.from[0] === 7 && move.from[1] === 7) {
      newCastlingRights = {
        ...newCastlingRights,
        black: {
          ...newCastlingRights.black,
          king: false,
        },
      };
    }
  }

  if (move.isEnPassantCapture === true) {
    newBoard[move.from[0]][move.to[1]] = null;
  }

  let enPassantSquare: [number, number] | null = null;
  if (move.isDoublePawnMove === true) {
    if (piece?.colour === "white") {
      enPassantSquare = [move.to[0] - 1, move.to[1]];
    } else {
      enPassantSquare = [move.to[0] + 1, move.to[1]];
    }
  }

  return new Board({
    board: newBoard,
    activeColour: board.getActiveColour() === "white" ? "black" : "white",
    castlingRights: newCastlingRights,
    enPassant: enPassantSquare,
    halfmove: piece?.type === "P" || capturedPiece
      ? 0
      : board.getHalfmove() + 1,
    fullmove: board.getFullmove() +
      (board.getActiveColour() === "black" ? 1 : 0),
  });
}

/**
 * Returns all possible moves for a piece at a given position.
 */
export function getMoves(
  board: Board,
  position: [number, number],
  isRecursion = false,
): Move[] {
  const boardData = board.getBoard();
  const piece = boardData[position[0]][position[1]];
  if (piece === null) {
    return [];
  }

  let moves: Move[] = [];

  switch (piece.type) {
    case "P":
      moves = getPawnMoves(board, position);
      break;
    case "N":
      moves = getKnightMoves(board, position);
      break;
    case "B":
      moves = getBishopMoves(board, position);
      break;
    case "R":
      moves = getRookMoves(board, position);
      break;
    case "Q":
      moves = getQueenMoves(board, position);
      break;
    case "K":
      moves = getKingMoves(
        board,
        position,
        isRecursion,
      );
      break;
  }

  // Filter out moves that would put the king in check
  return moves.filter((move) => {
    if (isRecursion) return true;
    else {
      const newBoard = makeMove(board, move);
      const inCheck = isKingInCheck(newBoard, piece.colour);
      return !inCheck;
    }
  });
}

/**
 * Checks if the king of the given colour is in check.
 *
 * @internal
 */
export function isKingInCheck(
  board: Board,
  colour: "black" | "white",
): boolean {
  const kingPosition = findKing(board.getBoard(), colour);
  if (!kingPosition) {
    return false;
  }

  const opponentColour = colour === "white" ? "black" : "white";
  const opponentMoves = getAllMoves(
    board.setActiveColour(opponentColour, false),
    true,
  );

  return opponentMoves.some((move) =>
    move.to[0] === kingPosition[0] && move.to[1] === kingPosition[1]
  );
}

/**
 * Finds the position of the king of the given colour.
 *
 * @internal
 */
export function findKing(
  board: BoardType,
  colour: "black" | "white",
): [number, number] | null {
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (board[i][j]?.type === "K" && board[i][j]?.colour === colour) {
        return [i, j];
      }
    }
  }

  return null;
}

/**
 * Returns all possible orthogonal moves for a piece.
 *
 * @internal
 */
export function getOrthogonalMoves(
  board: Board,
  position: [number, number],
  colour = board.getActiveColour()
): Move[] {
  const boardData = board.getBoard();
  const moves: Move[] = [];
  const directions = [
    [-1, 0],
    [0, -1],
    [0, 1],
    [1, 0],
  ];

  for (const direction of directions) {
    const [dx, dy] = direction;
    let [x, y] = position;

    while (true) {
      x += dx;
      y += dy;

      // Check if the move is on the board
      if (x < 0 || x >= 8 || y < 0 || y >= 8) {
        break;
      }

      const piece = boardData[x][y];

      if (piece === null) {
        moves.push({
          from: position,
          to: [x, y],
        });
      } else if (piece.colour === colour) {
        break;
      } else {
        moves.push({
          from: position,
          to: [x, y],
        });

        break;
      }
    }
  }

  return moves;
}

/**
 * Returns all possible diagonal moves for a piece.
 *
 * @internal
 */
export function getDiagonalMoves(
  board: Board,
  position: [number, number],
  colour = board.getActiveColour()
): Move[] {
  const boardData = board.getBoard();
  const moves: Move[] = [];
  const directions = [
    [-1, -1],
    [-1, 1],
    [1, -1],
    [1, 1],
  ];

  for (const direction of directions) {
    const [dx, dy] = direction;
    let [x, y] = position;

    while (true) {
      x += dx;
      y += dy;

      // Check if the move is on the board
      if (x < 0 || x >= 8 || y < 0 || y >= 8) {
        break;
      }

      const piece = boardData[x][y];

      if (piece === null) {
        moves.push({
          from: position,
          to: [x, y],
        });
      } else if (piece.colour === colour) {
        break;
      } else {
        moves.push({
          from: position,
          to: [x, y],
        });

        break;
      }
    }
  }

  return moves;
}
