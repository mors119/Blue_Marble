import { Tile } from '../types';

export function formatMoney(amount: number) {
  return `${(amount / 10000).toLocaleString()}만 원`;
}

export function calculateAssetSellValue(tile: Tile, level: number) {
  const buyPrice = tile.price || 0;
  let spentUpgrade = 0;

  if (tile.upgradeCosts && level > 0) {
    for (let i = 0; i < level; i += 1) {
      spentUpgrade += tile.upgradeCosts[i];
    }
  }

  return Math.floor((buyPrice + spentUpgrade) * 0.5);
}
