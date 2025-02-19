// see https://www.chessprogramming.org/Perft_Results

import { Board } from "../../src/core/Board";
import { _perft } from "../../src/core/MoveGenerator";

describe("Perft p4", () => {
  // Position 4 from https://www.chessprogramming.org/Perft_Results#Position_4
  const position =
    "r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1";

  test("Depth 1", () => {
    const board = new Board(
      position,
    );

    const perft = _perft(board, 1);
    expect(perft).toBe(6);
  });

  test("Depth 2", () => {
    const board = new Board(
      position,
    );

    const perft = _perft(board, 2);
    expect(perft).toBe(264);
  });

  test("Depth 3", () => {
    const board = new Board(
      position,
    );

    const perft = _perft(board, 3);
    expect(perft).toBe(9_467);
  });

  /*
  test("Depth 4", () => {
    const board = new Board(
      position,
    );

    const perft = _perft(board, 4);
    expect(perft).toBe(422333);
  });

  test("Depth 5", () => {
    const board = new Board(
      position,
    );

    const perft = _perft(board, 5);
    expect(perft).toBe(15833292);
  });
  */
});

describe("Perft p5", () => {
  // Position 5 from https://www.chessprogramming.org/Perft_Results#Position_5
  const position = "rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8";

  test("Depth 1", () => {
    const board = new Board(
      position,
    );

    const perft = _perft(board, 1);
    expect(perft).toBe(44);
  });

  test("Depth 2", () => {
    const board = new Board(
      position,
    );

    const perft = _perft(board, 2);
    expect(perft).toBe(1_486);
  });

  test("Depth 3", () => {
    const board = new Board(
      position,
    );

    const perft = _perft(board, 3);
    expect(perft).toBe(62_379);
  });

  /* test("Depth 4", () => {
    const board = new Board(
      position,
    );

    const perft = _perft(board, 4);
    expect(perft).toBe(2103487);
  });

  test("Depth 5", () => {
    const board = new Board(
      position,
    );

    const perft = _perft(board, 5);
    expect(perft).toBe(89941194);
  }); */
});
