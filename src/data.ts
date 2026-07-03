/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Tile, PremiereCard } from './types';

export const MOVIE_GRADES = {
  C: {
    buyPrice: 600000,
    buildCosts: [200000, 300000, 400000, 600000], // Level 1 (홍보), 2 (극장개봉), 3 (OTT확장), 4 (프랜차이즈)
    rents: [40000, 100000, 300000, 700000, 1200000], // Level 0 (판권), 1, 2, 3, 4
  },
  B: {
    buyPrice: 1000000,
    buildCosts: [300000, 500000, 700000, 1000000],
    rents: [80000, 220000, 600000, 1400000, 2400000],
  },
  A: {
    buyPrice: 1600000,
    buildCosts: [500000, 800000, 1200000, 1600000],
    rents: [150000, 450000, 1200000, 2800000, 4500000],
  },
};

export const BOARD_LAYOUT: Tile[] = [
  { id: 0, name: '출발선', type: 'START', price: 2000000 },
  { id: 1, name: '토이 어드벤처', type: 'MOVIE', grade: 'C', genre: '애니메이션', price: 600000, upgradeCosts: MOVIE_GRADES.C.buildCosts, rents: MOVIE_GRADES.C.rents },
  { id: 2, name: '시사회 카드', type: 'CARD' },
  { id: 3, name: '바다 탐험대', type: 'MOVIE', grade: 'C', genre: '가족', price: 600000, upgradeCosts: MOVIE_GRADES.C.buildCosts, rents: MOVIE_GRADES.C.rents },
  { id: 4, name: '제작비 초과 세금', type: 'TAX', price: 500000 },
  { id: 5, name: '독립영화 제작소', type: 'MOVIE', grade: 'SPECIAL', genre: '시네마 지원', price: 800000 },
  { id: 6, name: '괴도와 보석상자', type: 'MOVIE', grade: 'B', genre: '범죄/스릴러', price: 1000000, upgradeCosts: MOVIE_GRADES.B.buildCosts, rents: MOVIE_GRADES.B.rents },
  { id: 7, name: '시사회 카드', type: 'CARD' },
  { id: 8, name: '스파이 마스터', type: 'MOVIE', grade: 'B', genre: '액션', price: 1000000, upgradeCosts: MOVIE_GRADES.B.buildCosts, rents: MOVIE_GRADES.B.rents },
  { id: 9, name: '서대문 로맨스', type: 'MOVIE', grade: 'C', genre: '드라마', price: 600000, upgradeCosts: MOVIE_GRADES.C.buildCosts, rents: MOVIE_GRADES.C.rents },
  { id: 10, name: '촬영 지연', type: 'SKIP' },
  { id: 11, name: '몬스터 패밀리', type: 'MOVIE', grade: 'C', genre: '코미디', price: 600000, upgradeCosts: MOVIE_GRADES.C.buildCosts, rents: MOVIE_GRADES.C.rents },
  { id: 12, name: '시사회 카드', type: 'CARD' },
  { id: 13, name: '정글의 법칙', type: 'MOVIE', grade: 'C', genre: '모험', price: 600000, upgradeCosts: MOVIE_GRADES.C.buildCosts, rents: MOVIE_GRADES.C.rents },
  { id: 14, name: '펫 시티', type: 'MOVIE', grade: 'C', genre: '애니메이션', price: 600000, upgradeCosts: MOVIE_GRADES.C.buildCosts, rents: MOVIE_GRADES.C.rents },
  { id: 15, name: '글로벌 배급 네트워크', type: 'MOVIE', grade: 'SPECIAL', genre: '배급 거점', price: 800000 },
  { id: 16, name: '쉐도우 체이서', type: 'MOVIE', grade: 'B', genre: '미스터리', price: 1000000, upgradeCosts: MOVIE_GRADES.B.buildCosts, rents: MOVIE_GRADES.B.rents },
  { id: 17, name: '시사회 카드', type: 'CARD' },
  { id: 18, name: '고스트 하우스', type: 'MOVIE', grade: 'B', genre: '공포', price: 1000000, upgradeCosts: MOVIE_GRADES.B.buildCosts, rents: MOVIE_GRADES.B.rents },
  { id: 19, name: '코드네임 X', type: 'MOVIE', grade: 'B', genre: '느와르', price: 1000000, upgradeCosts: MOVIE_GRADES.B.buildCosts, rents: MOVIE_GRADES.B.rents },
  { id: 20, name: '황금종려상 휴게실', type: 'DONATION_REST' },
  { id: 21, name: '타임 패러독스', type: 'MOVIE', grade: 'A', genre: 'SF/판타지', price: 1600000, upgradeCosts: MOVIE_GRADES.A.buildCosts, rents: MOVIE_GRADES.A.rents },
  { id: 22, name: '시사회 카드', type: 'CARD' },
  { id: 23, name: '스페이스 오디세이', type: 'MOVIE', grade: 'A', genre: 'SF', price: 1600000, upgradeCosts: MOVIE_GRADES.A.buildCosts, rents: MOVIE_GRADES.A.rents },
  { id: 24, name: '사이버 펑크', type: 'MOVIE', grade: 'A', genre: 'SF/스릴러', price: 1600000, upgradeCosts: MOVIE_GRADES.A.buildCosts, rents: MOVIE_GRADES.A.rents },
  { id: 25, name: '할리우드 빌리지', type: 'MOVIE', grade: 'SPECIAL', genre: '글로벌 스튜디오', price: 800000 },
  { id: 26, name: '엠페러', type: 'MOVIE', grade: 'A', genre: '대하역사', price: 1600000, upgradeCosts: MOVIE_GRADES.A.buildCosts, rents: MOVIE_GRADES.A.rents },
  { id: 27, name: '다크 나이트', type: 'MOVIE', grade: 'A', genre: '히어로 액션', price: 1600000, upgradeCosts: MOVIE_GRADES.A.buildCosts, rents: MOVIE_GRADES.A.rents },
  { id: 28, name: '시사회 카드', type: 'CARD' },
  { id: 29, name: '은하철도 2026', type: 'MOVIE', grade: 'A', genre: '애니메이션', price: 1600000, upgradeCosts: MOVIE_GRADES.A.buildCosts, rents: MOVIE_GRADES.A.rents },
  { id: 30, name: '국제 영화제 초청', type: 'TRAVEL' },
  { id: 31, name: '레트로 멜로', type: 'MOVIE', grade: 'B', genre: '로맨스', price: 1000000, upgradeCosts: MOVIE_GRADES.B.buildCosts, rents: MOVIE_GRADES.B.rents },
  { id: 32, name: '청춘 스케치', type: 'MOVIE', grade: 'B', genre: '드라마', price: 1000000, upgradeCosts: MOVIE_GRADES.B.buildCosts, rents: MOVIE_GRADES.B.rents },
  { id: 33, name: '시사회 카드', type: 'CARD' },
  { id: 34, name: '수상한 패밀리', type: 'MOVIE', grade: 'B', genre: '코미디', price: 1000000, upgradeCosts: MOVIE_GRADES.B.buildCosts, rents: MOVIE_GRADES.B.rents },
  { id: 35, name: '시네마 스트리밍 본부', type: 'MOVIE', grade: 'SPECIAL', genre: '플랫폼', price: 800000 },
  { id: 36, name: '시사회 카드', type: 'CARD' },
  { id: 37, name: '사하라의 불꽃', type: 'MOVIE', grade: 'A', genre: '모험/액션', price: 1600000, upgradeCosts: MOVIE_GRADES.A.buildCosts, rents: MOVIE_GRADES.A.rents },
  { id: 38, name: '저작권 침해 벌금', type: 'TAX', price: 800000 },
  { id: 39, name: '라스트 엠파이어', type: 'MOVIE', grade: 'A', genre: '재난 블록버스터', price: 1600000, upgradeCosts: MOVIE_GRADES.A.buildCosts, rents: MOVIE_GRADES.A.rents },
];

export const PREMIERE_CARDS: PremiereCard[] = [
  {
    id: 1,
    title: '천만 관객 신화!',
    description: '작품이 신드롬을 일으키며 관객수 천만을 돌파했습니다! 영화 진흥금 200만 원을 획득합니다.',
    effect: (player) => ({ moneyChange: 2000000, message: '🎬 천만 관객 신화 달성! 제작 지원금 +2,000,000원' }),
  },
  {
    id: 2,
    title: 'OTT 동시 개봉 대성공',
    description: '글로벌 스트리밍 플랫폼에서 1위를 차지했습니다. 수익금 100만 원을 정산 받습니다.',
    effect: (player) => ({ moneyChange: 1000000, message: '📱 OTT 글로벌 1위 달성! 수익 정산 +1,000,000원' }),
  },
  {
    id: 3,
    title: 'CG 및 특수효과 초과 지출',
    description: '재촬영과 CG 완성도를 높이기 위해 추가 제작비가 대폭 투입되었습니다. 제작 비용 60만 원을 지출합니다.',
    effect: (player) => ({ moneyChange: -600000, message: '💥 CG 특수효과 제작비 초과! 지출 -600,000원' }),
  },
  {
    id: 4,
    title: '영화제 최고 작품상 수상',
    description: '평단의 엄청난 극찬과 함께 최고 작품상을 수상했습니다. 상금 150만 원을 받습니다.',
    effect: (player) => ({ moneyChange: 1500000, message: '🏆 황금종려상 작품상 수상! 상금 +1,500,000원' }),
  },
  {
    id: 5,
    title: '네티즌 별점 테러',
    description: '악의적인 평점 왜곡과 관람평 테러로 인해 극장 손실이 발생했습니다. 40만 원을 잃습니다.',
    effect: (player) => ({ moneyChange: -400000, message: '⭐ 악성 리뷰 및 별점 테러! 손실 -400,000원' }),
  },
  {
    id: 6,
    title: '글로벌 판권 역수출',
    description: '해외 100개국 선판매에 성공하여 엄청난 판권 로열티를 얻었습니다. 250만 원을 획득합니다.',
    effect: (player) => ({ moneyChange: 2500000, message: '🌍 해외 판권 100개국 선판매! 수입 +2,500,000원' }),
  },
  {
    id: 7,
    title: '할리우드 제작진 러브콜',
    description: '글로벌 거장 감독과의 공동 제작 파트너십을 체결했습니다. 투자 유치금 120만 원을 얻습니다.',
    effect: (player) => ({ moneyChange: 1200000, message: '✨ 글로벌 합작 파트너십 체결! 투자금 +1,200,000원' }),
  },
  {
    id: 8,
    title: '영화 배급 사기 연루',
    description: '가짜 배급 대행사에 속아 계약금 일부를 유실했습니다. 배급 사기 손실 80만 원.',
    effect: (player) => ({ moneyChange: -800000, message: '⚠️ 배급 대행 사기 피해! 손해 -800,000원' }),
  },
  {
    id: 9,
    title: '국제 영화제 강제 초청',
    description: '급하게 국제 영화제 개막작으로 선정되어 영화제 현장으로 즉시 날아갑니다!',
    effect: (player) => ({ moneyChange: 0, message: '✈️ 국제 영화제 개막작 초청! 영화제 칸으로 강제 이동합니다.', moveDestination: 30 }),
  },
  {
    id: 10,
    title: '촬영 지연 현장 지원',
    description: '현장의 촬영 지연을 수습하기 위해 즉시 촬영 현장(촬영 지연 칸)으로 파견을 떠납니다.',
    effect: (player) => ({ moneyChange: 0, message: '⏳ 현장 트러블 수습 파견! 촬영 지연 칸으로 이동합니다.', moveDestination: 10 }),
  },
  {
    id: 11,
    title: '대기업 스폰서십 체결',
    description: '식품 및 자동차 대기업과 공식 PPL 및 브랜드 스폰서십을 체결하였습니다. 지원금 100만 원.',
    effect: (player) => ({ moneyChange: 1000000, message: '🚗 대기업 PPL 및 스폰서 체결! 후원금 +1,000,000원' }),
  },
  {
    id: 12,
    title: '티켓 파워 배우 스캔들',
    description: '주연 배우의 돌발 행동과 스캔들로 인해 개봉 일정이 취소될 위기에 처했습니다. 수습 비용 50만 원.',
    effect: (player) => ({ moneyChange: -500000, message: '🚨 배우 사생활 스캔들 수습 비용 발생! 지출 -500,000원' }),
  },
];
