// see https://www.chessprogramming.org/Perft_Results

import MoveGenerator from "../../src/core/MoveGenerator";
import Board from "../../src/core/Board";

const position =
  "r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1";

describe("Perft", () => {
  // Position 4 from https://www.chessprogramming.org/Perft_Results#Position_4
  test("Depth 1", () => {
    const board = new Board(
      position,
    );
    expect(MoveGenerator._perft(board.getBoard(), 1)).toBe(6);
  });

  /* test("Depth 2", () => {
    const board = new Board(
      position,
    );
    expect(MoveGenerator._perft(board.getBoard(), 2)).toBe(264);
  });

  test("Depth 3", () => {
    const board = new Board(
      position,
    );
    expect(MoveGenerator._perft(board.getBoard(), 3)).toBe(9467);
  });

  test("Depth 4", () => {
    const board = new Board(
      position,
    );
    expect(MoveGenerator._perft(board.getBoard(), 4)).toBe(422333);
  });

  test("Depth 5", () => {
    const board = new Board(
      position,
    );
    expect(MoveGenerator._perft(board.getBoard(), 5)).toBe(15833292);
  });

  test("Depth 6", () => {
    const board = new Board(
      position,
    );
    expect(MoveGenerator._perft(board.getBoard(), 6)).toBe(706045033);
  }); */
});
