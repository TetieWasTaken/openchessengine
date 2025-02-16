import Eval from "../../src/bot/Eval";
import Board from "../../src/core/Board";

describe("Eval", () => {
  test("White pawn", () => {
    const board = new Board("8/8/8/8/8/8/8/P7");
    expect(Eval.evaluate(board.getBoard())).toBe(1);
  });

  test("White bishop", () => {
    const board = new Board("8/8/8/8/8/8/8/B7");
    expect(Eval.evaluate(board.getBoard())).toBe(3);
  });

  test("Black pawn", () => {
    const board = new Board("8/8/8/8/8/8/8/p7");
    expect(Eval.evaluate(board.getBoard())).toBe(-1);
  });

  test("Combination", () => {
    const board = new Board("8/8/8/8/8/8/8/pR6");
    expect(Eval.evaluate(board.getBoard())).toBe(4);
  });

  test("White king", () => {
    const board = new Board("8/8/8/8/8/8/8/K7");
    expect(Eval.evaluate(board.getBoard())).toBe(Infinity);
  });
});
