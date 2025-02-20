import { minimax } from "../../src/bot/minimax";
import { Board } from "../../src/core/board";

// See https://lichess.org/editor/ for position setup

describe("Minimax", () => {
  test("Checkmate in 1", () => {
    const board = new Board("kr6/pp6/8/3N4/8/8/8/4K3 w - - 0 1");
    const move = minimax(board, 3);
    expect(move.score).toBe(Infinity);
  });

  test("Four pieces", () => {
    const board = new Board("k7/3n4/8/1q1R1p2/3b4/8/8/7K w - - 0 1");
    const move = minimax(board, 3);
    expect(move.score).toBeCloseTo(-2.26, 2);
  });
});
