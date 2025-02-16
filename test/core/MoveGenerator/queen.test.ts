import { Board } from "../../../src/core/Board";
import { MoveGenerator } from "../../../src/core/MoveGenerator";

describe("Move Generator | Queen", () => {
  test("White queen at [1, 1]", () => {
    const board = new Board("8/8/8/8/8/8/1Q6/8").getBoard();
    const moves = MoveGenerator.getMoves(board, [1, 1]);

    // Ignore the order of the moves, as it doesn't matter
    const expectedMoves = [
      // orthogonals
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
      // diagonals
      [0, 0],
      [0, 2],
      [2, 0],
      [2, 2],
      [3, 3],
      [4, 4],
      [5, 5],
      [6, 6],
      [7, 7],
    ];

    expectedMoves.forEach((move) => {
      expect(moves.map((m) => m.to)).toContainEqual(move);
    });

    expect(moves.length).toBe(expectedMoves.length);
  });

  test("Queen with capture", () => {
    const board = new Board("8/1q6/8/8/3q4/8/1Q6/8").getBoard();
    const moves = MoveGenerator.getMoves(board, [1, 1]);

    expect(moves.map((m) => m.to)).toContainEqual([6, 1]);
    expect(moves.map((m) => m.to)).not.toContainEqual([7, 1]);
    expect(moves.map((m) => m.to)).toContainEqual([3, 3]);
    expect(moves.map((m) => m.to)).not.toContainEqual([4, 4]);
  });

  test("Queen with blocking piece", () => {
    const board = new Board("8/1Q6/8/8/3Q4/8/1Q6/8").getBoard();
    const moves = MoveGenerator.getMoves(board, [1, 1]);

    expect(moves.map((m) => m.to)).not.toContainEqual([6, 1]);
    expect(moves.map((m) => m.to)).not.toContainEqual([7, 1]);
    expect(moves.map((m) => m.to)).not.toContainEqual([3, 3]);
    expect(moves.map((m) => m.to)).not.toContainEqual([4, 4]);
  });
});
