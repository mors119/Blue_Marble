import { Award, HelpCircle, RotateCcw, Volume2, VolumeX } from 'lucide-react';

interface GameHeaderProps {
  taxDonationPool: number;
  formatMoney: (amount: number) => string;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenRules: () => void;
  onResetGame: () => void;
}

export function GameHeader({
  taxDonationPool,
  formatMoney,
  soundEnabled,
  onToggleSound,
  onOpenRules,
  onResetGame,
}: GameHeaderProps) {
  return (
    <header className="h-20 bg-[#FF6B6B] border-b-4 border-black flex items-center justify-between px-6 shadow-[0_4px_0_0_#000] text-white">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border-2 border-black shadow-[2px_2px_0_0_#000] text-black shrink-0">
          <span className="text-2xl">🎬</span>
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-black tracking-tighter uppercase italic text-white leading-none">Cinema Blue Marble</h1>
          <p className="text-[10px] text-white/95 font-bold uppercase tracking-wider mt-0.5">대한민국 대표 시네마 보드 게임 엔진</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 bg-white text-[#2D3436] border-2 border-black px-3 py-1.5 shadow-[2px_2px_0_0_#000] font-black uppercase text-[10px]">
          <Award className="w-4 h-4 text-[#FF6B6B]" />
          <span>누적 영화제 기금:</span>
          <span className="text-xs font-black font-mono text-[#FF6B6B]">{formatMoney(taxDonationPool)}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={onToggleSound}
            className="p-2 border-2 border-black bg-white text-[#2D3436] hover:translate-x-[1px] hover:translate-y-[1px] shadow-[2px_2px_0_0_#000] hover:shadow-[1px_1px_0_0_#000] transition-all cursor-pointer"
            title="소리 조절"
          >
            {soundEnabled ? <Volume2 className="w-4.5 h-4.5" /> : <VolumeX className="w-4.5 h-4.5 text-red-500" />}
          </button>
          <button
            onClick={onOpenRules}
            className="p-2 border-2 border-black bg-white text-[#2D3436] hover:translate-x-[1px] hover:translate-y-[1px] shadow-[2px_2px_0_0_#000] hover:shadow-[1px_1px_0_0_#000] transition-all cursor-pointer"
            title="게임 설명 가이드"
          >
            <HelpCircle className="w-4.5 h-4.5" />
          </button>
          <button
            onClick={onResetGame}
            className="p-2 border-2 border-black bg-[#FF6B6B] text-white hover:translate-x-[1px] hover:translate-y-[1px] shadow-[2px_2px_0_0_#000] hover:shadow-[1px_1px_0_0_#000] transition-all cursor-pointer"
            title="게임 재시작"
          >
            <RotateCcw className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>
    </header>
  );
}
