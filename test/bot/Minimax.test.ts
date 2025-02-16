import Minimax from "../../src/bot/Minimax";
import Board from "../../src/core/Board";

// See https://lichess.org/editor/ for position setup

describe("Minimax", () => {
  test("Checkmate in 1", () => {
    const board = new Board("kr6/pp6/8/3N4/8/8/8/4K3");
    const move = Minimax(board.getBoard(), 3, true);
    expect(move).toBeGreaterThan(1000);
  });

  test("Four pieces", () => {
    const board = new Board("k7/3n4/8/1q1R1p2/3b4/8/8/7K");
    const move = Minimax(board.getBoard(), 1, true);
    expect(move).toBe(-2);
  });
});
