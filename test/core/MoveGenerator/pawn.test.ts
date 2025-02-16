import { Board } from "../../../src/core/Board";
import MoveGenerator from "../../../src/core/MoveGenerator";

describe("Move Generator | Pawn", () => {
  test("White pawn at [1, 1] with blocking piece", () => {
    const board = new Board("8/8/8/8/8/1p6/1P6/8").getBoard();
    const moves = MoveGenerator.getMoves(board, [1, 1]);

    expect(moves).toEqual([]);
  });

  test("Black pawn at [6, 0] with capture", () => {
    const board = new Board("8/p7/1P6/8/8/8/8/8").getBoard();
    const moves = MoveGenerator.getMoves(board, [6, 0]);

    expect(moves.map((m) => m.to)).toEqual([
      [5, 0],
      [4, 0],
      [5, 1],
    ]);
  });

  test("White pawn at [1, 0]", () => {
    const board = new Board("8/8/8/8/8/8/P7/8").getBoard();
    const moves = MoveGenerator.getMoves(board, [1, 0]);

    expect(moves.map((m) => m.to)).toEqual([
      [2, 0],
      [3, 0],
    ]);
  });

  test("Black pawn at [6, 0] with blocking piece", () => {
    const board = new Board("8/p7/P7/8/8/8/8/8").getBoard();
    const moves = MoveGenerator.getMoves(board, [6, 0]);

    expect(moves).toEqual([]);
  });
});
