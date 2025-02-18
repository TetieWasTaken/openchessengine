import { evaluate } from "../../src/bot/Eval";
import Board from "../../src/core/Board";

describe("Eval", () => {
  test("White pawn", () => {
    const board = new Board("8/8/8/8/8/8/8/P7 w - - 0 1");
    expect(evaluate(board.getBoard())).toBe(1);
  });

  test("White bishop", () => {
    const board = new Board("8/8/8/8/8/8/8/B7 w - - 0 1");
    expect(evaluate(board.getBoard())).toBe(3);
  });

  test("Black pawn", () => {
    const board = new Board("8/8/8/8/8/8/8/p7 w - - 0 1");
    expect(evaluate(board.getBoard())).toBe(-1);
  });

  test("Combination", () => {
    const board = new Board("8/8/8/8/8/8/8/pR6 w - - 0 1");
    expect(evaluate(board.getBoard())).toBe(4);
  });

  test("White king", () => {
    const board = new Board("8/8/8/8/8/8/8/K7 w - - 0 1");
    expect(evaluate(board.getBoard())).toBe(10000);
  });
});
