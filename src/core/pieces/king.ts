import type { Move, SingleCastlingRights } from "../../types/Core";
import type { Board } from "../Board";
import { isKingInCheck, makeMove } from "../MoveGenerator";

/**
 * Returns all possible moves for a king.
 *
 * @internal
 */
export function getKingMoves(
  board: Board,
  position: [number, number],
  colour: "black" | "white",
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
