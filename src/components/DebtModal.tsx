import { Dispatch, SetStateAction } from 'react';
import { Skull } from 'lucide-react';
import { BOARD_LAYOUT } from '../data';
import { Player } from '../types';
import { MOVIE_SHORT_STAGE_LABELS } from '../constants/game';

interface DebtModalProps {
  activePlayer: Player | null;
  calculateAssetSellValue: (tile: (typeof BOARD_LAYOUT)[number], level: number) => number;
  formatMoney: (amount: number) => string;
  handleHumanSellAsset: (tileId: number) => void;
  handleBankruptPlayer: (player: Player) => void;
  rentReceiverIdx: number | null;
  rentOwed: number;
  taxOwed: number;
  players: Player[];
  setPlayers: Dispatch<SetStateAction<Player[]>>;
  setTaxDonationPool: Dispatch<SetStateAction<number>>;
  addLog: (playerId: number | undefined, message: string, type: 'roll' | 'buy' | 'upgrade' | 'rent' | 'tax' | 'card' | 'system' | 'bankrupt' | 'win') => void;
  onPlayVictory: () => void;
  nextTurn: () => void;
}

export function DebtModal({
  activePlayer,
  calculateAssetSellValue,
  formatMoney,
  handleHumanSellAsset,
  handleBankruptPlayer,
  rentReceiverIdx,
  rentOwed,
  taxOwed,
  players,
  setPlayers,
  setTaxDonationPool,
  addLog,
  onPlayVictory,
  nextTurn,
}: DebtModalProps) {
  if (!activePlayer || activePlayer.money >= 0 || activePlayer.isAI) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-[#2D3436]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white border-4 border-black rounded-none p-6 max-w-md w-full shadow-[8px_8px_0_0_#000] text-center space-y-4 animate-in fade-in zoom-in-95 duration-200 text-[#2D3436]">
        <Skull className="w-12 h-12 text-[#FF6B6B] mx-auto animate-bounce" />
        <div className="space-y-1">
          <h3 className="text-lg font-black uppercase italic text-[#FF6B6B]">🚨 재정 부도 비상 경보</h3>
          <p className="text-xs text-slate-700 font-bold">
            현재 자금이 마이너스 상태입니다! 이 대금을 정상 납입하지 않으면 최종 부도 파산(Bankruptcy) 선언을 해야 합니다.
          </p>
          <div className="bg-[#FFFBEB] p-3 rounded-none border-2 border-black shadow-[2px_2px_0_0_#000] my-2">
            <span className="text-[10px] text-slate-600 block font-black uppercase">미해결 채무액</span>
            <span className="text-xl font-black text-[#FF6B6B] font-mono">
              {formatMoney(Math.abs(activePlayer.money))}
            </span>
          </div>
        </div>

        <div className="space-y-2 max-h-40 overflow-y-auto text-left">
          <span className="text-[10px] font-black text-slate-600 uppercase block tracking-wider mb-1">
            긴급 수혈 가능한 본사 보유 판권 리스트
          </span>

          {Object.keys(activePlayer.ownedMovies).length === 0 ? (
            <p className="text-xs text-slate-500 italic text-center py-4 font-bold">긴급 처분 가능한 영화 자산이 없습니다.</p>
          ) : (
            Object.entries(activePlayer.ownedMovies).map(([idStr, lvl]) => {
              const tileId = parseInt(idStr, 10);
              const level = lvl as number;
              const tile = BOARD_LAYOUT.find((entry) => entry.id === tileId)!;
              const sellValue = calculateAssetSellValue(tile, level);

              return (
                <div
                  key={tileId}
                  className="flex items-center justify-between bg-white p-2.5 rounded-none border-2 border-black"
                >
                  <div>
                    <span className="text-xs font-black text-[#2D3436]">{tile.name}</span>
                    <span className="text-[9px] text-[#FF6B6B] block font-black">
                      {MOVIE_SHORT_STAGE_LABELS[level]} 단계
                    </span>
                  </div>
                  <button
                    onClick={() => handleHumanSellAsset(tileId)}
                    className="px-2.5 py-1.5 rounded-none bg-[#FF6B6B] text-white border-2 border-black hover:translate-y-[1px] font-black text-[10px] transition-all cursor-pointer shadow-[1px_1px_0_0_#000]"
                  >
                    판권 매각 (+{formatMoney(sellValue)})
                  </button>
                </div>
              );
            })
          )}
        </div>

        <div className="flex gap-2 pt-2 border-t-2 border-black">
          <button
            onClick={() => {
              if (window.confirm('정말 시네마 사업을 영구 종료하고 파산 선언을 하시겠습니까?')) {
                handleBankruptPlayer(activePlayer);
              }
            }}
            className="flex-1 py-2 rounded-none text-xs font-black text-slate-500 hover:text-black bg-[#FFFBEB] border-2 border-black shadow-[1px_1px_0_0_#000] cursor-pointer"
          >
            파산 선언
          </button>

          <button
            onClick={() => {
              if (activePlayer.money >= 0) {
                if (rentReceiverIdx !== null) {
                  setPlayers((prev) =>
                    prev.map((player) => {
                      if (player.id === rentReceiverIdx) {
                        return { ...player, money: player.money + rentOwed };
                      }
                      return player;
                    })
                  );
                  addLog(activePlayer.id, `🎟️ 자산을 긴급 청산하여 ${players[rentReceiverIdx].name} 제작사에 무사히 수수료를 완납하였습니다.`, 'rent');
                } else {
                  setTaxDonationPool((prev) => prev + taxOwed);
                  addLog(activePlayer.id, `💸 자산을 매각하여 세무 지출 ${formatMoney(taxOwed)} 정산을 무사히 마쳤습니다.`, 'tax');
                }

                onPlayVictory();
                setTimeout(nextTurn, 1500);
              } else {
                alert(`아직 채무액 ${formatMoney(Math.abs(activePlayer.money))}이 남아있어 합의 서명을 진행할 수 없습니다.`);
              }
            }}
            disabled={activePlayer.money < 0}
            className={`flex-1 py-2 rounded-none text-xs font-black border-2 border-black transition-all cursor-pointer ${
              activePlayer.money >= 0
                ? 'bg-[#4ECDC4] text-[#2D3436] hover:bg-teal-400 shadow-[2px_2px_0_0_#000]'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed border-slate-300 shadow-none'
            }`}
          >
            상환 합의 체결
          </button>
        </div>
      </div>
    </div>
  );
}
