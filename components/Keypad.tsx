import React from 'react';

interface KeypadProps {
  onNumberClick: (num: number) => void;
  onDelete: () => void;
  disabled?: boolean;
  counts: Record<number, number>;
}

export const Keypad: React.FC<KeypadProps> = ({ onNumberClick, onDelete, disabled, counts }) => {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <div className="w-full max-w-md mt-6">
      <div className="grid grid-cols-5 gap-2 sm:gap-4">
        {numbers.map((num) => {
          const count = counts[num] || 0;
          return (
            <button
              key={num}
              onClick={() => onNumberClick(num)}
              disabled={disabled}
              className="relative aspect-square flex items-center justify-center text-xl sm:text-2xl font-bold rounded-lg bg-white shadow-sm border border-slate-200 text-indigo-600 hover:bg-indigo-50 active:bg-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {num}
              {count > 0 && (
                <span className="absolute top-0.5 right-1 sm:top-1 sm:right-1.5 text-[10px] sm:text-xs font-medium text-slate-400">
                  {count}
                </span>
              )}
            </button>
          );
        })}
        <button
          onClick={onDelete}
          disabled={disabled}
          className="aspect-square flex items-center justify-center text-lg sm:text-xl font-semibold rounded-lg bg-slate-100 shadow-sm border border-slate-200 text-slate-600 hover:bg-slate-200 active:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          aria-label="Delete"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9.75L14.25 12m0 0l2.25 2.25M14.25 12l2.25-2.25M14.25 12l-2.25 2.25m-2.25-2.25l-2.25 2.25m0 0L7.5 12m2.25 2.25L7.5 9.75M7.5 9.75l2.25 2.25m2.535 4.926l6-11.523a.75.75 0 011.33.696l-6 11.523a.75.75 0 01-1.33-.696z" />
          </svg>
        </button>
      </div>
    </div>
  );
};