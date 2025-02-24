/** @format */

import type { BoardSide, Colour, Piece } from './enums';

export type Move = {
	castle?: BoardSide;
	from: [number, number];
	isCapture?: boolean;
	isDoublePawnMove?: boolean;
	isEnPassantCapture?: boolean;
	piece: {
		colour: Colour;
		type: Piece;
	};
	promotion?: Piece;
	to: [number, number];
};

export type CastlingRights = {
	[colour in Colour]: {
		[side in BoardSide]: boolean;
	};
};

export type BoardData = {
	activeColour: Colour;
	board: Bitboards;
	castlingRights: CastlingRights;
	enPassant: [number, number] | null;
	fullmove: number;
	halfmove: number;
};

export type Bitboard = bigint;

export type Bitboards = {
	[colour in Colour]: {
		[piece in Piece]: Bitboard;
	};
};
