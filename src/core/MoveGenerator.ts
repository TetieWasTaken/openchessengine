import type { BoardType } from "../types/BoardType";

type Move = {
  from: [number, number];
  to: [number, number];
};

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
    const moves: Move[] = [];
    const direction = colour === "white" ? -1 : 1;

    // Move forward one square
    if (board[position[0] + direction][position[1]] === null) {
      moves.push({
        from: position,
        to: [position[0] + direction, position[1]],
      });
    }

    // Move forward two squares
    if (
      position[0] === (colour === "white" ? 6 : 1) &&
      board[position[0] + 2 * direction][position[1]] === null
    ) {
      moves.push({
        from: position,
        to: [position[0] + 2 * direction, position[1]],
      });
    }

    // Capture diagonally to the left
    if (board[position[0] + direction][position[1] - 1]?.colour !== colour) {
      moves.push({
        from: position,
        to: [position[0] + direction, position[1] - 1],
      });
    }

    // Capture diagonally to the right
    if (board[position[0] + direction][position[1] + 1]?.colour !== colour) {
      moves.push({
        from: position,
        to: [position[0] + direction, position[1] + 1],
      });
    }

    return moves;
  }
}
