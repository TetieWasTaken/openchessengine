/** @format */

import { Board } from '../../../src/core/board';
import { getMoves, makeMove } from '../../../src/core/moveGenerator';
import { Colour, Piece } from '../../../src/types/enums';

describe('Move Generator | Pawn', () => {
	test('Regular pawn', () => {
		const board = new Board('8/8/8/8/8/8/1P6/8 w - - 0 1');
		const moves = getMoves(board, [1, 6]);

		expect(moves.map((move) => move.to)).toEqual([
			[1, 5],
			[1, 4],
		]);
	});

	test('Pawn with blocking piece', () => {
		const board = new Board('8/8/8/8/8/1p6/1P6/8 w - - 0 1');
		const moves = getMoves(board, [1, 6]);

		expect(moves).toEqual([]);
	});

	test('Pawn with capture', () => {
		const board = new Board('8/8/2p5/1P6/8/8/8/8 w - - 0 1');
		const moves = getMoves(board, [1, 3]);

		expect(moves.map((move) => move.to)).toContainEqual([2, 2]);
	});

	test('Promotion', () => {
		const board = new Board('8/1P6/8/8/8/8/8/8 w - - 0 1');
		const moves = getMoves(board, [1, 1]);

		expect(moves.map((move) => move.promotion)).toEqual([Piece.Queen, Piece.Rook, Piece.Bishop, Piece.Knight]);

		const newBoard = makeMove(board, {
			from: [1, 1],
			to: [1, 0],
			promotion: Piece.Knight,
			piece: {
				type: Piece.Pawn,
				colour: Colour.White,
			},
		});

		expect(newBoard.getPieceAt(1, 0)?.[0]).toBe(Piece.Knight);
	});

	test('En passant', () => {
		const board = new Board('8/8/8/1Pp5/8/8/8/8 w - c6 0 1');
		const moves = getMoves(board, [1, 3]);

		expect(moves.map((move) => move.to)).toContainEqual([2, 2]);
	});

	test('En passant square', () => {
		const board = new Board('8/2p5/8/1P6/8/8/8/8 b - - 0 1');

		expect(board.getEnPassantSquare()).toBeNull();

		const newBoard = makeMove(board, {
			from: [2, 1],
			to: [2, 3],
			isDoublePawnMove: true,
			piece: {
				type: Piece.Pawn,
				colour: Colour.Black,
			},
		});

		expect(newBoard.getEnPassantSquare()).toEqual([2, 2]);
	});
});
