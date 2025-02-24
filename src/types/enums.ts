/** @format */

export enum Piece {
	Bishop = 'B',
	King = 'K',
	Knight = 'N',
	Pawn = 'P',
	Queen = 'Q',
	Rook = 'R',
}

export const pieceMap: { [key: string]: Piece } = {
	'b': Piece.Bishop,
	'k': Piece.King,
	'n': Piece.Knight,
	'p': Piece.Pawn,
	'q': Piece.Queen,
	'r': Piece.Rook,
	'B': Piece.Bishop,
	'K': Piece.King,
	'N': Piece.Knight,
	'P': Piece.Pawn,
	'Q': Piece.Queen,
	'R': Piece.Rook,
};

export enum Colour {
	White = 'w',
	Black = 'b',
}

export enum BoardSide {
	Queen = 'q',
	King = 'k',
}