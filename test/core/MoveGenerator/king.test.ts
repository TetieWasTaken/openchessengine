import { Board } from "../../../src/core/Board";
import { MoveGenerator } from "../../../src/core/MoveGenerator";

describe("Move Generator | King", () => {
  test("White king at [1, 1]", () => {
    const board = new Board("8/8/8/8/8/8/1K6/8 w - - 0 1");
    const moves = MoveGenerator.getMoves(board, [1, 1]);

    // Ignore the order of the moves, as it doesn't matter
    const expectedMoves = [
      [0, 0],
      [0, 1],
      [0, 2],
      [1, 0],
      [1, 2],
      [2, 0],
      [2, 1],
      [2, 2],
    ];

    expectedMoves.forEach((move) => {
      expect(moves.map((m) => m.to)).toContainEqual(move);
    });

    expect(moves.length).toBe(expectedMoves.length);
  });

  test("King with capture", () => {
    const board = new Board("8/8/8/8/8/1p6/1K6/8 w - - 0 1");
    const moves = MoveGenerator.getMoves(board, [1, 1]);

    expect(moves.map((m) => m.to)).toContainEqual([2, 1]);
  });

  test("King with blocking piece", () => {
    const board = new Board("8/8/8/8/8/1P6/1K6/8 w - - 0 1");
    const moves = MoveGenerator.getMoves(board, [1, 1]);

    expect(moves.map((m) => m.to)).not.toContainEqual([2, 1]);
  });

  test("King with castling", () => {
    const board = new Board("4k3/8/8/8/8/8/8/R3K2R b KQha - 0 1");
    const moves = MoveGenerator.getMoves(board, [0, 4]);

    expect(moves.map((m) => m.to)).toContainEqual([0, 6]);
    expect(moves.map((m) => m.to)).toContainEqual([0, 2]);
  });

  test("King with castling and blocking piece", () => {
    const board = new Board("4k3/8/8/8/8/8/8/R2QK2R b KQ - 0 1");
    const moves = MoveGenerator.getMoves(board, [0, 4]);

    expect(moves.map((m) => m.to)).toContainEqual([0, 6]);
    expect(moves.map((m) => m.to)).not.toContainEqual([0, 2]);
  });

  test("King with castling and check", () => {
    const board = new Board("4k3/8/8/8/2b5/8/8/R3K2R b KQ - 0 1");
    const moves = MoveGenerator.getMoves(board, [0, 4]);

    expect(moves.map((m) => m.to)).not.toContainEqual([0, 6]);
    expect(moves.map((m) => m.to)).toContainEqual([0, 2]);
  });

  test("Black king with castling", () => {
    const board = new Board("r3k2r/8/8/8/8/8/8/4K3 b kq - 0 1");
    const moves = MoveGenerator.getMoves(board, [7, 4]);

    expect(moves.map((m) => m.to)).toContainEqual([7, 6]);
    expect(moves.map((m) => m.to)).toContainEqual([7, 2]);
  });

  test("Castling flags", () => {
    const board = new Board("r3k2r/8/8/8/8/8/8/R3K2R b Qk - 0 1");
    const blackMoves = MoveGenerator.getMoves(board, [7, 4]);
    const whiteMoves = MoveGenerator.getMoves(board, [0, 4]);

    expect(blackMoves.map((m) => m.to)).toContainEqual([7, 6]);
    expect(blackMoves.map((m) => m.to)).not.toContainEqual([7, 2]);
    expect(whiteMoves.map((m) => m.to)).not.toContainEqual([0, 6]);
    expect(whiteMoves.map((m) => m.to)).toContainEqual([0, 2]);
  });

  test("Castling after rook taken", () => {
    const board = new Board("r3k2r/8/8/8/8/6n1/8/R3K2R b KQkq - 0 1");
    const newBoard = MoveGenerator.makeMove(board, {
      from: [2, 6],
      to: [0, 7],
    });

    const moves = MoveGenerator.getMoves(newBoard, [0, 4]);
    expect(moves.map((m) => m.to)).not.toContainEqual([0, 6]);
  });
});
