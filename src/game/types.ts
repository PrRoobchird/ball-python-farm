export type GeneInheritance = 'dominant' | 'recessive' | 'codominant' | 'sex_linked';

export type ColorComplex = 'normal' | 'black_complex' | 'bright_complex';

export type GeneId =
  // Dominant
  | 'pinstripe'
  | 'spider'
  | 'woma'
  | 'calico'
  // Recessive
  | 'albino'
  | 'pied'
  | 'clown'
  | 'axanthic'
  | 'lavender'
  | 'hypo'
  // Co-dominant (Incomplete Dominant)
  | 'black_pastel'
  | 'black_head'
  | 'headless_axanthic'
  | 'cinnamon'
  | 'pastel'
  | 'mojave'
  | 'lesser'
  | 'fire'
  | 'enchi';

export interface GeneDefinition {
  id: GeneId | 'banana';
  nameEn: string;
  nameTh: string;
  superNameEn?: string;
  superNameTh?: string;
  inheritance: GeneInheritance;
  complex: ColorComplex;
  baseValueMultiplier: number;
  superValueMultiplier?: number;
  rarityTier: 1 | 2 | 3 | 4;
  shortCode: string;
  descriptionTh: string;
}

export type Sex = 'M' | 'F';

/**
 * Chromosomal representation for Sex-Linked Banana gene:
 * Female (XX): [x1, x2] where each allele is boolean (has Banana or not)
 * Male (XY): [x, y] where x is boolean (Banana on X) and y is boolean (Banana on Y)
 */
export interface SexChromosomeState {
  x1: boolean; // Always X
  x2OrY: boolean; // Second X for Female, Y for Male
}

export interface Genotype {
  /** Autosomal genes: allele count 0 (wild), 1 (het / single), 2 (hom / super) */
  alleles: Partial<Record<GeneId, 1 | 2>>;
  /** Sex chromosomes for Banana (X / Y linked) */
  banana: SexChromosomeState;
}

export type BananaStatus =
  | 'none'
  | 'banana_female'
  | 'super_banana_female'
  | 'banana_x_male' // Female Maker (X^B Y)
  | 'banana_y_male' // Male Maker (X Y^B)
  | 'super_banana_male'; // X^B Y^B

export type MorphRarity = 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic';

export interface PhenotypeSummary {
  /** Unique deterministic key for Morph Codex discovery */
  phenotypeKey: string;
  nameEn: string;
  nameTh: string;
  hetLabelTh: string;
  complex: ColorComplex;
  visualGeneCount: number;
  superCount: number;
  hetCount: number;
  bananaStatus: BananaStatus;
  rarity: MorphRarity;
  basePrice: number;
  specialComboName?: string;
  traits: string[];
}

export type DecorSlot = 'substrate' | 'backdrop' | 'hide' | 'plant';

export interface TerrariumDecorConfig {
  substrate: string;
  backdrop: string;
  hide: string;
  plant: string;
}

export interface Snake {
  id: string;
  name: string;
  sex: Sex;
  genotype: Genotype;
  ageDays: number;
  matureDays: number;
  isForSale: boolean;
  askingPrice: number;
  terrariumId: string;
  origin: 'shop' | 'bred';
  parents?: {
    sireName: string;
    damName: string;
  };
  seed: number;
  bornDay: number;
}

export interface Terrarium {
  id: string;
  name: string;
  decor: TerrariumDecorConfig;
}

export interface EggInClutch {
  id: string;
  sex: Sex;
  genotype: Genotype;
  survived: boolean;
}

export interface BreedingClutch {
  id: string;
  sireId: string;
  damId: string;
  sireName: string;
  damName: string;
  laidDay: number;
  hatchDay: number;
  survivalRateSnapshot: number;
  eggs: EggInClutch[];
  hatched: boolean;
}

export interface ShopListing {
  id: string;
  shopId: ShopId;
  sex: Sex;
  genotype: Genotype;
  ageDays: number;
  matureDays: number;
  price: number;
  seed: number;
}

export type ShopId = 'starter_classic' | 'black_complex' | 'bright_recessive' | 'rare_auction';

export interface ShopDefinition {
  id: ShopId;
  nameTh: string;
  subtitleTh: string;
  specialtyTh: string;
}

export interface MarketTrend {
  id: string;
  titleTh: string;
  descriptionTh: string;
  targetType: 'complex' | 'inheritance' | 'super' | 'banana';
  targetValue: string;
  multiplier: number;
}

export interface EquipmentUpgrade {
  id: string;
  nameTh: string;
  category: 'incubator' | 'climate' | 'nutrition';
  descriptionTh: string;
  maxLevel: number;
  baseCost: number;
  costStep: number;
  survivalBonusPerLevel: number; // percentage points, e.g. +5
  clutchSizeBonusPerLevel: number; // +0.5 etc
  growthSpeedBonusPerLevel: number; // extra age/day
}

export interface DecorItem {
  id: string;
  slot: DecorSlot;
  nameTh: string;
  descriptionTh: string;
  cost: number;
  unlockRequirementTh: string;
  unlockType: 'free' | 'morphs' | 'day' | 'bred';
  unlockCount: number;
  appealBonus: number;
  previewColor: string;
}

export interface GameLogEntry {
  id: string;
  day: number;
  text: string;
  tone: 'info' | 'success' | 'warning' | 'rare';
}

export interface GameState {
  day: number;
  money: number;
  snakes: Snake[];
  terrariums: Terrarium[];
  clutches: BreedingClutch[];
  shopListings: ShopListing[];
  equipmentLevels: Record<string, number>;
  unlockedDecorIds: string[];
  discoveredMorphs: Record<
    string,
    {
      key: string;
      nameEn: string;
      nameTh: string;
      complex: ColorComplex;
      rarity: MorphRarity;
      firstDiscoveredDay: number;
      countProduced: number;
      sampleSex: Sex;
      sampleGenotype: Genotype;
    }
  >;
  marketTrend: MarketTrend;
  totalBred: number;
  totalSold: number;
  logs: GameLogEntry[];
  hasSeenIntro: boolean;
}
