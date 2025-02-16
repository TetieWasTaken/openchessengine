import type { BoardType, Move } from "../types/Core";

export class MoveGenerator {
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

  static getBishopMoves(
    board: BoardType,
    position: [number, number],
    colour: "white" | "black",
  ): Move[] {
    return MoveGenerator.getDiagonalMoves(board, position, colour);
  }

  static getRookMoves(
    board: BoardType,
    position: [number, number],
    colour: "white" | "black",
  ): Move[] {
    return MoveGenerator.getOrthogonalMoves(board, position, colour);
  }

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
