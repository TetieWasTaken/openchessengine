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
};
