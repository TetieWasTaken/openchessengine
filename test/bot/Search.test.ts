/** @format */

import { search } from '../../src/bot/search';
import { Board } from '../../src/core/board';

// See https://lichess.org/editor/ for position setup

describe('Search', () => {
	test('Checkmate in 1', () => {
		const board = new Board('kr6/pp6/8/3N4/8/8/8/4K3 w - - 0 1');
		const move = search(board, 3);
		expect(move).toContain({ from: [3, 3], to: [2, 1] });
	});

	test('Four pieces', () => {
		const board = new Board('k7/3n4/8/1q1R1p2/3b4/8/8/7K w - - 0 1');
		const move = search(board, 3);
		expect(move).toContain({ from: [3, 3], to: [1, 3] });
	});
});
