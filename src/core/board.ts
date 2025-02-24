/** @format */

import type { Bitboards, BoardData, CastlingRights } from '../types/core';
import { Piece, Colour, pieceMap, BoardSide } from '../types/enums';
import { DEFAULT_FEN } from '../utils/constants';

/**
 * Represents a chess board
 */
export class Board {
	private castlingRights: CastlingRights = {
		[Colour.White]: {
			[BoardSide.King]: true,
			[BoardSide.Queen]: true,
		},
		[Colour.Black]: {
			[BoardSide.King]: true,
			[BoardSide.Queen]: true,
		},
	};

	private enPassantSquare: [number, number] | null = null;

	private activeColour: Colour = Colour.White;

	private halfmove = 0;

	private fullmove = 1;

	private bitboards: Bitboards = {
		[Colour.White]: {
			[Piece.Pawn]: 0n,
			[Piece.Rook]: 0n,
			[Piece.Knight]: 0n,
			[Piece.Bishop]: 0n,
			[Piece.Queen]: 0n,
			[Piece.King]: 0n,
		},
		[Colour.Black]: {
			[Piece.Pawn]: 0n,
			[Piece.Rook]: 0n,
			[Piece.Knight]: 0n,
			[Piece.Bishop]: 0n,
			[Piece.Queen]: 0n,
			[Piece.King]: 0n,
		},
	};

	public constructor(data?: BoardData | string) {
		if (data === undefined || typeof data === 'string') {
			this.fromFEN(data as string | undefined);
		} else {
			this.bitboards = data.board;
			this.activeColour = data.activeColour;
			this.castlingRights = data.castlingRights;
			this.enPassantSquare = data.enPassant;
			this.halfmove = data.halfmove;
			this.fullmove = data.fullmove;
		}
	}

	public fenToBitboards(placement: string): Bitboards {
		const bitboards: Bitboards = this.bitboards;

		const ranks = placement.split('/');
		for (let rank = 0; rank < 8; rank++) {
			let file = 0;
			for (const char of ranks[rank]) {
				if (Number.isNaN(Number.parseInt(char, 10))) {
					const colour = char === char.toUpperCase() ? Colour.White : Colour.Black;
					const piece = pieceMap[char.toLowerCase()];
					const bitboard = 1n << (BigInt(rank * 8) + BigInt(file));

					bitboards[colour][piece] |= bitboard;

					file++;
				} else {
					file += Number.parseInt(char, 10);
				}
			}
		}

		return bitboards;
	}

	/**
	 * Create a board from a FEN string.
	 *
	 * @param fen - The FEN string
	 */
	public fromFEN(fen: string | undefined): this {
		let fenString = fen;
		if (fenString === undefined || fenString.trim() === '') {
			fenString = DEFAULT_FEN;
		}

		const [board, activeColour, castling, enPassant, halfmove, fullmove] = fenString.split(' ');
		this.bitboards = this.fenToBitboards(board);
		this.activeColour = activeColour === 'w' ? Colour.White : Colour.Black;
		this.castlingRights = this.parseCastlingRights(castling);
		this.enPassantSquare = this.parseEnPassantSquare(enPassant);
		this.halfmove = Number.parseInt(halfmove, 10);
		this.fullmove = Number.parseInt(fullmove, 10);
		return this;
	}

	/**
	 * Getter for the castling rights.
	 *
	 * @param side -
	 * @returns
	 */
	public getCastlingRights(): CastlingRights {
		return this.castlingRights;
	}

	/**
	 * Get the halfmove clock.
	 */
	public getHalfmove(): number {
		return this.halfmove;
	}

	/**
	 * Get the fullmove number.
	 */
	public getFullmove(): number {
		return this.fullmove;
	}

	/**
	 * Get the active colour.
	 */
	public getActiveColour(): Colour {
		return this.activeColour;
	}

	/**
	 * Clone the board.
	 */
	public clone(): Board {
		const clonedBitboards: Bitboards = {
			[Colour.White]: {
				[Piece.Pawn]: this.bitboards[Colour.White][Piece.Pawn],
				[Piece.Rook]: this.bitboards[Colour.White][Piece.Rook],
				[Piece.Knight]: this.bitboards[Colour.White][Piece.Knight],
				[Piece.Bishop]: this.bitboards[Colour.White][Piece.Bishop],
				[Piece.Queen]: this.bitboards[Colour.White][Piece.Queen],
				[Piece.King]: this.bitboards[Colour.White][Piece.King],
			},
			[Colour.Black]: {
				[Piece.Pawn]: this.bitboards[Colour.Black][Piece.Pawn],
				[Piece.Rook]: this.bitboards[Colour.Black][Piece.Rook],
				[Piece.Knight]: this.bitboards[Colour.Black][Piece.Knight],
				[Piece.Bishop]: this.bitboards[Colour.Black][Piece.Bishop],
				[Piece.Queen]: this.bitboards[Colour.Black][Piece.Queen],
				[Piece.King]: this.bitboards[Colour.Black][Piece.King],
			},
		};

		return new Board({
			board: clonedBitboards,
			activeColour: this.activeColour,
			castlingRights: {
				[Colour.White]: { ...this.castlingRights[Colour.White] },
				[Colour.Black]: {
					...this.castlingRights[Colour.Black],
				},
			},
			enPassant: this.enPassantSquare,
			halfmove: this.halfmove,
			fullmove: this.fullmove,
		});
	}

	/**
	 * Set the active colour.
	 *
	 * @param colour -
	 * @param mutate - Whether to mutate the board or return a new one
	 */
	public setActiveColour(colour: Colour, mutate = true): this {
		if (mutate) {
			this.activeColour = colour;
			return this;
		}

		const newBoard = this.clone();
		newBoard.setActiveColour(colour, true);

		// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
		return newBoard as this;
	}

	public removeCastlingRights(side: Colour, type?: BoardSide): this {
		if (type === undefined) {
			this.castlingRights[side][BoardSide.King] = false;
			this.castlingRights[side][BoardSide.Queen] = false;
		} else {
			this.castlingRights[side][type] = false;
		}

		return this;
	}

	/**
	 * Convert the board to a string.
	 */
	public toString(): string {
		let boardStr = '\n';

		for (let y = 0; y < 8; y++) {
			boardStr += `${8 - y} `;
			for (let x = 0; x < 8; x++) {
				const piece = this.getPieceAt(x, y);
				if (piece === null) {
					boardStr += '.';
				} else {
					const [type, colour] = piece;
					boardStr += colour === Colour.White ? type.toUpperCase() : type.toLowerCase();
				}

				boardStr += ' ';
			}

			boardStr += '\n';
		}

		boardStr += '  a b c d e f g h\n';
		return boardStr;
	}

	/**
	 * Parse castling rights from a FEN string.
	 *
	 * @param castling - The FEN string
	 * @internal
	 */
	private parseCastlingRights(castling = ''): CastlingRights {
		return {
			[Colour.White]: {
				[BoardSide.King]: castling.includes('K'),
				[BoardSide.Queen]: castling.includes('Q'),
			},
			[Colour.Black]: {
				[BoardSide.King]: castling.includes('k'),
				[BoardSide.Queen]: castling.includes('q'),
			},
		};
	}

	/**
	 * Get the en passant square.
	 */
	public getEnPassantSquare(): [number, number] | null {
		return this.enPassantSquare;
	}

	/**
	 * Parse the en passant square from a FEN string.
	 *
	 * @param data -
	 */
	private parseEnPassantSquare(data = ''): [number, number] | null {
		if (data === '-') {
			return null;
		}

		const file = data.charAt(0);
		const rank = data.charAt(1);

		const fileCode = file.codePointAt(0);
		if (fileCode === undefined) {
			throw new Error('Invalid FEN string');
		}

		const x = fileCode - 97;
		const y = 8 - Number.parseInt(rank, 10);

		return [x, y];
	}

	/**
	 * Check if a position is within the bounds of the board.
	 *
	 * @param x - The x coordinate of the position
	 * @param y - The y coordinate of the position
	 * @example
	 * ```
	 * isWithinBounds(6, 3); // true
	 * isWithinBounds(5, 8); // false
	 * ```
	 * @returns Whether the position is within the bounds of the board
	 */
	public isWithinBounds(x: number, y: number): boolean {
		return x >= 0 && x < 8 && y >= 0 && y < 8;
	}

	public getBitboards(): Bitboards {
		return this.bitboards;
	}

	public getPieceAt(x: number, y: number): [Piece, Colour] | null {
		const bitboards = this.bitboards;
		const square = 1n << BigInt(y * 8 + x);

		for (const colour of Object.keys(bitboards) as Colour[]) {
			for (const piece of Object.keys(bitboards[colour]) as Piece[]) {
				if ((bitboards[colour][piece] & square) === square) {
					return [piece, colour];
				}
			}
		}

		return null;
	}

	public removePieceAt(x: number, y: number, piece?: Piece, colour?: Colour): this {
		const bitboards = this.bitboards;
		const square = 1n << BigInt(y * 8 + x);

		if (colour !== undefined && piece !== undefined) bitboards[colour][piece] &= ~square;
		else if (colour !== undefined) {
			for (const pieceType of Object.keys(bitboards[colour]) as Piece[]) {
				if (piece === undefined || piece === pieceType) {
					bitboards[colour][pieceType] &= ~square;
				}
			}
		} else {
			for (const col of Object.keys(bitboards) as Colour[]) {
				for (const pieceType of Object.keys(bitboards[col]) as Piece[]) {
					if ((piece === undefined || piece === pieceType) && (colour === undefined || colour === col)) {
						bitboards[col][pieceType] &= ~square;
					}
				}
			}
		}

		return this;
	}

	public addPieceAt(x: number, y: number, piece: Piece, colour: Colour): this {
		const bitboards = this.bitboards;
		const square = 1n << BigInt(y * 8 + x);

		bitboards[colour][piece] |= square;

		return this;
	}

	public setEnPassantSquare(square: [number, number] | null): this {
		this.enPassantSquare = square;
		return this;
	}

	public setCastlingRights(rights: CastlingRights): this {
		this.castlingRights = rights;
		return this;
	}

	public setHalfmove(halfmove: number): this {
		this.halfmove = halfmove;
		return this;
	}

	public setFullmove(fullmove: number): this {
		this.fullmove = fullmove;
		return this;
	}
}
