import { BoardType } from "../types/BoardType";
import fenToBoard from "../utils/fenToBoard";

export class Board {
  private board: BoardType;

  constructor(fen?: string) {
    this.board = this.createBoard(fen);
  }

  public getPiece([x, y]: [number, number]): BoardType[number][number] | null {
    return this.board[x][y];
  }

  public getBoard(): BoardType {
    return this.board;
  }

  private createBoard(
    fen: string = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR",
  ): BoardType {
    return fenToBoard(fen);
  }
}
