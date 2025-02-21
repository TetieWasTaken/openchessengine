/** @format */

import type { Colour, Piece } from './enums';

export type Move = {
	castle?: 'K' | 'Q';
	from: [number, number];
	isDoublePawnMove?: boolean;
	isEnPassantCapture?: boolean;
	promotion?: Piece;
	to: [number, number];
};

export type SingleCastlingRights = {
	king: boolean;
	queen: boolean;
};

export type CastlingRights = {
	black: SingleCastlingRights;
	white: SingleCastlingRights;
};

export type BoardData = {
	activeColour: 'black' | 'white';
	board: BitBoards;
	castlingRights: CastlingRights;
	enPassant: [number, number] | null;
	fullmove: number;
	halfmove: number;
};

export type Bitboard = bigint;

export type BitBoards = {
	[colour in Colour]: {
		[piece in Piece]: Bitboard;
	};
};
