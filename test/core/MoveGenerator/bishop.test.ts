import Board from "../../../src/core/Board";
import MoveGenerator from "../../../src/core/MoveGenerator";

describe("Move Generator | Bishop", () => {
  test("White bishop at [1, 1]", () => {
    const board = new Board("8/8/8/8/8/8/1B6/8 w - - 0 1");
    const moves = MoveGenerator.getMoves(board, [1, 1]);

    expect(moves.map((m) => m.to)).toEqual([
      [0, 0],
      [0, 2],
      [2, 0],
      [2, 2],
      [3, 3],
      [4, 4],
      [5, 5],
      [6, 6],
      [7, 7],
    ]);
  });

  test("Bishop with capture", () => {
    const board = new Board("7b/8/8/8/8/8/1B6/8 w - - 0 1");
    const moves = MoveGenerator.getMoves(board, [1, 1]);

    expect(moves.map((m) => m.to)).toEqual([
      [0, 0],
      [0, 2],
      [2, 0],
      [2, 2],
      [3, 3],
      [4, 4],
      [5, 5],
      [6, 6],
      [7, 7],
    ]);
  });

  test("Bishop with blocking piece", () => {
    const board = new Board("8/8/8/8/8/2b5/1B6/8 w - - 0 1");
    const moves = MoveGenerator.getMoves(board, [1, 1]);

    expect(moves.map((m) => m.to)).toEqual([
      [0, 0],
      [0, 2],
      [2, 0],
      [2, 2],
    ]);
  });
});
