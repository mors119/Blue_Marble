/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Tile, Player } from '../types';
import { 
  Film, 
  Sparkles, 
  AlertCircle, 
  Plane, 
  Clapperboard, 
  Award, 
  Compass,
  ArrowUpRight,
  TrendingUp,
  Tv,
  Presentation,
  Crown
} from 'lucide-react';

interface BoardTileProps {
  tile: Tile;
  playersOnTile: Player[];
  owner: Player | null;
  level: number | undefined;
  isFestivalSelectable: boolean; // Is this space selectable during Travel flight selection?
  onTileClick: (tileId: number) => void;
}

export const BoardTile: React.FC<BoardTileProps> = ({
  tile,
  playersOnTile,
  owner,
  level,
  isFestivalSelectable,
  onTileClick,
}) => {
  // Determine tile grid coordinates (1-indexed for CSS Grid, 11x11 board)
  const getTileGridArea = (id: number) => {
    let row = 1;
    let col = 1;

    if (id >= 0 && id <= 10) {
      row = 11;
      col = 11 - id;
    } else if (id >= 11 && id <= 20) {
      row = 21 - id;
      col = 1;
    } else if (id >= 21 && id <= 30) {
      row = 1;
      col = id - 19;
    } else {
      row = id - 29;
      col = 11;
    }

    return {
      gridRowStart: row,
      gridColumnStart: col,
    };
  };

  const isCorner = tile.id % 10 === 0;

  // Level markers
  const renderLevelMarkers = () => {
    if (tile.type !== 'MOVIE' || owner === null || level === undefined || tile.grade === 'SPECIAL') return null;
    
    // Level 0: 🎬 (Rights bought), 1: Promo, 2: Theater, 3: OTT, 4: Franchise
    const levels = [
      { icon: Film, label: '판권', color: 'text-slate-600' },
      { icon: TrendingUp, label: '홍보', color: 'text-[#FF6B6B]' },
      { icon: Presentation, label: '극장', color: 'text-[#4ECDC4]' },
      { icon: Tv, label: 'OTT', color: 'text-indigo-600' },
      { icon: Crown, label: '프랜차이즈', color: 'text-amber-600 font-bold animate-pulse' }
    ];

    const currentLevel = levels[level];
    const Icon = currentLevel.icon;

    return (
      <div className="absolute top-1 right-1 flex items-center gap-0.5 px-1 py-0.5 rounded-none bg-white text-[9px] border border-black shadow-[1px_1px_0_0_#000] z-20">
        <Icon className={`w-2.5 h-2.5 ${currentLevel.color}`} />
        <span className="text-[8px] text-[#2D3436] font-bold">{currentLevel.label}</span>
      </div>
    );
  };

  // Grade color scheme
  const getGradeStyles = () => {
    if (tile.type !== 'MOVIE') return '';
    if (tile.grade === 'A') return 'border-t-8 border-t-[#FF6B6B]';
    if (tile.grade === 'B') return 'border-t-8 border-t-[#FFD93D]';
    if (tile.grade === 'C') return 'border-t-8 border-t-[#4ECDC4]';
    if (tile.grade === 'SPECIAL') return 'border-t-8 border-t-[#A8E6CF]';
    return '';
  };

  const getTileBackground = () => {
    if (isCorner) return 'bg-[#FFD93D] text-[#2D3436] border-2 border-black';
    if (tile.type === 'TAX') return 'bg-[#FF6B6B] text-white border-2 border-black hover:bg-[#ff8282]';
    if (tile.type === 'CARD') return 'bg-[#A8E6CF] text-[#2D3436] border-2 border-black hover:bg-[#bbf0dd]';
    return 'bg-white text-[#2D3436] border-2 border-[#2D3436] hover:bg-[#FFFBEB]';
  };

  return (
    <button
      id={`tile-${tile.id}`}
      onClick={() => onTileClick(tile.id)}
      disabled={!isFestivalSelectable}
      style={getTileGridArea(tile.id)}
      className={`
        relative flex flex-col justify-between p-1.5 select-none transition-all duration-200 text-left overflow-hidden h-full w-full rounded-none shadow-[2px_2px_0_0_#2D3436]
        ${getTileBackground()}
        ${getGradeStyles()}
        ${owner ? `ring-4 ring-inset ${owner.id === 0 ? 'ring-[#FF6B6B]' : owner.id === 1 ? 'ring-[#4ECDC4]' : owner.id === 2 ? 'ring-[#FFD93D]' : 'ring-[#A8E6CF]'}` : ''}
        ${isFestivalSelectable ? 'cursor-pointer hover:scale-102 ring-4 ring-[#4ECDC4] border-[#2D3436] bg-[#A8E6CF] shadow-[4px_4px_0_0_#2D3436] animate-pulse z-30' : ''}
      `}
    >
      {/* Grade and Genre text (only for movies) */}
      {!isCorner && tile.type === 'MOVIE' && (
        <div className="flex justify-between items-center w-full">
          <span className={`text-[8px] font-black uppercase ${
            tile.grade === 'A' ? 'text-[#FF6B6B]' :
            tile.grade === 'B' ? 'text-amber-600' :
            tile.grade === 'C' ? 'text-emerald-600' :
            'text-fuchsia-600'
          }`}>
            {tile.grade}등급
          </span>
          <span className="text-[7px] text-[#2D3436] font-bold font-mono truncate max-w-[40px]">{tile.genre}</span>
        </div>
      )}

      {/* Renders specific visuals for centers/special spots */}
      <div className="flex flex-col items-center justify-center my-auto py-1 w-full text-center">
        {tile.type === 'START' && (
          <>
            <ArrowUpRight className="w-5 h-5 text-[#FF6B6B] animate-bounce" />
            <span className="text-[10px] font-black text-[#2D3436] mt-0.5 uppercase italic">출발선</span>
            <span className="text-[7px] text-[#2D3436] font-bold font-mono">지원금 +200만</span>
          </>
        )}

        {tile.type === 'SKIP' && (
          <>
            <Clapperboard className="w-5 h-5 text-[#2D3436] animate-pulse" />
            <span className="text-[10px] font-black text-[#2D3436] mt-0.5 uppercase italic">촬영 지연</span>
            <span className="text-[7px] text-slate-700 font-bold font-mono">1회 휴식</span>
          </>
        )}

        {tile.type === 'DONATION_REST' && (
          <>
            <Award className="w-5 h-5 text-[#2D3436]" />
            <span className="text-[9px] font-black text-[#2D3436] mt-0.5 uppercase italic">영화제 휴게실</span>
            <span className="text-[7px] text-slate-700 font-bold font-mono">기금 수령</span>
          </>
        )}

        {tile.type === 'TRAVEL' && (
          <>
            <Plane className="w-5 h-5 text-[#2D3436]" />
            <span className="text-[9px] font-black text-[#2D3436] mt-0.5 uppercase italic">국제영화제</span>
            <span className="text-[7px] text-slate-700 font-bold font-mono">초청 비행</span>
          </>
        )}

        {tile.type === 'CARD' && (
          <>
            <Sparkles className="w-5 h-5 text-[#2D3436]" />
            <span className="text-[9px] font-black text-[#2D3436] mt-0.5 uppercase italic">시사회 카드</span>
          </>
        )}

        {tile.type === 'TAX' && (
          <>
            <AlertCircle className="w-4 h-4 text-white mb-0.5" />
            <span className="text-[9px] font-black text-white truncate max-w-[65px]">{tile.name}</span>
            <span className="text-[8px] text-white font-black mt-0.5">-{tile.price ? (tile.price / 10000) : 0}만</span>
          </>
        )}

        {tile.type === 'MOVIE' && (
          <>
            <span className="text-[9.5px] font-black text-[#2D3436] leading-tight truncate w-full text-center">
              {tile.name}
            </span>
            {tile.price && !owner && (
              <span className="text-[8px] text-[#2D3436]/70 font-bold font-mono mt-0.5">
                {tile.price / 10000}만 원
              </span>
            )}
            {owner && (
              <span className="text-[8.5px] text-[#2D3436] font-black mt-0.5 bg-slate-100/80 px-1 border border-[#2D3436] truncate max-w-[65px]">
                {owner.name}
              </span>
            )}
          </>
        )}
      </div>

      {/* Render levels markers */}
      {renderLevelMarkers()}

      {/* Player avatar chips container */}
      <div className="absolute bottom-1.5 left-1.5 right-1.5 flex flex-wrap gap-0.5 justify-center pointer-events-none z-10">
        {playersOnTile.map((player) => (
          <div
            key={player.id}
            style={{ width: '15px', height: '15px' }}
            className={`
              rounded-full border-2 border-black flex items-center justify-center text-[7.5px] font-black shadow-[1px_1px_0_0_#000] transform scale-110
              ${player.color} transition-all duration-300
            `}
            title={player.name}
          >
            {player.isAI ? '🤖' : player.name[0]}
          </div>
        ))}
      </div>
    </button>
  );
};
