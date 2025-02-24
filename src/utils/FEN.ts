/** @format */

import type { Board } from '../core/board';
import type { CastlingRights } from '../types/core';
import type { Piece } from '../types/enums';
import { BoardSide, Colour } from '../types/enums';

type FENOptions = {
	activeColour: string;
	castling: CastlingRights;
	enPassant: string;
	fullmove: number;
	halfmove: number;
};

/**
 * Converts a Board to a FEN string.
 *
 * @param board -
 */
export function toFEN(board: Board): string {
	const fenParts = [
		_toBoardString(board),
		board.getActiveColour(),
		_toCastlingString(board.getCastlingRights()) === '' ? '-' : _toCastlingString(board.getCastlingRights()),
		board.getEnPassantSquare() ? board.getEnPassantSquare() : '-',
		board.getHalfmove().toString(),
		board.getFullmove().toString(),
	];

	return fenParts.join(' ');
}

function _toBoardString(board: Board): string {
	const bitboards = board.getBitboards();
	let fen = '';

	for (let row = 7; row >= 0; row--) {
		let empty = 0;

		for (let col = 0; col < 8; col++) {
			const piece = board.getPieceAt(row, col);

			if (piece) {
				if (empty > 0) {
					fen += String(empty);
					empty = 0;
				}

				fen += pieceToFen(piece);
			} else {
				empty++;
			}
		}

		if (empty > 0) {
			fen += String(empty);
		}

		if (row > 0) {
			fen += '/';
		}
	}

	return fen;
}

function _toCastlingString(castling: FENOptions['castling']): string {
	let castlingString = '';

	if (castling[Colour.White][BoardSide.Queen]) castlingString += 'Q';
	if (castling[Colour.White][BoardSide.King]) castlingString += 'K';
	if (castling[Colour.Black][BoardSide.Queen]) castlingString += 'q';
	if (castling[Colour.Black][BoardSide.King]) castlingString += 'k';

	return castlingString;
}

/**
 * Converts a piece to its FEN representation.
 *
 * @param piece -
 */
function pieceToFen(piece: [Piece, Colour]): string {
	const [type, colour] = piece;

	if (colour === Colour.Black) {
		return type.toLowerCase();
	}

	return type;
}

type FENParts = {
	activeColour: string;
	board: string;
	castling: string;
	enPassant: string;
	fullmove: string;
	halfmove: string;
};

/**
 * Parses a FEN string into its parts.
 *
 * @param fen -
 */
export function parseFEN(fen: string): FENParts {
	const parts = fen.split(' ');
	return {
		board: parts[0],
		activeColour: parts[1],
		castling: parts[2],
		enPassant: parts[3],
		halfmove: parts[4],
		fullmove: parts[5],
	};
}
