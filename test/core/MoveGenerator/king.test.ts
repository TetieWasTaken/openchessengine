import Board from "../../../src/core/Board";
import MoveGenerator from "../../../src/core/MoveGenerator";

describe("Move Generator | King", () => {
  test("White king at [1, 1]", () => {
    const board = new Board("8/8/8/8/8/8/1K6/8").getBoard();
    const moves = MoveGenerator.getMoves(board, [1, 1]);

    // Ignore the order of the moves, as it doesn't matter
    const expectedMoves = [
      [0, 0],
      [0, 1],
      [0, 2],
      [1, 0],
      [1, 2],
      [2, 0],
      [2, 1],
      [2, 2],
    ];

    expectedMoves.forEach((move) => {
      expect(moves.map((m) => m.to)).toContainEqual(move);
    });

    expect(moves.length).toBe(expectedMoves.length);
  });

  test("King with capture", () => {
    const board = new Board("8/8/8/8/8/1p6/1K6/8").getBoard();
    const moves = MoveGenerator.getMoves(board, [1, 1]);

    expect(moves.map((m) => m.to)).toContainEqual([2, 1]);
  });

  test("King with blocking piece", () => {
    const board = new Board("8/8/8/8/8/1P6/1K6/8").getBoard();
    const moves = MoveGenerator.getMoves(board, [1, 1]);

    expect(moves.map((m) => m.to)).not.toContainEqual([2, 1]);
  });
});
