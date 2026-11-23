import { AUTOSOMAL_GENES } from './genes';
import { emptyGenotype, evaluatePhenotype, getBananaStatus } from './genetics';
import {
  DecorItem,
  EquipmentUpgrade,
  GeneId,
  Genotype,
  MarketTrend,
  Sex,
  ShopDefinition,
  ShopId,
  ShopListing,
  Snake,
  TerrariumDecorConfig,
} from './types';

export const SHOPS: ShopDefinition[] = [
  {
    id: 'starter_classic',
    nameTh: 'ร้านงูเริ่มต้น & คลาสสิก',
    subtitleTh: 'ราคาย่อมเยาเหมาะสำหรับตั้งฟาร์มใหม่',
    specialtyTh: 'Normal · ยีนเด่น · Co-dom พื้นฐาน · พาหะ (Het)',
  },
  {
    id: 'black_complex',
    nameTh: 'ฟาร์มสายเข้ม Black Complex',
    subtitleTh: 'รวมสายพันธุ์โทนดำ น้ำตาลเข้ม และซูเปอร์สีดำ',
    specialtyTh: 'Black Pastel · Black Head · Headless Axanthic · Cinnamon',
  },
  {
    id: 'bright_recessive',
    nameTh: 'แล็บสีสว่าง & ยีนด้อย',
    subtitleTh: 'เชี่ยวชาญ Banana X/Y กลุ่มสีขาว และยีนด้อยแท้',
    specialtyTh: 'Banana X/Y · Mojave · Lesser · Albino · Pied · Clown',
  },
  {
    id: 'rare_auction',
    nameTh: 'ตลาดประมูลมอร์ฟหายาก',
    subtitleTh: 'สายพันธุ์คอมโบหลายยีนและซูเปอร์ฟอร์มพร้อมผสม',
    specialtyTh: 'Double/Triple Gene · Super Form · Visual Recessive',
  },
];

export const MARKET_TRENDS: MarketTrend[] = [
  {
    id: 'trend_black',
    titleTh: 'กระแสโทนสีเข้มมาแรง (Black Complex)',
    descriptionTh: 'ผู้สะสมกำลังตามหามอร์ฟสายดำเข้มและซูเปอร์ฟอร์มโทนดำ',
    targetType: 'complex',
    targetValue: 'black_complex',
    multiplier: 1.35,
  },
  {
    id: 'trend_bright',
    titleTh: 'ความต้องการกลุ่มสีสว่าง & ลายขาวพุ่งสูง',
    descriptionTh: 'มอร์ฟสีเหลืองสด สีส้ม ขาวตาฟ้า และ Piebald ขายได้ราคาดีเป็นพิเศษ',
    targetType: 'complex',
    targetValue: 'bright_complex',
    multiplier: 1.3,
  },
  {
    id: 'trend_banana',
    titleTh: 'ตลาดตามหายีน Banana (X/Y)',
    descriptionTh: 'งูกลุ่ม Banana X (Female Maker) และ Banana Y (Male Maker) กำลังขาดตลาด',
    targetType: 'banana',
    targetValue: 'banana',
    multiplier: 1.4,
  },
  {
    id: 'trend_recessive',
    titleTh: 'ยุคทองของยีนด้อย (Recessive Visual)',
    descriptionTh: 'ตลาดให้ราคาสูงสำหรับงูแสดงลักษณะยีนด้อยแท้ เช่น Albino, Pied, Clown',
    targetType: 'inheritance',
    targetValue: 'recessive',
    multiplier: 1.35,
  },
  {
    id: 'trend_super',
    titleTh: 'นักสะสมล่า Super Form',
    descriptionTh: 'งูซูเปอร์ฟอร์มจากยีนเด่นร่วมกำลังเป็นที่ต้องการสูงมาก',
    targetType: 'super',
    targetValue: 'super',
    multiplier: 1.45,
  },
  {
    id: 'trend_normal',
    titleTh: 'ฟาร์มใหม่แห่ซื้อสายพันธุ์พื้นฐาน',
    descriptionTh: 'งูแบบดั้งเดิมและยีนเด่นระดับเริ่มต้นซื้อง่ายขายคล่อง',
    targetType: 'complex',
    targetValue: 'normal',
    multiplier: 1.25,
  },
];

export const EQUIPMENT_UPGRADES: EquipmentUpgrade[] = [
  {
    id: 'incubator_pro',
    nameTh: 'ตู้ฟักไข่ควบคุมอุณหภูมิ',
    category: 'incubator',
    descriptionTh: 'รักษาอุณหภูมิ 31.5°C คงที่ ลดอัตราไข่เสียและเพิ่มโอกาสรอดชีวิตของลูกงู',
    maxLevel: 5,
    baseCost: 2200,
    costStep: 1800,
    survivalBonusPerLevel: 5,
    clutchSizeBonusPerLevel: 0,
    growthSpeedBonusPerLevel: 0,
  },
  {
    id: 'hygro_mist',
    nameTh: 'ระบบควบคุมความชื้นอัตโนมัติ',
    category: 'climate',
    descriptionTh: 'รักษาระดับความชื้น 85–90% ในกล่องฟัก ช่วยให้ลูกงูเจาะไข่รอดชีวิตมากขึ้น',
    maxLevel: 5,
    baseCost: 1800,
    costStep: 1500,
    survivalBonusPerLevel: 4,
    clutchSizeBonusPerLevel: 0,
    growthSpeedBonusPerLevel: 0,
  },
  {
    id: 'breeder_diet',
    nameTh: 'ชุดอาหารบำรุงและแคลเซียมแม่พันธุ์',
    category: 'nutrition',
    descriptionTh: 'เพิ่มจำนวนไข่ต่อครอกและช่วยให้ลูกงูโตเต็มวัยพร้อมผสมพันธุ์เร็วขึ้น',
    maxLevel: 4,
    baseCost: 2500,
    costStep: 2200,
    survivalBonusPerLevel: 1,
    clutchSizeBonusPerLevel: 1,
    growthSpeedBonusPerLevel: 1,
  },
];

export const DECOR_ITEMS: DecorItem[] = [
  // Substrates
  {
    id: 'sub_paper',
    slot: 'substrate',
    nameTh: 'กระดาษรองตู้มาตรฐาน',
    descriptionTh: 'สะอาด ดูแลง่าย เหมาะสำหรับตู้เริ่มต้น',
    cost: 0,
    unlockRequirementTh: 'ปลดล็อกตั้งแต่เริ่มเกม',
    unlockType: 'free',
    unlockCount: 0,
    appealBonus: 0,
    previewColor: '#D6CEB8',
  },
  {
    id: 'sub_coco',
    slot: 'substrate',
    nameTh: 'กาบมะพร้าวสับชื้น (Coco Husk)',
    descriptionTh: 'กักเก็บความชื้นธรรมชาติ ดูอบอุ่นเหมือนป่าเขตร้อน',
    cost: 600,
    unlockRequirementTh: 'พร้อมซื้อทันที',
    unlockType: 'free',
    unlockCount: 0,
    appealBonus: 4,
    previewColor: '#6B442A',
  },
  {
    id: 'sub_moss',
    slot: 'substrate',
    nameTh: 'มอสป่าชุ่มชื้น (Forest Moss)',
    descriptionTh: 'พื้นสีเขียวสดชื่น ช่วยเสริมโทนสีงูให้โดดเด่น',
    cost: 1400,
    unlockRequirementTh: 'ค้นพบมอร์ฟครบ 4 แบบ',
    unlockType: 'morphs',
    unlockCount: 4,
    appealBonus: 8,
    previewColor: '#2F5E38',
  },
  {
    id: 'sub_slate',
    slot: 'substrate',
    nameTh: 'พื้นหินชนวนสีดำ (Dark Slate)',
    descriptionTh: 'พื้นหินสีเข้มหรูหรา ขับสีงูขาวและงูสีสว่างให้คมชัด',
    cost: 2200,
    unlockRequirementTh: 'ค้นพบมอร์ฟครบ 8 แบบ',
    unlockType: 'morphs',
    unlockCount: 8,
    appealBonus: 12,
    previewColor: '#272E36',
  },

  // Backdrops
  {
    id: 'bg_rack',
    slot: 'backdrop',
    nameTh: 'ผนังกล่องเลี้ยงสีทึบ',
    descriptionTh: 'ผนังเรียบมาตรฐานเพื่อความสงบของงู',
    cost: 0,
    unlockRequirementTh: 'ปลดล็อกตั้งแต่เริ่มเกม',
    unlockType: 'free',
    unlockCount: 0,
    appealBonus: 0,
    previewColor: '#222A25',
  },
  {
    id: 'bg_cork',
    slot: 'backdrop',
    nameTh: 'ผนังเปลือกไม้คอร์ก (Cork Wall)',
    descriptionTh: 'พื้นผิวเปลือกไม้ธรรมชาติสไตล์ตู้อนุรักษ์',
    cost: 800,
    unlockRequirementTh: 'พร้อมซื้อทันที',
    unlockType: 'free',
    unlockCount: 0,
    appealBonus: 5,
    previewColor: '#5C402D',
  },
  {
    id: 'bg_jungle',
    slot: 'backdrop',
    nameTh: 'ฉากหลังป่าดิบชื้นยามเช้า',
    descriptionTh: 'ต้นไม้เขตร้อนและเถาวัลย์เขียวขจีสไตล์พิกเซล',
    cost: 1600,
    unlockRequirementTh: 'ฟักลูกงูสำเร็จ 3 ตัว',
    unlockType: 'bred',
    unlockCount: 3,
    appealBonus: 9,
    previewColor: '#1E4631',
  },
  {
    id: 'bg_night',
    slot: 'backdrop',
    nameTh: 'ฉากกลางคืนแสงจันทร์ (Moonlight)',
    descriptionTh: 'บรรยากาศแสงไฟกลางคืนสุดพรีเมียมสำหรับมอร์ฟแรร์',
    cost: 2600,
    unlockRequirementTh: 'ค้นพบมอร์ฟครบ 10 แบบ',
    unlockType: 'morphs',
    unlockCount: 10,
    appealBonus: 14,
    previewColor: '#151B2E',
  },

  // Hides
  {
    id: 'hide_plastic',
    slot: 'hide',
    nameTh: 'กล่องหลบซ่อนสีดำ',
    descriptionTh: 'บ้านหลบซ่อนพื้นฐานช่วยลดความเครียดให้งู',
    cost: 0,
    unlockRequirementTh: 'ปลดล็อกตั้งแต่เริ่มเกม',
    unlockType: 'free',
    unlockCount: 0,
    appealBonus: 0,
    previewColor: '#2B3036',
  },
  {
    id: 'hide_wood',
    slot: 'hide',
    nameTh: 'โพรงขอนไม้ธรรมชาติ',
    descriptionTh: 'ขอนไม้กลวงผิวหยาบ ช่วยให้ลอกคราบง่ายและดูเป็นธรรมชาติ',
    cost: 700,
    unlockRequirementTh: 'พร้อมซื้อทันที',
    unlockType: 'free',
    unlockCount: 0,
    appealBonus: 5,
    previewColor: '#785133',
  },
  {
    id: 'hide_rock',
    slot: 'hide',
    nameTh: 'ถ้ำหินซ้อน (Rock Cave)',
    descriptionTh: 'ถ้ำหินจำลองทรงเรขาคณิตสำหรับนอนขดตัว',
    cost: 1500,
    unlockRequirementTh: 'ผ่านไปถึงวันที่ 5',
    unlockType: 'day',
    unlockCount: 5,
    appealBonus: 9,
    previewColor: '#5B646D',
  },
  {
    id: 'hide_temple',
    slot: 'hide',
    nameTh: 'ซากวิหารโบราณ (Aztec Ruin)',
    descriptionTh: 'ประติมากรรมหินโบราณ เพิ่มความอลังการให้ตู้โชว์',
    cost: 2800,
    unlockRequirementTh: 'ฟักลูกงูสำเร็จ 6 ตัว',
    unlockType: 'bred',
    unlockCount: 6,
    appealBonus: 15,
    previewColor: '#8B7B58',
  },

  // Plants & Props
  {
    id: 'plant_none',
    slot: 'plant',
    nameTh: 'ถ้วยน้ำมาตรฐาน',
    descriptionTh: 'ถ้วยน้ำดื่มเซรามิกเรียบง่าย',
    cost: 0,
    unlockRequirementTh: 'ปลดล็อกตั้งแต่เริ่มเกม',
    unlockType: 'free',
    unlockCount: 0,
    appealBonus: 0,
    previewColor: '#60A5FA',
  },
  {
    id: 'plant_fern',
    slot: 'plant',
    nameTh: 'ต้นเฟิร์นเขียว & ขอนกิ่งไม้',
    descriptionTh: 'เพิ่มพุ่มเฟิร์นและกิ่งไม้ให้ตู้ดูมีชีวิตชีวา',
    cost: 650,
    unlockRequirementTh: 'พร้อมซื้อทันที',
    unlockType: 'free',
    unlockCount: 0,
    appealBonus: 4,
    previewColor: '#3E8E41',
  },
  {
    id: 'plant_monstera',
    slot: 'plant',
    nameTh: 'มอนสเตอร่าใบแฉก & หินประดับ',
    descriptionTh: 'ไม้ใบยอดนิยมในตู้ไบโอแอคทีฟระดับมืออาชีพ',
    cost: 1500,
    unlockRequirementTh: 'ค้นพบมอร์ฟครบ 6 แบบ',
    unlockType: 'morphs',
    unlockCount: 6,
    appealBonus: 8,
    previewColor: '#16A34A',
  },
  {
    id: 'plant_lantern',
    slot: 'plant',
    nameTh: 'โคมความร้อน & เถาวัลย์เรืองแสง',
    descriptionTh: 'ไฟอบอุ่นและเถาวัลย์ประดับตู้โชว์สายประกวด',
    cost: 2400,
    unlockRequirementTh: 'ค้นพบมอร์ฟครบ 12 แบบ',
    unlockType: 'morphs',
    unlockCount: 12,
    appealBonus: 13,
    previewColor: '#F59E0B',
  },
];

export const DEFAULT_DECOR: TerrariumDecorConfig = {
  substrate: 'sub_paper',
  backdrop: 'bg_rack',
  hide: 'hide_plastic',
  plant: 'plant_none',
};

export function getEquipmentCost(eq: EquipmentUpgrade, currentLevel: number): number {
  return eq.baseCost + currentLevel * eq.costStep;
}

export function getFarmStatsFromEquipment(equipmentLevels: Record<string, number>) {
  let survivalRate = 64; // Starter tub baseline 64%
  let clutchSize = 4; // Base 4 eggs
  let growthBonus = 0;

  for (const eq of EQUIPMENT_UPGRADES) {
    const lvl = equipmentLevels[eq.id] || 0;
    survivalRate += lvl * eq.survivalBonusPerLevel;
    clutchSize += lvl * eq.clutchSizeBonusPerLevel;
    growthBonus += lvl * eq.growthSpeedBonusPerLevel;
  }

  return {
    survivalRate: Math.min(98, survivalRate),
    clutchSize,
    growthPerDay: 1 + growthBonus,
  };
}

export function getTerrariumAppealBonus(decor: TerrariumDecorConfig): number {
  const ids = [decor.substrate, decor.backdrop, decor.hide, decor.plant];
  let total = 0;
  for (const id of ids) {
    const item = DECOR_ITEMS.find((d) => d.id === id);
    if (item) total += item.appealBonus;
  }
  return total;
}

export function doesMorphMatchTrend(sex: Sex, genotype: Genotype, trend: MarketTrend): boolean {
  const pheno = evaluatePhenotype(sex, genotype);
  if (trend.targetType === 'complex') {
    return pheno.complex === trend.targetValue;
  }
  if (trend.targetType === 'banana') {
    return getBananaStatus(sex, genotype) !== 'none';
  }
  if (trend.targetType === 'super') {
    return pheno.superCount > 0;
  }
  if (trend.targetType === 'inheritance') {
    if (trend.targetValue === 'recessive') {
      return AUTOSOMAL_GENES.some(
        (g) => g.inheritance === 'recessive' && (genotype.alleles[g.id as GeneId] || 0) === 2
      );
    }
  }
  return false;
}

export function calculateMarketValue(
  sex: Sex,
  genotype: Genotype,
  trend: MarketTrend,
  decorAppeal = 0
): { basePrice: number; trendMultiplier: number; finalMarketPrice: number; matchesTrend: boolean } {
  const pheno = evaluatePhenotype(sex, genotype);
  const matchesTrend = doesMorphMatchTrend(sex, genotype, trend);
  const trendMultiplier = matchesTrend ? trend.multiplier : 1.0;
  const appealMultiplier = 1 + decorAppeal * 0.005; // up to ~+25% market appeal from nice tank!
  const raw = pheno.basePrice * trendMultiplier * appealMultiplier;
  const finalMarketPrice = Math.round(raw / 50) * 50;
  return {
    basePrice: pheno.basePrice,
    trendMultiplier,
    finalMarketPrice,
    matchesTrend,
  };
}

export function computeDailySaleChance(
  askingPrice: number,
  marketValue: number,
  matchesTrend: boolean,
  decorAppeal: number
): number {
  if (askingPrice <= 0) return 0;
  const ratio = askingPrice / Math.max(1, marketValue);
  let baseChance = 0;
  if (ratio <= 0.85) baseChance = 0.88;
  else if (ratio <= 1.0) baseChance = 0.68;
  else if (ratio <= 1.15) baseChance = 0.45;
  else if (ratio <= 1.35) baseChance = 0.24;
  else if (ratio <= 1.6) baseChance = 0.1;
  else baseChance = 0.02;

  if (matchesTrend) baseChance += 0.14;
  baseChance += decorAppeal * 0.003;
  return Math.max(0.02, Math.min(0.95, baseChance));
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function makeListing(
  shopId: ShopId,
  sex: Sex,
  genotype: Genotype,
  priceVariance = 1.0,
  mature = false
): ShopListing {
  const pheno = evaluatePhenotype(sex, genotype);
  const price = Math.max(950, Math.round((pheno.basePrice * priceVariance) / 50) * 50);
  const matureDays = 6;
  const ageDays = mature ? matureDays : Math.random() < 0.4 ? matureDays : 2 + Math.floor(Math.random() * 3);
  return {
    id: `shop_${shopId}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    shopId,
    sex,
    genotype,
    ageDays,
    matureDays,
    price,
    seed: Math.floor(Math.random() * 100000),
  };
}

export function generateDailyShopInventory(): ShopListing[] {
  const listings: ShopListing[] = [];

  // 1. Starter & Classic Shop (6 snakes: budget-friendly ฿1,050 - ฿4,800)
  {
    // Always have at least 1 affordable Normal Female & Male
    listings.push(makeListing('starter_classic', 'F', emptyGenotype(), 0.92, true));
    listings.push(makeListing('starter_classic', 'M', emptyGenotype(), 0.9, true));

    const starterGenes: GeneId[] = ['pastel', 'pinstripe', 'spider', 'fire', 'enchi', 'woma', 'cinnamon'];
    const hetGenes: GeneId[] = ['albino', 'pied', 'clown', 'axanthic', 'hypo'];

    for (let i = 0; i < 4; i++) {
      const g = emptyGenotype();
      const sex: Sex = i % 2 === 0 ? 'M' : 'F';
      if (i < 2) {
        g.alleles[pickRandom(starterGenes)] = 1;
      } else if (i === 2) {
        // Het Recessive budget gem!
        g.alleles[pickRandom(hetGenes)] = 1;
      } else {
        // Single gene + Het recessive
        g.alleles[pickRandom(starterGenes)] = 1;
        if (Math.random() < 0.7) g.alleles[pickRandom(hetGenes)] = 1;
      }
      listings.push(makeListing('starter_classic', sex, g, 0.95 + Math.random() * 0.15));
    }
  }

  // 2. Black Complex Shop (5 snakes)
  {
    const blackGenes: GeneId[] = ['black_pastel', 'black_head', 'headless_axanthic', 'cinnamon'];
    const supportGenes: GeneId[] = ['pastel', 'mojave', 'fire', 'pinstripe'];
    for (let i = 0; i < 5; i++) {
      const g = emptyGenotype();
      const sex: Sex = i % 2 === 0 ? 'M' : 'F';
      const mainGene = blackGenes[i % blackGenes.length];
      if (i === 4 && Math.random() < 0.55) {
        // Occasional Super Black form
        g.alleles[mainGene] = 2;
      } else {
        g.alleles[mainGene] = 1;
        if (i >= 2) {
          g.alleles[pickRandom(supportGenes)] = 1;
        }
        if (Math.random() < 0.35) {
          g.alleles['axanthic'] = Math.random() < 0.25 ? 2 : 1;
        }
      }
      listings.push(makeListing('black_complex', sex, g, 0.95 + Math.random() * 0.2));
    }
  }

  // 3. Bright & Recessive Lab (6 snakes - includes Banana X & Banana Y!)
  {
    // Always offer at least one Banana X (Female Maker) or Banana Y (Male Maker)
    const banX = emptyGenotype();
    banX.banana = { x1: true, x2OrY: false };
    listings.push(makeListing('bright_recessive', 'M', banX, 1.0, true));

    const banY = emptyGenotype();
    banY.banana = { x1: false, x2OrY: true };
    listings.push(makeListing('bright_recessive', 'M', banY, 1.05, true));

    const brightCodoms: GeneId[] = ['mojave', 'lesser', 'pastel', 'enchi', 'fire', 'calico'];
    const recessives: GeneId[] = ['albino', 'pied', 'clown', 'lavender', 'hypo', 'axanthic'];

    for (let i = 0; i < 4; i++) {
      const g = emptyGenotype();
      const sex: Sex = i % 2 === 0 ? 'F' : 'M';
      if (i === 0) {
        // Banana Female or Banana combo
        if (sex === 'F') g.banana = { x1: true, x2OrY: false };
        else g.banana = Math.random() < 0.5 ? { x1: true, x2OrY: false } : { x1: false, x2OrY: true };
        if (Math.random() < 0.5) g.alleles[pickRandom(brightCodoms)] = 1;
      } else if (i === 1) {
        // Visual Recessive
        g.alleles[pickRandom(recessives)] = 2;
      } else if (i === 2) {
        // BEL gene (Mojave or Lesser) + Het recessive
        g.alleles[Math.random() < 0.5 ? 'mojave' : 'lesser'] = 1;
        g.alleles[pickRandom(recessives)] = 1;
      } else {
        const first = pickRandom(brightCodoms);
        const others = brightCodoms.filter((c) => c !== first);
        g.alleles[first] = 1;
        g.alleles[pickRandom(others)] = 1;
      }
      listings.push(makeListing('bright_recessive', sex, g, 0.98 + Math.random() * 0.22));
    }
  }

  // 4. Rare Morph Auction (4 high-tier multi-gene / Super / Double visual)
  {
    const allCodoms: GeneId[] = ['black_pastel', 'black_head', 'headless_axanthic', 'pastel', 'mojave', 'lesser', 'fire', 'enchi'];
    const doms: GeneId[] = ['pinstripe', 'spider', 'woma', 'calico'];
    const recs: GeneId[] = ['albino', 'pied', 'clown', 'axanthic', 'lavender'];

    for (let i = 0; i < 4; i++) {
      const g = emptyGenotype();
      const sex: Sex = i % 2 === 0 ? 'F' : 'M';
      if (i === 0) {
        // Super form + 1 gene
        g.alleles[pickRandom(allCodoms)] = 2;
        g.alleles[pickRandom(doms)] = 1;
      } else if (i === 1) {
        // Visual Recessive + Co-dom
        g.alleles[pickRandom(recs)] = 2;
        g.alleles[pickRandom(allCodoms)] = 1;
      } else if (i === 2) {
        // Banana Multi-gene
        if (sex === 'F') g.banana = { x1: true, x2OrY: Math.random() < 0.2 };
        else g.banana = Math.random() < 0.5 ? { x1: true, x2OrY: false } : { x1: false, x2OrY: true };
        g.alleles[pickRandom(allCodoms)] = 1;
        g.alleles[pickRandom(recs)] = Math.random() < 0.4 ? 2 : 1;
      } else {
        // Triple gene powerhouse
        g.alleles[pickRandom(allCodoms)] = 1;
        g.alleles[pickRandom(doms)] = 1;
        g.alleles[pickRandom(recs)] = 2;
      }
      listings.push(makeListing('rare_auction', sex, g, 1.05 + Math.random() * 0.2, true));
    }
  }

  return listings;
}

export function createNewSnakeFromGenotype(params: {
  name?: string;
  sex: Sex;
  genotype: Genotype;
  ageDays: number;
  matureDays: number;
  terrariumId: string;
  origin: 'shop' | 'bred';
  parents?: { sireName: string; damName: string };
  bornDay: number;
  seed?: number;
}): Snake {
  const pheno = evaluatePhenotype(params.sex, params.genotype);
  const autoName =
    params.name ||
    `${pheno.specialComboName || pheno.nameEn.split(' Het ')[0]} #${Math.floor(100 + Math.random() * 899)}`;
  return {
    id: `snk_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    name: autoName,
    sex: params.sex,
    genotype: params.genotype,
    ageDays: params.ageDays,
    matureDays: params.matureDays,
    isForSale: false,
    askingPrice: pheno.basePrice,
    terrariumId: params.terrariumId,
    origin: params.origin,
    parents: params.parents,
    seed: params.seed ?? Math.floor(Math.random() * 100000),
    bornDay: params.bornDay,
  };
}
