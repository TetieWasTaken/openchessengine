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
    expect(MoveGenerator._perft(board, 1)).toBe(6);
  });

  test("Depth 2", () => {
    const board = new Board(
      position,
    );
    expect(MoveGenerator._perft(board, 2)).toBe(264);
  });

  test("Depth 3", () => {
    const board = new Board(
      position,
    );
    expect(MoveGenerator._perft(board, 3)).toBe(9467);
  });

  test("d3 c4c5", () => {
    const board = new Board(
      "r3k2r/Pppp1ppp/1b3nbN/nPP5/BB2P3/q4N2/Pp1P2PP/R2Q1RK1 b kq - 0 1",
    );

    expect(MoveGenerator._perft(board, 2)).toBe(1409);
  });

  test("d3 c4c5", () => {
    const board = new Board(
      "r3k2r/Pppp1ppp/1b3nbN/nPP5/BB2P3/q4N2/Pp1P2PP/R2Q1RK1 b kq - 0 1",
    );

    expect(MoveGenerator._perft(board, 2)).toBe(1409);
  });

  test("d3 d2d4", () => {
    const board = new Board(
      "r3k2r/Pppp1ppp/1b3nbN/nP6/BBPPP3/q4N2/Pp4PP/R2Q1RK1 b kq - 0 1",
    );

    expect(MoveGenerator._perft(board, 2)).toBe(1643);
  });

  test("d3 f3d4", () => {
    const board = new Board(
      "r3k2r/Pppp1ppp/1b3nbN/nP6/BBPNP3/q7/Pp1P2PP/R2Q1RK1 b kq - 0 1",
    );

    expect(MoveGenerator._perft(board, 2)).toBe(1687);
  });

  test("d3 b4c5", () => {
    const board = new Board(
      "r3k2r/Pppp1ppp/1b3nbN/nPB5/B1P1P3/q4N2/Pp1P2PP/R2Q1RK1 b kq - 0 1",
    );

    expect(MoveGenerator._perft(board, 2)).toBe(1352);
  });

  test("d3 f1f2", () => {
    const board = new Board(
      "r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P1RPP/R2Q2K1 b kq - 0 1",
    );

    expect(MoveGenerator._perft(board, 2)).toBe(1623);
  });

  test("d3 g1h1", () => {
    const board = new Board(
      "r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1R1K b kq - 0 1",
    );

    expect(MoveGenerator._perft(board, 2)).toBe(1753);
  });

  /* test("Depth 4", () => {
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
