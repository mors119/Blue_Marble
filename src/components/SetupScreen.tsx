/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Film, Users, Coins, ArrowRight, User, Cpu, Sparkles } from 'lucide-react';

interface SetupScreenProps {
  onStartGame: (playersConfig: { name: string; isAI: boolean }[], startingMoney: number) => void;
}

export const SetupScreen: React.FC<SetupScreenProps> = ({ onStartGame }) => {
  const [playerCount, setPlayerCount] = useState<number>(3);
  const [startingMoney, setStartingMoney] = useState<number>(10000000); // 1,000만 원 (default)
  
  // Default cinema-themed names
  const defaultNames = [
    '충무로 필름',
    '골드만 픽처스',
    '인디스크린 필름',
    '할리우드 네트웍스',
  ];

  const [players, setPlayers] = useState([
    { name: '충무로 필름', isAI: false },
    { name: '골드만 픽처스', isAI: true },
    { name: '인디스크린 필름', isAI: true },
    { name: '할리우드 네트웍스', isAI: true },
  ]);

  const handlePlayerCountChange = (count: number) => {
    setPlayerCount(count);
  };

  const handlePlayerNameChange = (index: number, name: string) => {
    setPlayers(prev => prev.map((p, idx) => idx === index ? { ...p, name } : p));
  };

  const handlePlayerTypeToggle = (index: number) => {
    setPlayers(prev => prev.map((p, idx) => idx === index ? { ...p, isAI: !p.isAI } : p));
  };

  const handleStart = () => {
    const config = players.slice(0, playerCount).map((p, idx) => ({
      name: p.name.trim() || `제작사 ${idx + 1}`,
      isAI: p.isAI,
    }));
    onStartGame(config, startingMoney);
  };

  return (
    <div className="max-w-xl w-full bg-white border-4 border-[#2D3436] p-8 shadow-[8px_8px_0_0_#2D3436] space-y-6 mx-auto text-[#2D3436]">
      {/* Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center p-3 bg-[#FF6B6B] border-2 border-black text-white shadow-[3px_3px_0_0_#2D3436] mb-2">
          <Film className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-black tracking-tighter text-[#2D3436] flex justify-center items-center gap-2 uppercase italic">
          영화판 <span className="bg-[#FF6B6B] text-white px-3 py-1 border-2 border-black rotate-[-1deg] shadow-[2px_2px_0_0_#2D3436]">블루마블</span>
        </h1>
        <p className="text-xs font-bold text-slate-600">
          시나리오 기획부터 배급, 마케팅, 프랜차이즈까지! 나만의 시네마 제국을 세워라.
        </p>
      </div>

      <div className="space-y-5">
         {/* Starting Capital Budget */}
        <div className="space-y-2">
          <label className="text-xs font-black text-[#2D3436] tracking-wider uppercase flex items-center gap-1.5">
            <Coins className="w-3.5 h-3.5 text-[#FFD93D]" />
            초기 영화 제작 지원금
          </label>
          <div className="grid grid-cols-3 gap-2.5">
            {[6000000, 10000000, 15000000].map((money) => (
              <button
                key={money}
                type="button"
                onClick={() => setStartingMoney(money)}
                className={`
                  py-2.5 px-3 border-2 border-black text-xs font-black transition-all duration-150 shadow-[2px_2px_0_0_#2D3436]
                  ${
                    startingMoney === money
                      ? 'bg-[#FFD93D] text-[#2D3436] translate-x-[1px] translate-y-[1px] shadow-[1px_1px_0_0_#2D3436]'
                      : 'bg-[#FFFBEB] text-slate-700 hover:bg-amber-50'
                  }
                `}
              >
                {(money / 10000).toLocaleString()}만 원
              </button>
            ))}
          </div>
        </div>

        {/* Player Count */}
        <div className="space-y-2">
          <label className="text-xs font-black text-[#2D3436] tracking-wider uppercase flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-[#FF6B6B]" />
            참가 영화사 수
          </label>
          <div className="grid grid-cols-3 gap-2.5">
            {[2, 3, 4].map((count) => (
              <button
                key={count}
                type="button"
                onClick={() => handlePlayerCountChange(count)}
                className={`
                  py-2.5 px-3 border-2 border-black text-xs font-black transition-all duration-150 shadow-[2px_2px_0_0_#2D3436]
                  ${
                    playerCount === count
                      ? 'bg-[#4ECDC4] text-[#2D3436] translate-x-[1px] translate-y-[1px] shadow-[1px_1px_0_0_#2D3436]'
                      : 'bg-[#FFFBEB] text-slate-700 hover:bg-amber-50'
                  }
                `}
              >
                {count}인 제작 경쟁
              </button>
            ))}
          </div>
        </div>

        {/* Players details */}
        <div className="space-y-3 bg-[#FFFBEB] p-4 border-2 border-black shadow-[3px_3px_0_0_#2D3436]">
          <label className="text-xs font-black text-[#2D3436] tracking-wider uppercase">
            영화사 설정
          </label>
          <div className="space-y-2.5">
            {players.slice(0, playerCount).map((player, index) => {
              const playerColors = [
                'border-l-[#FF6B6B] text-[#FF6B6B]',
                'border-l-[#4ECDC4] text-[#4ECDC4]',
                'border-l-[#FFD93D] text-amber-600',
                'border-l-[#A8E6CF] text-emerald-600',
              ];

              return (
                <div
                  key={index}
                  className={`flex items-center gap-3 bg-white border-2 border-black p-2.5 border-l-8 ${playerColors[index]} shadow-[2px_2px_0_0_#2D3436]`}
                >
                  {/* Name Input */}
                  <div className="flex-1">
                    <input
                      type="text"
                      value={player.name}
                      maxLength={14}
                      placeholder={`제작사 ${index + 1}`}
                      onChange={(e) => handlePlayerNameChange(index, e.target.value)}
                      className="w-full bg-[#FFFBEB] border-2 border-black px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:bg-white font-bold"
                    />
                  </div>

                  {/* AI or Human Toggle */}
                  <button
                    type="button"
                    onClick={() => handlePlayerTypeToggle(index)}
                    className={`
                      flex items-center gap-1 px-2.5 py-1.5 border-2 border-black text-[11px] font-black transition-all duration-150 shadow-[1px_1px_0_0_#2D3436]
                      ${
                        player.isAI
                          ? 'bg-[#FF6B6B] text-white'
                          : 'bg-[#A8E6CF] text-[#2D3436]'
                      }
                    `}
                  >
                    {player.isAI ? (
                      <>
                        <Cpu className="w-3.5 h-3.5" />
                        AI 제작사
                      </>
                    ) : (
                      <>
                        <User className="w-3.5 h-3.5" />
                        감독 (플레이어)
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Start Button */}
      <button
        onClick={handleStart}
        className="w-full py-4 text-white bg-[#FF6B6B] border-4 border-black font-black text-lg tracking-wider uppercase italic shadow-[4px_4px_0_0_#2D3436] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#2D3436] transition-all cursor-pointer flex items-center justify-center gap-2"
      >
        <Sparkles className="w-5 h-5 animate-spin" style={{ animationDuration: '3s' }} />
        스크린 극장 개봉하기 (게임 시작)
        <ArrowRight className="w-4 h-4 ml-1" />
      </button>

      {/* Game outline brief info */}
      <div className="text-center">
        <span className="text-[10px] font-bold text-slate-500">
          제작비 납부, 판권 인수, 시사회 행운, 파산 예방 전략 등을 다루는 고도의 경영 보드게임
        </span>
      </div>
    </div>
  );
};
