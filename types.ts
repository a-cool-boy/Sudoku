export enum Difficulty {
  EASY = 'Easy',
  MEDIUM = 'Medium',
  HARD = 'Hard',
  EXPERT = 'Expert'
}

export interface CellData {
  row: number;
  col: number;
  value: number; // 0 for empty
  isInitial: boolean; // True if part of the initial puzzle
  isError: boolean; // True if user input is incorrect vs solution
  notes: number[]; // For pencil marks (future feature, groundwork laid)
}

export type BoardData = CellData[][];

export const DIFFICULTY_REMOVAL_COUNTS = {
  [Difficulty.EASY]: 30,
  [Difficulty.MEDIUM]: 40,
  [Difficulty.HARD]: 50,
  [Difficulty.EXPERT]: 60,
};