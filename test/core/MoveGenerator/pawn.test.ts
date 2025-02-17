import Board from "../../../src/core/Board";
import MoveGenerator from "../../../src/core/MoveGenerator";

describe("Move Generator | Pawn", () => {
  test("White pawn at [1, 1] with blocking piece", () => {
    const board = new Board("8/8/8/8/8/1p6/1P6/8");
    const moves = MoveGenerator.getMoves(board, [1, 1]);

    expect(moves).toEqual([]);
  });

  test("Black pawn at [6, 0] with capture", () => {
    const board = new Board("8/p7/1P6/8/8/8/8/8");
    const moves = MoveGenerator.getMoves(board, [6, 0]);

    expect(moves.map((m) => m.to)).toEqual([
      [5, 0],
      [4, 0],
      [5, 1],
    ]);
  });

  test("White pawn at [1, 0]", () => {
    const board = new Board("8/8/8/8/8/8/P7/8");
    const moves = MoveGenerator.getMoves(board, [1, 0]);

    expect(moves.map((m) => m.to)).toEqual([
      [2, 0],
      [3, 0],
    ]);
  });

  test("Black pawn at [6, 0] with blocking piece", () => {
    const board = new Board("8/p7/P7/8/8/8/8/8");
    const moves = MoveGenerator.getMoves(board, [6, 0]);

    expect(moves).toEqual([]);
  });

  test("Promotion", () => {
    const board = new Board("k7/4P3/8/8/8/8/8/7K w - - 0 1");
    const moves = MoveGenerator.getMoves(board, [6, 4]);

    expect(moves.map((m) => m.promotion)).toEqual(["Q", "R", "B", "N"]);
  });

  test("Rook promotion", () => {
    const board = new Board("k7/4P3/8/8/8/8/8/7K w - - 0 1");
    const newBoard = MoveGenerator.makeMove(board, {
      from: [6, 4],
      to: [7, 4],
      promotion: "R",
    });

    expect(newBoard.getPiece([7, 4])).toEqual({ type: "R", colour: "white" });
  });

  test("En passant", () => {
    const board = new Board(
      "rnbqkbnr/pppp1ppp/8/8/3pP3/2P5/PP3PPP/RNBQKBNR b KQkq e3 0 1",
    );
    const moves = MoveGenerator.getMoves(board, [3, 3]);

    expect(moves.map((m) => m.to)).toContainEqual([2, 4]);
  });
});
