import { Board } from "../../../src/core/Board";
import { MoveGenerator } from "../../../src/core/MoveGenerator";

describe("Move Generator | Pawn", () => {
  test("White pawn at [1, 1] with blocking piece", () => {
    const board = new Board("8/8/8/8/8/1p6/1P6/8 w - - 0 1");
    const moves = MoveGenerator.getMoves(board, [1, 1]);

    expect(moves).toEqual([]);
  });

  test("Black pawn at [6, 0] with capture", () => {
    const board = new Board("8/p7/1P6/8/8/8/8/8 b - - 0 1");
    const moves = MoveGenerator.getMoves(board, [6, 0]);

    expect(moves.map((m) => m.to)).toEqual([
      [5, 0],
      [4, 0],
      [5, 1],
    ]);
  });

  test("White pawn at [1, 0]", () => {
    const board = new Board("8/8/8/8/8/8/P7/8 w - - 0 1");
    const moves = MoveGenerator.getMoves(board, [1, 0]);

    expect(moves.map((m) => m.to)).toEqual([
      [2, 0],
      [3, 0],
    ]);
  });

  test("Black pawn at [6, 0] with blocking piece", () => {
    const board = new Board("8/p7/P7/8/8/8/8/8 b - - 0 1");
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

  test("En passant square", () => {
    const board = new Board(
      "K7/7p/8/8/8/8/P7/7k w - - 0 1",
    );

    expect(board.getEnPassantSquare()).toBeNull();
    const moves = MoveGenerator.getMoves(board, [6, 7]);
    expect(moves.map((m) => m.to)).toContainEqual([4, 7]);
    expect(moves.find((m) => m.to[0] === 4 && m.to[1] === 7)?.isDoublePawnMove)
      .toBe(true);

    const blackBoard = MoveGenerator.makeMove(board, {
      from: [6, 7],
      to: [4, 7],
      isDoublePawnMove: true,
    });

    expect(blackBoard.getEnPassantSquare()).toEqual([5, 7]);

    const whiteBoard = MoveGenerator.makeMove(blackBoard, {
      from: [1, 0],
      to: [3, 0],
      isDoublePawnMove: true,
    });

    expect(whiteBoard.getEnPassantSquare()).toEqual([2, 0]);
  });

  test("En passant capture", () => {
    const board = new Board(
      "7k/p7/8/1P6/1p6/8/P7/7K w - - 0 1",
    );

    const newBoard = MoveGenerator.makeMove(board, {
      from: [1, 0],
      to: [3, 0],
      isDoublePawnMove: true,
    });

    const afterEnPassant = MoveGenerator.makeMove(newBoard, {
      from: [3, 1],
      to: [2, 0],
      isEnPassantCapture: true,
    });

    expect(afterEnPassant.getPiece([2, 0])).toEqual({
      type: "P",
      colour: "black",
    });
    expect(afterEnPassant.getPiece([3, 0])).toBeNull();

    const otherSide = MoveGenerator.makeMove(afterEnPassant, {
      from: [6, 0],
      to: [4, 0],
      isDoublePawnMove: true,
    });

    const afterOtherSide = MoveGenerator.makeMove(otherSide, {
      from: [4, 1],
      to: [5, 0],
      isEnPassantCapture: true,
    });

    expect(afterOtherSide.getPiece([5, 0])).toEqual({
      type: "P",
      colour: "white",
    });

    expect(afterOtherSide.getPiece([4, 0])).toBeNull();
  });
});
