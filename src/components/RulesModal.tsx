/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Film, TrendingUp, Presentation, Tv, Crown, Award, Plane, Clapperboard, Sparkles } from 'lucide-react';
import { MOVIE_GRADES } from '../data';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const formatMoney = (amount: number) => {
    return `${(amount / 10000).toLocaleString()}만 원`;
  };

  return (
    <div className="fixed inset-0 bg-[#2D3436]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white border-4 border-black max-w-2xl w-full max-h-[85vh] flex flex-col shadow-[8px_8px_0_0_#2D3436] rounded-none animate-in fade-in zoom-in-95 duration-150 text-[#2D3436]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b-4 border-black bg-[#FFD93D]">
          <div className="flex items-center gap-2">
            <Film className="w-5 h-5 text-[#FF6B6B]" />
            <h2 className="text-lg font-black uppercase italic tracking-tight">영화판 블루마블 가이드라인</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1 border-2 border-black bg-white text-[#2D3436] hover:bg-slate-100 transition-all shadow-[2px_2px_0_0_#000] rounded-none cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-800">
          {/* Core Rules */}
          <section className="space-y-2">
            <h3 className="text-base font-black text-[#2D3436] flex items-center gap-1.5 border-b-2 border-black pb-1.5 uppercase italic">
              💡 핵심 게임 규칙
            </h3>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-700 font-bold">
              <li>모든 플레이어는 **시작 자금 1,000만 원**을 지급받고 출발합니다.</li>
              <li>주사위 2개를 굴려 합산된 값만큼 보드판을 이동합니다.</li>
              <li>**주사위 더블(동일 숫자)**이 나오면 한 번 더 기회를 얻습니다. (단, 연속 3회 더블 시 촬영 지연으로 즉시 이동)</li>
              <li>보드판 한 바퀴를 돌아 출발선을 통과할 때마다 **제작 지원금 200만 원**을 획득합니다.</li>
              <li>파산하지 않고 최후까지 살아남는 1개의 영화사가 최종 **시네마 제국**으로 승리합니다.</li>
            </ul>
          </section>

          {/* Investment & Rents */}
          <section className="space-y-3">
            <h3 className="text-base font-black text-[#2D3436] flex items-center gap-1.5 border-b-2 border-black pb-1.5 uppercase italic">
              🏗️ 등급별 판권 및 제작 단계별 투자금
            </h3>
            <p className="text-xs text-slate-600 font-bold">
              자신의 영화 칸에 재도착할 때마다 한 단계씩 영화를 제작(업그레이드)할 수 있습니다. (한 차례에 1단계씩만 제작 가능)
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
              {/* Grade C */}
              <div className="p-3 bg-white rounded-none border-2 border-black shadow-[3px_3px_0_0_#2D3436]">
                <div className="text-[#2D3436] bg-[#A8E6CF] px-1 border border-black font-black text-center mb-1.5 text-xs">C등급 (애니메이션)</div>
                <div className="space-y-1 text-xs">
                  <p className="font-bold"><span className="text-slate-600">판권료:</span> {formatMoney(MOVIE_GRADES.C.buyPrice)}</p>
                  <p className="font-black text-[#2D3436] mt-1">단계별 추가 제작비:</p>
                  <ul className="list-none pl-1 space-y-0.5 text-slate-600 font-bold">
                    <li>📣 홍보: {formatMoney(MOVIE_GRADES.C.buildCosts[0])}</li>
                    <li>🏛️ 극장: {formatMoney(MOVIE_GRADES.C.buildCosts[1])}</li>
                    <li>📱 OTT: {formatMoney(MOVIE_GRADES.C.buildCosts[2])}</li>
                    <li>👑 프랜: {formatMoney(MOVIE_GRADES.C.buildCosts[3])}</li>
                  </ul>
                </div>
              </div>

              {/* Grade B */}
              <div className="p-3 bg-white rounded-none border-2 border-black shadow-[3px_3px_0_0_#2D3436]">
                <div className="text-[#2D3436] bg-[#FFD93D] px-1 border border-black font-black text-center mb-1.5 text-xs">B등급 (액션/공포)</div>
                <div className="space-y-1 text-xs">
                  <p className="font-bold"><span className="text-slate-600">판권료:</span> {formatMoney(MOVIE_GRADES.B.buyPrice)}</p>
                  <p className="font-black text-[#2D3436] mt-1">단계별 추가 제작비:</p>
                  <ul className="list-none pl-1 space-y-0.5 text-slate-600 font-bold">
                    <li>📣 홍보: {formatMoney(MOVIE_GRADES.B.buildCosts[0])}</li>
                    <li>🏛️ 극장: {formatMoney(MOVIE_GRADES.B.buildCosts[1])}</li>
                    <li>📱 OTT: {formatMoney(MOVIE_GRADES.B.buildCosts[2])}</li>
                    <li>👑 프랜: {formatMoney(MOVIE_GRADES.B.buildCosts[3])}</li>
                  </ul>
                </div>
              </div>

              {/* Grade A */}
              <div className="p-3 bg-white rounded-none border-2 border-black shadow-[3px_3px_0_0_#2D3436]">
                <div className="text-white bg-[#FF6B6B] px-1 border border-black font-black text-center mb-1.5 text-xs">A등급 (대작 블록버스터)</div>
                <div className="space-y-1 text-xs">
                  <p className="font-bold"><span className="text-slate-600">판권료:</span> {formatMoney(MOVIE_GRADES.A.buyPrice)}</p>
                  <p className="font-black text-[#2D3436] mt-1">단계별 추가 제작비:</p>
                  <ul className="list-none pl-1 space-y-0.5 text-slate-600 font-bold">
                    <li>📣 홍보: {formatMoney(MOVIE_GRADES.A.buildCosts[0])}</li>
                    <li>🏛️ 극장: {formatMoney(MOVIE_GRADES.A.buildCosts[1])}</li>
                    <li>📱 OTT: {formatMoney(MOVIE_GRADES.A.buildCosts[2])}</li>
                    <li>👑 프랜: {formatMoney(MOVIE_GRADES.A.buildCosts[3])}</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Rents details */}
          <section className="space-y-2">
            <h3 className="text-base font-black text-[#2D3436] flex items-center gap-1.5 border-b-2 border-black pb-1.5 uppercase italic">
              🎟️ 제작 단계별 관람 수익 (통행료)
            </h3>
            <p className="text-xs text-slate-600 font-bold">
              상대방 소유의 영화 칸에 도달할 시, 영화 제작 단계에 따른 관람 수익을 소유주에게 지불해야 합니다.
            </p>
            <div className="overflow-x-auto border-2 border-black shadow-[3px_3px_0_0_#2D3436]">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#FFD93D] text-[#2D3436] font-black border-b-2 border-black">
                    <th className="p-2 border-r border-black">등급</th>
                    <th className="p-2 border-r border-black">🎬 기본판권</th>
                    <th className="p-2 border-r border-black">📣 홍보단계</th>
                    <th className="p-2 border-r border-black">🏛️ 극장개봉</th>
                    <th className="p-2 border-r border-black">📱 OTT확장</th>
                    <th className="p-2">👑 프랜차이즈</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black font-bold">
                  <tr className="bg-white">
                    <td className="p-2 text-[#2D3436] bg-[#A8E6CF] font-black border-r border-black">C등급</td>
                    <td className="p-2 border-r border-black">{formatMoney(MOVIE_GRADES.C.rents[0])}</td>
                    <td className="p-2 border-r border-black">{formatMoney(MOVIE_GRADES.C.rents[1])}</td>
                    <td className="p-2 border-r border-black">{formatMoney(MOVIE_GRADES.C.rents[2])}</td>
                    <td className="p-2 border-r border-black">{formatMoney(MOVIE_GRADES.C.rents[3])}</td>
                    <td className="p-2 text-[#FF6B6B] font-black">{formatMoney(MOVIE_GRADES.C.rents[4])}</td>
                  </tr>
                  <tr className="bg-slate-50">
                    <td className="p-2 text-[#2D3436] bg-[#FFD93D] font-black border-r border-black">B등급</td>
                    <td className="p-2 border-r border-black">{formatMoney(MOVIE_GRADES.B.rents[0])}</td>
                    <td className="p-2 border-r border-black">{formatMoney(MOVIE_GRADES.B.rents[1])}</td>
                    <td className="p-2 border-r border-black">{formatMoney(MOVIE_GRADES.B.rents[2])}</td>
                    <td className="p-2 border-r border-black">{formatMoney(MOVIE_GRADES.B.rents[3])}</td>
                    <td className="p-2 text-[#FF6B6B] font-black">{formatMoney(MOVIE_GRADES.B.rents[4])}</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="p-2 text-white bg-[#FF6B6B] font-black border-r border-black">A등급</td>
                    <td className="p-2 border-r border-black">{formatMoney(MOVIE_GRADES.A.rents[0])}</td>
                    <td className="p-2 border-r border-black">{formatMoney(MOVIE_GRADES.A.rents[1])}</td>
                    <td className="p-2 border-r border-black">{formatMoney(MOVIE_GRADES.A.rents[2])}</td>
                    <td className="p-2 border-r border-black">{formatMoney(MOVIE_GRADES.A.rents[3])}</td>
                    <td className="p-2 text-[#FF6B6B] font-black">{formatMoney(MOVIE_GRADES.A.rents[4])}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Special Tiles */}
          <section className="space-y-2">
            <h3 className="text-base font-black text-[#2D3436] flex items-center gap-1.5 border-b-2 border-black pb-1.5 uppercase italic">
              🎭 특수한 영역 규칙
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-bold">
              <div className="flex gap-2.5 p-3 bg-white border-2 border-black shadow-[3px_3px_0_0_#2D3436]">
                <Award className="w-5 h-5 text-[#FFD93D] shrink-0" />
                <div>
                  <h4 className="font-black text-[#2D3436] uppercase italic">영화제 휴게실 (세금 금고)</h4>
                  <p className="text-slate-600 mt-1">
                    플레이어들이 '제작비 초과 세금' 이나 '저작권 침해 벌금' 등의 칸에 걸려서 납부한 세금은 모두 영화제 휴게실 금고에 차곡차곡 모입니다. 이 휴게실 칸에 정확히 도착하는 플레이어는 금고에 누적되어 있는 **모든 세금 지원금을 단번에 수령**합니다!
                  </p>
                </div>
              </div>

              <div className="flex gap-2.5 p-3 bg-white border-2 border-black shadow-[3px_3px_0_0_#2D3436]">
                <Clapperboard className="w-5 h-5 text-[#FF6B6B] shrink-0" />
                <div>
                  <h4 className="font-black text-[#2D3436] uppercase italic">촬영 지연 (휴식)</h4>
                  <p className="text-slate-600 mt-1">
                    이곳에 갇히면 주사위를 굴리기 전 **50만 원의 지연 수습비를 납부하고 탈출**하거나, 주사위를 던져 **더블(동일 숫자)**이 나오면 즉시 무료로 탈출하여 주사위 눈만큼 즉시 전진합니다. 그렇지 못하면 최대 1회 차례를 쉽니다.
                  </p>
                </div>
              </div>

              <div className="flex gap-2.5 p-3 bg-white border-2 border-black shadow-[3px_3px_0_0_#2D3436]">
                <Plane className="w-5 h-5 text-[#4ECDC4] shrink-0" />
                <div>
                  <h4 className="font-black text-[#2D3436] uppercase italic">국제 영화제 초청 (자유 비행)</h4>
                  <p className="text-slate-600 mt-1">
                    영화제 전세기를 타고 날아갈 기회입니다. 다음 턴이 시작되면 보드판 위의 **어떤 칸이든 원하는 칸을 마우스로 클릭하여 즉시 날아갈 수 있습니다.** 출발선(0번)을 지나쳐 가게 되면 보너스 200만 원도 정상적으로 받습니다!
                  </p>
                </div>
              </div>

              <div className="flex gap-2.5 p-3 bg-white border-2 border-black shadow-[3px_3px_0_0_#2D3436]">
                <Sparkles className="w-5 h-5 text-[#FF6B6B] shrink-0" />
                <div>
                  <h4 className="font-black text-[#2D3436] uppercase italic">시사회 카드 (찬스)</h4>
                  <p className="text-slate-600 mt-1">
                    '천만 영화 흥행', 'PPL 스폰서십 유치' 같은 대박 찬스부터, 'CG 제작비 초과 수수료', '주연 배우 스캔들 수습' 등 영화 업계에서만 발생할 수 있는 독특하고 긴박한 상황들을 무작위로 마주하게 됩니다.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Special Tourism / Distribution Networks */}
          <section className="space-y-2">
            <h3 className="text-base font-black text-[#2D3436] flex items-center gap-1.5 border-b-2 border-black pb-1.5 uppercase italic">
              🌐 시네마 특별 거점 (독립영화 제작소 / 할리우드 빌리지 등)
            </h3>
            <p className="text-xs text-slate-600 font-bold leading-relaxed">
              보드판 사방의 중심에 위치한 4개의 특별 거점(독립영화 제작소, 글로벌 배급 네트워크, 할리우드 빌리지, 시네마 스트리밍 본부)은 업그레이드가 불가능한 대신, **소유한 특별 거점 개수**에 비례해 수익(통행료)이 엄청나게 상승하는 시네마 요충지입니다.
            </p>
            <ul className="list-disc pl-5 text-xs text-slate-700 font-bold space-y-1">
              <li>특별 거점 판권 비용: 각 **80만 원** (투자 단계 없음)</li>
              <li>관람 수익: 1개 소유 시 **10만 원** | 2개 소유 시 **25만 원** | 3개 소유 시 **50만 원** | 4개 모두 소유 시 **100만 원**</li>
            </ul>
          </section>
        </div>

        {/* Footer */}
        <div className="p-5 border-t-4 border-black flex justify-end bg-[#FFFBEB]">
          <button
            onClick={onClose}
            className="px-6 py-2.5 border-2 border-black bg-[#4ECDC4] text-[#2D3436] font-black uppercase italic shadow-[3px_3px_0_0_#000] hover:bg-teal-400 transition-all cursor-pointer active:translate-y-[1px]"
          >
            영화사 경영 투입하기!
          </button>
        </div>
      </div>
    </div>
  );
};
