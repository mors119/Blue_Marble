/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { GameLog } from '../types';
import { 
  ScrollText, 
  Dices, 
  Coins, 
  Hammer, 
  Sparkles, 
  Info,
  ShieldAlert
} from 'lucide-react';

interface GameLogsProps {
  logs: GameLog[];
  playerColors: string[]; // player id -> color text class
  playerNames: string[];
}

export const GameLogs: React.FC<GameLogsProps> = ({ logs, playerColors, playerNames }) => {
  const [filter, setFilter] = useState<string>('all');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when logs update
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const filteredLogs = logs.filter((log) => {
    if (filter === 'all') return true;
    if (filter === 'roll') return log.type === 'roll';
    if (filter === 'invest') return log.type === 'buy' || log.type === 'upgrade';
    if (filter === 'rent') return log.type === 'rent' || log.type === 'tax';
    if (filter === 'card') return log.type === 'card';
    return true;
  });

  const getLogIcon = (type: GameLog['type']) => {
    switch (type) {
      case 'roll':
        return <Dices className="w-3.5 h-3.5 text-sky-400" />;
      case 'buy':
      case 'upgrade':
        return <Hammer className="w-3.5 h-3.5 text-emerald-400" />;
      case 'rent':
      case 'tax':
        return <Coins className="w-3.5 h-3.5 text-amber-400" />;
      case 'card':
        return <Sparkles className="w-3.5 h-3.5 text-fuchsia-400" />;
      case 'bankrupt':
        return <ShieldAlert className="w-3.5 h-3.5 text-red-500 animate-pulse" />;
      default:
        return <Info className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#2D3436] border-4 border-black overflow-hidden shadow-[4px_4px_0_0_#000] rounded-none">
      {/* Title & Tabs */}
      <div className="p-3 bg-[#2D3436] border-b-2 border-black flex flex-col gap-2">
        <div className="flex items-center gap-1.5 text-xs font-black text-[#A8E6CF] uppercase tracking-wider">
          <ScrollText className="w-4 h-4 text-[#FFD93D]" />
          <span>시네마 트랜잭션 원장 (실시간 로그)</span>
        </div>

        {/* Tab Filters */}
        <div className="flex flex-wrap gap-1">
          {[
            { id: 'all', label: '전체' },
            { id: 'roll', label: '주사위' },
            { id: 'invest', label: '제작/인수' },
            { id: 'rent', label: '수수료/세금' },
            { id: 'card', label: '시사회' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`
                px-2.5 py-1 text-[10px] font-black rounded-none border transition-all cursor-pointer
                ${
                  filter === tab.id
                    ? 'bg-[#FFD93D] text-[#2D3436] border-black shadow-[1px_1px_0_0_#000]'
                    : 'bg-[#2D3436] text-[#A8E6CF] border-transparent hover:border-black hover:bg-[#FFD93D]/10'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Log Body */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 p-3 overflow-y-auto space-y-2 text-[11px] font-mono text-[#A8E6CF] max-h-[300px] md:max-h-[380px]"
      >
        {filteredLogs.length === 0 ? (
          <div className="h-24 flex items-center justify-center text-slate-500 font-normal italic">
            기록된 활동 로그가 없습니다.
          </div>
        ) : (
          filteredLogs.map((log) => {
            const hasPlayer = log.playerId !== undefined;
            const pName = hasPlayer ? playerNames[log.playerId!] : '';
            const pColor = hasPlayer ? playerColors[log.playerId!] : 'text-slate-400';

            return (
              <div 
                key={log.id} 
                className="flex gap-2.5 p-2 bg-[#232729] border border-[#2D3436] hover:bg-[#1f2224] transition-colors"
              >
                <div className="shrink-0 mt-0.5">
                  {getLogIcon(log.type)}
                </div>
                
                <div className="flex-1 leading-normal">
                  <div className="flex justify-between items-baseline mb-0.5">
                    {hasPlayer && (
                      <span className={`text-[10px] font-black tracking-tight ${pColor}`}>
                        {pName}
                      </span>
                    )}
                    <span className="text-[8px] text-[#A8E6CF]/70 font-mono ml-auto">
                      {log.timestamp}
                    </span>
                  </div>
                  <p className="text-white font-sans text-xs">{log.message}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
