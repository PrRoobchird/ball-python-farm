import React, { useEffect, useState } from 'react';
import { BreedingView } from './components/BreedingView';
import { CodexView } from './components/CodexView';
import { EquipmentView } from './components/EquipmentView';
import { FarmView } from './components/FarmView';
import { MarketView } from './components/MarketView';
import { PixelSnakeSprite } from './components/PixelSnakeSprite';
import {
  DECOR_ITEMS,
  DEFAULT_DECOR,
  EQUIPMENT_UPGRADES,
  EXPO_THEMES,
  MARKET_TRENDS,
  calculateMarketValue,
  computeDailySaleChance,
  createNewSnakeFromGenotype,
  generateDailyShopInventory,
  getEquipmentCost,
  getFarmStatsFromEquipment,
  getTerrariumAppealBonus,
  scoreSnakeForExpo,
} from './game/economy';
import {
  buildPedigreeFromParents,
  evaluatePhenotype,
  generateClutchEggs,
  getRarityColorClass,
  getRarityLabelTh,
} from './game/genetics';
import { AUTOSOMAL_GENES } from './game/genes';
import { sound } from './game/sound';
import {
  BreedingClutch,
  DecorSlot,
  GameLogEntry,
  GameState,
  GeneId,
  PedigreeNode,
  ShopListing,
  Snake,
} from './game/types';
import { FastForward, RotateCcw, Sparkles, Volume2, VolumeX, X } from 'lucide-react';

type ActiveTab = 'farm' | 'market' | 'breeding' | 'equipment' | 'codex';

const SAVE_KEY = 'ball_python_pixel_save_v1';

function createInitialState(): GameState {
  return {
    day: 1,
    money: 12000,
    reputation: 0,
    trophies: 0,
    snakes: [],
    terrariums: [
      { id: 'terr_1', name: 'ตู้เลี้ยง #1', decor: { ...DEFAULT_DECOR } },
      { id: 'terr_2', name: 'ตู้เลี้ยง #2', decor: { ...DEFAULT_DECOR } },
    ],
    clutches: [],
    shopListings: generateDailyShopInventory(),
    equipmentLevels: {
      incubator_pro: 0,
      hygro_mist: 0,
      breeder_diet: 0,
    },
    unlockedDecorIds: DECOR_ITEMS.filter((d) => d.cost === 0).map((d) => d.id),
    discoveredMorphs: {},
    marketTrend: MARKET_TRENDS[0],
    currentExpo: EXPO_THEMES[0],
    lastExpoDayEntered: 0,
    expoHistory: [],
    totalBred: 0,
    totalSold: 0,
    logs: [
      {
        id: 'log_init',
        day: 1,
        text: 'เริ่มต้นฟาร์มใหม่ด้วยงบ ฿12,000 และตู้เลี้ยงว่าง 2 ตู้ — เลือกซื้องูคู่แรกจากตลาดได้เลย!',
        tone: 'info',
      },
    ],
    hasSeenIntro: false,
  };
}

function loadSavedState(): GameState {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return createInitialState();
    const parsed = JSON.parse(raw) as Partial<GameState>;
    if (!parsed || typeof parsed.money !== 'number' || !Array.isArray(parsed.terrariums)) {
      return createInitialState();
    }
    const base = createInitialState();
    const day = parsed.day ?? 1;
    const migratedSnakes: Snake[] = (parsed.snakes || []).map((s) => ({
      ...s,
      hunger: s.hunger ?? 90,
      isInBlue: s.isInBlue ?? false,
      nextShedDay: s.nextShedDay ?? day + 4,
      freshShedUntilDay: s.freshShedUntilDay ?? 0,
      cooldownUntilDay: s.cooldownUntilDay ?? 0,
      dnaTested: s.dnaTested ?? (!s.posHets || Object.keys(s.posHets).length === 0),
    }));

    return {
      ...base,
      ...parsed,
      snakes: migratedSnakes,
      reputation: parsed.reputation ?? 0,
      trophies: parsed.trophies ?? 0,
      currentExpo: parsed.currentExpo ?? EXPO_THEMES[0],
      lastExpoDayEntered: parsed.lastExpoDayEntered ?? 0,
      expoHistory: parsed.expoHistory ?? [],
    };
  } catch {
    return createInitialState();
  }
}

interface HatchModalResult {
  clutchName: string;
  totalEggs: number;
  hatchedBabies: Array<{
    snake: Snake;
    isNewMorph: boolean;
  }>;
  lostCount: number;
}

export default function App() {
  const [state, setState] = useState<GameState>(() => loadSavedState());
  const [activeTab, setActiveTab] = useState<ActiveTab>(() =>
    state.snakes.length === 0 ? 'market' : 'farm'
  );
  const [muted, setMuted] = useState(false);
  const [preselectedSireId, setPreselectedSireId] = useState<string | null>(null);
  const [preselectedDamId, setPreselectedDamId] = useState<string | null>(null);
  const [hatchModal, setHatchModal] = useState<HatchModalResult | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage quota errors
    }
  }, [state]);

  const toggleSound = () => {
    const next = !muted;
    setMuted(next);
    sound.muted = next;
    if (!next) sound.click();
  };

  const pushLog = (
    logs: GameLogEntry[],
    day: number,
    text: string,
    tone: GameLogEntry['tone'] = 'info'
  ): GameLogEntry[] => {
    return [{ id: `log_${Date.now()}_${Math.random()}`, day, text, tone }, ...logs].slice(0, 18);
  };

  const recordDiscoveredMorph = (
    discovered: GameState['discoveredMorphs'],
    snake: Snake,
    day: number
  ): { nextDiscovered: GameState['discoveredMorphs']; isNew: boolean } => {
    const pheno = evaluatePhenotype(snake.sex, snake.genotype);
    const existing = discovered[pheno.phenotypeKey];
    if (existing) {
      return {
        isNew: false,
        nextDiscovered: {
          ...discovered,
          [pheno.phenotypeKey]: {
            ...existing,
            countProduced: existing.countProduced + 1,
          },
        },
      };
    }
    return {
      isNew: true,
      nextDiscovered: {
        ...discovered,
        [pheno.phenotypeKey]: {
          key: pheno.phenotypeKey,
          nameEn: pheno.nameEn,
          nameTh: pheno.nameTh,
          complex: pheno.complex,
          rarity: pheno.rarity,
          firstDiscoveredDay: day,
          countProduced: 1,
          sampleSex: snake.sex,
          sampleGenotype: snake.genotype,
        },
      },
    };
  };

  const handleBuyListing = (listing: ShopListing) => {
    const occupiedIds = new Set(state.snakes.map((s) => s.terrariumId));
    const freeTerrarium = state.terrariums.find((t) => !occupiedIds.has(t.id));
    if (!freeTerrarium) return;
    if (state.money < listing.price) return;

    sound.buy();
    const newSnake = createNewSnakeFromGenotype({
      sex: listing.sex,
      genotype: listing.genotype,
      ageDays: listing.ageDays,
      matureDays: listing.matureDays,
      terrariumId: freeTerrarium.id,
      origin: 'shop',
      bornDay: state.day,
      seed: listing.seed,
    });

    const pheno = evaluatePhenotype(newSnake.sex, newSnake.genotype);
    const { nextDiscovered, isNew } = recordDiscoveredMorph(
      state.discoveredMorphs,
      newSnake,
      state.day
    );

    setState((prev) => ({
      ...prev,
      money: prev.money - listing.price,
      snakes: [...prev.snakes, newSnake],
      shopListings: prev.shopListings.filter((l) => l.id !== listing.id),
      discoveredMorphs: nextDiscovered,
      logs: pushLog(
        prev.logs,
        prev.day,
        `ซื้องู ${pheno.nameEn} (${newSnake.sex === 'M' ? '♂' : '♀'}) เข้าสู่ ${freeTerrarium.name} ในราคา ฿${listing.price.toLocaleString()}${isNew ? ' [ค้นพบมอร์ฟใหม่!]' : ''}`,
        isNew ? 'rare' : 'success'
      ),
    }));
  };

  const handleRefreshShops = () => {
    if (state.money < 300) return;
    sound.click();
    setState((prev) => ({
      ...prev,
      money: prev.money - 300,
      shopListings: generateDailyShopInventory(),
      logs: pushLog(prev.logs, prev.day, 'รีเฟรชรายการงูใหม่ในตลาดทั้ง 4 ร้านแล้ว', 'info'),
    }));
  };

  const handleBuyTerrarium = () => {
    const cost = 2200 + Math.max(0, state.terrariums.length - 2) * 800;
    if (state.money < cost) return;
    sound.buy();
    const nextNum = state.terrariums.length + 1;
    setState((prev) => ({
      ...prev,
      money: prev.money - cost,
      terrariums: [
        ...prev.terrariums,
        { id: `terr_${Date.now()}`, name: `ตู้เลี้ยง #${nextNum}`, decor: { ...DEFAULT_DECOR } },
      ],
      logs: pushLog(prev.logs, prev.day, `ขยายโรงเรือนเพิ่ม ตู้เลี้ยง #${nextNum} (฿${cost.toLocaleString()})`, 'success'),
    }));
  };

  const handleToggleSale = (snakeId: string, isForSale: boolean, askingPrice: number) => {
    sound.click();
    setState((prev) => ({
      ...prev,
      snakes: prev.snakes.map((s) =>
        s.id === snakeId ? { ...s, isForSale, askingPrice } : s
      ),
      logs: pushLog(
        prev.logs,
        prev.day,
        isForSale
          ? `ตั้งขายงูในตลาดราคา ฿${askingPrice.toLocaleString()}`
          : 'ถอดประกาศขายงูออกจากตลาดแล้ว',
        'info'
      ),
    }));
  };

  const handleUpdateDecor = (terrariumId: string, slot: DecorSlot, decorId: string) => {
    sound.click();
    setState((prev) => ({
      ...prev,
      terrariums: prev.terrariums.map((t) =>
        t.id === terrariumId ? { ...t, decor: { ...t.decor, [slot]: decorId } } : t
      ),
    }));
  };

  const handleRenameSnake = (snakeId: string, name: string) => {
    sound.click();
    setState((prev) => ({
      ...prev,
      snakes: prev.snakes.map((s) => (s.id === snakeId ? { ...s, name } : s)),
    }));
  };

  const handleFeedSnake = (snakeId: string) => {
    if (state.money < 60) return;
    const target = state.snakes.find((s) => s.id === snakeId);
    if (!target) return;
    sound.click();
    setState((prev) => ({
      ...prev,
      money: prev.money - 60,
      snakes: prev.snakes.map((s) =>
        s.id === snakeId
          ? {
              ...s,
              hunger: 100,
              ageDays: Math.min(s.matureDays, s.ageDays + (s.ageDays < s.matureDays ? 1 : 0)),
            }
          : s
      ),
      logs: pushLog(prev.logs, prev.day, `ให้อาหาร ${target.name} เรียบร้อย (ความอิ่ม 100%)`, 'info'),
    }));
  };

  const handleDnaTestSnake = (snakeId: string) => {
    if (state.money < 650) return;
    const target = state.snakes.find((s) => s.id === snakeId);
    if (!target || target.dnaTested) return;

    sound.hatch();

    const confirmedHets: string[] = [];
    for (const g of AUTOSOMAL_GENES) {
      const id = g.id as GeneId;
      if (g.inheritance === 'recessive' && target.posHets?.[id]) {
        if ((target.genotype.alleles[id] || 0) === 1) {
          confirmedHets.push(`พบยีนแฝง ${g.nameEn} 100%!`);
        } else {
          confirmedHets.push(`ไม่พบยีน ${g.nameEn}`);
        }
      }
    }

    setState((prev) => ({
      ...prev,
      money: prev.money - 650,
      snakes: prev.snakes.map((s) =>
        s.id === snakeId ? { ...s, dnaTested: true, posHets: undefined } : s
      ),
      logs: pushLog(
        prev.logs,
        prev.day,
        `ผลตรวจ DNA คราบของ ${target.name}: ${confirmedHets.join(' · ') || 'ยืนยันยีนเรียบร้อย'}`,
        confirmedHets.some((t) => t.includes('พบยีนแฝง')) ? 'rare' : 'info'
      ),
    }));
  };

  const handleEnterExpo = (snakeId: string) => {
    if (state.lastExpoDayEntered === state.day) return;
    if (state.money < state.currentExpo.entryFee) return;
    const snake = state.snakes.find((s) => s.id === snakeId);
    if (!snake) return;

    const terr = state.terrariums.find((t) => t.id === snake.terrariumId);
    const appeal = terr ? getTerrariumAppealBonus(terr.decor) : 0;
    const result = scoreSnakeForExpo(snake, state.currentExpo, appeal, state.day);

    if (result.rank === 1) sound.hatch();
    else if (result.prizeMoney > 0) sound.sell();
    else sound.click();

    setState((prev) => ({
      ...prev,
      money: prev.money - prev.currentExpo.entryFee + result.prizeMoney,
      reputation: prev.reputation + result.repGained,
      trophies: prev.trophies + (result.rank === 1 ? 1 : 0),
      lastExpoDayEntered: prev.day,
      expoHistory: [result, ...prev.expoHistory].slice(0, 12),
      logs: pushLog(
        prev.logs,
        prev.day,
        `ประกวด ${result.themeTitleTh}: ${snake.name} ได้อันดับที่ ${result.rank} (คะแนน ${result.score}) ${result.prizeMoney > 0 ? `+฿${result.prizeMoney.toLocaleString()} ` : ''}+${result.repGained} ชื่อเสียง`,
        result.rank === 1 ? 'rare' : result.rank <= 3 ? 'success' : 'info'
      ),
    }));
  };

  const handleSendToBreeding = (snake: Snake) => {
    sound.click();
    if (snake.sex === 'M') setPreselectedSireId(snake.id);
    else setPreselectedDamId(snake.id);
    setActiveTab('breeding');
  };

  const handleStartBreeding = (sireId: string, damId: string) => {
    const sire = state.snakes.find((s) => s.id === sireId);
    const dam = state.snakes.find((s) => s.id === damId);
    if (!sire || !dam) return;
    if (dam.cooldownUntilDay > state.day) return;

    sound.breed();
    const farmStats = getFarmStatsFromEquipment(state.equipmentLevels);
    const eggs = generateClutchEggs(
      sire.genotype,
      dam.genotype,
      farmStats.clutchSize,
      farmStats.survivalRate
    );

    const clutch: BreedingClutch = {
      id: `clutch_${Date.now()}`,
      sireId: sire.id,
      damId: dam.id,
      sireName: sire.name,
      damName: dam.name,
      laidDay: state.day,
      hatchDay: state.day + 3,
      survivalRateSnapshot: farmStats.survivalRate,
      eggs,
      hatched: false,
    };

    setState((prev) => ({
      ...prev,
      snakes: prev.snakes.map((s) =>
        s.id === dam.id ? { ...s, cooldownUntilDay: prev.day + 2 } : s
      ),
      clutches: [clutch, ...prev.clutches],
      logs: pushLog(
        prev.logs,
        prev.day,
        `จับคู่ ${sire.name} × ${dam.name} สำเร็จ! ได้ไข่ ${eggs.length} ใบ (ฟักวันที่ ${clutch.hatchDay})`,
        'success'
      ),
    }));
  };

  const handleHatchClutch = (clutchId: string) => {
    const clutch = state.clutches.find((c) => c.id === clutchId);
    if (!clutch || clutch.hatched) return;

    const occupiedIds = new Set(state.snakes.map((s) => s.terrariumId));
    const freeTerrariums = state.terrariums.filter((t) => !occupiedIds.has(t.id));
    const survivingEggs = clutch.eggs.filter((e) => e.survived);
    if (freeTerrariums.length < survivingEggs.length) return;

    sound.hatch();

    const sire = state.snakes.find((s) => s.id === clutch.sireId);
    const dam = state.snakes.find((s) => s.id === clutch.damId);
    let pedigreeParents: { sireNode: PedigreeNode; damNode: PedigreeNode } | undefined;
    if (sire && dam) {
      pedigreeParents = buildPedigreeFromParents(sire, dam);
    }

    const hatchedBabies: Array<{ snake: Snake; isNewMorph: boolean }> = [];
    let nextDiscovered = { ...state.discoveredMorphs };
    const provenRecessiveGenes = new Set<GeneId>();

    survivingEggs.forEach((egg, idx) => {
      const targetTerr = freeTerrariums[idx];
      const pheno = evaluatePhenotype(egg.sex, egg.genotype, {
        posHets: egg.posHets,
        dnaTested: false,
      });

      for (const g of AUTOSOMAL_GENES) {
        if (g.inheritance === 'recessive' && (egg.genotype.alleles[g.id as GeneId] || 0) === 2) {
          provenRecessiveGenes.add(g.id as GeneId);
        }
      }

      const babyPedigree: PedigreeNode | undefined = pedigreeParents
        ? {
            name: `${pheno.specialComboName || pheno.nameEn.split(' Het ')[0]}`,
            morphEn: pheno.specialComboName || pheno.nameEn,
            sex: egg.sex,
            sire: pedigreeParents.sireNode,
            dam: pedigreeParents.damNode,
          }
        : undefined;

      const baby = createNewSnakeFromGenotype({
        sex: egg.sex,
        genotype: egg.genotype,
        posHets: egg.posHets,
        ageDays: 0,
        matureDays: 6,
        terrariumId: targetTerr.id,
        origin: 'bred',
        parents: { sireName: clutch.sireName, damName: clutch.damName },
        pedigree: babyPedigree,
        bornDay: state.day,
      });
      if (baby.pedigree) {
        baby.pedigree.name = baby.name;
      }
      const res = recordDiscoveredMorph(nextDiscovered, baby, state.day);
      nextDiscovered = res.nextDiscovered;
      hatchedBabies.push({ snake: baby, isNewMorph: res.isNew });
    });

    const lostCount = clutch.eggs.length - survivingEggs.length;
    const newBabies = hatchedBabies.map((b) => b.snake);

    // Auto-prove out Pos Hets on parents if a visual recessive baby hatched!
    const updatedExistingSnakes = state.snakes.map((s) => {
      if ((s.id === clutch.sireId || s.id === clutch.damId) && provenRecessiveGenes.size > 0 && s.posHets) {
        const nextPos = { ...s.posHets };
        let changed = false;
        provenRecessiveGenes.forEach((gid) => {
          if (nextPos[gid]) {
            delete nextPos[gid];
            changed = true;
          }
        });
        if (changed) {
          return {
            ...s,
            posHets: Object.keys(nextPos).length > 0 ? nextPos : undefined,
            dnaTested: Object.keys(nextPos).length === 0 ? true : s.dnaTested,
          };
        }
      }
      return s;
    });

    setState((prev) => ({
      ...prev,
      snakes: [...updatedExistingSnakes, ...newBabies],
      clutches: prev.clutches.map((c) =>
        c.id === clutchId ? { ...c, hatched: true } : c
      ),
      discoveredMorphs: nextDiscovered,
      totalBred: prev.totalBred + newBabies.length,
      reputation: prev.reputation + hatchedBabies.filter((b) => b.isNewMorph).length * 5,
      logs: pushLog(
        prev.logs,
        prev.day,
        `ฟักไข่ ${clutch.sireName} × ${clutch.damName} สำเร็จ! รอดชีวิต ${newBabies.length}/${clutch.eggs.length} ตัว${provenRecessiveGenes.size > 0 ? ' [Prove Out ยีนด้อยพ่อแม่พันธุ์แล้ว!]' : ''}`,
        newBabies.length > 0 ? 'rare' : 'warning'
      ),
    }));

    setHatchModal({
      clutchName: `${clutch.sireName} × ${clutch.damName}`,
      totalEggs: clutch.eggs.length,
      hatchedBabies,
      lostCount,
    });
  };

  const handleUpgradeEquipment = (equipmentId: string) => {
    const eq = EQUIPMENT_UPGRADES.find((e) => e.id === equipmentId);
    if (!eq) return;
    const currentLevel = state.equipmentLevels[equipmentId] || 0;
    if (currentLevel >= eq.maxLevel) return;
    const cost = getEquipmentCost(eq, currentLevel);
    if (state.money < cost) return;

    sound.buy();
    setState((prev) => ({
      ...prev,
      money: prev.money - cost,
      equipmentLevels: {
        ...prev.equipmentLevels,
        [equipmentId]: currentLevel + 1,
      },
      logs: pushLog(
        prev.logs,
        prev.day,
        `อัปเกรด ${eq.nameTh} เป็นระดับ ${currentLevel + 1} แล้ว`,
        'success'
      ),
    }));
  };

  const handleBuyDecor = (decorId: string) => {
    const item = DECOR_ITEMS.find((d) => d.id === decorId);
    if (!item) return;
    if (state.unlockedDecorIds.includes(decorId)) return;
    if (state.money < item.cost) return;

    sound.buy();
    setState((prev) => ({
      ...prev,
      money: prev.money - item.cost,
      unlockedDecorIds: [...prev.unlockedDecorIds, decorId],
      logs: pushLog(prev.logs, prev.day, `ปลดล็อกและซื้อของตกแต่ง "${item.nameTh}" แล้ว`, 'success'),
    }));
  };

  const handleAdvanceDay = () => {
    sound.nextDay();
    const nextDay = state.day + 1;
    const farmStats = getFarmStatsFromEquipment(state.equipmentLevels);

    let earnedMoney = 0;
    let soldCount = 0;
    let nextLogs = [...state.logs];
    const remainingSnakes: Snake[] = [];

    for (const snake of state.snakes) {
      if (snake.isForSale) {
        const terr = state.terrariums.find((t) => t.id === snake.terrariumId);
        const appeal = terr ? getTerrariumAppealBonus(terr.decor) : 0;
        const val = calculateMarketValue(
          snake.sex,
          snake.genotype,
          state.marketTrend,
          appeal,
          state.reputation,
          snake.posHets,
          snake.dnaTested
        );
        const chance = computeDailySaleChance(
          snake.askingPrice,
          val.finalMarketPrice,
          val.matchesTrend,
          appeal,
          state.reputation
        );
        if (Math.random() < chance) {
          earnedMoney += snake.askingPrice;
          soldCount += 1;
          const pheno = evaluatePhenotype(snake.sex, snake.genotype, {
            posHets: snake.posHets,
            dnaTested: snake.dnaTested,
          });
          nextLogs = pushLog(
            nextLogs,
            nextDay,
            `ขาย ${snake.name} (${pheno.nameEn}) สำเร็จ ได้รับ ฿${snake.askingPrice.toLocaleString()}!`,
            'success'
          );
          continue;
        }
      }

      // Update Hunger & Shedding cycle
      const nextHunger = Math.max(15, snake.hunger - 14);
      let nextIsInBlue = snake.isInBlue;
      let nextShedDay = snake.nextShedDay;
      let nextFreshShed = snake.freshShedUntilDay;

      if (snake.isInBlue) {
        // Completes shed today!
        nextIsInBlue = false;
        nextFreshShed = nextDay + 2;
        nextShedDay = nextDay + 5;
      } else if (nextDay >= snake.nextShedDay) {
        nextIsInBlue = true;
      }

      const growthBoost = snake.hunger >= 50 ? farmStats.growthPerDay : 0.5;

      remainingSnakes.push({
        ...snake,
        hunger: nextHunger,
        isInBlue: nextIsInBlue,
        nextShedDay,
        freshShedUntilDay: nextFreshShed,
        ageDays: Math.min(snake.matureDays, Math.floor(snake.ageDays + growthBoost)),
      });
    }

    if (soldCount > 0) {
      setTimeout(() => sound.sell(), 160);
    }

    let nextTrend = state.marketTrend;
    if (nextDay % 3 === 1) {
      const idx = Math.floor(Math.random() * MARKET_TRENDS.length);
      nextTrend = MARKET_TRENDS[idx];
      nextLogs = pushLog(nextLogs, nextDay, `เทรนด์ตลาดเปลี่ยนเป็น: ${nextTrend.titleTh}`, 'info');
    }

    let nextExpo = state.currentExpo;
    if (nextDay % 4 === 1) {
      const eIdx = Math.floor(Math.random() * EXPO_THEMES.length);
      nextExpo = EXPO_THEMES[eIdx];
      nextLogs = pushLog(nextLogs, nextDay, `งานประกวดใหม่เปิดรับสมัคร: ${nextExpo.titleTh}`, 'info');
    }

    const newlyReady = state.clutches.filter(
      (c) => !c.hatched && c.hatchDay === nextDay
    );
    if (newlyReady.length > 0) {
      nextLogs = pushLog(
        nextLogs,
        nextDay,
        `มีไข่ครบกำหนดฟักแล้ว ${newlyReady.length} ครอก! ไปที่ห้องผสมพันธุ์เพื่อเปิดฟักไข่`,
        'rare'
      );
    }

    setState((prev) => ({
      ...prev,
      day: nextDay,
      money: prev.money + earnedMoney,
      reputation: prev.reputation + soldCount * 2,
      snakes: remainingSnakes,
      shopListings: generateDailyShopInventory(),
      marketTrend: nextTrend,
      currentExpo: nextExpo,
      totalSold: prev.totalSold + soldCount,
      logs: nextLogs,
    }));
  };

  const handleResetGame = () => {
    sound.click();
    const fresh = createInitialState();
    setState(fresh);
    setShowResetConfirm(false);
    setActiveTab('market');
  };

  const farmStats = getFarmStatsFromEquipment(state.equipmentLevels);
  const discoveredCount = Object.keys(state.discoveredMorphs).length;
  const readyClutchesCount = state.clutches.filter(
    (c) => !c.hatched && c.hatchDay <= state.day
  ).length;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Strict 3-Zone Top Bar Contract */}
      <header className="bg-[#151D19] border-b-2 border-[#36483E] px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-8">
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('farm');
            }}
            className="font-pixel text-base sm:text-lg text-[#EAB308] tracking-tight whitespace-nowrap shrink-0"
          >
            BALL PYTHON PIXEL
          </a>

          <nav className="flex items-center gap-5 sm:gap-6 overflow-x-auto text-sm font-semibold">
            {(
              [
                ['farm', 'ฟาร์มเลี้ยง'],
                ['market', 'ตลาดและงานประกวด'],
                ['breeding', 'ผสมพันธุ์'],
                ['equipment', 'อุปกรณ์และตกแต่ง'],
                ['codex', 'สารานุกรมมอร์ฟ'],
              ] as Array<[ActiveTab, string]>
            ).map(([tabKey, label]) => (
              <button
                key={tabKey}
                onClick={() => {
                  sound.click();
                  setActiveTab(tabKey);
                }}
                className={`whitespace-nowrap shrink-0 pb-1 border-b-2 transition-colors cursor-pointer ${
                  activeTab === tabKey
                    ? 'text-[#F4F0E2] border-[#EAB308]'
                    : 'text-[#9BA89E] border-transparent hover:text-[#F4F0E2]'
                }`}
              >
                {label}
                {tabKey === 'breeding' && readyClutchesCount > 0 && (
                  <span className="ml-1.5 font-mono-num text-xs text-[#4ADE80]">
                    ({readyClutchesCount})
                  </span>
                )}
              </button>
            ))}
          </nav>

          <div className="shrink-0">
            <button
              onClick={handleAdvanceDay}
              className="pixel-btn px-4 py-2 bg-[#22C55E] text-[#0B120D] text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap shrink-0"
            >
              <FastForward className="w-4 h-4" />
              วันถัดไป
            </button>
          </div>
        </div>
      </header>

      {/* Workspace Status HUD Strip */}
      <div className="bg-[#1A241F] border-b-2 border-[#2C3A32] px-4 sm:px-8 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 font-mono-num">
            <div>
              <span className="text-[#9BA89E]">วันที่:</span>{' '}
              <strong className="text-[#F4F0E2]">{state.day}</strong>
            </div>
            <div>
              <span className="text-[#9BA89E]">เงินทุน:</span>{' '}
              <strong className="text-[#4ADE80] text-sm">฿{state.money.toLocaleString()}</strong>
            </div>
            <div>
              <span className="text-[#9BA89E]">ชื่อเสียง:</span>{' '}
              <strong className="text-[#EAB308]">{state.reputation}</strong>
            </div>
            <div>
              <span className="text-[#9BA89E]">งูในฟาร์ม:</span>{' '}
              <strong className="text-[#F4F0E2]">
                {state.snakes.length}/{state.terrariums.length}
              </strong>
            </div>
            <div>
              <span className="text-[#9BA89E]">โอกาสรอดลูกงู:</span>{' '}
              <strong className="text-[#4ADE80]">{farmStats.survivalRate}%</strong>
            </div>
            <div>
              <span className="text-[#9BA89E]">มอร์ฟที่ค้นพบ:</span>{' '}
              <strong className="text-[#38BDF8]">{discoveredCount}</strong>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleSound}
              className="text-[#9BA89E] hover:text-[#F4F0E2] flex items-center gap-1 whitespace-nowrap"
              title={muted ? 'เปิดเสียง' : 'ปิดเสียง'}
            >
              {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span>{muted ? 'ปิดเสียง' : 'เสียง 8-Bit'}</span>
            </button>
            <button
              onClick={() => setShowResetConfirm(true)}
              className="text-[#9BA89E] hover:text-[#FB7185] flex items-center gap-1 whitespace-nowrap"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>เริ่มใหม่</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 space-y-6">
        {state.logs[0] && (
          <div className="pixel-inset px-4 py-2.5 flex items-center justify-between gap-4 text-xs">
            <div className="truncate">
              <span className="font-mono-num text-[#EAB308] mr-2">DAY {state.logs[0].day}</span>
              <span
                className={
                  state.logs[0].tone === 'rare'
                    ? 'text-[#C084FC] font-semibold'
                    : state.logs[0].tone === 'success'
                      ? 'text-[#4ADE80]'
                      : state.logs[0].tone === 'warning'
                        ? 'text-[#FB7185]'
                        : 'text-[#D1D5DB]'
                }
              >
                {state.logs[0].text}
              </span>
            </div>
            {readyClutchesCount > 0 && activeTab !== 'breeding' && (
              <button
                onClick={() => setActiveTab('breeding')}
                className="text-[#4ADE80] font-bold hover:underline whitespace-nowrap shrink-0"
              >
                ไปฟักไข่ ({readyClutchesCount}) →
              </button>
            )}
          </div>
        )}

        {activeTab === 'farm' && (
          <FarmView
            state={state}
            onBuyTerrarium={handleBuyTerrarium}
            onToggleSale={handleToggleSale}
            onUpdateDecor={handleUpdateDecor}
            onRenameSnake={handleRenameSnake}
            onFeedSnake={handleFeedSnake}
            onDnaTestSnake={handleDnaTestSnake}
            onSendToBreeding={handleSendToBreeding}
            onGoToShop={() => setActiveTab('market')}
            onGoToEquipment={() => setActiveTab('equipment')}
          />
        )}

        {activeTab === 'market' && (
          <MarketView
            state={state}
            onBuyListing={handleBuyListing}
            onRefreshShops={handleRefreshShops}
            onEnterExpo={handleEnterExpo}
          />
        )}

        {activeTab === 'breeding' && (
          <BreedingView
            state={state}
            preselectedSireId={preselectedSireId}
            preselectedDamId={preselectedDamId}
            onStartBreeding={handleStartBreeding}
            onHatchClutch={handleHatchClutch}
            onGoToEquipment={() => setActiveTab('equipment')}
          />
        )}

        {activeTab === 'equipment' && (
          <EquipmentView
            state={state}
            onUpgradeEquipment={handleUpgradeEquipment}
            onBuyDecor={handleBuyDecor}
          />
        )}

        {activeTab === 'codex' && <CodexView state={state} />}
      </main>

      {/* Hatch Result Modal */}
      {hatchModal && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <div className="pixel-panel max-w-2xl w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="font-pixel text-sm text-[#4ADE80] flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  HATCHING COMPLETE!
                </div>
                <h3 className="text-xl font-bold text-[#F4F0E2] mt-1">
                  ผลลัพธ์การฟักไข่: {hatchModal.clutchName}
                </h3>
                <p className="text-xs text-[#9BA89E] mt-1">
                  รอดชีวิต {hatchModal.hatchedBabies.length} จาก {hatchModal.totalEggs} ใบ
                  {hatchModal.lostCount > 0 &&
                    ` (สูญเสีย ${hatchModal.lostCount} ใบ — อัปเกรดตู้ฟักไข่เพื่อเพิ่มโอกาสรอด)`}
                </p>
              </div>

              <button
                onClick={() => setHatchModal(null)}
                className="p-1.5 text-[#9BA89E] hover:text-[#F4F0E2]"
                aria-label="ปิดหน้าต่าง"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {hatchModal.hatchedBabies.length === 0 ? (
              <div className="pixel-inset p-6 text-center text-sm text-[#FB7185]">
                น่าเสียดาย ลูกงูในครอกนี้ไม่รอดชีวิต ลองอัปเกรดตู้ฟักไข่และระบบความชื้นในหน้าอุปกรณ์ก่อนผสมครั้งถัดไป
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {hatchModal.hatchedBabies.map(({ snake, isNewMorph }) => {
                  const ph = evaluatePhenotype(snake.sex, snake.genotype, {
                    posHets: snake.posHets,
                    dnaTested: snake.dnaTested,
                  });
                  return (
                    <div key={snake.id} className="pixel-card p-3 space-y-2">
                      <div className="pixel-inset p-2 flex justify-center">
                        <PixelSnakeSprite
                          sex={snake.sex}
                          genotype={snake.genotype}
                          seed={snake.seed}
                          width={168}
                          height={96}
                        />
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-sm text-[#F4F0E2] truncate">
                          {ph.nameEn}
                        </span>
                        <span
                          className={`font-mono-num text-xs font-bold ${
                            snake.sex === 'M' ? 'text-[#38BDF8]' : 'text-[#FB7185]'
                          }`}
                        >
                          {snake.sex === 'M' ? '♂ ผู้' : '♀ เมีย'}
                        </span>
                      </div>
                      <div className="text-xs text-[#EAB308]">{ph.nameTh}</div>
                      <div className="flex items-center justify-between text-xs">
                        <span className={getRarityColorClass(ph.rarity)}>
                          {getRarityLabelTh(ph.rarity)}
                        </span>
                        {isNewMorph && (
                          <span className="font-bold text-[#C084FC]">ค้นพบมอร์ฟใหม่!</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  setHatchModal(null);
                  setActiveTab('farm');
                }}
                className="pixel-btn px-5 py-2.5 bg-[#EAB308] text-[#111714] text-sm font-bold"
              >
                ดูลูกงูในฟาร์ม
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Game Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <div className="pixel-panel max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-[#F4F0E2]">ยืนยันการเริ่มเกมใหม่</h3>
            <p className="text-sm text-[#9BA89E]">
              ข้อมูลฟาร์ม งูทั้งหมด เงินทุน และสารานุกรมมอร์ฟที่ค้นพบจะถูกรีเซ็ตกลับไปเริ่มต้นใหม่ที่งบ ฿12,000
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="pixel-btn px-4 py-2 bg-[#27352D] text-[#F4F0E2] text-xs font-bold"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleResetGame}
                className="pixel-btn px-4 py-2 bg-[#EF4444] text-white text-xs font-bold"
              >
                เริ่มเกมใหม่
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
