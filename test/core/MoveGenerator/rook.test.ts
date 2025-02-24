/** @format */

import { Board } from '../../../src/core/board';
import { getMoves } from '../../../src/core/moveGenerator';

describe('Move Generator | Rook', () => {
	test('Regular rook', () => {
		const board = new Board('8/8/8/8/4R3/8/8/8 w - - 0 1');
		const moves = getMoves(board, [4, 4]);

		const expectedMoves = [
			[4, 0],
			[0, 4],
			[7, 4],
			[4, 7],
		];

		expect(moves.map((move) => move.to)).toEqual(expect.arrayContaining(expectedMoves));
	});

	test('Rook with capture', () => {
		const board = new Board('8/4p3/8/8/4R3/8/8/8 w - - 0 1');
		const moves = getMoves(board, [4, 4]);

		expect(moves.map((move) => move.to)).toContainEqual([4, 1]);
		expect(moves.map((move) => move.to)).not.toContainEqual([4, 0]);
	});

	test('Rook with blocking piece', () => {
		const board = new Board('8/4P3/8/8/4R3/8/8/8 w - - 0 1');
		const moves = getMoves(board, [4, 4]);

		expect(moves.map((move) => move.to)).not.toContainEqual([4, 1]);
		expect(moves.map((move) => move.to)).not.toContainEqual([4, 0]);
	});
});
