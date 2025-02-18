export interface PieceType {
  type: "P" | "N" | "B" | "R" | "Q" | "K";
  colour: "white" | "black";
}
export type SquareType = PieceType | null;
export type BoardType = SquareType[][];

export interface Move {
  from: [number, number];
  to: [number, number];
  promotion?: "Q" | "R" | "B" | "N";
  isDoublePawnMove?: boolean;
  castle?: "K" | "Q";
  isEnPassantCapture?: boolean;
}

export interface SingleCastlingRights {
  king: boolean;
  queen: boolean;
}

export interface CastlingRights {
  white: SingleCastlingRights;
  black: SingleCastlingRights;
}

export interface BoardData {
  board: BoardType;
  activeColour: "white" | "black";
  castlingRights: CastlingRights;
  enPassant: [number, number] | null;
  halfmove: number;
  fullmove: number;
}
