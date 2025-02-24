/** @format */

import { Board } from '../../../src/core/board';
import { getMoves } from '../../../src/core/moveGenerator';

describe('Move Generator | Knight', () => {
	test('White knight', () => {
		const board = new Board('8/8/2N5/8/8/8/8/8 w - - 0 1');
		const moves = getMoves(board, [2, 2]);

		const expectedMoves = [
			[0, 1],
			[0, 3],
			[1, 0],
			[1, 4],
			[3, 0],
			[3, 4],
			[4, 1],
			[4, 3],
		];

		expect(moves.map((move) => move.to)).toEqual(expect.arrayContaining(expectedMoves));
	});

	test('Knight with capture', () => {
		const board = new Board('1p6/8/2N5/8/8/8/8/8 w - - 0 1');
		const moves = getMoves(board, [2, 2]);

		expect(moves.map((move) => move.to)).toContainEqual([0, 1]);
	});

	test('Knight with blocking piece', () => {
		const board = new Board('1P6/8/2N5/8/8/8/8/8 w - - 0 1');
		const moves = getMoves(board, [2, 2]);

		expect(moves.map((move) => move.to)).not.toContainEqual([0, 1]);
	});
});
