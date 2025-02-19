import type {
  BoardType,
  CastlingRights,
  Move,
  SingleCastlingRights,
} from "../types/Core";
import { Board } from "./Board";
import { getKnightMoves } from "./pieces/knight";
import { getPawnMoves } from "./pieces/pawn";

/**
 * Returns all possible moves for a given board and colour
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
 * Returns the number of nodes at a given depth, see https://www.chessprogramming.org/Perft
 * @param board
 * @param depth
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
 * Makes a move on the board and returns the new board
 */
export function makeMove(board: Board, move: Move): Board {
  const boardData = board.getBoard();
  const newBoard = boardData.map((row) => row.slice());

  const capturedPiece = newBoard[move.to[0]][move.to[1]];

  const piece = newBoard[move.from[0]][move.from[1]];
  newBoard[move.from[0]][move.from[1]] = null;

  // Checking for pawn should be superfluous, but good for robustness
  if (Boolean(move.promotion) && piece?.type === "P") {
    newBoard[move.to[0]][move.to[1]] = {
      type: move.promotion!,
      colour: piece.colour,
    };
  } else {
    newBoard[move.to[0]][move.to[1]] = piece;
  }

  // Castling rights
  // eslint-disabe-next-line @typescript-eslint/no-unsafe-type-assertion
  let newCastlingRights = board.getCastlingRights() as CastlingRights;

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
    } else {
      if (move.to[0] === 7 && move.to[1] === 0) {
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
  }

  if (move.castle !== null && move.castle !== undefined) {
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
    } else {
      if (move.from[0] === 7 && move.from[1] === 0) {
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
 * Returns all possible moves for a piece at a given position
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
      moves = getPawnMoves(board, position, piece.colour);
      break;
    case "N":
      moves = getKnightMoves(board, position, piece.colour);
      break;
    case "B":
      moves = getBishopMoves(boardData, position, piece.colour);
      break;
    case "R":
      moves = getRookMoves(boardData, position, piece.colour);
      break;
    case "Q":
      moves = getQueenMoves(boardData, position, piece.colour);
      break;
    case "K":
      moves = getKingMoves(
        board,
        position,
        piece.colour,
        isRecursion,
      );
      break;
  }

  // Filter out moves that would put the king in check
  return moves.filter((move) => {
    if (!isRecursion) {
      const newBoard = makeMove(board, move);
      const inCheck = isKingInCheck(newBoard, piece.colour);
      return !inCheck;
    } else return true;
  });
}

/**
 * Checks if the king of the given colour is in check
 * @internal
 */
export function isKingInCheck(
  board: Board,
  colour: "white" | "black",
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

  return opponentMoves.some((move) => {
    return move.to[0] === kingPosition[0] && move.to[1] === kingPosition[1];
  });
}

/**
 * Finds the position of the king of the given colour
 * @internal
 */
export function findKing(
  board: BoardType,
  colour: "white" | "black",
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
 * Returns all possible moves for a bishop
 * @internal
 */
export function getBishopMoves(
  board: BoardType,
  position: [number, number],
  colour: "white" | "black",
): Move[] {
  return getDiagonalMoves(board, position, colour);
}

/**
 * Returns all possible moves for a rook
 * @internal
 */
export function getRookMoves(
  board: BoardType,
  position: [number, number],
  colour: "white" | "black",
): Move[] {
  return getOrthogonalMoves(board, position, colour);
}

/**
 * Returns all possible moves for a queen
 * @internal
 */
export function getQueenMoves(
  board: BoardType,
  position: [number, number],
  colour: "white" | "black",
): Move[] {
  return [
    ...getOrthogonalMoves(board, position, colour),
    ...getDiagonalMoves(board, position, colour),
  ];
}

/**
 * Returns all possible moves for a king
 * @internal
 */
export function getKingMoves(
  board: Board,
  position: [number, number],
  colour: "white" | "black",
  isRecursion = false,
): Move[] {
  const moves: Move[] = [];
  const directions = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];

  for (const direction of directions) {
    const [dx, dy] = direction;
    const [x, y] = position;

    // Check if the move is on the board
    if (x + dx >= 0 && x + dx < 8 && y + dy >= 0 && y + dy < 8) {
      const piece = board.getBoard()[x + dx][y + dy];

      if (piece === null || piece.colour !== colour) {
        moves.push({
          from: position,
          to: [x + dx, y + dy],
        });
      }
    }
  }

  if (!isRecursion) {
    const kingInCheck = isKingInCheck(board, colour);

    if (!kingInCheck) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
      const castlingRights = board.getCastlingRights(
        colour,
      ) as SingleCastlingRights;

      if (castlingRights.king) {
        const kingSide = colour === "white" ? 0 : 7;
        const kingSideEmpty = board.getBoard()[kingSide][5] === null &&
          board.getBoard()[kingSide][6] === null;

        if (kingSideEmpty) {
          const newBoard = makeMove(
            board,
            {
              from: position,
              to: [kingSide, 5],
            },
          );

          if (!isKingInCheck(newBoard, colour)) {
            const finalBoard = makeMove(newBoard, {
              from: [kingSide, 5],
              to: [kingSide, 6],
            });

            if (!isKingInCheck(finalBoard, colour)) {
              moves.push({
                from: position,
                to: [kingSide, 6],
                castle: "K",
              });
            }
          }
        }
      }

      if (castlingRights.queen) {
        const queenSide = colour === "white" ? 0 : 7;
        const queenSideEmpty = board.getBoard()[queenSide][1] === null &&
          board.getBoard()[queenSide][2] === null &&
          board.getBoard()[queenSide][3] === null;
        if (queenSideEmpty) {
          const newBoard = makeMove(
            board,
            {
              from: position,
              to: [queenSide, 3],
            },
          );

          if (!isKingInCheck(newBoard, colour)) {
            const finalBoard = makeMove(newBoard, {
              from: [queenSide, 3],
              to: [queenSide, 2],
            });

            if (!isKingInCheck(finalBoard, colour)) {
              moves.push({
                from: position,
                to: [queenSide, 2],
                castle: "Q",
              });
            }
          }
        }
      }
    }
  }

  return moves;
}

/**
 * Returns all possible orthogonal moves for a piece
 * @internal
 */
export function getOrthogonalMoves(
  board: BoardType,
  position: [number, number],
  colour: "white" | "black",
): Move[] {
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

      const piece = board[x][y];

      if (piece === null) {
        moves.push({
          from: position,
          to: [x, y],
        });
      } else if (piece.colour !== colour) {
        moves.push({
          from: position,
          to: [x, y],
        });

        break;
      } else {
        break;
      }
    }
  }

  return moves;
}

/**
 * Returns all possible diagonal moves for a piece
 * @internal
 */
export function getDiagonalMoves(
  board: BoardType,
  position: [number, number],
  colour: "white" | "black",
): Move[] {
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

      const piece = board[x][y];

      if (piece === null) {
        moves.push({
          from: position,
          to: [x, y],
        });
      } else if (piece.colour !== colour) {
        moves.push({
          from: position,
          to: [x, y],
        });

        break;
      } else {
        break;
      }
    }
  }

  return moves;
}
