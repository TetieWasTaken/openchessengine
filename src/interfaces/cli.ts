// src/cli.ts
import Board from "../core/Board";
import Search from "../bot/Search";
import MoveGenerator from "../core/MoveGenerator";
import { parseFEN, toFEN } from "../utils/FEN";
import { Move } from "../types/Core";

class FENCLI {
  private readonly depth: number = 3;

  public run() {
    const fen = this.parseArgs();
    const fenParts = parseFEN(fen);

    let board: Board;
    try {
      board = new Board(fenParts.board);
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Invalid FEN: ${error.message}`);
      } else {
        console.error("Invalid FEN: Unknown error");
      }
      process.exit(1);
    }

    const bestMove = Search(
      board.getBoard(),
      this.depth,
      fenParts.activeColour === "w" ? "white" : "black",
    );

    if (!bestMove) {
      console.log("No legal moves available");
      process.exit(0);
    }

    const newBoard = MoveGenerator.makeMove(board.getBoard(), bestMove);
    const newFEN = toFEN(newBoard, {
      activeColour: fenParts.activeColour === "w" ? "b" : "w",
      // todo: castling, enPassant, halfmove
      castling: fenParts.castling,
      enPassant: fenParts.enPassant,
      halfmove: fenParts.halfmove,
      fullmove: fenParts.activeColour === "w"
        ? fenParts.fullmove
        : String(Number(fenParts.fullmove) + 1),
    });

    console.log(`Best move: ${this.moveToAlgebraic(bestMove)}`);
    console.log(
      `New FEN: ${newFEN} (depth ${this.depth})`,
    );

    console.log(new Board(newFEN).toString());
  }

  private parseArgs(): string {
    const args = process.argv.slice(2);

    for (let i = 0; i < args.length; i++) {
      if (["-f", "--fen"].includes(args[i]) && args[i + 1]) {
        return args[i + 1];
      }
    }

    console.error("Usage: ts-node cli.ts -f <FEN>");
    process.exit(1);
  }

  private moveToAlgebraic(move: Move): string {
    const fileFrom = String.fromCharCode(97 + move.from[1]);
    const rankFrom = move.from[0] + 1;
    const fileTo = String.fromCharCode(97 + move.to[1]);
    const rankTo = move.to[0] + 1;

    return `${fileFrom}${rankFrom}${fileTo}${rankTo}`;
  }
}

// Run the CLI
new FENCLI().run();
