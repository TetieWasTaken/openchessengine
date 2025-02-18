import type { BoardType, CastlingRights, Move } from "../types/Core";
import { toFEN } from "../utils/FEN";
import Board from "./Board";

/**
 * Helper class to generate moves for a given board
 */
export default class MoveGenerator {
  /**
   * Returns all possible moves for a given board and colour
   */
  static getAllMoves(
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
          moves.push(...MoveGenerator.getMoves(board, [i, j], isRecursion));
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
  static _perft(board: Board, depth: number): number {
    if (depth === 0) {
      return 1;
    }

    const moves = MoveGenerator.getAllMoves(board);
    let nodes = 0;

    for (const move of moves) {
      const newBoard = MoveGenerator.makeMove(board, move);
      nodes += MoveGenerator._perft(newBoard, depth - 1);
    }

    return nodes;
  }

  /**
   * Makes a move on the board and returns the new board
   */
  static makeMove(board: Board, move: Move): Board {
    const boardData = board.getBoard();
    const newBoard = boardData.map((row) => row.slice());

    const piece = newBoard[move.from[0]][move.from[1]];
    newBoard[move.from[0]][move.from[1]] = null;

    // Checking for pawn should be superfluous, but good for robustness
    if (move.promotion && piece?.type === "P") {
      newBoard[move.to[0]][move.to[1]] = {
        type: move.promotion,
        colour: piece.colour,
      };
    } else {
      newBoard[move.to[0]][move.to[1]] = piece;
    }

    // Castling rights
    let newCastlingRights = board.getCastlingRights() as CastlingRights;

    const capturedPiece = newBoard[move.to[0]][move.to[1]];
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

    if (move.castle) {
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

    let enPassantSquare = "-";
    if (move.isDoublePawnMove) {
      if (piece?.colour === "white") {
        enPassantSquare = String.fromCharCode(97 + move.to[1]) +
          (move.to[0] - 1 + 1);
      } else {
        enPassantSquare = String.fromCharCode(97 + move.to[1]) +
          (move.to[0] + 1 + 1);
      }
    }

    return new Board(toFEN(newBoard, {
      // todo: implement these
      activeColour: board.getActiveColour() === "white" ? "b" : "w",
      castling: newCastlingRights,
      enPassant: enPassantSquare,
      halfmove: 0,
      fullmove: 1,
    }));
  }

  /**
   * Returns all possible moves for a piece at a given position
   */
  static getMoves(
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
        moves = MoveGenerator.getPawnMoves(board, position, piece.colour);
        break;
      case "N":
        moves = MoveGenerator.getKnightMoves(boardData, position, piece.colour);
        break;
      case "B":
        moves = MoveGenerator.getBishopMoves(boardData, position, piece.colour);
        break;
      case "R":
        moves = MoveGenerator.getRookMoves(boardData, position, piece.colour);
        break;
      case "Q":
        moves = MoveGenerator.getQueenMoves(boardData, position, piece.colour);
        break;
      case "K":
        moves = MoveGenerator.getKingMoves(
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
        const newBoard = MoveGenerator.makeMove(board, move);
        const inCheck = MoveGenerator.isKingInCheck(newBoard, piece.colour);
        return !inCheck;
      } else return true;
    });
  }

  /**
   * Checks if the king of the given colour is in check
   * @internal
   */
  static isKingInCheck(board: Board, colour: "white" | "black"): boolean {
    const kingPosition = MoveGenerator.findKing(board.getBoard(), colour);
    if (!kingPosition) {
      return false;
    }

    const opponentColour = colour === "white" ? "black" : "white";
    const opponentMoves = MoveGenerator.getAllMoves(
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
  static findKing(
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
   * Returns all possible moves for a pawn
   * @internal
   */
  static getPawnMoves(
    board: Board,
    position: [number, number],
    colour: "white" | "black",
  ): Move[] {
    // todo: add en passant

    const moves: Move[] = [];
    const direction = colour === "white" ? 1 : -1;
    const boardData = board.getBoard();

    // Move forward one square
    if (boardData[position[0] + direction][position[1]] === null) {
      if (position[0] + direction === 7 || position[0] + direction === 0) {
        moves.push({
          from: position,
          to: [position[0] + direction, position[1]],
          promotion: "Q",
        });
        moves.push({
          from: position,
          to: [position[0] + direction, position[1]],
          promotion: "R",
        });
        moves.push({
          from: position,
          to: [position[0] + direction, position[1]],
          promotion: "B",
        });
        moves.push({
          from: position,
          to: [position[0] + direction, position[1]],
          promotion: "N",
        });
      } else {
        moves.push({
          from: position,
          to: [position[0] + direction, position[1]],
        });
      }
    }

    // Move forward two squares
    if (
      position[0] === (colour === "white" ? 1 : 6) &&
      boardData[position[0] + direction][position[1]] === null &&
      boardData[position[0] + 2 * direction][position[1]] === null
    ) {
      moves.push({
        from: position,
        to: [position[0] + 2 * direction, position[1]],
        isDoublePawnMove: true,
      });
    }

    // En passant
    const enPassantSquare = board.getEnPassantSquare();

    if (enPassantSquare) {
      if (
        enPassantSquare[0] === position[0] + direction && (
          enPassantSquare[1] === position[1] - 1 ||
          enPassantSquare[1] === position[1] + 1
        )
      ) {
        moves.push({
          from: position,
          to: [enPassantSquare[0], enPassantSquare[1]],
        });
      }
    }

    // Capture diagonally to the left
    if (
      position[1] - 1 >= 0 &&
      boardData[position[0] + direction][position[1] - 1] !== null &&
      boardData[position[0] + direction][position[1] - 1]?.colour !== colour
    ) {
      if (position[0] + direction === 7 || position[0] + direction === 0) {
        moves.push({
          from: position,
          to: [position[0] + direction, position[1] - 1],
          promotion: "Q",
        });
        moves.push({
          from: position,
          to: [position[0] + direction, position[1] - 1],
          promotion: "R",
        });
        moves.push({
          from: position,
          to: [position[0] + direction, position[1] - 1],
          promotion: "B",
        });
        moves.push({
          from: position,
          to: [position[0] + direction, position[1] - 1],
          promotion: "N",
        });
      } else {
        moves.push({
          from: position,
          to: [position[0] + direction, position[1] - 1],
        });
      }
    }

    // Capture diagonally to the right
    if (
      position[1] + 1 < 8 &&
      boardData[position[0] + direction][position[1] + 1] !== null &&
      boardData[position[0] + direction][position[1] + 1]?.colour !== colour
    ) {
      if (position[0] + direction === 7 || position[0] + direction === 0) {
        moves.push({
          from: position,
          to: [position[0] + direction, position[1] + 1],
          promotion: "Q",
        });
        moves.push({
          from: position,
          to: [position[0] + direction, position[1] + 1],
          promotion: "R",
        });
        moves.push({
          from: position,
          to: [position[0] + direction, position[1] + 1],
          promotion: "B",
        });
        moves.push({
          from: position,
          to: [position[0] + direction, position[1] + 1],
          promotion: "N",
        });
      } else {
        moves.push({
          from: position,
          to: [position[0] + direction, position[1] + 1],
        });
      }
    }

    return moves;
  }

  /**
   * Returns all possible moves for a knight
   * @internal
   */
  static getKnightMoves(
    board: BoardType,
    position: [number, number],
    colour: "white" | "black",
  ): Move[] {
    const moves: Move[] = [];
    const directions = [
      [-2, -1],
      [-2, 1],
      [-1, -2],
      [-1, 2],
      [1, -2],
      [1, 2],
      [2, -1],
      [2, 1],
    ];

    for (const direction of directions) {
      const [dx, dy] = direction;
      const [x, y] = position;

      // todo: use generic function to mitigate code duplication
      // Check if the move is on the board
      if (x + dx >= 0 && x + dx < 8 && y + dy >= 0 && y + dy < 8) {
        const piece = board[x + dx][y + dy];

        if (piece === null || piece.colour !== colour) {
          moves.push({
            from: position,
            to: [x + dx, y + dy],
          });
        }
      }
    }

    return moves;
  }

  /**
   * Returns all possible moves for a bishop
   * @internal
   */
  static getBishopMoves(
    board: BoardType,
    position: [number, number],
    colour: "white" | "black",
  ): Move[] {
    return MoveGenerator.getDiagonalMoves(board, position, colour);
  }

  /**
   * Returns all possible moves for a rook
   * @internal
   */
  static getRookMoves(
    board: BoardType,
    position: [number, number],
    colour: "white" | "black",
  ): Move[] {
    return MoveGenerator.getOrthogonalMoves(board, position, colour);
  }

  /**
   * Returns all possible moves for a queen
   * @internal
   */
  static getQueenMoves(
    board: BoardType,
    position: [number, number],
    colour: "white" | "black",
  ): Move[] {
    return [
      ...MoveGenerator.getOrthogonalMoves(board, position, colour),
      ...MoveGenerator.getDiagonalMoves(board, position, colour),
    ];
  }

  /**
   * Returns all possible moves for a king
   * @internal
   */
  static getKingMoves(
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
      const kingInCheck = MoveGenerator.isKingInCheck(board, colour);

      if (!kingInCheck) {
        const castlingRights = board.getCastlingRights(colour) as {
          king: boolean;
          queen: boolean;
        };

        if (castlingRights.king) {
          const kingSide = colour === "white" ? 0 : 7;
          const kingSideEmpty = board.getBoard()[kingSide][5] === null &&
            board.getBoard()[kingSide][6] === null;

          if (kingSideEmpty) {
            const newBoard = MoveGenerator.makeMove(
              board,
              {
                from: position,
                to: [kingSide, 5],
              },
            );

            if (!MoveGenerator.isKingInCheck(newBoard, colour)) {
              const finalBoard = MoveGenerator.makeMove(newBoard, {
                from: [kingSide, 5],
                to: [kingSide, 6],
              });

              if (!MoveGenerator.isKingInCheck(finalBoard, colour)) {
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
            const newBoard = MoveGenerator.makeMove(
              board,
              {
                from: position,
                to: [queenSide, 3],
              },
            );

            if (!MoveGenerator.isKingInCheck(newBoard, colour)) {
              const finalBoard = MoveGenerator.makeMove(newBoard, {
                from: [queenSide, 3],
                to: [queenSide, 2],
              });

              if (!MoveGenerator.isKingInCheck(finalBoard, colour)) {
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
  static getOrthogonalMoves(
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
  static getDiagonalMoves(
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
}
