/** @format */

import { Board } from '../../../src/core/board';
import { getMoves, makeMove } from '../../../src/core/moveGenerator';
import { Colour, Piece } from '../../../src/types/enums';

describe('Move Generator | Pawn', () => {
	test('White pawn at [1, 1] with blocking piece', () => {
		const board = new Board('8/8/8/8/8/1p6/1P6/8 w - - 0 1');
		const moves = getMoves(board, [1, 1]);

		expect(moves).toEqual([]);
	});

	test('Black pawn at [6, 0] with capture', () => {
		const board = new Board('8/p7/1P6/8/8/8/8/8 b - - 0 1');
		const moves = getMoves(board, [6, 0]);

		expect(moves.map((move) => move.to)).toEqual([
			[5, 0],
			[4, 0],
			[5, 1],
		]);
	});

	test('White pawn at [1, 0]', () => {
		const board = new Board('8/8/8/8/8/8/P7/8 w - - 0 1');
		const moves = getMoves(board, [1, 0]);

		expect(moves.map((move) => move.to)).toEqual([
			[2, 0],
			[3, 0],
		]);
	});

	test('Black pawn at [6, 0] with blocking piece', () => {
		const board = new Board('8/p7/P7/8/8/8/8/8 b - - 0 1');
		const moves = getMoves(board, [6, 0]);

		expect(moves).toEqual([]);
	});

	test('Promotion', () => {
		const board = new Board('k7/4P3/8/8/8/8/8/7K w - - 0 1');
		const moves = getMoves(board, [6, 4]);

		expect(moves.map((move) => move.promotion)).toEqual(['Q', 'R', 'B', 'N']);
	});

	test('Rook promotion', () => {
		const board = new Board('k7/4P3/8/8/8/8/8/7K w - - 0 1');
		const newBoard = makeMove(board, {
			from: [4, 1],
			to: [4, 0],
			promotion: Piece.Rook,
			piece: {
				type: Piece.Pawn,
				colour: Colour.White,
			},
		});

		expect(newBoard.getPieceAt(4, 0)?.[0]).toBe(Piece.Rook);
	});

	test('En passant', () => {
		const board = new Board('rnbqkbnr/pppp1ppp/8/8/3pP3/2P5/PP3PPP/RNBQKBNR b KQkq e3 0 1');
		const moves = getMoves(board, [3, 3]);

		expect(moves.map((move) => move.to)).toContainEqual([2, 4]);
	});

	test('En passant square', () => {
		const board = new Board('K7/7p/8/8/8/8/P7/7k b - - 0 1');

		expect(board.getEnPassantSquare()).toBeNull();
		const moves = getMoves(board, [7, 1]);
		expect(moves.map((move) => move.to)).toContainEqual([7, 3]);
		expect(moves.find((move) => move.to[0] === 7 && move.to[1] === 3)?.isDoublePawnMove).toBe(true);

		const blackBoard = makeMove(board, {
			from: [7, 1],
			to: [7, 3],
			isDoublePawnMove: true,
			piece: {
				type: Piece.Pawn,
				colour: Colour.Black,
			}
		});

		expect(blackBoard.getEnPassantSquare()).toEqual([7, 2]);

		const whiteBoard = makeMove(blackBoard, {
			from: [0, 6],
			to: [0, 4],
			isEnPassantCapture: true,
			piece: {
				type: Piece.Pawn,
				colour: Colour.White
			}
		});

		expect(whiteBoard.getEnPassantSquare()).toEqual([0, 5]);
	});

	test('En passant capture', () => {
		const board = new Board('7k/p7/8/1P6/1p6/8/P7/7K w - - 0 1');

		const newBoard = makeMove(board, {
			from: [0, 6],
			to: [0, 4],
			isDoublePawnMove: true,
			piece: {
				type: Piece.Pawn,
				colour: Colour.White,
			},
		});

		const afterEnPassant = makeMove(newBoard, {
			from: [1, 4],
			to: [0, 5],
			isEnPassantCapture: true,
			piece: {
				type: Piece.Pawn,
				colour: Colour.Black,
			},
		});

		expect(afterEnPassant.getPieceAt(0, 5)).toEqual([Piece.Pawn, Colour.Black]);
		expect(afterEnPassant.getPieceAt(1, 4)).toBeNull();

		const otherSide = makeMove(afterEnPassant, {
			from: [0, 1],
			to: [0, 3],
			isDoublePawnMove: true,
			piece: {
				type: Piece.Pawn,
				colour: Colour.Black,
			},
		});

		const afterOtherSide = makeMove(otherSide, {
			from: [1, 3],
			to: [0, 2],
			isEnPassantCapture: true,
			piece: {
				type: Piece.Pawn,
				colour: Colour.White,
			},
		});

		expect(afterOtherSide.getPieceAt(0, 2)).toEqual([Piece.Pawn, Colour.White]);
		expect(afterOtherSide.getPieceAt(1, 3)).toBeNull();
	});
});
