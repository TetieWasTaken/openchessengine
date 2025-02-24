/** @format */

import { Board } from '../../../src/core/board';
import { getMoves } from '../../../src/core/moveGenerator';

describe('Move Generator | Bishop', () => {
	test('White bishop', () => {
		const board = new Board('8/8/8/8/4B3/8/8/8 w - - 0 1');
		const moves = getMoves(board, [4, 4]);

		const expectedMoves = [
			[0, 0],
			[1, 1],
			[2, 2],
			[3, 3],
			[5, 5],
			[6, 6],
			[7, 7],
			[1, 7],
			[2, 6],
			[3, 5],
			[5, 3],
			[6, 2],
			[7, 1],
		];

		expect(moves.map((move) => move.to)).toEqual(expect.arrayContaining(expectedMoves));
	});

	test('Bishop with capture', () => {
		const board = new Board('8/8/8/8/8/2b5/1B6/8 w - - 0 1');
		const moves = getMoves(board, [1, 6]);

		const expectedMoves = [
			[0, 7],
			[0, 5],
			[2, 7],
			[2, 5],
		];

		expect(moves.map((move) => move.to)).toEqual(expect.arrayContaining(expectedMoves));
	});

	test('Bishop with blocking piece', () => {
		const board = new Board('8/8/8/8/8/2B5/1B6/8 w - - 0 1');
		const moves = getMoves(board, [1, 6]);

		const expectedMoves = [
			[0, 5],
			[0, 7],
			[2, 7],
		];

		expect(moves.map((move) => move.to)).toEqual(expect.arrayContaining(expectedMoves));
	});
});
