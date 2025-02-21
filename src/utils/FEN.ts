/** @format */

import type { Board } from '../core/board';
import type { CastlingRights, PieceType, SingleCastlingRights, SquareType } from '../types/core';

type FENOptions = {
	activeColour: string;
	castling: CastlingRights | SingleCastlingRights;
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
		board.getActiveColour() === 'white' ? 'w' : 'b',
		_toCastlingString(board.getCastlingRights()) === '' ? '-' : _toCastlingString(board.getCastlingRights()),
		board.getEnPassantSquare() ? board.getEnPassantSquare() : '-',
		board.getHalfmove().toString(),
		board.getFullmove().toString(),
	];

	return fenParts.join(' ');
}

function _toBoardString(board: Board): string {
	let fen = '';

	for (let i = board.getBoard().length - 1; i >= 0; i--) {
		const row = board.getBoard()[i];
		let empty = 0;

		for (const square of row) {
			if (square === null) {
				empty++;
			} else {
				if (empty !== 0) {
					fen += empty.toString();
					empty = 0;
				}

				fen += pieceToFen(square);
			}
		}

		if (empty !== 0) {
			fen += empty.toString();
		}

		if (i !== 0) {
			fen += '/';
		}
	}

	return fen;
}

function _toCastlingString(castling: FENOptions['castling']): string {
	if ('white' in castling) {
		return `${castling.white.king ? 'K' : ''}${castling.white.queen ? 'Q' : ''
			}${castling.black.king ? 'k' : ''}${castling.black.queen ? 'q' : ''}`;
	}

	return `${castling.king ? 'K' : ''}${castling.queen ? 'Q' : ''}`;
}

/**
 * Converts a piece to its FEN representation.
 *
 * @param piece -
 */
function pieceToFen(piece: PieceType): string {
	/* eslint-disable id-length */
	const map: Record<string, string> = {
		P: 'P',
		N: 'N',
		B: 'B',
		R: 'R',
		Q: 'Q',
		K: 'K',
	};
	/* eslint-enable id-length */

	return piece.colour === 'white' ? map[piece.type] : map[piece.type].toLowerCase();
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
 * Checks if a character is a valid piece type.
 *
 * @param char -
 */
function isPieceType(char: string): char is PieceType['type'] {
	return ['P', 'N', 'B', 'R', 'Q', 'K'].includes(char);
}

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
