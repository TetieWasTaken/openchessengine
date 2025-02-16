import { Board } from "../../src/core/Board";

describe("Chess Board", () => {
  test("Rook at [0, 0]", () => {
    const board = new Board();
    expect(board.getPiece([0, 0])?.type).toBe("R");
  });

  test("Empty square", () => {
    const board = new Board();
    expect(board.getPiece([4, 4])).toBeNull();
  });

  test("White piece", () => {
    const board = new Board();
    expect(board.getPiece([1, 0])?.colour).toBe("white");
  });

  test("Black piece", () => {
    const board = new Board();
    expect(board.getPiece([6, 0])?.colour).toBe("black");
  });
});
