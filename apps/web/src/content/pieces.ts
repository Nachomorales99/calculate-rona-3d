export type PieceShape = "key" | "round" | "hex" | "box";

export interface Piece {
  name: string;
  material: string;
  shape: PieceShape;
  /** Cloudinary más adelante; hoy siluetas. */
  imageUrl?: string;
}

export const PIECES: readonly Piece[] = [
  { name: "Llavero con nombre", material: "PLA", shape: "key" },
  { name: "Posavasos ficha", material: "PLA Silk", shape: "round" },
  { name: "Organizador hex", material: "PETG", shape: "hex" },
  { name: "Caja con tapa", material: "PLA-CF", shape: "box" },
  { name: "Maceta", material: "PLA", shape: "round" },
  { name: "Soporte de auriculares", material: "PETG", shape: "box" },
];
