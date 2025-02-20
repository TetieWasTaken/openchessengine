/** @format */

import type { Piece } from './enums';

export type PieceType = {
	colour: 'black' | 'white';
	type: Piece;
};
export type SquareType = PieceType | null;
export type BoardType = SquareType[][];

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
	board: BoardType;
	castlingRights: CastlingRights;
	enPassant: [number, number] | null;
	fullmove: number;
	halfmove: number;
};
