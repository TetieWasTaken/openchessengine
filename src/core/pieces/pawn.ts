import type { Move } from "../../types/core";
import type { Board } from "../board";

/**
 * Returns all {@link https://www.chessprogramming.org/Move_Generation#Pseudo-legal | pseudo-legal} moves for a pawn.
 *
 * @param board - The board to get the moves from
 * @param position - The position of the pawn
 * @param colour - The colour of the pawn
 * @example
 * ```
 * getPawnMoves(board, [1, 0]);
 * ```
 * @returns An array of pseudo-legal moves
 */
export function getPawnMoves(
  board: Board,
  position: [number, number],
  colour = board.getActiveColour(),
): Move[] {
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

  if (
    enPassantSquare &&
    enPassantSquare[0] === position[0] + direction &&
    (enPassantSquare[1] === position[1] - 1 ||
      enPassantSquare[1] === position[1] + 1)
  ) {
    moves.push({
      from: position,
      to: [enPassantSquare[0], enPassantSquare[1]],
      isEnPassantCapture: true,
    });
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
