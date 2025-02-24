/** @format */

import { Board } from '../../../src/core/board';
import { getMoves, makeMove } from '../../../src/core/moveGenerator';
import { Colour, Piece } from '../../../src/types/enums';

describe('Move Generator | King', () => {
	test('White king', () => {
		const board = new Board('8/8/8/8/8/8/1K6/8 w - - 0 1');
		const moves = getMoves(board, [1, 6]);

		const expectedMoves = [
			[0, 5],
			[0, 6],
			[0, 7],
			[1, 5],
			[1, 7],
			[2, 5],
			[2, 6],
			[2, 7],
		];

		expect(moves.map((move) => move.to)).toEqual(expect.arrayContaining(expectedMoves));
	});

	test('King with capture', () => {
		const board = new Board('8/8/8/8/8/1p6/1K6/8 w - - 0 1');
		const moves = getMoves(board, [1, 6]);

		expect(moves.map((move) => move.to)).toContainEqual([1, 5]);
	});

	test('King with blocking piece', () => {
		const board = new Board('8/8/8/8/8/1P6/1K6/8 w - - 0 1');
		const moves = getMoves(board, [1, 6]);

		expect(moves.map((move) => move.to)).not.toContainEqual([1, 5]);
	});

	test('King with castling', () => {
		const board = new Board('4k3/8/8/8/8/8/8/R3K2R w KQha - 0 1');
		const moves = getMoves(board, [4, 7]);

		expect(moves.map((move) => move.to)).toContainEqual([6, 7]);
		expect(moves.map((move) => move.to)).toContainEqual([2, 7]);
	});

	test('King with castling and blocking piece', () => {
		const board = new Board('4k3/8/8/8/8/8/8/R2QK2R w KQ - 0 1');
		const moves = getMoves(board, [4, 7]);

		expect(moves.map((move) => move.to)).toContainEqual([6, 7]);
		expect(moves.map((move) => move.to)).not.toContainEqual([2, 7]);
	});

	test('King with castling and check', () => {
		const board = new Board('4k3/8/8/8/2b5/8/8/R3K2R w KQ - 0 1');
		const moves = getMoves(board, [4, 7]);

		expect(moves.map((move) => move.to)).not.toContainEqual([6, 7]);
		expect(moves.map((move) => move.to)).toContainEqual([2, 7]);
	});

	test('Castling flags', () => {
		const board = new Board('r3k2r/8/8/8/8/8/8/R3K2R w Qk - 0 1');
		const whiteMoves = getMoves(board, [4, 7]);
		const blackMoves = getMoves(board.setActiveColour(Colour.Black), [4, 0]);

		expect(whiteMoves.map((move) => move.to)).not.toContainEqual([6, 7]);
		expect(whiteMoves.map((move) => move.to)).toContainEqual([2, 7]);
		expect(blackMoves.map((move) => move.to)).toContainEqual([6, 0]);
		expect(blackMoves.map((move) => move.to)).not.toContainEqual([2, 0]);
	});

	test('Castling after rook taken', () => {
		const board = new Board('r3k2r/8/8/8/8/6n1/8/R3K2R b KQkq - 0 1');
		const newBoard = makeMove(board, {
			from: [6, 5],
			to: [7, 7],
			piece: { type: Piece.Knight, colour: Colour.Black },
			isCapture: true,
		});

		const moves = getMoves(newBoard, [4, 7]);
		expect(moves.map((move) => move.to)).not.toContainEqual([6, 7]);
	});
});
