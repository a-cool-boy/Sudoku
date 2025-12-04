import React from 'react';
import { CellData } from '../types';

interface CellProps {
  data: CellData;
  isSelected: boolean;
  isRelated: boolean; // Same row, col, or box
  isSameValue: boolean; // Highlights other cells with the same number
  onClick: (row: number, col: number) => void;
}

export const Cell: React.FC<CellProps> = ({
  data,
  isSelected,
  isRelated,
  isSameValue,
  onClick,
}) => {
  const { row, col, value, isInitial, isError } = data;

  // Determine border classes for the grid visualization
  // We want:
  // - No border on the very right edge (col 8) -> handled by container
  // - Thick border (2px) on box boundaries (col 2, 5)
  // - Standard border (1px) otherwise
  // - All borders are slate-400 as requested for higher visibility
  let borderRight = 'border-r border-slate-400';
  if ((col + 1) % 3 === 0) borderRight = 'border-r-2 border-slate-400';
  if (col === 8) borderRight = '';

  let borderBottom = 'border-b border-slate-400';
  if ((row + 1) % 3 === 0) borderBottom = 'border-b-2 border-slate-400';
  if (row === 8) borderBottom = '';
  
  // Base classes
  // Added aspect-square to ensure perfect square shape
  const baseClasses = `
    relative flex items-center justify-center text-xl sm:text-2xl font-medium cursor-pointer select-none transition-colors duration-75
    w-full aspect-square
    ${borderRight}
    ${borderBottom}
  `;

  // Dynamic Background Logic
  let bgClass = 'bg-white';
  let textClass = 'text-slate-800';

  if (isError) {
    bgClass = 'bg-red-100';
    textClass = 'text-red-600';
  } else if (isSelected) {
    bgClass = 'bg-indigo-500';
    textClass = 'text-white';
  } else if (isSameValue && value !== 0) {
    bgClass = 'bg-indigo-200';
    textClass = 'text-indigo-900';
  } else if (isRelated) {
    bgClass = 'bg-indigo-50';
  } else if (isInitial) {
    bgClass = 'bg-slate-100';
  }

  // Initial numbers are bolder and darker (unless selected)
  if (isInitial && !isSelected && !isError) {
    textClass = 'text-slate-900 font-bold';
  } else if (!isInitial && !isSelected && !isError) {
     textClass = 'text-indigo-600';
  }

  return (
    <div
      className={`${baseClasses} ${bgClass} ${textClass}`}
      onClick={() => onClick(row, col)}
      role="button"
      aria-label={`Row ${row + 1}, Column ${col + 1}, Value ${value || 'Empty'}`}
    >
      {value !== 0 ? value : ''}
    </div>
  );
};