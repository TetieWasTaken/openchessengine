import { Board } from "../../../src/core/Board";
import { MoveGenerator } from "../../../src/core/MoveGenerator";

describe("Move Generator | Rook", () => {
  test("White rook at [1, 1]", () => {
    const board = new Board("8/8/8/8/8/8/1R6/8").getBoard();
    const moves = MoveGenerator.getMoves(board, [1, 1]);

    // Ignore the order of the moves, as it doesn't matter
    const expectedMoves = [
      [0, 1],
      [2, 1],
      [3, 1],
      [4, 1],
      [5, 1],
      [6, 1],
      [7, 1],
      [1, 0],
      [1, 2],
      [1, 3],
      [1, 4],
      [1, 5],
      [1, 6],
      [1, 7],
    ];

    expectedMoves.forEach((move) => {
      expect(moves.map((m) => m.to)).toContainEqual(move);
    });

    expect(moves.length).toBe(expectedMoves.length);
  });

  test("Rook with capture", () => {
    const board = new Board("8/1r6/8/8/8/8/1R6/8").getBoard();
    const moves = MoveGenerator.getMoves(board, [1, 1]);

    expect(moves.map((m) => m.to)).toContainEqual([6, 1]);
    expect(moves.map((m) => m.to)).not.toContainEqual([7, 1]);
  });

  test("Rook with blocking piece", () => {
    const board = new Board("8/1R6/8/8/8/8/1R6/8").getBoard();
    const moves = MoveGenerator.getMoves(board, [1, 1]);

    expect(moves.map((m) => m.to)).not.toContainEqual([6, 1]);
    expect(moves.map((m) => m.to)).not.toContainEqual([7, 1]);
  });
});
