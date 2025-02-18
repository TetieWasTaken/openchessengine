export type PieceType = {
  type: "P" | "N" | "B" | "R" | "Q" | "K";
  colour: "white" | "black";
};
export type SquareType = PieceType | null;
export type BoardType = SquareType[][];

export type Move = {
  from: [number, number];
  to: [number, number];
  promotion?: "Q" | "R" | "B" | "N";
  isDoublePawnMove?: boolean;
  castle?: "K" | "Q";
  isEnPassantCapture?: boolean;
};

export type SingleCastlingRights = { king: boolean; queen: boolean };

export type CastlingRights = {
  white: SingleCastlingRights;
  black: SingleCastlingRights;
};

export type BoardData = {
  board: BoardType;
  activeColour: "white" | "black";
  castlingRights: CastlingRights;
  enPassant: [number, number] | null;
  halfmove: number;
  fullmove: number;
};
