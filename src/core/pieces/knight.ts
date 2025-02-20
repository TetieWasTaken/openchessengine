import type { Move } from "../../types/core";
import type { Board } from "../board";

/**
 * Returns all possible moves for a knight.
 *
 * @internal
 */
export function getKnightMoves(
  board: Board,
  position: [number, number],
  colour = board.getActiveColour(),
): Move[] {
  const boardData = board.getBoard();
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
      const piece = boardData[x + dx][y + dy];

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
