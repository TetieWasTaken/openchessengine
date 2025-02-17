import Search from "../../src/bot/Search";
import Board from "../../src/core/Board";

// See https://lichess.org/editor/ for position setup

describe("Search", () => {
  test("Checkmate in 1", () => {
    const board = new Board("kr6/pp6/8/3N4/8/8/8/4K3 w - - 0 1");
    const move = Search(board, 3);
    expect(move).toEqual({ from: [4, 3], to: [6, 2] });
  });

  test("Four pieces", () => {
    const board = new Board("k7/3n4/8/1q1R1p2/3b4/8/8/7K w - - 0 1");
    const move = Search(board);
    expect(move).toEqual({ from: [4, 3], to: [4, 1] });
  });
});
