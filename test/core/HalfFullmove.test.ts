/** @format */

import { Board } from '../../src/core/board';
import { makeMove } from '../../src/core/moveGenerator';
import { Colour, Piece } from '../../src/types/enums';

describe('Half/Full moves', () => {
	it('Should set half & full moves with custom FEN', () => {
		const board = new Board('5k2/8/8/8/3PK3/8/8/8 w - - 3 9');

		expect(board.getHalfmove()).toBe(3);
		expect(board.getFullmove()).toBe(9);
	});

	it('Should increment halfmove on knight move', () => {
		const board = new Board();
		const newBoard = makeMove(board, { from: [1, 0], to: [2, 2], piece: { type: Piece.Knight, colour: Colour.White } });

		expect(newBoard.getHalfmove()).toBe(1);
	});

	it('Should reset halfmove on pawn move', () => {
		const board = new Board('5k2/8/8/8/3PK3/8/8/8 w - - 3 9');
		const newBoard = makeMove(board, { from: [3, 4], to: [3, 3], piece: { type: Piece.Pawn, colour: Colour.White } });

		expect(newBoard.getHalfmove()).toBe(0);
	});

	it('Should increment fullmove on black move', () => {
		const board = new Board();
		const move = makeMove(board, { from: [0, 6], to: [0, 5], piece: { type: Piece.Pawn, colour: Colour.White } });
		const newBoard = makeMove(move, { from: [0, 1], to: [0, 2], piece: { type: Piece.Pawn, colour: Colour.Black } });

		expect(newBoard.getFullmove()).toBe(2);
	});
});
