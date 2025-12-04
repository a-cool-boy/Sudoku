import React from 'react';
import { Difficulty } from '../types';

interface ControlsProps {
  difficulty: Difficulty;
  onDifficultyChange: (diff: Difficulty) => void;
  onNewGame: () => void;
  mistakes: number;
}

export const Controls: React.FC<ControlsProps> = ({
  difficulty,
  onDifficultyChange,
  onNewGame,
  mistakes
}) => {
  return (
    <div className="flex flex-col sm:flex-row w-full max-w-md justify-between items-center mb-6 gap-4">
      <div className="flex items-center gap-4">
        <div className="flex flex-col">
            <label className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Difficulty</label>
            <select
            value={difficulty}
            onChange={(e) => onDifficultyChange(e.target.value as Difficulty)}
            className="bg-white border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-32 p-2.5 shadow-sm font-medium"
            >
            {Object.values(Difficulty).map((d) => (
                <option key={d} value={d}>
                {d}
                </option>
            ))}
            </select>
        </div>
        
        <div className="flex flex-col">
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Mistakes</span>
            <span className={`font-mono text-lg font-bold ${mistakes > 2 ? 'text-red-500' : 'text-slate-700'}`}>
                {mistakes}/3
            </span>
        </div>
      </div>

      <button
        onClick={onNewGame}
        className="text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-none shadow-md transition-all active:scale-95 w-full sm:w-auto"
      >
        New Game
      </button>
    </div>
  );
};