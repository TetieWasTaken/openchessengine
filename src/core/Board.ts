import { BoardType } from "../types/BoardType";
import fenToBoard from "../utils/fenToBoard";

export class Board {
  private board: BoardType;

  constructor() {
    this.board = this.createBoard();
  }

  private createBoard(): BoardType {
    return fenToBoard("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR");
  }
}
