/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import { Tile, Player, GameLog, PremiereCard } from './types';
import { BOARD_LAYOUT, PREMIERE_CARDS } from './data';
import { sound } from './utils/audio';
import { PLAYER_COLORS, PLAYER_TEXT_COLORS, UPGRADE_TIER_LABELS } from './constants/game';
import { calculateAssetSellValue, formatMoney } from './utils/game';
import { BoardTile } from './components/BoardTile';
import { DebtModal } from './components/DebtModal';
import { GameCenterPanel } from './components/GameCenterPanel';
import { GameHeader } from './components/GameHeader';
import { RulesModal } from './components/RulesModal';
import { SetupScreen } from './components/SetupScreen';
import { GameLogs } from './components/GameLogs';
import { AssetList } from './components/AssetList';

export default function App() {
  // Game screens: 'setup' or 'play'
  const [gameMode, setGameMode] = useState<'setup' | 'play'>('setup');

  // Base State
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayerIdx, setCurrentPlayerIdx] = useState<number>(0);
  const [taxDonationPool, setTaxDonationPool] = useState<number>(0);
  const [logs, setLogs] = useState<GameLog[]>([]);

  // Dice State
  const [dice1, setDice1] = useState<number>(1);
  const [dice2, setDice2] = useState<number>(1);
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [isMoving, setIsMoving] = useState<boolean>(false);
  const [consecutiveDoubles, setConsecutiveDoubles] = useState<number>(0);

  // Active turn interactive dialogs
  const [activeTileEffect, setActiveTileEffect] = useState<Tile | null>(null);
  const [activeCardDrawn, setActiveCardDrawn] = useState<PremiereCard | null>(null);
  const [rentOwed, setRentOwed] = useState<number>(0);
  const [rentReceiverIdx, setRentReceiverIdx] = useState<number | null>(null);
  const [taxOwed, setTaxOwed] = useState<number>(0);

  // Special actions
  const [isFlyingSelectMode, setIsFlyingSelectMode] = useState<boolean>(false);
  const [isRulesOpen, setIsRulesOpen] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [gameWinner, setGameWinner] = useState<Player | null>(null);

  // AI thinking status indicator
  const [aiThinkingMessage, setAiThinkingMessage] = useState<string>('');

  // Utility to generate a unique log entry
  const addLog = useCallback((playerId: number | undefined, message: string, type: GameLog['type']) => {
    const timestamp = new Date().toLocaleTimeString('ko-KR', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const newLog: GameLog = {
      id: Math.random().toString(36).substr(2, 9),
      playerId,
      message,
      timestamp,
      type,
    };
    setLogs((prev) => [...prev, newLog]);
  }, []);

  // Sound toggling
  const handleToggleSound = () => {
    const nextVal = !soundEnabled;
    setSoundEnabled(nextVal);
    sound.toggle(nextVal);
  };

  // Setup game handler
  const handleSetupGame = (playersConfig: { name: string; isAI: boolean }[], startingMoney: number) => {
    const initialPlayers: Player[] = playersConfig.map((config, idx) => ({
      id: idx,
      name: config.name,
      color: PLAYER_COLORS[idx],
      money: startingMoney,
      position: 0,
      isSkipping: false,
      skipTurnsLeft: 0,
      isAI: config.isAI,
      isBankrupt: false,
      ownedMovies: {},
    }));

    setPlayers(initialPlayers);
    setCurrentPlayerIdx(0);
    setTaxDonationPool(0);
    setLogs([]);
    setGameWinner(null);
    setGameMode('play');

    // Add initial system logs
    setTimeout(() => {
      addLog(undefined, '🎬 영화판 블루마블 시네마 월드에 오신 것을 환영합니다!', 'system');
      addLog(undefined, `💵 각 영화사 마다 초기 예산 ${formatMoney(startingMoney)}이 배정되었습니다.`, 'system');
      addLog(0, `${initialPlayers[0].name} 영화사의 선제작 차례입니다! 주사위를 던져주세요.`, 'system');
      if (soundEnabled) sound.playVictory();
    }, 100);
  };

  // Reset Game
  const handleResetGame = () => {
    if (window.confirm('정말 게임을 초기화하고 첫 설정 화면으로 돌아가시겠습니까?')) {
      setGameMode('setup');
      setPlayers([]);
      setCurrentPlayerIdx(0);
      setTaxDonationPool(0);
      setLogs([]);
      setActiveTileEffect(null);
      setActiveCardDrawn(null);
      setGameWinner(null);
    }
  };

  // Find active owner of a movie space
  const getTileOwner = (tileId: number): Player | null => {
    return players.find((p) => p.ownedMovies[tileId] !== undefined) || null;
  };

  // Step-by-step movement animation
  const animateMoveToPosition = (targetPos: number, callback: () => void) => {
    setIsMoving(true);
    let curPos = players[currentPlayerIdx].position;

    const performStep = () => {
      curPos = (curPos + 1) % 40;

      // Play sound tick
      if (soundEnabled) sound.playDice();

      // Pass START space bonus (and skip adding if landed precisely on 0 since handleTile handles it)
      if (curPos === 0) {
        setPlayers((prev) =>
          prev.map((p, idx) => {
            if (idx === currentPlayerIdx) {
              if (soundEnabled) sound.playCoin();
              addLog(idx, `🎬 출발선을 통과하여 제작 지원금 200만 원을 획득했습니다!`, 'system');
              return { ...p, money: p.money + 2000000 };
            }
            return p;
          })
        );
      }

      setPlayers((prev) =>
        prev.map((p, idx) => {
          if (idx === currentPlayerIdx) {
            return { ...p, position: curPos };
          }
          return p;
        })
      );

      if (curPos !== targetPos) {
        setTimeout(performStep, 150);
      } else {
        setIsMoving(false);
        callback();
      }
    };

    setTimeout(performStep, 150);
  };

  // End active player turn and advance index
  const nextTurn = useCallback(() => {
    // Reset state values
    setActiveTileEffect(null);
    setActiveCardDrawn(null);
    setRentOwed(0);
    setRentReceiverIdx(null);
    setTaxOwed(0);
    setIsFlyingSelectMode(false);

    // Filter out bankrupt players to check for game winner
    const activePlayers = players.filter((p) => !p.isBankrupt);
    if (activePlayers.length === 1) {
      setGameWinner(activePlayers[0]);
      addLog(activePlayers[0].id, `🏆 최후까지 살아남은 ${activePlayers[0].name} 영화사가 시네마 제국 왕좌를 차지했습니다!`, 'win');
      if (soundEnabled) sound.playVictory();
      return;
    }

    // Determine next index
    let nextIdx = (currentPlayerIdx + 1) % players.length;
    while (players[nextIdx].isBankrupt) {
      nextIdx = (nextIdx + 1) % players.length;
    }

    setCurrentPlayerIdx(nextIdx);
    addLog(nextIdx, `${players[nextIdx].name} 영화사의 차례입니다.`, 'system');
  }, [currentPlayerIdx, players, addLog, soundEnabled]);

  // Handle debt / lack of funds check
  const checkDebtOrPay = (player: Player, amount: number, onPaid: (updatedPlayer: Player) => void) => {
    if (player.money >= amount) {
      // Able to pay right away
      const updated = { ...player, money: player.money - amount };
      setPlayers((prev) => prev.map((p) => (p.id === player.id ? updated : p)));
      onPaid(updated);
    } else {
      // Debt status
      const deficit = amount - player.money;
      addLog(player.id, `🚨 예산 부족! 결제 금액(${formatMoney(amount)}) 대비 잔액이 ${formatMoney(player.money)}뿐입니다. 영화 판권을 매각해 현금을 마련하세요!`, 'tax');
      if (soundEnabled) sound.playFail();

      // Trigger AI automatic liquidation helper or set state for human
      if (player.isAI) {
        handleAiAutoLiquidation(player, amount, onPaid);
      } else {
        // Human interactive sell mode
        // Handled in separate state UI inside App render
      }
    }
  };

  // AI auto liquidation logic
  const handleAiAutoLiquidation = (
    aiPlayer: Player,
    debtAmount: number,
    onPaid: (updatedPlayer: Player) => void
  ) => {
    setAiThinkingMessage(`${aiPlayer.name}가 구조 조정을 통해 판권을 매각하고 있습니다...`);
    
    setTimeout(() => {
      let currentMoney = aiPlayer.money;
      const ownedEntries = Object.entries(aiPlayer.ownedMovies).map(([idStr, lvl]) => ({
        tileId: parseInt(idStr, 10),
        level: lvl,
        tile: BOARD_LAYOUT.find((t) => t.id === parseInt(idStr, 10))!,
      }));

      // Sort properties from cheapest to most expensive sell value
      ownedEntries.sort((a, b) => {
        const valA = calculateAssetSellValue(a.tile, a.level);
        const valB = calculateAssetSellValue(b.tile, b.level);
        return valA - valB;
      });

      const updatedOwned = { ...aiPlayer.ownedMovies };

      for (const entry of ownedEntries) {
        if (currentMoney >= debtAmount) break;
        const sellVal = calculateAssetSellValue(entry.tile, entry.level);
        currentMoney += sellVal;
        delete updatedOwned[entry.tileId];
        addLog(
          aiPlayer.id,
          `💸 자금 충당을 위해 [${entry.tile.name}]의 판권을 배급 시장에 긴급 긴급매각했습니다. (+${formatMoney(sellVal)})`,
          'buy'
        );
      }

      setAiThinkingMessage('');

      if (currentMoney >= debtAmount) {
        // Saved from bankruptcy!
        const finalPlayer = {
          ...aiPlayer,
          money: currentMoney - debtAmount,
          ownedMovies: updatedOwned,
        };
        setPlayers((prev) => prev.map((p) => (p.id === aiPlayer.id ? finalPlayer : p)));
        onPaid(finalPlayer);
      } else {
        // Bankruptcy unavoidable!
        handleBankruptPlayer(aiPlayer);
      }
    }, 1500);
  };

  // Bankrupt player and return assets to bank
  const handleBankruptPlayer = (bankruptPlayer: Player) => {
    addLog(bankruptPlayer.id, `💀 영화사 재정 악화로 최종 부도 및 파산(BANKRUPTCY)을 선언했습니다!`, 'bankrupt');
    if (soundEnabled) sound.playFail();

    setPlayers((prev) =>
      prev.map((p) => {
        if (p.id === bankruptPlayer.id) {
          return {
            ...p,
            isBankrupt: true,
            money: 0,
            ownedMovies: {}, // Release all films back to market
          };
        }
        return p;
      })
    );

    // Auto-advance
    setTimeout(() => {
      // Clear active effects
      setActiveTileEffect(null);
      setActiveCardDrawn(null);
      setRentOwed(0);
      setTaxOwed(0);
      setRentReceiverIdx(null);
      
      // Advance turn
      nextTurn();
    }, 2000);
  };

  // Human player manually sells an asset to resolve debt
  const handleHumanSellAsset = (tileId: number) => {
    const player = players[currentPlayerIdx];
    const level = player.ownedMovies[tileId];
    if (level === undefined) return;

    const tile = BOARD_LAYOUT.find((t) => t.id === tileId)!;
    const sellValue = calculateAssetSellValue(tile, level);

    const updatedOwned = { ...player.ownedMovies };
    delete updatedOwned[tileId];

    const updatedPlayer = {
      ...player,
      money: player.money + sellValue,
      ownedMovies: updatedOwned,
    };

    setPlayers((prev) => prev.map((p) => (p.id === player.id ? updatedPlayer : p)));
    addLog(player.id, `💸 자금 확보를 위해 [${tile.name}] 판권을 긴급 매각 처분했습니다. (+${formatMoney(sellValue)})`, 'buy');
    if (soundEnabled) sound.playCoin();
  };

  // Handle landing on movie tile
  const handleMovieTile = (player: Player, tile: Tile) => {
    const owner = getTileOwner(tile.id);
    const cost = tile.price || 0;

    if (!owner) {
      // Unowned: prompt buy
      setActiveTileEffect(tile);
    } else if (owner.id === player.id) {
      // Owned by self: prompt upgrade (if regular movie and level < 4)
      if (tile.grade !== 'SPECIAL' && player.ownedMovies[tile.id] < 4) {
        setActiveTileEffect(tile);
      } else {
        // Max upgrade or special spot with no upgrade path
        addLog(player.id, `🏰 [${tile.name}]는 이미 완벽히 제작 완료된 본사의 메인 프로젝트입니다.`, 'system');
        setTimeout(nextTurn, 1500);
      }
    } else {
      // Owned by another player: Rent owed!
      const level = owner.ownedMovies[tile.id];
      let rent = 0;

      if (tile.grade === 'SPECIAL') {
        // Special tourism spot multiplier
        const totalSpecialsOwned = Object.keys(owner.ownedMovies).filter((tIdStr) => {
          const tId = parseInt(tIdStr, 10);
          return BOARD_LAYOUT.find((t) => t.id === tId)?.grade === 'SPECIAL';
        }).length;

        const specialRents = [100000, 250000, 500000, 1000000];
        rent = specialRents[Math.max(0, Math.min(totalSpecialsOwned - 1, 3))];
      } else {
        rent = tile.rents ? tile.rents[level] : 0;
      }

      setRentOwed(rent);
      setRentReceiverIdx(owner.id);
      setActiveTileEffect(tile);
    }
  };

  // Resolve paying rent to another player
  const handlePayRent = () => {
    const payer = players[currentPlayerIdx];
    if (rentReceiverIdx === null) return;
    const receiver = players[rentReceiverIdx];

    checkDebtOrPay(payer, rentOwed, (updatedPayer) => {
      // Payment successful
      setPlayers((prev) =>
        prev.map((p) => {
          if (p.id === receiver.id) {
            return { ...p, money: p.money + rentOwed };
          }
          return p;
        })
      );

      addLog(payer.id, `🎟️ ${receiver.name} 제작사에 [${activeTileEffect?.name}] 관람 수익으로 ${formatMoney(rentOwed)}을 송금 지불했습니다.`, 'rent');
      if (soundEnabled) sound.playCoin();

      setTimeout(nextTurn, 1500);
    });
  };

  // Handle landing on tax tile
  const handleTaxTile = (player: Player, tile: Tile) => {
    const tax = tile.price || 0;
    setTaxOwed(tax);
    setActiveTileEffect(tile);
  };

  // Resolve tax payment
  const handlePayTax = () => {
    const payer = players[currentPlayerIdx];
    const tax = taxOwed;

    checkDebtOrPay(payer, tax, (updatedPayer) => {
      // Paid! Add to Film Foundation tax pool
      setTaxDonationPool((prev) => prev + tax);
      addLog(payer.id, `💸 세금 납부처 [${activeTileEffect?.name}]에 영화 상생 기금 ${formatMoney(tax)}을 성공적으로 납부했습니다.`, 'tax');
      if (soundEnabled) sound.playCoin();

      setTimeout(nextTurn, 1500);
    });
  };

  // Resolve drawing Premiere Card
  const drawPremiereCard = (player: Player) => {
    const randomCard = PREMIERE_CARDS[Math.floor(Math.random() * PREMIERE_CARDS.length)];
    setActiveCardDrawn(randomCard);
    setActiveTileEffect(BOARD_LAYOUT[player.position]);
  };

  // Apply card drawn effect
  const handleApplyCardEffect = () => {
    if (!activeCardDrawn) return;
    const player = players[currentPlayerIdx];
    const effectResult = activeCardDrawn.effect(player, null);

    // Apply immediate money change
    if (effectResult.moneyChange !== 0) {
      checkDebtOrPay(player, -effectResult.moneyChange, (updatedPlayer) => {
        addLog(player.id, effectResult.message, 'card');
        
        // If card also triggers movement redirection
        if (effectResult.moveDestination !== undefined) {
          handleCardMovement(effectResult.moveDestination);
        } else {
          setTimeout(nextTurn, 1500);
        }
      });
    } else {
      addLog(player.id, effectResult.message, 'card');

      // If card triggers movement redirection
      if (effectResult.moveDestination !== undefined) {
        handleCardMovement(effectResult.moveDestination);
      } else {
        setTimeout(nextTurn, 1500);
      }
    }
  };

  // Handle movement triggered from card effects (Jail, festival, etc.)
  const handleCardMovement = (dest: number) => {
    setActiveCardDrawn(null);
    setActiveTileEffect(null);

    setTimeout(() => {
      animateMoveToPosition(dest, () => {
        const player = players[currentPlayerIdx];
        const tile = BOARD_LAYOUT[dest];

        if (dest === 10) {
          // Sent to jail
          setPlayers((prev) =>
            prev.map((p, idx) => {
              if (idx === currentPlayerIdx) {
                return { ...p, isSkipping: true, skipTurnsLeft: 1 };
              }
              return p;
            })
          );
          addLog(player.id, `⏳ 현장 리스크 촬영 지연으로 인해 1회 강제 휴식에 돌입합니다.`, 'system');
          setTimeout(nextTurn, 1500);
        } else {
          // Landed elsewhere
          handleTileLanding(player, tile);
        }
      });
    }, 800);
  };

  // Core tile landing dispatch engine
  const handleTileLanding = (player: Player, tile: Tile) => {
    addLog(player.id, `📍 [${tile.name}] 칸에 무사히 도착하여 필드 수습을 진행합니다.`, 'system');

    switch (tile.type) {
      case 'START':
        addLog(player.id, '🎬 출발선에 정착했습니다! 다음 바퀴 개봉을 준비합니다.', 'system');
        setTimeout(nextTurn, 1500);
        break;

      case 'SKIP':
        // Landed on delay space
        setPlayers((prev) =>
          prev.map((p, idx) => {
            if (idx === currentPlayerIdx) {
              return { ...p, isSkipping: true, skipTurnsLeft: 1 };
            }
            return p;
          })
        );
        addLog(player.id, `⏳ 감독/스태프 피로 및 시나리오 수정 지연으로 인해 촬영지연(1회 휴식)에 돌입합니다.`, 'system');
        setTimeout(nextTurn, 1500);
        break;

      case 'DONATION_REST':
        // Retrieve tax donation pool
        if (taxDonationPool > 0) {
          setPlayers((prev) =>
            prev.map((p, idx) => {
              if (idx === currentPlayerIdx) {
                return { ...p, money: p.money + taxDonationPool };
              }
              return p;
            })
          );
          addLog(player.id, `🏆 경축! 황금종려상 휴게실에 축하 방문하여 영화 기금 지원금 ${formatMoney(taxDonationPool)}을 단번에 수령 받았습니다!`, 'system');
          setTaxDonationPool(0);
          if (soundEnabled) sound.playVictory();
        } else {
          addLog(player.id, '🍿 영화제 휴게실에서 달콤한 팝콘을 씹으며 잠깐의 온전한 휴식을 가집니다.', 'system');
        }
        setTimeout(nextTurn, 1500);
        break;

      case 'TRAVEL':
        // Travel invitation flight: set up flag
        addLog(player.id, `✈️ 글로벌 국제 영화제(칸, 베니스) 공식 초청! 다음 차례에 원하는 임의의 칸으로 즉시 날아갑니다!`, 'system');
        setTimeout(nextTurn, 1500);
        break;

      case 'TAX':
        handleTaxTile(player, tile);
        break;

      case 'CARD':
        drawPremiereCard(player);
        break;

      case 'MOVIE':
        handleMovieTile(player, tile);
        break;
    }
  };

  // Buy movie right action
  const handleBuyMovieRight = () => {
    const player = players[currentPlayerIdx];
    const tile = activeTileEffect;
    if (!tile || !tile.price) return;

    if (player.money >= tile.price) {
      const updatedPlayer = {
        ...player,
        money: player.money - tile.price,
        ownedMovies: {
          ...player.ownedMovies,
          [tile.id]: 0, // Level 0 purchased
        },
      };

      setPlayers((prev) => prev.map((p) => (p.id === player.id ? updatedPlayer : p)));
      addLog(player.id, `🎬 [${tile.name}] 영화 판권을 대리점 계약 체결하여 인수 완료했습니다! (-${formatMoney(tile.price)})`, 'buy');
      if (soundEnabled) sound.playCoin();

      setTimeout(nextTurn, 1200);
    } else {
      alert('예산이 부족하여 판권을 취득할 수 없습니다.');
    }
  };

  // Upgrade movie development tier
  const handleUpgradeMovie = () => {
    const player = players[currentPlayerIdx];
    const tile = activeTileEffect;
    if (!tile || tile.upgradeCosts === undefined) return;

    const currentLevel = player.ownedMovies[tile.id];
    const upgradeCost = tile.upgradeCosts[currentLevel];

    if (player.money >= upgradeCost) {
      const updatedPlayer = {
        ...player,
        money: player.money - upgradeCost,
        ownedMovies: {
          ...player.ownedMovies,
          [tile.id]: currentLevel + 1, // Advance level
        },
      };

      setPlayers((prev) => prev.map((p) => (p.id === player.id ? updatedPlayer : p)));

      addLog(
        player.id,
        `🏗️ [${tile.name}]를 '${UPGRADE_TIER_LABELS[currentLevel]}' 투자 완성 단계로 업그레이드하였습니다! (-${formatMoney(upgradeCost)})`,
        'upgrade'
      );
      if (soundEnabled) sound.playUpgrade();

      setTimeout(nextTurn, 1200);
    } else {
      alert('예산이 부족하여 영화 업그레이드를 중단합니다.');
    }
  };

  // Roll Slate Dice trigger
  const handleRollDice = () => {
    if (isRolling || isMoving || gameWinner) return;

    setIsRolling(true);
    if (soundEnabled) sound.playDice();

    // Reset temporary effect states
    setActiveTileEffect(null);
    setActiveCardDrawn(null);

    // Dynamic fake rolling effect delay
    setTimeout(() => {
      const r1 = Math.floor(Math.random() * 6) + 1;
      const r2 = Math.floor(Math.random() * 6) + 1;

      setDice1(r1);
      setDice2(r2);
      setIsRolling(false);

      const diceSum = r1 + r2;
      const isDouble = r1 === r2;

      const player = players[currentPlayerIdx];
      addLog(player.id, `🎲 주사위 슬레이트 격하게 찰칵! [${r1}, ${r2}] (합 ${diceSum})이(가) 기록되었습니다.`, 'roll');

      // Check consecutive doubles
      let nextDoubleCount = isDouble ? consecutiveDoubles + 1 : 0;
      setConsecutiveDoubles(nextDoubleCount);

      if (nextDoubleCount === 3) {
        addLog(player.id, `🚨 3회 연속 주사위 더블 발생! 영화 과열 제작 혐의로 즉시 촬영 지연 현장으로 긴급 연행됩니다!`, 'system');
        setConsecutiveDoubles(0);
        
        // Immediate send to jail
        animateMoveToPosition(10, () => {
          setPlayers((prev) =>
            prev.map((p, idx) => {
              if (idx === currentPlayerIdx) {
                return { ...p, isSkipping: true, skipTurnsLeft: 1, position: 10 };
              }
              return p;
            })
          );
          setTimeout(nextTurn, 1500);
        });
        return;
      }

      // Handle character step-by-step movement
      const startPos = player.position;
      const targetPos = (startPos + diceSum) % 40;

      animateMoveToPosition(targetPos, () => {
        const landedTile = BOARD_LAYOUT[targetPos];
        handleTileLanding(player, landedTile);
      });
    }, 1200);
  };

  // Handle escape checks when beginning turn in Delay
  const handlePayEscapeDelay = () => {
    const player = players[currentPlayerIdx];
    const fee = 500000;

    if (player.money >= fee) {
      setPlayers((prev) =>
        prev.map((p, idx) => {
          if (idx === currentPlayerIdx) {
            return { ...p, money: p.money - fee, isSkipping: false, skipTurnsLeft: 0 };
          }
          return p;
        })
      );
      addLog(player.id, `💸 지연 수습 기금 ${formatMoney(fee)}을 즉시 지급하고 대기실 탈출을 완수했습니다!`, 'system');
      if (soundEnabled) sound.playCoin();
    } else {
      alert('보유 예산이 충분하지 않아 탈출금 지출이 거절되었습니다.');
    }
  };

  const handleRollEscapeDelay = () => {
    setIsRolling(true);
    if (soundEnabled) sound.playDice();

    setTimeout(() => {
      const r1 = Math.floor(Math.random() * 6) + 1;
      const r2 = Math.floor(Math.random() * 6) + 1;

      setDice1(r1);
      setDice2(r2);
      setIsRolling(false);

      const isDouble = r1 === r2;
      const player = players[currentPlayerIdx];

      addLog(player.id, `⏳ 탈출 주사위 시도: [${r1}, ${r2}] 굴림.`, 'roll');

      if (isDouble) {
        addLog(player.id, `🎉 주사위 더블 성공! 촬영장 복구 및 즉시 무상 탈출하여 ${r1 + r2}칸만큼 이동합니다.`, 'system');
        setPlayers((prev) =>
          prev.map((p, idx) => {
            if (idx === currentPlayerIdx) {
              return { ...p, isSkipping: false, skipTurnsLeft: 0 };
            }
            return p;
          })
        );

        const targetPos = (player.position + r1 + r2) % 40;
        animateMoveToPosition(targetPos, () => {
          const landedTile = BOARD_LAYOUT[targetPos];
          handleTileLanding(player, landedTile);
        });
      } else {
        addLog(player.id, `😢 탈출 실패! 주사위가 일치하지 않습니다. 다음 차례를 기약합니다.`, 'system');
        setPlayers((prev) =>
          prev.map((p, idx) => {
            if (idx === currentPlayerIdx) {
              return { ...p, isSkipping: false, skipTurnsLeft: 0 }; // Released on next turn
            }
            return p;
          })
        );
        setTimeout(nextTurn, 1500);
      }
    }, 1200);
  };

  // Flying choice click handler (Travel)
  const handleFestivalTileSelect = (targetTileId: number) => {
    if (!isFlyingSelectMode) return;
    
    setIsFlyingSelectMode(false);
    const player = players[currentPlayerIdx];
    const startPos = player.position;

    // Check if flight passes START (index 0)
    const passedStart = targetTileId < startPos;

    addLog(player.id, `✈️ 국제영화제 주최 전세기 기수를 돌려 [${BOARD_LAYOUT[targetTileId].name}]로 슝 날아갑니다!`, 'system');

    // Smooth single step jump with flight sound
    if (soundEnabled) sound.playVictory();

    setTimeout(() => {
      setPlayers((prev) =>
        prev.map((p, idx) => {
          if (idx === currentPlayerIdx) {
            let moneyBonus = p.money;
            if (passedStart && targetTileId !== 0) {
              moneyBonus += 2000000;
              addLog(idx, `🎬 비행 중 출발선을 횡단하여 제작 지원금 200만 원 보너스를 무상 수령합니다.`, 'system');
              if (soundEnabled) sound.playCoin();
            }
            return { ...p, position: targetTileId, money: moneyBonus };
          }
          return p;
        })
      );

      setTimeout(() => {
        const landedTile = BOARD_LAYOUT[targetTileId];
        handleTileLanding(player, landedTile);
      }, 300);
    }, 500);
  };

  // AI Game Decisions Automator Hook
  useEffect(() => {
    if (gameMode !== 'play' || isRolling || isMoving || gameWinner || activeCardDrawn) return;

    const activePlayer = players[currentPlayerIdx];
    if (!activePlayer || !activePlayer.isAI) return;

    // 1. AI is in jail (촬영 지연)
    if (activePlayer.position === 10 && activePlayer.isSkipping) {
      setAiThinkingMessage(`${activePlayer.name}가 대기실 리스크를 수습하는 방향을 고민하고 있습니다...`);
      setTimeout(() => {
        setAiThinkingMessage('');
        if (activePlayer.money >= 3500000) {
          // If wealthy, pay to skip delay
          handlePayEscapeDelay();
        } else {
          // Else try rolling
          handleRollEscapeDelay();
        }
      }, 1500);
      return;
    }

    // 2. AI landed on International Film Festival (국제 영화제) and needs to choose destination
    if (activePlayer.position === 30 && !isFlyingSelectMode && !activeTileEffect) {
      // Trigger fly mode flag
      setIsFlyingSelectMode(true);
      setAiThinkingMessage(`${activePlayer.name}가 베니스 영화제 초청지를 신중하게 선택하고 있습니다...`);
      
      setTimeout(() => {
        setAiThinkingMessage('');
        
        // AI selects best available movie to buy, prioritizing Grade A, then B, then C
        const unownedMovies = BOARD_LAYOUT.filter((tile) => {
          if (tile.type !== 'MOVIE') return false;
          const owner = getTileOwner(tile.id);
          return owner === null;
        });

        let targetTileId = 0; // Default fallback to START

        if (unownedMovies.length > 0) {
          // Sort by highest buy price
          unownedMovies.sort((a, b) => (b.price || 0) - (a.price || 0));
          targetTileId = unownedMovies[0].id;
        } else {
          // No unowned movies. Fly to self property to upgrade, or go to tax rest room to collect cash
          const myMovies = BOARD_LAYOUT.filter((tile) => {
            if (tile.type !== 'MOVIE' || tile.grade === 'SPECIAL') return false;
            const owner = getTileOwner(tile.id);
            return owner?.id === activePlayer.id && activePlayer.ownedMovies[tile.id] < 4;
          });

          if (myMovies.length > 0) {
            targetTileId = myMovies[0].id;
          } else if (taxDonationPool > 1000000) {
            targetTileId = 20; // Rest lounge for fat cash
          } else {
            targetTileId = 0; // START
          }
        }

        handleFestivalTileSelect(targetTileId);
      }, 1800);
      return;
    }

    // 3. AI is waiting to Roll (idle phase)
    if (!activeTileEffect && !isFlyingSelectMode) {
      setAiThinkingMessage(`${activePlayer.name}가 주사위를 고르고 있습니다...`);
      const timer = setTimeout(() => {
        setAiThinkingMessage('');
        handleRollDice();
      }, 1600);
      return () => clearTimeout(timer);
    }

    // 4. AI landed on a property/tax tile and needs decision
    if (activeTileEffect) {
      const tile = activeTileEffect;
      const owner = getTileOwner(tile.id);

      setAiThinkingMessage(`${activePlayer.name}가 비즈니스 계약서를 검토하고 있습니다...`);

      const decisionTimer = setTimeout(() => {
        setAiThinkingMessage('');

        if (tile.type === 'MOVIE') {
          if (!owner) {
            // Unowned property. AI buys if it keeps at least 800,000 KRW left (or special spots)
            const cost = tile.price || 0;
            if (activePlayer.money >= cost && (activePlayer.money - cost) >= 800000) {
              handleBuyMovieRight();
            } else {
              addLog(activePlayer.id, `🎬 [${tile.name}]의 판권 인수를 보류하고 패스하였습니다.`, 'system');
              nextTurn();
            }
          } else if (owner.id === activePlayer.id) {
            // Self owned. AI upgrades if they can afford it and keep 1,000,000 KRW cushion
            const level = activePlayer.ownedMovies[tile.id];
            if (tile.upgradeCosts && level < 4) {
              const upgradeCost = tile.upgradeCosts[level];
              if (activePlayer.money >= upgradeCost && (activePlayer.money - upgradeCost) >= 1000000) {
                handleUpgradeMovie();
              } else {
                addLog(activePlayer.id, `🏰 [${tile.name}] 영화사 업그레이드를 생략하고 차례를 마감했습니다.`, 'system');
                nextTurn();
              }
            } else {
              nextTurn();
            }
          } else {
            // Pay rent
            handlePayRent();
          }
        } else if (tile.type === 'TAX') {
          // Pay tax
          handlePayTax();
        }
      }, 1500);

      return () => clearTimeout(decisionTimer);
    }
  }, [
    gameMode,
    players,
    currentPlayerIdx,
    isRolling,
    isMoving,
    isFlyingSelectMode,
    activeTileEffect,
    activeCardDrawn,
    gameWinner,
    soundEnabled,
    taxDonationPool,
    addLog,
    nextTurn,
  ]);

  // Main render branch
  if (gameMode === 'setup') {
    return (
      <div className="min-h-screen bg-[#FFFBEB] flex items-center justify-center p-4">
        <SetupScreen onStartGame={handleSetupGame} />
      </div>
    );
  }

  const activePlayer = players[currentPlayerIdx];
  const activeTile = activeTileEffect;
  const isHumanTurn = activePlayer && !activePlayer.isAI;

  return (
    <div className="min-h-screen bg-[#FFFBEB] text-[#2D3436] flex flex-col font-sans select-none pb-12">
      <GameHeader
        taxDonationPool={taxDonationPool}
        formatMoney={formatMoney}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onOpenRules={() => setIsRulesOpen(true)}
        onResetGame={handleResetGame}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-8 flex items-center justify-center">
          <div className="relative w-full aspect-square max-w-[750px] bg-[#4ECDC4] p-2.5 rounded-none shadow-[8px_8px_0_0_#2D3436] border-4 border-black grid grid-cols-11 grid-rows-11 gap-1">
            <GameCenterPanel
              players={players}
              currentPlayerIdx={currentPlayerIdx}
              gameWinner={gameWinner}
              activeCardDrawn={activeCardDrawn}
              isFlyingSelectMode={isFlyingSelectMode}
              aiThinkingMessage={aiThinkingMessage}
              activeTile={activeTile}
              activePlayer={activePlayer}
              isHumanTurn={isHumanTurn}
              dice1={dice1}
              dice2={dice2}
              isRolling={isRolling}
              isMoving={isMoving}
              rentOwed={rentOwed}
              taxOwed={taxOwed}
              formatMoney={formatMoney}
              getTileOwner={getTileOwner}
              onResetGame={handleResetGame}
              onApplyCardEffect={handleApplyCardEffect}
              onBuyMovieRight={handleBuyMovieRight}
              onUpgradeMovie={handleUpgradeMovie}
              onPayRent={handlePayRent}
              onPayTax={handlePayTax}
              onRollEscapeDelay={handleRollEscapeDelay}
              onPayEscapeDelay={handlePayEscapeDelay}
              onRollDice={handleRollDice}
              addLog={addLog}
              nextTurn={nextTurn}
            />

            {BOARD_LAYOUT.map((tile) => {
              const playersOnTile = players.filter((p) => p.position === tile.id && !p.isBankrupt);
              const owner = getTileOwner(tile.id);
              const level = owner ? owner.ownedMovies[tile.id] : undefined;

              return (
                <BoardTile
                  key={tile.id}
                  tile={tile}
                  playersOnTile={playersOnTile}
                  owner={owner}
                  level={level}
                  isFestivalSelectable={isFlyingSelectMode && isHumanTurn}
                  onTileClick={handleFestivalTileSelect}
                />
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-6 justify-stretch">
          <div className="flex-1">
            <AssetList players={players} activePlayerIdx={currentPlayerIdx} />
          </div>

          <div className="flex-1">
            <GameLogs logs={logs} playerColors={[...PLAYER_TEXT_COLORS]} playerNames={players.map((p) => p.name)} />
          </div>
        </div>
      </main>

      <DebtModal
        activePlayer={activePlayer}
        calculateAssetSellValue={calculateAssetSellValue}
        formatMoney={formatMoney}
        handleHumanSellAsset={handleHumanSellAsset}
        handleBankruptPlayer={handleBankruptPlayer}
        rentReceiverIdx={rentReceiverIdx}
        rentOwed={rentOwed}
        taxOwed={taxOwed}
        players={players}
        setPlayers={setPlayers}
        setTaxDonationPool={setTaxDonationPool}
        addLog={addLog}
        onPlayVictory={() => soundEnabled && sound.playVictory()}
        nextTurn={nextTurn}
      />

      <RulesModal isOpen={isRulesOpen} onClose={() => setIsRulesOpen(false)} />
    </div>
  );
}
