import { BoardData, CellData, Difficulty, DIFFICULTY_REMOVAL_COUNTS } from '../types';

// Constants
const BLANK = 0;
const SIZE = 9;
const BOX_SIZE = 3;

// Helper to check if placing a number is safe according to Sudoku rules
// (Row, Col, and 3x3 Box constraints)
const isSafe = (board: number[][], row: number, col: number, num: number): boolean => {
  // Check row
  for (let x = 0; x < SIZE; x++) {
    if (board[row][x] === num) return false;
  }

  // Check col
  for (let x = 0; x < SIZE; x++) {
    if (board[x][col] === num) return false;
  }

  // Check 3x3 box
  const startRow = row - (row % BOX_SIZE);
  const startCol = col - (col % BOX_SIZE);
  for (let i = 0; i < BOX_SIZE; i++) {
    for (let j = 0; j < BOX_SIZE; j++) {
      if (board[i + startRow][j + startCol] === num) return false;
    }
  }

  return true;
};

// Backtracking solver
const solveBoard = (board: number[][]): boolean => {
  for (let row = 0; row < SIZE; row++) {
    for (let col = 0; col < SIZE; col++) {
      if (board[row][col] === BLANK) {
        // Try numbers 1-9
        // Shuffle them to ensure randomness in generation if we used this for generating from scratch
        // But for solving, order doesn't strictly matter for correctness.
        for (let num = 1; num <= SIZE; num++) {
          if (isSafe(board, row, col, num)) {
            board[row][col] = num;
            if (solveBoard(board)) return true;
            board[row][col] = BLANK;
          }
        }
        return false;
      }
    }
  }
  return true;
};

// Fill the 3 diagonal boxes (independent of each other) to seed the board
const fillDiagonal = (board: number[][]) => {
  for (let i = 0; i < SIZE; i = i + BOX_SIZE) {
    fillBox(board, i, i);
  }
};

const fillBox = (board: number[][], row: number, col: number) => {
  let num: number;
  for (let i = 0; i < BOX_SIZE; i++) {
    for (let j = 0; j < BOX_SIZE; j++) {
      do {
        num = Math.floor(Math.random() * SIZE) + 1;
      } while (!isSafeBox(board, row, col, num));
      board[row + i][col + j] = num;
    }
  }
};

const isSafeBox = (board: number[][], rowStart: number, colStart: number, num: number) => {
  for (let i = 0; i < BOX_SIZE; i++) {
    for (let j = 0; j < BOX_SIZE; j++) {
      if (board[rowStart + i][colStart + j] === num) return false;
    }
  }
  return true;
};

// Generate a new game
export const generateGame = (difficulty: Difficulty): { initialBoard: BoardData; solvedBoard: number[][] } => {
  // 1. Create empty board
  const board: number[][] = Array.from({ length: SIZE }, () => Array(SIZE).fill(BLANK));

  // 2. Fill diagonals
  fillDiagonal(board);

  // 3. Solve the rest to get a complete valid Sudoku
  solveBoard(board);

  // 4. Copy the solved board for solution checking
  const solvedBoard = board.map((row) => [...row]);

  // 5. Remove digits based on difficulty
  const attempts = DIFFICULTY_REMOVAL_COUNTS[difficulty];
  let count = attempts;
  
  while (count > 0) {
    let row = Math.floor(Math.random() * SIZE);
    let col = Math.floor(Math.random() * SIZE);
    
    while (board[row][col] === BLANK) {
        row = Math.floor(Math.random() * SIZE);
        col = Math.floor(Math.random() * SIZE);
    }
    
    // In a rigorous generator, we would check if removing this leads to a unique solution.
    // For a lightweight web app, simple removal is acceptable and standard.
    board[row][col] = BLANK;
    count--;
  }

  // 6. Convert to CellData structure
  const initialBoard: BoardData = board.map((row, rIndex) =>
    row.map((val, cIndex) => ({
      row: rIndex,
      col: cIndex,
      value: val,
      isInitial: val !== BLANK,
      isError: false,
      notes: [],
    }))
  );

  return { initialBoard, solvedBoard };
};