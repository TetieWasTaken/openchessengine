/** @format */

export type PieceType = {
	colour: 'black' | 'white';
	type: 'B' | 'K' | 'N' | 'P' | 'Q' | 'R';
};
export type SquareType = PieceType | null;
export type BoardType = SquareType[][];

export type Move = {
	castle?: 'K' | 'Q';
	from: [number, number];
	isDoublePawnMove?: boolean;
	isEnPassantCapture?: boolean;
	promotion?: 'B' | 'N' | 'Q' | 'R';
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
