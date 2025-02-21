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
	board: BitBoards;
	castlingRights: CastlingRights;
	enPassant: [number, number] | null;
	fullmove: number;
	halfmove: number;
};

export type Bitboard = bigint;
export interface BitBoards {
	whitePawns: Bitboard;
	whiteKnights: Bitboard;
	whiteBishops: Bitboard;
	whiteRooks: Bitboard;
	whiteQueens: Bitboard;
	whiteKing: Bitboard;
	blackPawns: Bitboard;
	blackKnights: Bitboard;
	blackBishops: Bitboard;
	blackRooks: Bitboard;
	blackQueens: Bitboard;
	blackKing: Bitboard;
}