import type { BoardType, Move } from "../types/Core";

/**
 * Helper class to generate moves for a given board
 */
export default class MoveGenerator {
  /**
   * Returns all possible moves for a given board and colour
   */
  static getAllMoves(board: BoardType, colour: "white" | "black"): Move[] {
    const moves: Move[] = [];

    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (board[i][j] !== null && board[i][j]?.colour === colour) {
          moves.push(...MoveGenerator.getMoves(board, [i, j]));
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
  static _perft(board: BoardType, depth: number): number {
    if (depth === 0) {
      return 1;
    }

    const moves = MoveGenerator.getAllMoves(board, "white");
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
  static makeMove(board: BoardType, move: Move): BoardType {
    const newBoard = board.map((row) => [...row]);
    const { from, to } = move;

    newBoard[to[0]][to[1]] = newBoard[from[0]][from[1]];
    newBoard[from[0]][from[1]] = null;

    return newBoard;
  }

  /**
   * Returns all possible moves for a piece at a given position
   */
  static getMoves(board: BoardType, position: [number, number]): Move[] {
    const piece = board[position[0]][position[1]];
    if (piece === null) {
      return [];
    }

    switch (piece.type) {
      case "P":
        return MoveGenerator.getPawnMoves(board, position, piece.colour);
      case "N":
        return MoveGenerator.getKnightMoves(board, position, piece.colour);
      case "B":
        return MoveGenerator.getBishopMoves(board, position, piece.colour);
      case "R":
        return MoveGenerator.getRookMoves(board, position, piece.colour);
      case "Q":
        return MoveGenerator.getQueenMoves(board, position, piece.colour);
      case "K":
        return MoveGenerator.getKingMoves(board, position, piece.colour);
    }
  }

  /**
   * Returns all possible moves for a pawn
   * @internal
   */
  static getPawnMoves(
    board: BoardType,
    position: [number, number],
    colour: "white" | "black",
  ): Move[] {
    // todo: add en passant

    const moves: Move[] = [];
    const direction = colour === "white" ? 1 : -1;

    // Move forward one square
    if (board[position[0] + direction][position[1]] === null) {
      moves.push({
        from: position,
        to: [position[0] + direction, position[1]],
      });
    }

    // Move forward two squares
    if (
      position[0] === (colour === "white" ? 1 : 6) &&
      board[position[0] + direction][position[1]] === null &&
      board[position[0] + 2 * direction][position[1]] === null
    ) {
      moves.push({
        from: position,
        to: [position[0] + 2 * direction, position[1]],
      });
    }

    // Capture diagonally to the left
    if (
      position[1] - 1 >= 0 &&
      board[position[0] + direction][position[1] - 1] !== null &&
      board[position[0] + direction][position[1] - 1]?.colour !== colour
    ) {
      moves.push({
        from: position,
        to: [position[0] + direction, position[1] - 1],
      });
    }

    // Capture diagonally to the right
    if (
      position[1] + 1 < 8 &&
      board[position[0] + direction][position[1] + 1] !== null &&
      board[position[0] + direction][position[1] + 1]?.colour !== colour
    ) {
      moves.push({
        from: position,
        to: [position[0] + direction, position[1] + 1],
      });
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
    board: BoardType,
    position: [number, number],
    colour: "white" | "black",
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
