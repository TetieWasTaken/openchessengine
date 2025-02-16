import { Board } from "../../../src/core/Board";
import MoveGenerator from "../../../src/core/MoveGenerator";

describe("Move Generator | Knight", () => {
  test("White knight at [1, 1]", () => {
    const board = new Board("8/8/8/8/8/8/1N6/8").getBoard();
    const moves = MoveGenerator.getMoves(board, [1, 1]);

    expect(moves.map((m) => m.to)).toEqual([
      [0, 3],
      [2, 3],
      [3, 0],
      [3, 2],
    ]);
  });

  test("Knight with capture", () => {
    const board = new Board("8/8/8/8/n7/8/1N6/8").getBoard();
    const moves = MoveGenerator.getMoves(board, [1, 1]);

    expect(moves.map((m) => m.to)).toEqual([
      [0, 3],
      [2, 3],
      [3, 0],
      [3, 2],
    ]);
  });

  test("Knight with blocking piece", () => {
    const board = new Board("8/8/8/8/P7/8/1N6/8").getBoard();
    const moves = MoveGenerator.getMoves(board, [1, 1]);

    expect(moves.map((m) => m.to)).toEqual([
      [0, 3],
      [2, 3],
      [3, 2],
    ]);
  });
});
