import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { BoardData, Difficulty } from './types';
import { generateGame } from './utils/sudoku';
import { Cell } from './components/Cell';
import { Keypad } from './components/Keypad';
import { Controls } from './components/Controls';

const App: React.FC = () => {
  const [board, setBoard] = useState<BoardData>([]);
  const [solvedBoard, setSolvedBoard] = useState<number[][]>([]);
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.EASY);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isWon, setIsWon] = useState(false);

  // Initialize Game
  const startNewGame = useCallback((diff: Difficulty = difficulty) => {
    const { initialBoard, solvedBoard: solution } = generateGame(diff);
    setBoard(initialBoard);
    setSolvedBoard(solution);
    setMistakes(0);
    setIsGameOver(false);
    setIsWon(false);
    setSelectedCell(null);
  }, [difficulty]);

  // Initial load
  useEffect(() => {
    startNewGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Calculate number counts
  const numberCounts = useMemo(() => {
    const counts: Record<number, number> = {};
    for (let i = 1; i <= 9; i++) counts[i] = 0;
    
    board.forEach(row => {
      row.forEach(cell => {
        if (cell.value !== 0) {
          counts[cell.value] = (counts[cell.value] || 0) + 1;
        }
      });
    });
    return counts;
  }, [board]);

  // Handle cell selection
  const handleCellClick = (row: number, col: number) => {
    if (isGameOver || isWon) return;
    setSelectedCell([row, col]);
  };

  // Handle number input
  const handleInput = useCallback((num: number) => {
    if (isGameOver || isWon || !selectedCell) return;

    const [r, c] = selectedCell;
    const currentCell = board[r][c];

    // Cannot edit initial cells
    if (currentCell.isInitial) return;

    // Check if correct
    const isCorrect = num === solvedBoard[r][c];
    const isError = !isCorrect;

    const newBoard = [...board];
    newBoard[r][c] = {
      ...currentCell,
      value: num,
      isError: isError,
    };

    setBoard(newBoard);

    if (isError) {
      setMistakes((prev) => {
        const newMistakes = prev + 1;
        if (newMistakes >= 3) {
          setIsGameOver(true);
        }
        return newMistakes;
      });
    } else {
        // Check for win condition
        // A win is when all cells are filled and no errors (though if we enforce correctness on input, we just check filled)
        const isFilled = newBoard.every(row => row.every(cell => cell.value !== 0));
        if (isFilled) {
            setIsWon(true);
        }
    }
  }, [board, selectedCell, solvedBoard, isGameOver, isWon]);

  // Handle delete
  const handleDelete = useCallback(() => {
    if (isGameOver || isWon || !selectedCell) return;
    const [r, c] = selectedCell;
    if (board[r][c].isInitial) return;

    const newBoard = [...board];
    newBoard[r][c] = {
      ...newBoard[r][c],
      value: 0,
      isError: false,
    };
    setBoard(newBoard);
  }, [board, selectedCell, isGameOver, isWon]);

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isGameOver || isWon) return;

      // Numbers
      if (e.key >= '1' && e.key <= '9') {
        handleInput(parseInt(e.key));
        return;
      }

      // Delete / Backspace
      if (e.key === 'Backspace' || e.key === 'Delete') {
        handleDelete();
        return;
      }

      // Arrows
      if (!selectedCell) return;
      const [r, c] = selectedCell;
      if (e.key === 'ArrowUp') setSelectedCell([Math.max(0, r - 1), c]);
      if (e.key === 'ArrowDown') setSelectedCell([Math.min(8, r + 1), c]);
      if (e.key === 'ArrowLeft') setSelectedCell([r, Math.max(0, c - 1)]);
      if (e.key === 'ArrowRight') setSelectedCell([r, Math.min(8, c + 1)]);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleInput, handleDelete, isGameOver, isWon, selectedCell]);


  // Helper for Cell Rendering Props
  const getCellProps = (rIndex: number, cIndex: number, cell: any) => {
    const isSelected = selectedCell?.[0] === rIndex && selectedCell?.[1] === cIndex;
    
    // Highlight related cells (same row, col, or box)
    let isRelated = false;
    if (selectedCell) {
        const [sRow, sCol] = selectedCell;
        const sameRow = sRow === rIndex;
        const sameCol = sCol === cIndex;
        const sameBox = Math.floor(sRow / 3) === Math.floor(rIndex / 3) && Math.floor(sCol / 3) === Math.floor(cIndex / 3);
        isRelated = sameRow || sameCol || sameBox;
    }

    // Highlight all instances of the same number
    const isSameValue = selectedCell 
        && board[selectedCell[0]][selectedCell[1]].value !== 0 
        && board[selectedCell[0]][selectedCell[1]].value === cell.value;

    return { isSelected, isRelated, isSameValue };
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 font-sans bg-slate-50">
      <header className="mb-6 text-center">
        <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">Sudoku</h1>
        <p className="text-slate-500 mt-1">Relax and solve</p>
      </header>

      <Controls 
        difficulty={difficulty}
        onDifficultyChange={(d) => { setDifficulty(d); startNewGame(d); }}
        onNewGame={() => startNewGame()}
        mistakes={mistakes}
      />

      {/* Game Board Container */}
      <div className="relative p-1 bg-slate-800 rounded-lg shadow-2xl">
        <div className="grid grid-cols-9 w-full max-w-md sm:max-w-lg bg-white border-2 border-slate-800">
            {board.map((row, rIndex) => (
                row.map((cell, cIndex) => (
                    <Cell
                        key={`${rIndex}-${cIndex}`}
                        data={cell}
                        {...getCellProps(rIndex, cIndex, cell)}
                        onClick={handleCellClick}
                    />
                ))
            ))}
        </div>

        {/* Overlay for Game Over / Win */}
        {(isGameOver || isWon) && (
            <div className="absolute inset-0 z-10 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-lg text-white animate-fade-in">
                <h2 className="text-3xl font-bold mb-2">{isWon ? 'Puzzle Solved!' : 'Game Over'}</h2>
                <p className="mb-6 text-slate-300">
                    {isWon ? 'Great job!' : 'Too many mistakes.'}
                </p>
                <button 
                    onClick={() => startNewGame()}
                    className="px-6 py-3 bg-white text-indigo-900 font-bold rounded-full hover:bg-indigo-50 transition-transform active:scale-95 shadow-lg"
                >
                    Play Again
                </button>
            </div>
        )}
      </div>

      <Keypad 
        onNumberClick={handleInput} 
        onDelete={handleDelete}
        disabled={isGameOver || isWon}
        counts={numberCounts}
      />
      
      <footer className="mt-12 text-slate-400 text-sm">
        Use keyboard or tap numbers to play
      </footer>
    </div>
  );
};

export default App;