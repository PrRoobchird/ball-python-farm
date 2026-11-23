import { AUTOSOMAL_GENES } from './genes';
import { emptyGenotype, evaluatePhenotype, getBananaStatus } from './genetics';
import {
  DecorItem,
  EquipmentUpgrade,
  ExpoResult,
  ExpoTheme,
  GeneId,
  Genotype,
  MarketTrend,
  PedigreeNode,
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

export const EXPO_THEMES: ExpoTheme[] = [
  {
    id: 'expo_black',
    titleTh: 'Thailand Black Complex Cup',
    descriptionTh: 'ประกวดความคมเข้มของมอร์ฟโทนดำ (Black Pastel, Black Head, Headless Axanthic, Cinnamon)',
    focusType: 'black_complex',
    entryFee: 250,
    firstPrize: 2800,
    repReward: 20,
  },
  {
    id: 'expo_bright',
    titleTh: 'Bright & White Morph Showdown',
    descriptionTh: 'เวทีโชว์สีสันสดใสและงูขาวตาฟ้า/ตาดำ (Pastel, Enchi, Mojave, Lesser, Fire)',
    focusType: 'bright_complex',
    entryFee: 250,
    firstPrize: 2800,
    repReward: 20,
  },
  {
    id: 'expo_super',
    titleTh: 'Super Form Masters Expo',
    descriptionTh: 'ประชันงู Super Form ที่เข้าคู่ยีนเด่นร่วมครบทั้ง 2 ชุด',
    focusType: 'super',
    entryFee: 350,
    firstPrize: 4200,
    repReward: 28,
  },
  {
    id: 'expo_recessive',
    titleTh: 'Recessive Royalty Classic',
    descriptionTh: 'ประกวดยีนด้อยแท้ (Albino, Piebald, Clown, Lavender, Axanthic, Hypo)',
    focusType: 'recessive',
    entryFee: 350,
    firstPrize: 4500,
    repReward: 30,
  },
  {
    id: 'expo_banana',
    titleTh: 'Banana Genetics Showcase',
    descriptionTh: 'ประชันงูสายพันธุ์ Banana (X/Y) และคอมโบสีเหลืองกล้วย',
    focusType: 'banana',
    entryFee: 300,
    firstPrize: 3500,
    repReward: 24,
  },
  {
    id: 'expo_terrarium',
    titleTh: 'Bioactive Vivarium & Health Award',
    descriptionTh: 'ให้คะแนนความสวยงามของตู้เลี้ยง สุขภาพงู และการลอกคราบที่สมบูรณ์แบบ',
    focusType: 'terrarium',
    entryFee: 200,
    firstPrize: 2400,
    repReward: 18,
  },
];

export interface DreamMorphGoal {
  id: string;
  nameEn: string;
  nameTh: string;
  difficultyTh: string;
  descriptionTh: string;
  requiredAlleles: Partial<Record<GeneId, 1 | 2>>;
  requireBanana?: boolean;
}

export const DREAM_GOALS: DreamMorphGoal[] = [
  {
    id: 'goal_bel',
    nameEn: 'Blue-Eyed Leucistic (BEL)',
    nameTh: 'งูขาวตาฟ้า (BEL)',
    difficultyTh: 'ระดับกลาง · 1–2 รุ่น',
    descriptionTh: 'ใช้ Mojave × Mojave หรือ Lesser × Lesser หรือ Mojave × Lesser (ได้ลูก BEL ทันที 25%)',
    requiredAlleles: { mojave: 1, lesser: 1 },
  },
  {
    id: 'goal_bumblebee',
    nameEn: 'Bumblebee (Pastel Spider)',
    nameTh: 'บัมเบิลบี (พาสเทล สไปเดอร์)',
    difficultyTh: 'เริ่มต้นง่าย · 1 รุ่น',
    descriptionTh: 'จับคู่ Pastel × Spider ให้โอกาสเกิด Bumblebee 25% ทันทีในครอกแรก',
    requiredAlleles: { pastel: 1, spider: 1 },
  },
  {
    id: 'goal_super_black_head',
    nameEn: 'Super Black Head',
    nameTh: 'ซูเปอร์ แบล็กเฮด',
    difficultyTh: 'ระดับกลาง · 1–2 รุ่น',
    descriptionTh: 'จับคู่ Black Head × Black Head ได้ Super Black Head 25% ในกลุ่ม Black Complex',
    requiredAlleles: { black_head: 2 },
  },
  {
    id: 'goal_super_headless_ax',
    nameEn: 'Super Headless Axanthic',
    nameTh: 'ซูเปอร์ เฮดเลส แอกแซนทิก',
    difficultyTh: 'ระดับกลาง · 1–2 รุ่น',
    descriptionTh: 'จับคู่ Headless Axanthic × Headless Axanthic ได้ Super Form สีเทาชาร์โคลเข้ม 25%',
    requiredAlleles: { headless_axanthic: 2 },
  },
  {
    id: 'goal_snow',
    nameEn: 'Snow (Albino Axanthic)',
    nameTh: 'สโนว์ (อัลไบโน แอกแซนทิก)',
    difficultyTh: 'ระดับสูง · 2 รุ่น (F2)',
    descriptionTh: 'ต้องมียีนด้อย Albino และ Axanthic ครบทั้ง 2 ชุด (2+2) จากการผสมข้ามรุ่น',
    requiredAlleles: { albino: 2, axanthic: 2 },
  },
  {
    id: 'goal_panda_pied',
    nameEn: 'Panda Pied (Super Black Pastel Pied)',
    nameTh: 'แพนด้าพาย (ซูเปอร์ แบล็กพาสเทล พายบอลด์)',
    difficultyTh: 'ระดับตำนาน · 2–3 รุ่น',
    descriptionTh: 'เป้าหมายยอดฮิตในวงการ: Super Black Pastel + Piebald แท้ เกิดเป็นงูสีขาวตัดดำสนิท!',
    requiredAlleles: { black_pastel: 2, pied: 2 },
  },
  {
    id: 'goal_banana_pastel_clown',
    nameEn: 'Banana Pastel Clown',
    nameTh: 'บานาน่า พาสเทล คลาวน์',
    difficultyTh: 'ระดับตำนาน · 2–3 รุ่น',
    descriptionTh: 'รวมยีนโครโมโซมเพศ Banana + Pastel + ยีนด้อย Clown แท้ (2 ชุด)',
    requiredAlleles: { pastel: 1, clown: 2 },
    requireBanana: true,
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
  let survivalRate = 64;
  let clutchSize = 4;
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
  decorAppeal = 0,
  reputation = 0,
  posHets?: Partial<Record<GeneId, number>>,
  dnaTested?: boolean
): {
  basePrice: number;
  trendMultiplier: number;
  repMultiplier: number;
  finalMarketPrice: number;
  matchesTrend: boolean;
} {
  const pheno = evaluatePhenotype(sex, genotype, { posHets, dnaTested });
  const matchesTrend = doesMorphMatchTrend(sex, genotype, trend);
  const trendMultiplier = matchesTrend ? trend.multiplier : 1.0;
  const appealMultiplier = 1 + decorAppeal * 0.005;
  const repMultiplier = 1 + Math.min(0.4, reputation * 0.002); // up to +40% at 200 rep
  const raw = pheno.basePrice * trendMultiplier * appealMultiplier * repMultiplier;
  const finalMarketPrice = Math.round(raw / 50) * 50;
  return {
    basePrice: pheno.basePrice,
    trendMultiplier,
    repMultiplier,
    finalMarketPrice,
    matchesTrend,
  };
}

export function computeDailySaleChance(
  askingPrice: number,
  marketValue: number,
  matchesTrend: boolean,
  decorAppeal: number,
  reputation = 0
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
  baseChance += Math.min(0.12, reputation * 0.0006);
  return Math.max(0.02, Math.min(0.96, baseChance));
}

export function scoreSnakeForExpo(
  snake: Snake,
  theme: ExpoTheme,
  decorAppeal: number,
  day: number
): ExpoResult {
  const pheno = evaluatePhenotype(snake.sex, snake.genotype, {
    posHets: snake.posHets,
    dnaTested: snake.dnaTested,
  });

  let score = 40;
  score += pheno.visualGeneCount * 10;
  score += pheno.superCount * 14;
  score += Math.round(decorAppeal * 0.8);
  score += snake.hunger >= 75 ? 8 : snake.hunger >= 40 ? 3 : -8;

  if (snake.isInBlue) {
    score -= 10; // In blue cloudy eyes slightly dull colors
  } else if (day <= snake.freshShedUntilDay) {
    score += 15; // Fresh shed vibrant iridescent sheen!
  }

  let matchesTheme = false;
  if (theme.focusType === 'black_complex' && pheno.complex === 'black_complex') matchesTheme = true;
  if (theme.focusType === 'bright_complex' && pheno.complex === 'bright_complex') matchesTheme = true;
  if (theme.focusType === 'super' && pheno.superCount > 0) matchesTheme = true;
  if (theme.focusType === 'banana' && pheno.bananaStatus !== 'none') matchesTheme = true;
  if (
    theme.focusType === 'recessive' &&
    AUTOSOMAL_GENES.some(
      (g) => g.inheritance === 'recessive' && (snake.genotype.alleles[g.id as GeneId] || 0) === 2
    )
  ) {
    matchesTheme = true;
  }
  if (theme.focusType === 'terrarium' && decorAppeal >= 16) matchesTheme = true;

  if (matchesTheme) score += 28;
  score += Math.floor(Math.random() * 11); // judge variance

  // Rival benchmark scores
  const firstThreshold = 104;
  const secondThreshold = 84;
  const thirdThreshold = 66;

  let rank: 1 | 2 | 3 | 4 = 4;
  let prizeMoney = 0;
  let repGained = 2;

  if (score >= firstThreshold) {
    rank = 1;
    prizeMoney = theme.firstPrize;
    repGained = theme.repReward;
  } else if (score >= secondThreshold) {
    rank = 2;
    prizeMoney = Math.round(theme.firstPrize * 0.5);
    repGained = Math.round(theme.repReward * 0.6);
  } else if (score >= thirdThreshold) {
    rank = 3;
    prizeMoney = Math.round(theme.firstPrize * 0.25);
    repGained = Math.round(theme.repReward * 0.35);
  }

  return {
    day,
    themeTitleTh: theme.titleTh,
    snakeName: snake.name,
    morphEn: pheno.specialComboName || pheno.nameEn,
    score,
    rank,
    prizeMoney,
    repGained,
  };
}

export function analyzeDreamGoal(
  goal: DreamMorphGoal,
  snakes: Snake[],
  shopListings: ShopListing[]
): {
  readinessPct: number;
  ownedKeys: string[];
  missingKeys: string[];
  bestSire?: Snake;
  bestDam?: Snake;
  recommendedShop?: ShopListing;
  adviceTh: string;
} {
  const requiredGenes = Object.entries(goal.requiredAlleles) as Array<[GeneId, 1 | 2]>;
  const totalPoints = requiredGenes.reduce((sum, [, count]) => sum + count, 0) + (goal.requireBanana ? 1 : 0);

  const countOwnedOnSnake = (s: Snake | ShopListing, posHets?: Partial<Record<GeneId, number>>, dnaTested?: boolean) => {
    let pts = 0;
    const keys: string[] = [];
    for (const [gid, needed] of requiredGenes) {
      const actual = s.genotype.alleles[gid] || 0;
      const masked = !dnaTested && posHets?.[gid];
      const known = masked ? 0 : actual;
      const contrib = Math.min(needed, known);
      if (contrib > 0) {
        pts += contrib;
        keys.push(`${gid}:${contrib}`);
      }
    }
    if (goal.requireBanana && getBananaStatus(s.sex, s.genotype) !== 'none') {
      pts += 1;
      keys.push('banana');
    }
    return { pts, keys };
  };

  // Check coverage across farm (how many target alleles we have on at least one Male & Female)
  let bestSire: Snake | undefined;
  let bestSirePts = 0;
  let bestDam: Snake | undefined;
  let bestDamPts = 0;

  const ownedGenePool = new Set<string>();

  for (const s of snakes) {
    const res = countOwnedOnSnake(s, s.posHets, s.dnaTested);
    res.keys.forEach((k) => ownedGenePool.add(k));
    if (s.sex === 'M' && res.pts > bestSirePts) {
      bestSirePts = res.pts;
      bestSire = s;
    }
    if (s.sex === 'F' && res.pts > bestDamPts) {
      bestDamPts = res.pts;
      bestDam = s;
    }
  }

  // Compute readiness across farm
  let coveredPoints = 0;
  const ownedKeys: string[] = [];
  const missingKeys: string[] = [];

  for (const [gid, needed] of requiredGenes) {
    const maxMale = snakes
      .filter((s) => s.sex === 'M')
      .reduce((m, s) => Math.max(m, (!s.dnaTested && s.posHets?.[gid]) ? 0 : (s.genotype.alleles[gid] || 0)), 0);
    const maxFemale = snakes
      .filter((s) => s.sex === 'F')
      .reduce((m, s) => Math.max(m, (!s.dnaTested && s.posHets?.[gid]) ? 0 : (s.genotype.alleles[gid] || 0)), 0);

    if (needed === 2) {
      const havePair = Math.min(1, maxMale) + Math.min(1, maxFemale);
      coveredPoints += havePair;
      if (havePair === 2) ownedKeys.push(`${gid} (ครบคู่พ่อ-แม่)`);
      else if (havePair === 1) {
        ownedKeys.push(`${gid} (มี 1 ฝั่ง)`);
        missingKeys.push(`${gid} อีก 1 ฝั่ง`);
      } else {
        missingKeys.push(`${gid} (ทั้งพ่อและแม่)`);
      }
    } else {
      const haveOne = maxMale >= 1 || maxFemale >= 1 ? 1 : 0;
      coveredPoints += haveOne;
      if (haveOne === 1) ownedKeys.push(gid);
      else missingKeys.push(gid);
    }
  }

  if (goal.requireBanana) {
    const hasBan = snakes.some((s) => getBananaStatus(s.sex, s.genotype) !== 'none');
    if (hasBan) {
      coveredPoints += 1;
      ownedKeys.push('Banana');
    } else {
      missingKeys.push('Banana');
    }
  }

  const readinessPct = Math.round((coveredPoints / Math.max(1, totalPoints)) * 100);

  // Recommend best shop listing containing missing genes
  let recommendedShop: ShopListing | undefined;
  let bestShopScore = 0;
  if (missingKeys.length > 0) {
    for (const l of shopListings) {
      let score = 0;
      for (const [gid, needed] of requiredGenes) {
        const cnt = l.genotype.alleles[gid] || 0;
        if (cnt > 0) score += Math.min(needed, cnt);
      }
      if (goal.requireBanana && getBananaStatus(l.sex, l.genotype) !== 'none') score += 1;
      if (score > bestShopScore) {
        bestShopScore = score;
        recommendedShop = l;
      }
    }
  }

  let adviceTh = '';
  if (readinessPct === 100 && bestSire && bestDam) {
    adviceTh = `พร้อมผสมแล้ว! ลองจับคู่ ${bestSire.name} (♂) × ${bestDam.name} (♀) เพื่อลุ้น ${goal.nameEn}`;
  } else if (recommendedShop) {
    const ph = evaluatePhenotype(recommendedShop.sex, recommendedShop.genotype);
    adviceTh = `ยังขาดยีนสำคัญ: ลองซื้อ "${ph.nameEn}" (${recommendedShop.sex === 'M' ? '♂' : '♀'}) จากตลาดในราคา ฿${recommendedShop.price.toLocaleString()}`;
  } else {
    adviceTh = `สะสมพ่อแม่พันธุ์ที่มีกลุ่มยีนเป้าหมายจากตลาด หรือรีเฟรชร้านค้าเพื่อหามอร์ฟตั้งต้น`;
  }

  return {
    readinessPct,
    ownedKeys,
    missingKeys,
    bestSire,
    bestDam,
    recommendedShop,
    adviceTh,
  };
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

  // 1. Starter & Classic Shop
  {
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
        g.alleles[pickRandom(hetGenes)] = 1;
      } else {
        g.alleles[pickRandom(starterGenes)] = 1;
        if (Math.random() < 0.7) g.alleles[pickRandom(hetGenes)] = 1;
      }
      listings.push(makeListing('starter_classic', sex, g, 0.95 + Math.random() * 0.15));
    }
  }

  // 2. Black Complex Shop
  {
    const blackGenes: GeneId[] = ['black_pastel', 'black_head', 'headless_axanthic', 'cinnamon'];
    const supportGenes: GeneId[] = ['pastel', 'mojave', 'fire', 'pinstripe'];
    for (let i = 0; i < 5; i++) {
      const g = emptyGenotype();
      const sex: Sex = i % 2 === 0 ? 'M' : 'F';
      const mainGene = blackGenes[i % blackGenes.length];
      if (i === 4 && Math.random() < 0.55) {
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

  // 3. Bright & Recessive Lab
  {
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
        if (sex === 'F') g.banana = { x1: true, x2OrY: false };
        else g.banana = Math.random() < 0.5 ? { x1: true, x2OrY: false } : { x1: false, x2OrY: true };
        if (Math.random() < 0.5) g.alleles[pickRandom(brightCodoms)] = 1;
      } else if (i === 1) {
        g.alleles[pickRandom(recessives)] = 2;
      } else if (i === 2) {
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

  // 4. Rare Morph Auction
  {
    const allCodoms: GeneId[] = ['black_pastel', 'black_head', 'headless_axanthic', 'pastel', 'mojave', 'lesser', 'fire', 'enchi'];
    const doms: GeneId[] = ['pinstripe', 'spider', 'woma', 'calico'];
    const recs: GeneId[] = ['albino', 'pied', 'clown', 'axanthic', 'lavender'];

    for (let i = 0; i < 4; i++) {
      const g = emptyGenotype();
      const sex: Sex = i % 2 === 0 ? 'F' : 'M';
      if (i === 0) {
        g.alleles[pickRandom(allCodoms)] = 2;
        g.alleles[pickRandom(doms)] = 1;
      } else if (i === 1) {
        g.alleles[pickRandom(recs)] = 2;
        g.alleles[pickRandom(allCodoms)] = 1;
      } else if (i === 2) {
        if (sex === 'F') g.banana = { x1: true, x2OrY: Math.random() < 0.2 };
        else g.banana = Math.random() < 0.5 ? { x1: true, x2OrY: false } : { x1: false, x2OrY: true };
        g.alleles[pickRandom(allCodoms)] = 1;
        g.alleles[pickRandom(recs)] = Math.random() < 0.4 ? 2 : 1;
      } else {
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
  posHets?: Partial<Record<GeneId, number>>;
  ageDays: number;
  matureDays: number;
  terrariumId: string;
  origin: 'shop' | 'bred';
  parents?: { sireName: string; damName: string };
  pedigree?: PedigreeNode;
  bornDay: number;
  seed?: number;
}): Snake {
  const pheno = evaluatePhenotype(params.sex, params.genotype, {
    posHets: params.posHets,
    dnaTested: false,
  });
  const baseTitle = pheno.specialComboName || pheno.nameEn.split(' Het ')[0].split(' 50%')[0].split(' 66%')[0];
  const autoName = params.name || `${baseTitle} #${Math.floor(100 + Math.random() * 899)}`;
  return {
    id: `snk_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    name: autoName,
    sex: params.sex,
    genotype: params.genotype,
    posHets: params.posHets,
    dnaTested: !params.posHets || Object.keys(params.posHets).length === 0,
    ageDays: params.ageDays,
    matureDays: params.matureDays,
    hunger: 92,
    isInBlue: false,
    nextShedDay: params.bornDay + 4 + Math.floor(Math.random() * 2),
    freshShedUntilDay: params.bornDay + 1,
    cooldownUntilDay: 0,
    isForSale: false,
    askingPrice: pheno.basePrice,
    terrariumId: params.terrariumId,
    origin: params.origin,
    parents: params.parents,
    pedigree: params.pedigree,
    seed: params.seed ?? Math.floor(Math.random() * 100000),
    bornDay: params.bornDay,
  };
}
