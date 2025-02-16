export type PieceType = {
  type: "P" | "N" | "B" | "R" | "Q" | "K";
  colour: "white" | "black";
};
export type SquareType = PieceType | null;
export type BoardType = SquareType[][];
