/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Player, Tile } from '../types';
import { BOARD_LAYOUT, MOVIE_GRADES } from '../data';
import { Film, Trophy, HelpCircle, Flame, DollarSign } from 'lucide-react';

interface AssetListProps {
  players: Player[];
  activePlayerIdx: number;
}

export const AssetList: React.FC<AssetListProps> = ({ players, activePlayerIdx }) => {
  const [selectedPlayerId, setSelectedPlayerId] = useState<number>(0);

  const activePlayer = players[selectedPlayerId] || players[0];

  // Group owned movies by grade
  const getOwnedMovieTiles = (player: Player): { tile: Tile; level: number }[] => {
    return Object.entries(player.ownedMovies).map(([tileIdStr, level]) => {
      const tileId = parseInt(tileIdStr, 10);
      const tile = BOARD_LAYOUT.find((t) => t.id === tileId)!;
      return { tile, level };
    });
  };

  const ownedAssets = getOwnedMovieTiles(activePlayer);

  const formatMoney = (amount: number) => {
    return `${(amount / 10000).toLocaleString()}만 원`;
  };

  const getLevelLabel = (tile: Tile, level: number) => {
    if (tile.grade === 'SPECIAL') return '특수 시네마 거점';
    const labels = ['🎬 시나리오 판권', '📣 홍보/마케팅', '🏛️ 극장 전격 개봉', '📱 OTT 동시 확장', '👑 월드 프랜차이즈'];
    return labels[level];
  };

  const getRentForAsset = (tile: Tile, level: number) => {
    if (tile.grade === 'SPECIAL') {
      // Calculate special tourism rent
      const ownerOwnedSpecials = ownedAssets.filter((a) => a.tile.grade === 'SPECIAL').length;
      const rents = [100000, 250000, 500000, 1000000];
      return rents[Math.max(0, Math.min(ownerOwnedSpecials - 1, 3))];
    }
    return tile.rents ? tile.rents[level] : 0;
  };

  return (
    <div className="bg-white border-4 border-black p-4 shadow-[4px_4px_0_0_#2D3436] flex flex-col h-full text-[#2D3436] rounded-none">
      {/* Tab Selectors for Players */}
      <div className="flex gap-1.5 mb-3.5 overflow-x-auto pb-1">
        {players.map((player) => {
          const isActive = player.id === selectedPlayerId;
          const isCurrentTurn = player.id === activePlayerIdx;

          return (
            <button
              key={player.id}
              onClick={() => setSelectedPlayerId(player.id)}
              className={`
                px-3 py-1.5 rounded-none text-xs font-black transition-all shrink-0 flex items-center gap-1.5 cursor-pointer border-2 border-black shadow-[1px_1px_0_0_#2D3436]
                ${
                  isActive
                    ? 'bg-[#FFD93D] text-[#2D3436] translate-y-[1px] shadow-[0px_0px_0_0_#2D3436]'
                    : 'bg-[#FFFBEB] text-slate-700 hover:bg-slate-100'
                }
              `}
            >
              <div className={`w-3 h-3 rounded-full border border-black ${player.color} ${isCurrentTurn ? 'animate-ping' : ''}`} />
              <span className={player.isBankrupt ? 'line-through text-slate-400' : ''}>
                {player.name} {player.isAI ? '🤖' : ''}
              </span>
              {player.isBankrupt && (
                <span className="text-[9px] text-red-600 bg-red-100 px-1 py-0.2 rounded-none font-black border border-red-600">
                  파산
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-2 gap-3 mb-4 bg-[#FFFBEB] p-3 border-2 border-black shadow-[2px_2px_0_0_#2D3436] rounded-none">
        <div className="space-y-0.5">
          <span className="text-[10px] text-[#2D3436] font-black uppercase">보유 제작 예산</span>
          <p className="text-sm font-black text-[#FF6B6B] font-mono">
            {activePlayer.isBankrupt ? '0원 (파산)' : formatMoney(activePlayer.money)}
          </p>
        </div>
        <div className="space-y-0.5">
          <span className="text-[10px] text-[#2D3436] font-black uppercase">확보한 영화 라인업</span>
          <p className="text-sm font-black text-[#2D3436] font-mono">
            {activePlayer.isBankrupt ? '0개' : `${ownedAssets.length}개 작품`}
          </p>
        </div>
      </div>

      {/* Assets Grid */}
      <div className="flex-1 overflow-y-auto space-y-2 max-h-[160px] md:max-h-[220px]">
        {activePlayer.isBankrupt ? (
          <div className="h-28 flex flex-col items-center justify-center text-slate-500 gap-1">
            <Trophy className="w-5 h-5 text-[#FF6B6B]/50" />
            <span className="text-xs italic font-bold">이 영화사는 파산하여 모든 판권이 소멸되었습니다.</span>
          </div>
        ) : ownedAssets.length === 0 ? (
          <div className="h-28 flex flex-col items-center justify-center text-slate-500 gap-1 border-2 border-dashed border-[#2D3436] bg-[#FFFBEB]">
            <Film className="w-5 h-5 text-slate-400" />
            <span className="text-[11px] italic font-bold">아작 인수 및 기획한 영화 판권이 없습니다.</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {ownedAssets.map(({ tile, level }) => {
              const gradeColor = 
                tile.grade === 'A' ? 'text-white bg-[#FF6B6B] border-black shadow-[1px_1px_0_0_#000]' :
                tile.grade === 'B' ? 'text-[#2D3436] bg-[#FFD93D] border-black shadow-[1px_1px_0_0_#000]' :
                tile.grade === 'C' ? 'text-[#2D3436] bg-[#4ECDC4] border-black shadow-[1px_1px_0_0_#000]' :
                'text-[#2D3436] bg-[#A8E6CF] border-black shadow-[1px_1px_0_0_#000]';

              return (
                <div
                  key={tile.id}
                  className="p-2.5 bg-white border-2 border-black rounded-none shadow-[2px_2px_0_0_#2D3436] flex flex-col justify-between hover:bg-slate-50"
                >
                  <div className="flex justify-between items-start mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-none border ${gradeColor}`}>
                        {tile.grade}
                      </span>
                      <span className="text-xs font-black text-[#2D3436] truncate max-w-[100px]">{tile.name}</span>
                    </div>
                    <span className="text-[9px] text-[#2D3436] font-bold font-mono">{tile.genre}</span>
                  </div>

                  <div className="flex items-center justify-between text-[10px] border-t border-black pt-1.5 mt-1">
                    <span className="text-slate-600 font-bold">{getLevelLabel(tile, level)}</span>
                    <div className="flex items-center gap-0.5 text-[#FF6B6B] font-black font-mono">
                      <DollarSign className="w-3 h-3 shrink-0" />
                      <span>{formatMoney(getRentForAsset(tile, level))}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
