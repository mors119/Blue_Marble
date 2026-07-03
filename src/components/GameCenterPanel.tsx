import { Award, Coins, Plane, Sparkles, Trophy } from 'lucide-react';
import { DiceCup } from './DiceCup';
import { MOVIE_STAGE_LABELS } from '../constants/game';
import { Player, PremiereCard, Tile } from '../types';

interface GameCenterPanelProps {
  players: Player[];
  currentPlayerIdx: number;
  gameWinner: Player | null;
  activeCardDrawn: PremiereCard | null;
  isFlyingSelectMode: boolean;
  aiThinkingMessage: string;
  activeTile: Tile | null;
  activePlayer: Player;
  isHumanTurn: boolean;
  dice1: number;
  dice2: number;
  isRolling: boolean;
  isMoving: boolean;
  rentOwed: number;
  taxOwed: number;
  formatMoney: (amount: number) => string;
  getTileOwner: (tileId: number) => Player | null;
  onResetGame: () => void;
  onApplyCardEffect: () => void;
  onBuyMovieRight: () => void;
  onUpgradeMovie: () => void;
  onPayRent: () => void;
  onPayTax: () => void;
  onRollEscapeDelay: () => void;
  onPayEscapeDelay: () => void;
  onRollDice: () => void;
  addLog: (playerId: number | undefined, message: string, type: 'roll' | 'buy' | 'upgrade' | 'rent' | 'tax' | 'card' | 'system' | 'bankrupt' | 'win') => void;
  nextTurn: () => void;
}

export function GameCenterPanel({
  players,
  currentPlayerIdx,
  gameWinner,
  activeCardDrawn,
  isFlyingSelectMode,
  aiThinkingMessage,
  activeTile,
  activePlayer,
  isHumanTurn,
  dice1,
  dice2,
  isRolling,
  isMoving,
  rentOwed,
  taxOwed,
  formatMoney,
  getTileOwner,
  onResetGame,
  onApplyCardEffect,
  onBuyMovieRight,
  onUpgradeMovie,
  onPayRent,
  onPayTax,
  onRollEscapeDelay,
  onPayEscapeDelay,
  onRollDice,
  addLog,
  nextTurn,
}: GameCenterPanelProps) {
  return (
    <div className="col-start-2 col-end-11 row-start-2 row-end-11 bg-[#FFFBEB] rounded-none p-3 md:p-5 flex flex-col justify-between border-4 border-black relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0">
        <div className="text-black/5 text-[48px] md:text-[84px] font-black tracking-tighter transform rotate-[-15deg] uppercase">CINEMA</div>
      </div>

      {isFlyingSelectMode && (
        <div className="absolute inset-0 bg-[#A8E6CF]/10 rounded-none border-4 border-dashed border-[#4ECDC4] pointer-events-none animate-pulse z-10" />
      )}

      {aiThinkingMessage && (
        <div className="absolute top-2 left-2 right-2 bg-[#FFD93D] border-2 border-black px-3 py-1.5 rounded-none flex items-center gap-2 justify-center text-[10px] font-black text-[#2D3436] shadow-[2px_2px_0_0_#000] animate-pulse z-10">
          <div className="w-2 h-2 rounded-full bg-[#FF6B6B] border border-black animate-ping" />
          {aiThinkingMessage}
        </div>
      )}

      <div className="flex-1 flex flex-col justify-center items-center py-2 relative z-20">
        {gameWinner ? (
          <div className="text-center space-y-4 max-w-md bg-white border-4 border-black p-6 rounded-none shadow-[6px_6px_0_0_#000] animate-in fade-in zoom-in-95 duration-200">
            <Trophy className="w-12 h-12 text-[#FFD93D] mx-auto animate-bounce" />
            <div className="space-y-1">
              <h3 className="text-xl font-black text-[#2D3436] uppercase italic">대영제국 등극 축하드립니다!</h3>
              <p className="text-xs text-slate-700 leading-normal font-bold">
                경쟁 제작사를 모두 합병하고, 은하계 시네마 배급 네트워크 왕좌의 주인공은{' '}
                <span className="font-black text-[#FF6B6B] text-sm">{gameWinner.name}</span> 영화사가 되었습니다.
              </p>
            </div>
            <button
              onClick={onResetGame}
              className="px-6 py-2.5 rounded-none bg-[#FFD93D] text-[#2D3436] font-black uppercase italic border-2 border-black hover:translate-y-[1px] shadow-[2px_2px_0_0_#000] cursor-pointer"
            >
              새로운 시나리오 기획 개시
            </button>
          </div>
        ) : activeCardDrawn ? (
          <div className="text-center space-y-4 max-w-sm bg-white border-4 border-black p-5 rounded-none shadow-[6px_6px_0_0_#000] relative animate-in fade-in zoom-in-95 duration-200">
            <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#FF6B6B] rounded-none p-2 border-2 border-black shadow-[2px_2px_0_0_#000]">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="pt-4 space-y-2">
              <span className="text-[10px] font-black text-[#FF6B6B] tracking-widest uppercase">시사회 특별 카드</span>
              <h4 className="text-base font-black text-[#2D3436]">{activeCardDrawn.title}</h4>
              <p className="text-xs text-slate-700 leading-relaxed bg-[#FFFBEB] p-3 rounded-none border-2 border-black shadow-[1px_1px_0_0_#000]">
                {activeCardDrawn.description}
              </p>
            </div>

            {isHumanTurn ? (
              <button
                onClick={onApplyCardEffect}
                className="w-full py-2.5 rounded-none bg-[#A8E6CF] text-[#2D3436] border-2 border-black font-black text-xs hover:bg-[#b5ecc9] transition-all cursor-pointer shadow-[2px_2px_0_0_#000]"
              >
                효과 집행하기
              </button>
            ) : (
              <div className="text-[10px] font-black text-slate-500 italic">
                AI가 초청 효과 정산 중...
              </div>
            )}
          </div>
        ) : isFlyingSelectMode ? (
          <div className="text-center space-y-3 bg-[#4ECDC4] border-4 border-black p-5 rounded-none max-w-sm shadow-[4px_4px_0_0_#000] text-[#2D3436]">
            <Plane className="w-10 h-10 text-white mx-auto" />
            <div className="space-y-1">
              <h4 className="text-[10px] font-black text-white tracking-wide uppercase">글로벌 비행 지령 수신</h4>
              <h3 className="text-sm font-black uppercase italic">이동할 목적지 선정 대기 중</h3>
              <p className="text-[10px] text-slate-900 leading-normal font-bold">
                {isHumanTurn ? (
                  <span className="text-black font-black">보드판 외곽에 빛나는 원하는 칸 중 아무 칸이나 클릭하시면 즉시 전용기가 착륙합니다!</span>
                ) : (
                  <span>AI가 가장 수익률이 좋은 목적지를 타겟팅하고 있습니다.</span>
                )}
              </p>
            </div>
          </div>
        ) : activeTile && activeTile.type === 'MOVIE' && !getTileOwner(activeTile.id) ? (
          <div className="text-center space-y-3.5 max-w-sm bg-white border-4 border-black p-4 rounded-none shadow-[6px_6px_0_0_#000] animate-in fade-in zoom-in-95 duration-200 text-[#2D3436]">
            <div className={`inline-flex px-2 py-0.5 rounded-none text-[8px] font-black border-2 border-black shadow-[1px_1px_0_0_#000] ${
              activeTile.grade === 'A' ? 'text-white bg-[#FF6B6B]' :
              activeTile.grade === 'B' ? 'text-[#2D3436] bg-[#FFD93D]' :
              activeTile.grade === 'C' ? 'text-[#2D3436] bg-[#4ECDC4]' :
              'text-[#2D3436] bg-[#A8E6CF]'
            }`}>
              {activeTile.grade}등급 영화 • {activeTile.genre}
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-black text-[#2D3436]">[ {activeTile.name} ]</h3>
              <p className="text-xs text-slate-600 font-bold">시나리오 기획 판권을 인수하여 개봉 준비를 시작하시겠습니까?</p>
              <div className="flex justify-center gap-4 mt-2 bg-[#FFFBEB] p-2 border-2 border-black shadow-[1px_1px_0_0_#000]">
                <div className="text-center">
                  <span className="text-[9px] text-slate-600 block font-bold">기획 판권 인수료</span>
                  <span className="text-xs font-black text-[#FF6B6B] font-mono">{formatMoney(activeTile.price || 0)}</span>
                </div>
                <div className="border-l-2 border-black h-8" />
                <div className="text-center">
                  <span className="text-[9px] text-slate-600 block font-bold">기본 관람 수익</span>
                  <span className="text-xs font-black text-[#2D3436] font-mono">
                    {formatMoney(activeTile.rents ? activeTile.rents[0] : 0)}
                  </span>
                </div>
              </div>
            </div>

            {isHumanTurn ? (
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    addLog(activePlayer.id, `🎬 [${activeTile.name}] 판권 인수를 보류하고 그냥 지나쳤습니다.`, 'system');
                    nextTurn();
                  }}
                  className="flex-1 py-2 text-xs font-black text-slate-500 hover:text-black bg-[#FFFBEB] border-2 border-black rounded-none hover:bg-slate-100 transition-all cursor-pointer shadow-[1px_1px_0_0_#000]"
                >
                  인수 포기
                </button>
                <button
                  onClick={onBuyMovieRight}
                  disabled={activePlayer.money < (activeTile.price || 0)}
                  className={`flex-1 py-2 text-xs font-black rounded-none border-2 border-black transition-all cursor-pointer ${
                    activePlayer.money >= (activeTile.price || 0)
                      ? 'bg-[#FF6B6B] text-white hover:bg-rose-500 shadow-[2px_2px_0_0_#000] hover:translate-y-[1px]'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none border-slate-300'
                  }`}
                >
                  판권 인수
                </button>
              </div>
            ) : (
              <div className="text-[10px] font-black text-slate-500 italic animate-pulse">
                AI가 판권 투자 검토 중...
              </div>
            )}
          </div>
        ) : activeTile && activeTile.type === 'MOVIE' && getTileOwner(activeTile.id)?.id === activePlayer.id ? (
          <div className="text-center space-y-3.5 max-w-sm bg-white border-4 border-black p-4 rounded-none shadow-[6px_6px_0_0_#000] animate-in fade-in zoom-in-95 duration-200 text-[#2D3436]">
            <span className="text-[8px] font-black px-2 py-0.5 rounded-none border-2 border-black bg-[#FFD93D] text-[#2D3436] uppercase shadow-[1px_1px_0_0_#000]">본사 소유 작품</span>
            <div className="space-y-1">
              <h3 className="text-base font-black text-[#2D3436]">[ {activeTile.name} ]</h3>
              <p className="text-xs text-slate-600 font-bold">
                현재 제작 단계: <span className="font-black text-[#FF6B6B] bg-slate-100 px-1 border border-black">{MOVIE_STAGE_LABELS[activePlayer.ownedMovies[activeTile.id]]}</span>
              </p>

              {activeTile.upgradeCosts && activePlayer.ownedMovies[activeTile.id] < 4 && (
                <div className="flex justify-center gap-4 mt-2 bg-[#FFFBEB] py-2 px-3 border-2 border-black shadow-[1px_1px_0_0_#000]">
                  <div className="text-center">
                    <span className="text-[9px] text-slate-600 block font-bold">다음 단계 투자금</span>
                    <span className="text-xs font-black text-emerald-600 font-mono">
                      {formatMoney(activeTile.upgradeCosts[activePlayer.ownedMovies[activeTile.id]])}
                    </span>
                  </div>
                  <div className="border-l-2 border-black h-8" />
                  <div className="text-center">
                    <span className="text-[9px] text-slate-600 block font-bold">인상될 관람 수익</span>
                    <span className="text-xs font-black text-[#FF6B6B] font-mono">
                      {formatMoney(activeTile.rents ? activeTile.rents[activePlayer.ownedMovies[activeTile.id] + 1] : 0)}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {isHumanTurn ? (
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    addLog(activePlayer.id, `🏰 [${activeTile.name}] 영화 제작 추가 투자를 미루고 다음 차례로 이월했습니다.`, 'system');
                    nextTurn();
                  }}
                  className="flex-1 py-2 text-xs font-black text-slate-500 bg-[#FFFBEB] border-2 border-black rounded-none hover:bg-slate-100 transition-all cursor-pointer shadow-[1px_1px_0_0_#000]"
                >
                  투자 보류
                </button>
                <button
                  onClick={onUpgradeMovie}
                  disabled={
                    activeTile.upgradeCosts === undefined ||
                    activePlayer.money < activeTile.upgradeCosts[activePlayer.ownedMovies[activeTile.id]]
                  }
                  className={`flex-1 py-2 text-xs font-black border-2 border-black rounded-none transition-all cursor-pointer ${
                    activeTile.upgradeCosts && activePlayer.money >= activeTile.upgradeCosts[activePlayer.ownedMovies[activeTile.id]]
                      ? 'bg-[#4ECDC4] text-[#2D3436] hover:bg-teal-400 shadow-[2px_2px_0_0_#000] hover:translate-y-[1px]'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none border-slate-300'
                  }`}
                >
                  단계 업그레이드
                </button>
              </div>
            ) : (
              <div className="text-[10px] font-black text-slate-500 italic animate-pulse">
                AI가 제작 확장 여부 조율 중...
              </div>
            )}
          </div>
        ) : activeTile && activeTile.type === 'MOVIE' && getTileOwner(activeTile.id)?.id !== activePlayer.id ? (
          <div className="text-center space-y-4 max-w-sm bg-white border-4 border-[#FF6B6B] p-5 rounded-none shadow-[6px_6px_0_0_#000] animate-in fade-in zoom-in-95 duration-200 text-[#2D3436]">
            <Coins className="w-10 h-10 text-[#FF6B6B] mx-auto animate-pulse" />
            <div className="space-y-1">
              <span className="text-[9px] font-black text-[#FF6B6B] tracking-wider uppercase">타사 영화 정산 발생</span>
              <h3 className="text-sm font-black">
                경쟁사 <span className="font-black text-emerald-600">{getTileOwner(activeTile.id)?.name}</span>의 구역 진입
              </h3>
              <p className="text-xs text-slate-600 font-bold">
                소유주의 홍보 배급망을 향한 영화 관람 및 대관료 수익 <span className="text-[#FF6B6B] font-black font-mono">{formatMoney(rentOwed)}</span> 정산이 요구됩니다.
              </p>
            </div>

            {isHumanTurn ? (
              <button
                onClick={onPayRent}
                className="w-full py-3 rounded-none border-2 border-black bg-[#FF6B6B] text-white font-black text-xs shadow-[2px_2px_0_0_#000] hover:translate-y-[1px] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer"
              >
                {activePlayer.money >= rentOwed ? '관람 대관 수익 지불' : `자산 청산 후 정산 (부족: ${formatMoney(rentOwed - activePlayer.money)})`}
              </button>
            ) : (
              <div className="text-[10px] font-black text-slate-500 italic animate-pulse">
                AI가 통행료 지불 대기 중...
              </div>
            )}
          </div>
        ) : activeTile && activeTile.type === 'TAX' ? (
          <div className="text-center space-y-4 max-w-sm bg-white border-4 border-[#FF6B6B] p-5 rounded-none shadow-[6px_6px_0_0_#000] animate-in fade-in zoom-in-95 duration-200 text-[#2D3436]">
            <Coins className="w-10 h-10 text-[#FF6B6B] mx-auto animate-pulse" />
            <div className="space-y-1">
              <span className="text-[9px] font-black text-[#FF6B6B] tracking-wider uppercase">영화 상생 기금 지출</span>
              <h3 className="text-sm font-black uppercase italic">{activeTile.name}</h3>
              <p className="text-xs text-slate-600 font-bold">
                규격 외 초과 지출로 인한 제반 비용 <span className="text-[#FF6B6B] font-black font-mono">{formatMoney(taxOwed)}</span> 세무 납입이 청구되었습니다.
              </p>
            </div>

            {isHumanTurn ? (
              <button
                onClick={onPayTax}
                className="w-full py-3 rounded-none border-2 border-black bg-[#FF6B6B] text-white font-black text-xs shadow-[2px_2px_0_0_#000] hover:translate-y-[1px] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer"
              >
                {activePlayer.money >= taxOwed ? '기금 납부하기' : `자산 청산 후 납부 (부족: ${formatMoney(taxOwed - activePlayer.money)})`}
              </button>
            ) : (
              <div className="text-[10px] font-black text-slate-500 italic animate-pulse">
                AI가 공공 지원 세무 정산 중...
              </div>
            )}
          </div>
        ) : activePlayer.position === 10 && activePlayer.isSkipping ? (
          <div className="text-center space-y-4 max-w-sm bg-white border-4 border-black p-5 rounded-none shadow-[6px_6px_0_0_#000] animate-in fade-in zoom-in-95 duration-200 text-[#2D3436]">
            <Award className="w-10 h-10 text-[#FFD93D] mx-auto" />
            <div className="space-y-1">
              <span className="text-[9px] font-black text-[#FFD93D] tracking-wider uppercase">촬영 리스크 발생 (대기실)</span>
              <h3 className="text-sm font-black uppercase italic">현장 지연 해결 옵션</h3>
              <p className="text-xs text-slate-600 font-bold leading-normal">
                추가 지연 수습 기금 50만 원을 지출하고 즉각 탈출하거나, 주사위를 던져 더블(같은 숫자)이 나오면 무료로 극적인 탈출을 노릴 수 있습니다.
              </p>
            </div>

            {isHumanTurn ? (
              <div className="flex gap-2">
                <button
                  onClick={onRollEscapeDelay}
                  disabled={isRolling}
                  className="flex-1 py-2.5 rounded-none bg-[#FFFBEB] text-[#2D3436] border-2 border-black text-xs font-black hover:bg-slate-100 transition-all cursor-pointer shadow-[1px_1px_0_0_#000]"
                >
                  주사위 탈출 시도
                </button>
                <button
                  onClick={onPayEscapeDelay}
                  disabled={activePlayer.money < 500000}
                  className={`flex-1 py-2.5 rounded-none border-2 border-black text-xs font-black transition-all cursor-pointer ${
                    activePlayer.money >= 500000
                      ? 'bg-[#FFD93D] text-[#2D3436] hover:bg-[#ffe270] shadow-[1px_1px_0_0_#000]'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed border-slate-300 shadow-none'
                  }`}
                >
                  50만 원 지불 탈출
                </button>
              </div>
            ) : (
              <div className="text-[10px] font-black text-slate-500 italic animate-pulse">
                AI가 현장 긴급 돌파 방안을 산출 중...
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-3.5 w-full">
            <DiceCup
              dice1={dice1}
              dice2={dice2}
              isRolling={isRolling}
              onRoll={onRollDice}
              disabled={isMoving || activePlayer.isAI}
              currentPlayerName={activePlayer.name}
              currentPlayerColor={activePlayer.color}
            />

            {!activePlayer.isAI && (
              <p className="text-[11px] text-[#2D3436] font-black uppercase tracking-wider animate-pulse text-center">
                노란 주사위 슬레이트 버튼을 눌러 제작 여정을 시작하세요 🎬
              </p>
            )}
          </div>
        )}
      </div>

      <div className="border-t-2 border-black pt-3 flex flex-wrap items-center justify-between gap-2.5 text-xs z-20">
        {players.map((player) => {
          const isCurrent = player.id === currentPlayerIdx;
          return (
            <div
              key={player.id}
              className={`
                flex items-center gap-2 px-3 py-1.5 border-2 border-black transition-all duration-300 rounded-none shadow-[2px_2px_0_0_#000]
                ${
                  player.isBankrupt
                    ? 'bg-slate-200 text-slate-400 line-through'
                    : isCurrent
                    ? 'bg-[#FFD93D] text-[#2D3436] font-black scale-102 translate-x-[-1px] translate-y-[-1px]'
                    : 'bg-white text-slate-700'
                }
              `}
            >
              <div className={`w-3 h-3 rounded-full border border-black ${player.color}`} />
              <span className="font-black">{player.name}</span>
              {!player.isBankrupt && (
                <span className="font-mono font-black text-[#FF6B6B] ml-1 text-[11px]">
                  {formatMoney(player.money)}
                </span>
              )}
              {player.isBankrupt && <span className="text-[9px] text-white bg-red-600 border border-black px-1 font-black">부도</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
