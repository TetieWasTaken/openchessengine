import { Board } from "../../src/core/Board";
import { MoveGenerator } from "../../src/core/MoveGenerator";

describe("Move Generator", () => {
  test("White pawn at [1, 0] with blocking piece", () => {
    const board = new Board().getBoard();
    board[2][0] = { type: "P", colour: "black" };
    const moves = MoveGenerator.getMoves(board, [1, 0]);

    expect(moves).toEqual([]);
  });

  test("Black pawn at [6, 0] with capture", () => {
    const board = new Board().getBoard();
    board[5][1] = { type: "P", colour: "white" };
    const moves = MoveGenerator.getMoves(board, [6, 0]);

    expect(moves.map((m) => m.to)).toEqual([
      [5, 0],
      [4, 0],
      [5, 1],
    ]);
  });

  test("White pawn at [1, 0]", () => {
    const board = new Board().getBoard();
    const moves = MoveGenerator.getMoves(board, [1, 0]);

    expect(moves.map((m) => m.to)).toEqual([
      [2, 0],
      [3, 0],
    ]);
  });

  test("Black pawn at [6, 0] with blocking piece", () => {
    const board = new Board().getBoard();
    board[5][0] = { type: "P", colour: "white" };
    const moves = MoveGenerator.getMoves(board, [6, 0]);

    expect(moves).toEqual([]);
  });
});
