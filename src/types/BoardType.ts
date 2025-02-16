export type PieceType = {
  type: "P" | "N" | "B" | "R" | "Q" | "K";
  color: "white" | "black";
};
export type SquareType = PieceType | null;
export type BoardType = SquareType[][];
