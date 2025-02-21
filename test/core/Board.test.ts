/** @format */

import { Board } from '../../src/core/board';
import { Colour, Piece } from '../../src/types/enums';

describe('Board generator', () => {
	test('Rook at [0, 0]', () => {
		const board = new Board();
		expect(board.getPieceAt(0, 0)?.[0]).toBe(Piece.Rook);
	});

	test('Empty square', () => {
		const board = new Board();
		expect(board.getPieceAt(4, 4)).toBeNull();
	});

	test('White piece', () => {
		const board = new Board();
		expect(board.getPieceAt(0, 0)?.[1]).toBe(Colour.White);
	});

	test('Black piece', () => {
		const board = new Board();
		expect(board.getPieceAt(7, 0)?.[1]).toBe(Colour.Black);
	});

	test('Custom FEN', () => {
		const board = new Board('8/8/8/8/3k4/8/8/8 w - - 0 1');
		expect(board.getPieceAt(3, 3)?.[0]).toBe(Piece.King);
	});

	test('No en passant square', () => {
		const board = new Board();
		expect(board.getEnPassantSquare()).toBeNull();
	});

	test('Custom en passant square', () => {
		const board = new Board('rnbqkbnr/pppp1ppp/8/8/3pP3/2P5/PP3PPP/RNBQKBNR b KQkq e3 0 1');
		expect(board.getEnPassantSquare()).toEqual([2, 4]);
	});
});
