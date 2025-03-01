/** @format */

export enum Piece {
	Bishop = 'B',
	King = 'K',
	Knight = 'N',
	Pawn = 'P',
	Queen = 'Q',
	Rook = 'R',
}

/* eslint-disable id-length */
export const pieceMap: { [key: string]: Piece } = {
	b: Piece.Bishop,
	k: Piece.King,
	n: Piece.Knight,
	p: Piece.Pawn,
	q: Piece.Queen,
	r: Piece.Rook,
	B: Piece.Bishop,
	K: Piece.King,
	N: Piece.Knight,
	P: Piece.Pawn,
	Q: Piece.Queen,
	R: Piece.Rook,
};
/* eslint-enable id-length */

export enum Colour {
	Black = 'b',
	White = 'w',
}

export enum BoardSide {
	King = 'k',
	Queen = 'q',
}
