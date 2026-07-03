/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Dices } from 'lucide-react';

interface DiceCupProps {
  dice1: number;
  dice2: number;
  isRolling: boolean;
  onRoll: () => void;
  disabled: boolean;
  currentPlayerName: string;
  currentPlayerColor: string;
}

export const DiceCup: React.FC<DiceCupProps> = ({
  dice1,
  dice2,
  isRolling,
  onRoll,
  disabled,
  currentPlayerName,
  currentPlayerColor,
}) => {
  // Render dice dots based on number
  const renderDots = (value: number) => {
    const dotPositions: { [key: number]: string[] } = {
      1: ['col-start-2 row-start-2 bg-red-500 w-3 h-3'],
      2: ['col-start-1 row-start-1', 'col-start-3 row-start-3'],
      3: ['col-start-1 row-start-1', 'col-start-2 row-start-2', 'col-start-3 row-start-3'],
      4: ['col-start-1 row-start-1', 'col-start-1 row-start-3', 'col-start-3 row-start-1', 'col-start-3 row-start-3'],
      5: ['col-start-1 row-start-1', 'col-start-1 row-start-3', 'col-start-2 row-start-2', 'col-start-3 row-start-1', 'col-start-3 row-start-3'],
      6: ['col-start-1 row-start-1', 'col-start-1 row-start-2', 'col-start-1 row-start-3', 'col-start-3 row-start-1', 'col-start-3 row-start-2', 'col-start-3 row-start-3'],
    };

    const isOne = value === 1;

    return (
      <div className="grid grid-cols-3 grid-rows-3 gap-1 w-full h-full p-2.5 items-center justify-items-center">
        {dotPositions[value]?.map((posClass, idx) => (
          <div
            key={idx}
            className={`rounded-full ${isOne ? posClass : 'bg-slate-900 w-2 h-2'} shadow-inner`}
          />
        ))}
      </div>
    );
  };

  const shakeAnimation = {
    roll: {
      x: [0, -10, 10, -12, 12, -8, 8, -4, 4, 0],
      y: [0, 8, -12, 10, -8, 12, -10, 4, -4, 0],
      rotate: [0, -45, 45, -30, 30, -15, 15, -5, 5, 0],
      transition: { duration: 0.6, ease: 'easeInOut' },
    },
    idle: { x: 0, y: 0, rotate: 0 },
  };

  return (
    <div className="flex flex-col items-center justify-center p-5 bg-white text-[#2D3436] border-4 border-black shadow-[6px_6px_0_0_#2D3436] rounded-none w-full max-w-sm mx-auto">
      {/* Turn indicator */}
      <div className="flex items-center gap-2 mb-4 bg-[#FFFBEB] px-4 py-1.5 rounded-none border-2 border-black shadow-[2px_2px_0_0_#2D3436]">
        <div className={`w-3.5 h-3.5 rounded-full border border-black ${currentPlayerColor} animate-pulse`} />
        <span className="text-xs font-black text-[#2D3436]">
          <span className="text-[#FF6B6B] font-black uppercase">{currentPlayerName}</span>의 차례 🎬
        </span>
      </div>

      {/* Dice display board */}
      <div className="flex gap-6 justify-center items-center h-24 mb-4">
        {/* Die 1 */}
        <motion.div
          animate={isRolling ? 'roll' : 'idle'}
          variants={shakeAnimation}
          className="w-16 h-16 bg-white rounded-none shadow-[4px_4px_0_0_#2D3436] flex items-center justify-center border-4 border-black relative"
          style={{ transformOrigin: 'center' }}
        >
          {renderDots(dice1)}
        </motion.div>

        {/* Die 2 */}
        <motion.div
          animate={isRolling ? 'roll' : 'idle'}
          variants={shakeAnimation}
          className="w-16 h-16 bg-white rounded-none shadow-[4px_4px_0_0_#2D3436] flex items-center justify-center border-4 border-black relative"
          style={{ transformOrigin: 'center' }}
        >
          {renderDots(dice2)}
        </motion.div>
      </div>

      {/* Action button */}
      <button
        onClick={onRoll}
        disabled={disabled || isRolling}
        className={`
          relative overflow-hidden w-full py-3 px-6 rounded-none font-black text-sm uppercase italic border-4 border-black tracking-wider transition-all duration-150 flex items-center justify-center gap-2 shadow-[4px_4px_0_0_#2D3436] cursor-pointer
          ${
            disabled || isRolling
              ? 'bg-slate-200 text-slate-500 border-2 border-slate-400 shadow-none cursor-not-allowed'
              : 'bg-[#FFD93D] text-[#2D3436] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#2D3436] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none'
          }
        `}
      >
        <Dices className={`w-4 h-4 ${isRolling ? 'animate-spin' : ''}`} />
        {isRolling ? '주사위 흔드는 중...' : '슬레이트 주사위 굴리기'}
      </button>

      {/* Double dice notify */}
      {dice1 === dice2 && !isRolling && dice1 > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-2.5 px-4 py-1.5 bg-[#4ECDC4] border-2 border-black text-[11px] font-black text-[#2D3436] rounded-none shadow-[2px_2px_0_0_#000] animate-bounce"
        >
          🎲 더블! 한 번 더 굴릴 수 있습니다!
        </motion.div>
      )}
    </div>
  );
};
