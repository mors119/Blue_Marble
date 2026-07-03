/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type MovieGrade = 'C' | 'B' | 'A' | 'SPECIAL';

export type TileType = 'START' | 'MOVIE' | 'TAX' | 'SKIP' | 'CARD' | 'TRAVEL' | 'DONATION_REST';

export interface Tile {
  id: number;
  name: string;
  type: TileType;
  grade?: MovieGrade;
  genre?: string;
  price?: number; // buy price or tax amount
  upgradeCosts?: number[]; // level 1, 2, 3, 4 upgrade costs
  rents?: number[]; // level 0, 1, 2, 3, 4 rents
}

export interface Player {
  id: number;
  name: string;
  color: string; // Tailwind class color
  money: number;
  position: number;
  isSkipping: boolean; // filming delay skip status
  skipTurnsLeft: number; // turns remaining in jail
  isAI: boolean;
  isBankrupt: boolean;
  ownedMovies: { [tileId: number]: number }; // tileId -> production level (0 to 4)
}

export interface GameLog {
  id: string;
  playerId?: number;
  message: string;
  timestamp: string;
  type: 'roll' | 'buy' | 'upgrade' | 'rent' | 'tax' | 'card' | 'system' | 'bankrupt' | 'win';
}

export interface PremiereCard {
  id: number;
  title: string;
  description: string;
  effect: (player: Player, gameState: any) => { moneyChange: number; message: string; moveDestination?: number };
}
