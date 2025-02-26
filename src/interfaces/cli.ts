/** @format */

import { search } from '../bot/search';
import { Board } from '../core/board';
import { makeMove } from '../core/moveGenerator';
import type { Move } from '../types/core';
import { toFEN } from '../utils/fen';

/**
 * CLI for interacting with the bot.
 */
class FENCLI {
	public run(): void {
		// parse the FEN, depth, and autoplay from the arguments (-f <FEN> -d <depth> -a)
		const { fen, depth, autoplay } = this.parseArgs();

		let board: Board;
		try {
			board = new Board(fen);
		} catch (error) {
			if (error instanceof Error) {
				console.error(`Invalid FEN: ${error.message}`);
			} else {
				console.error('Invalid FEN: Unknown error');
			}

			process.exit(1);
		}

		if (autoplay) {
			this.autoplay(board, depth);
		} else {
			this.playMove(board, depth);
		}
	}

	private playMove(board: Board, depth: number): void {
		const bestMove = search(board, depth);

		if (!bestMove) {
			console.log('No valid moves available.');
			return;
		}

		makeMove(board, bestMove, true);
		const newFEN = toFEN(board);

		console.log(`Best move: ${this.moveToAlgebraic(bestMove)}`);
		console.log(`New FEN: ${newFEN} (depth ${depth.toString()})`);

		console.log(new Board(newFEN).toString());
	}

	private autoplay(initialBoard: Board, depth: number): void {
		let board = initialBoard;
		let currentDepth = depth;
		while (currentDepth > 0) {
			const bestMove = search(board, currentDepth);

			if (!bestMove) {
				console.log('No valid moves available.');
				break;
			}

			board = makeMove(board, bestMove);
			const newFEN = toFEN(board);

			console.log(`Best move: ${this.moveToAlgebraic(bestMove)}`);
			console.log(`New FEN: ${newFEN} (depth ${currentDepth.toString()})`);
			console.log(board.toString());

			currentDepth--;
		}
	}

	/**
	 * Parse the arguments and return the FEN, depth, and autoplay flag.
	 *
	 * @internal
	 */
	private parseArgs(): { autoplay: boolean; depth: number; fen: string } {
		const args = process.argv.slice(2);
		let fen = '';
		let depth = 4;
		let autoplay = false;

		for (let i = 0; i < args.length; i++) {
			if (['-f', '--fen'].includes(args[i]) && args[i + 1] !== '') {
				fen = args[i + 1];
			} else if (['-d', '--depth'].includes(args[i]) && args[i + 1] !== '') {
				depth = Number.parseInt(args[i + 1], 10);
				if (Number.isNaN(depth) || depth <= 0) {
					console.error('Invalid depth value. It must be a positive integer.');
					process.exit(1);
				}
			} else if (['-a', '--autoplay'].includes(args[i])) {
				autoplay = true;
			}
		}

		if (fen === '') {
			console.error('Usage: -f <FEN> [-d <depth>] [-a]');
			process.exit(1);
		}

		return { fen, depth, autoplay };
	}

	/**
	 * Convert a move to algebraic notation.
	 *
	 * @param move -
	 * @internal
	 */
	private moveToAlgebraic(move: Move): string {
		const fileFrom = String.fromCodePoint(97 + move.from[1]);
		const rankFrom = (move.from[0] + 1).toString();
		const fileTo = String.fromCodePoint(97 + move.to[1]);
		const rankTo = (move.to[0] + 1).toString();

		return `${fileFrom}${rankFrom}${fileTo}${rankTo}`;
	}
}

// run cli
new FENCLI().run();
