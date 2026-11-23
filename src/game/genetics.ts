import { AUTOSOMAL_GENES, BANANA_GENE, GENE_MAP } from './genes';
import {
  BananaStatus,
  ColorComplex,
  EggInClutch,
  GeneId,
  Genotype,
  MorphRarity,
  PedigreeNode,
  PhenotypeSummary,
  Sex,
  Snake,
} from './types';

export function emptyGenotype(): Genotype {
  return {
    alleles: {},
    banana: { x1: false, x2OrY: false },
  };
}

export function cloneGenotype(g: Genotype): Genotype {
  return {
    alleles: { ...g.alleles },
    banana: { ...g.banana },
  };
}

export function getBananaStatus(sex: Sex, genotype: Genotype): BananaStatus {
  const { x1, x2OrY } = genotype.banana;
  if (sex === 'F') {
    if (x1 && x2OrY) return 'super_banana_female';
    if (x1 || x2OrY) return 'banana_female';
    return 'none';
  }
  if (x1 && x2OrY) return 'super_banana_male';
  if (x1 && !x2OrY) return 'banana_x_male';
  if (!x1 && x2OrY) return 'banana_y_male';
  return 'none';
}

export function bananaStatusLabelTh(status: BananaStatus): string {
  switch (status) {
    case 'banana_female':
      return 'Banana (เพศเมีย X^B X)';
    case 'super_banana_female':
      return 'Super Banana (เพศเมีย X^B X^B)';
    case 'banana_x_male':
      return 'Banana X (Female Maker · X^B Y)';
    case 'banana_y_male':
      return 'Banana Y (Male Maker · X Y^B)';
    case 'super_banana_male':
      return 'Super Banana (เพศผู้ X^B Y^B)';
    default:
      return '';
  }
}

export function bananaStatusShortEn(status: BananaStatus): string {
  switch (status) {
    case 'banana_female':
      return 'Banana';
    case 'super_banana_female':
    case 'super_banana_male':
      return 'Super Banana';
    case 'banana_x_male':
      return 'Banana (X / Female Maker)';
    case 'banana_y_male':
      return 'Banana (Y / Male Maker)';
    default:
      return '';
  }
}

export interface PhenotypeOptions {
  posHets?: Partial<Record<GeneId, number>>;
  dnaTested?: boolean;
}

export function evaluatePhenotype(
  sex: Sex,
  genotype: Genotype,
  options?: PhenotypeOptions
): PhenotypeSummary {
  const visualEn: string[] = [];
  const visualTh: string[] = [];
  const hetEn: string[] = [];
  const hetTh: string[] = [];
  const keyParts: string[] = [];
  const traits: string[] = [];

  const posHets = !options?.dnaTested ? options?.posHets : undefined;

  let visualGeneCount = 0;
  let superCount = 0;
  let hetCount = 0;
  let blackScore = 0;
  let brightScore = 0;
  let valueMultiplier = 1;

  const bananaStatus = getBananaStatus(sex, genotype);
  if (bananaStatus !== 'none') {
    const isSuper =
      bananaStatus === 'super_banana_female' || bananaStatus === 'super_banana_male';
    visualGeneCount += isSuper ? 2 : 1;
    brightScore += isSuper ? 3 : 2;
    if (isSuper) {
      superCount += 1;
      visualEn.push(BANANA_GENE.superNameEn || 'Super Banana');
      visualTh.push(BANANA_GENE.superNameTh || 'ซูเปอร์ บานาน่า');
      keyParts.push('ban:2');
      valueMultiplier *= BANANA_GENE.superValueMultiplier || 6;
      traits.push('Super Banana');
    } else {
      const enTag =
        bananaStatus === 'banana_x_male'
          ? 'Banana X'
          : bananaStatus === 'banana_y_male'
            ? 'Banana Y'
            : 'Banana';
      const thTag =
        bananaStatus === 'banana_x_male'
          ? 'บานาน่า X (Female Maker)'
          : bananaStatus === 'banana_y_male'
            ? 'บานาน่า Y (Male Maker)'
            : 'บานาน่า';
      visualEn.push(enTag);
      visualTh.push(thTag);
      keyParts.push('ban:1');
      valueMultiplier *= BANANA_GENE.baseValueMultiplier;
      traits.push(thTag);
    }
  }

  const mojCount = genotype.alleles.mojave || 0;
  const lesCount = genotype.alleles.lesser || 0;
  const isBelAllelic = mojCount === 1 && lesCount === 1;

  for (const gene of AUTOSOMAL_GENES) {
    const id = gene.id as GeneId;
    const count = genotype.alleles[id] || 0;
    const posPct = posHets?.[id];

    if (gene.inheritance === 'recessive' && count !== 2 && posPct) {
      // Mask hidden allele behind Pos Het percentage until DNA tested / proven out
      hetEn.push(`${posPct}% Pos Het ${gene.nameEn}`);
      hetTh.push(`${posPct}% Pos Het ${gene.nameTh}`);
      valueMultiplier *= posPct >= 66 ? 1.12 : 1.07;
      continue;
    }

    if (count === 0) continue;

    if (gene.inheritance === 'dominant') {
      visualGeneCount += 1;
      visualEn.push(gene.nameEn);
      visualTh.push(gene.nameTh);
      keyParts.push(`${id}:1`);
      traits.push(gene.nameTh);
      valueMultiplier *= count === 2 ? gene.baseValueMultiplier * 1.15 : gene.baseValueMultiplier;
      if (gene.complex === 'black_complex') blackScore += 1;
      else brightScore += 1;
    } else if (gene.inheritance === 'codominant') {
      if (count === 2) {
        visualGeneCount += 2;
        superCount += 1;
        visualEn.push(gene.superNameEn || `Super ${gene.nameEn}`);
        visualTh.push(gene.superNameTh || `ซูเปอร์ ${gene.nameTh}`);
        keyParts.push(`${id}:2`);
        traits.push(gene.superNameTh || `ซูเปอร์ ${gene.nameTh}`);
        valueMultiplier *= gene.superValueMultiplier || gene.baseValueMultiplier * 2.4;
        if (gene.complex === 'black_complex') blackScore += 3;
        else brightScore += 3;
      } else {
        visualGeneCount += 1;
        visualEn.push(gene.nameEn);
        visualTh.push(gene.nameTh);
        keyParts.push(`${id}:1`);
        traits.push(gene.nameTh);
        valueMultiplier *= gene.baseValueMultiplier;
        if (gene.complex === 'black_complex') blackScore += 1;
        else brightScore += 1;
      }
    } else if (gene.inheritance === 'recessive') {
      if (count === 2) {
        visualGeneCount += 2;
        visualEn.push(gene.nameEn);
        visualTh.push(gene.nameTh);
        keyParts.push(`${id}:2`);
        traits.push(`${gene.nameTh} (แท้)`);
        valueMultiplier *= gene.baseValueMultiplier;
        if (gene.complex === 'black_complex') blackScore += 2;
        else brightScore += 2;
      } else {
        hetCount += 1;
        hetEn.push(`Het ${gene.nameEn}`);
        hetTh.push(`100% Het ${gene.nameTh}`);
        valueMultiplier *= 1.18;
      }
    }
  }

  let specialComboName: string | undefined;
  const has = (id: GeneId, min = 1) => (genotype.alleles[id] || 0) >= min;
  const hasBan = bananaStatus !== 'none';

  if (isBelAllelic && visualGeneCount === 2) {
    specialComboName = 'Blue-Eyed Leucistic (Mojave Lesser BEL)';
  } else if (has('albino', 2) && has('axanthic', 2)) {
    specialComboName = 'Snow';
  } else if (has('pastel', 1) && has('spider', 1) && visualGeneCount === 2) {
    specialComboName = 'Bumblebee';
  } else if (has('pastel', 2) && has('spider', 1) && visualGeneCount === 3) {
    specialComboName = 'Killer Bee';
  } else if (has('pastel', 1) && has('pinstripe', 1) && visualGeneCount === 2) {
    specialComboName = 'Lemon Blast';
  } else if (has('pastel', 1) && has('mojave', 1) && visualGeneCount === 2) {
    specialComboName = 'Pastave';
  } else if (has('black_pastel', 1) && has('pastel', 1) && visualGeneCount === 2) {
    specialComboName = 'Pewter';
  } else if (has('black_pastel', 2) && has('pied', 2)) {
    specialComboName = 'Panda Pied';
  } else if (has('black_pastel', 1) && has('albino', 2) && has('pied', 2)) {
    specialComboName = 'Black Pastel Albino Pied';
  } else if (has('fire', 1) && has('pastel', 1) && visualGeneCount === 2) {
    specialComboName = 'Firefly';
  } else if (has('cinnamon', 1) && has('pastel', 1) && visualGeneCount === 2) {
    specialComboName = 'Pewter (Cin)';
  } else if (hasBan && has('pastel', 1) && has('clown', 2)) {
    specialComboName = 'Banana Pastel Clown';
  } else if (hasBan && has('black_pastel', 1) && visualGeneCount === 2) {
    specialComboName = 'Banana Black Pastel';
  }

  const phenotypeKey = keyParts.length > 0 ? keyParts.join('|') : 'normal';

  let nameEn = visualEn.length > 0 ? visualEn.join(' ') : 'Normal (Wild Type)';
  let nameTh = visualTh.length > 0 ? visualTh.join(' · ') : 'ดั้งเดิม (Normal / Wild Type)';

  if (specialComboName) {
    nameEn = specialComboName;
  }

  if (hetEn.length > 0) {
    nameEn = `${nameEn} ${hetEn.join(' / ')}`;
  }

  const hetLabelTh = hetTh.length > 0 ? `ยีนด้อยแฝง: ${hetTh.join(', ')}` : '';

  let complex: ColorComplex = 'normal';
  if (visualGeneCount > 0) {
    if (isBelAllelic || has('mojave', 2) || has('lesser', 2) || has('fire', 2)) {
      complex = 'bright_complex';
    } else if (blackScore > brightScore) {
      complex = 'black_complex';
    } else {
      complex = 'bright_complex';
    }
  }

  let rarity: MorphRarity = 'Common';
  const totalPower = visualGeneCount + superCount * 1.2 + hetCount * 0.35;
  if (totalPower >= 5.5 || (superCount >= 1 && visualGeneCount >= 4)) {
    rarity = 'Mythic';
  } else if (totalPower >= 4 || (has('clown', 2) && visualGeneCount >= 3) || (has('pied', 2) && superCount >= 1)) {
    rarity = 'Legendary';
  } else if (totalPower >= 2.8 || superCount >= 1) {
    rarity = 'Epic';
  } else if (totalPower >= 1.8) {
    rarity = 'Rare';
  } else if (visualGeneCount >= 1 || hetCount >= 1) {
    rarity = 'Uncommon';
  }

  const comboSynergy = 1 + Math.max(0, visualGeneCount - 1) * 0.25 + superCount * 0.2;
  const rawPrice = 1100 * valueMultiplier * comboSynergy;
  const basePrice = Math.round(rawPrice / 50) * 50;

  return {
    phenotypeKey,
    nameEn,
    nameTh,
    hetLabelTh,
    complex,
    visualGeneCount,
    superCount,
    hetCount,
    bananaStatus,
    rarity,
    basePrice,
    specialComboName,
    traits,
  };
}

export interface PunnettOutcome {
  phenotypeKey: string;
  nameEn: string;
  nameTh: string;
  hetLabelTh: string;
  sex: Sex | 'M/F';
  bananaStatus: BananaStatus;
  probability: number;
  rarity: MorphRarity;
  estimatedPrice: number;
  sampleGenotype: Genotype;
  sampleSex: Sex;
}

export function predictBreedingOutcomes(
  sireGenotype: Genotype,
  damGenotype: Genotype
): PunnettOutcome[] {
  type AlleleDist = Array<{ count: 0 | 1 | 2; prob: number }>;
  const activeGenes: GeneId[] = [];
  const geneDists: Record<string, AlleleDist> = {};

  for (const gene of AUTOSOMAL_GENES) {
    const id = gene.id as GeneId;
    const sCount = sireGenotype.alleles[id] || 0;
    const dCount = damGenotype.alleles[id] || 0;
    if (sCount === 0 && dCount === 0) continue;

    activeGenes.push(id);
    const sGametes = sCount === 0 ? [0] : sCount === 1 ? [0, 1] : [1];
    const dGametes = dCount === 0 ? [0] : dCount === 1 ? [0, 1] : [1];

    const counts: Record<number, number> = { 0: 0, 1: 0, 2: 0 };
    const total = sGametes.length * dGametes.length;
    for (const sg of sGametes) {
      for (const dg of dGametes) {
        counts[sg + dg] += 1;
      }
    }
    const dist: AlleleDist = [];
    for (const c of [0, 1, 2] as const) {
      if (counts[c] > 0) {
        dist.push({ count: c, prob: counts[c] / total });
      }
    }
    geneDists[id] = dist;
  }

  const sX = sireGenotype.banana.x1;
  const sY = sireGenotype.banana.x2OrY;
  const dX1 = damGenotype.banana.x1;
  const dX2 = damGenotype.banana.x2OrY;

  interface SexBananaOutcome {
    sex: Sex;
    x1: boolean;
    x2OrY: boolean;
    prob: number;
  }

  const rawSexOutcomes: SexBananaOutcome[] = [
    { sex: 'F', x1: sX, x2OrY: dX1, prob: 0.25 },
    { sex: 'F', x1: sX, x2OrY: dX2, prob: 0.25 },
    { sex: 'M', x1: dX1, x2OrY: sY, prob: 0.25 },
    { sex: 'M', x1: dX2, x2OrY: sY, prob: 0.25 },
  ];

  const mergedSexMap = new Map<string, SexBananaOutcome>();
  for (const o of rawSexOutcomes) {
    const normX1 = o.sex === 'F' ? o.x1 || o.x2OrY : o.x1;
    const normX2OrY = o.sex === 'F' ? o.x1 && o.x2OrY : o.x2OrY;
    const k = `${o.sex}:${normX1 ? 1 : 0}:${normX2OrY ? 1 : 0}`;
    const existing = mergedSexMap.get(k);
    if (existing) {
      existing.prob += o.prob;
    } else {
      mergedSexMap.set(k, { sex: o.sex, x1: normX1, x2OrY: normX2OrY, prob: o.prob });
    }
  }
  const sexOutcomes = Array.from(mergedSexMap.values());

  interface ComboState {
    alleles: Partial<Record<GeneId, 1 | 2>>;
    prob: number;
  }
  let combos: ComboState[] = [{ alleles: {}, prob: 1 }];

  for (const geneId of activeGenes) {
    const dist = geneDists[geneId];
    const next: ComboState[] = [];
    for (const c of combos) {
      for (const d of dist) {
        const nextAlleles = { ...c.alleles };
        if (d.count === 1 || d.count === 2) {
          nextAlleles[geneId] = d.count;
        }
        next.push({ alleles: nextAlleles, prob: c.prob * d.prob });
      }
    }
    combos = next;
  }

  const hasAnyBanana = sX || sY || dX1 || dX2;
  const resultMap = new Map<string, PunnettOutcome>();

  for (const c of combos) {
    for (const s of sexOutcomes) {
      const geno: Genotype = {
        alleles: c.alleles,
        banana: { x1: s.x1, x2OrY: s.x2OrY },
      };
      const pheno = evaluatePhenotype(s.sex, geno);
      const prob = c.prob * s.prob;
      const groupSex: Sex | 'M/F' = hasAnyBanana ? s.sex : 'M/F';
      const groupKey = `${pheno.nameEn}__${groupSex}__${pheno.bananaStatus}`;
      const existing = resultMap.get(groupKey);
      if (existing) {
        existing.probability += prob;
      } else {
        resultMap.set(groupKey, {
          phenotypeKey: pheno.phenotypeKey,
          nameEn: pheno.nameEn,
          nameTh: pheno.nameTh,
          hetLabelTh: pheno.hetLabelTh,
          sex: groupSex,
          bananaStatus: pheno.bananaStatus,
          probability: prob,
          rarity: pheno.rarity,
          estimatedPrice: pheno.basePrice,
          sampleGenotype: geno,
          sampleSex: s.sex,
        });
      }
    }
  }

  return Array.from(resultMap.values()).sort((a, b) => b.probability - a.probability);
}

export function generateClutchEggs(
  sireGenotype: Genotype,
  damGenotype: Genotype,
  clutchSize: number,
  survivalRatePct: number
): EggInClutch[] {
  const eggs: EggInClutch[] = [];

  for (let i = 0; i < clutchSize; i++) {
    const alleles: Partial<Record<GeneId, 1 | 2>> = {};
    const posHets: Partial<Record<GeneId, number>> = {};

    for (const gene of AUTOSOMAL_GENES) {
      const id = gene.id as GeneId;
      const sCount = sireGenotype.alleles[id] || 0;
      const dCount = damGenotype.alleles[id] || 0;
      if (sCount === 0 && dCount === 0) continue;

      const sAllele = sCount === 0 ? 0 : sCount === 2 ? 1 : Math.random() < 0.5 ? 1 : 0;
      const dAllele = dCount === 0 ? 0 : dCount === 2 ? 1 : Math.random() < 0.5 ? 1 : 0;
      const total = sAllele + dAllele;
      if (total === 1 || total === 2) {
        alleles[id] = total;
      }

      // Compute realistic Possible Het probability for non-visual recessive babies!
      if (gene.inheritance === 'recessive' && total !== 2) {
        if (sCount === 1 && dCount === 1) {
          posHets[id] = 66; // Het x Het non-visual = 66% Pos Het
        } else if ((sCount === 1 && dCount === 0) || (sCount === 0 && dCount === 1)) {
          posHets[id] = 50; // Het x Normal = 50% Pos Het
        }
        // Note: Visual(2) x Normal(0) = 100% guaranteed Het -> no uncertainty!
      }
    }

    const sex: Sex = Math.random() < 0.5 ? 'F' : 'M';
    const damPass = Math.random() < 0.5 ? damGenotype.banana.x1 : damGenotype.banana.x2OrY;
    let x1 = false;
    let x2OrY = false;
    if (sex === 'F') {
      x1 = sireGenotype.banana.x1;
      x2OrY = damPass;
    } else {
      x1 = damPass;
      x2OrY = sireGenotype.banana.x2OrY;
    }

    const survived = Math.random() * 100 < survivalRatePct;

    eggs.push({
      id: `egg_${Date.now()}_${i}_${Math.random().toString(36).slice(2, 7)}`,
      sex,
      genotype: {
        alleles,
        banana: { x1, x2OrY },
      },
      posHets: Object.keys(posHets).length > 0 ? posHets : undefined,
      survived,
    });
  }

  return eggs;
}

export function getGeneListForDisplay(
  sex: Sex,
  genotype: Genotype,
  options?: PhenotypeOptions
) {
  const list: Array<{
    nameEn: string;
    nameTh: string;
    inheritance: string;
    stateLabel: string;
    isSuper: boolean;
    isHet: boolean;
    isPosHet: boolean;
    isSexLinked: boolean;
  }> = [];

  const posHets = !options?.dnaTested ? options?.posHets : undefined;

  const banana = getBananaStatus(sex, genotype);
  if (banana !== 'none') {
    const isSuper = banana === 'super_banana_female' || banana === 'super_banana_male';
    list.push({
      nameEn: isSuper ? 'Super Banana' : 'Banana',
      nameTh: bananaStatusLabelTh(banana),
      inheritance: 'sex_linked',
      stateLabel: isSuper ? 'Super' : banana === 'banana_x_male' ? 'X-Linked' : banana === 'banana_y_male' ? 'Y-Linked' : 'X-Linked',
      isSuper,
      isHet: false,
      isPosHet: false,
      isSexLinked: true,
    });
  }

  for (const g of AUTOSOMAL_GENES) {
    const id = g.id as GeneId;
    const count = genotype.alleles[id] || 0;
    const posPct = posHets?.[id];

    if (g.inheritance === 'recessive' && count !== 2 && posPct) {
      list.push({
        nameEn: `${posPct}% Pos Het ${g.nameEn}`,
        nameTh: `${posPct}% Pos Het ${g.nameTh}`,
        inheritance: g.inheritance,
        stateLabel: `รอตรวจ DNA / Prove Out`,
        isSuper: false,
        isHet: true,
        isPosHet: true,
        isSexLinked: false,
      });
      continue;
    }

    if (count === 0) continue;

    if (g.inheritance === 'recessive') {
      list.push({
        nameEn: count === 2 ? g.nameEn : `Het ${g.nameEn}`,
        nameTh: count === 2 ? g.nameTh : `100% Het ${g.nameTh}`,
        inheritance: g.inheritance,
        stateLabel: count === 2 ? 'Visual (แท้)' : '100% Het (ยืนยัน)',
        isSuper: false,
        isHet: count === 1,
        isPosHet: false,
        isSexLinked: false,
      });
    } else if (g.inheritance === 'codominant') {
      list.push({
        nameEn: count === 2 ? g.superNameEn || `Super ${g.nameEn}` : g.nameEn,
        nameTh: count === 2 ? g.superNameTh || `ซูเปอร์ ${g.nameTh}` : g.nameTh,
        inheritance: g.inheritance,
        stateLabel: count === 2 ? 'Super Form' : 'Single Gene',
        isSuper: count === 2,
        isHet: false,
        isPosHet: false,
        isSexLinked: false,
      });
    } else {
      list.push({
        nameEn: g.nameEn,
        nameTh: g.nameTh,
        inheritance: g.inheritance,
        stateLabel: 'Dominant',
        isSuper: false,
        isHet: false,
        isPosHet: false,
        isSexLinked: false,
      });
    }
  }

  return list;
}

export function buildPedigreeFromParents(sire: Snake, dam: Snake): {
  sireNode: PedigreeNode;
  damNode: PedigreeNode;
} {
  const toGrandparent = (node?: PedigreeNode): PedigreeNode | undefined => {
    if (!node) return undefined;
    return { name: node.name, morphEn: node.morphEn, sex: node.sex };
  };

  const sirePheno = evaluatePhenotype(sire.sex, sire.genotype, {
    posHets: sire.posHets,
    dnaTested: sire.dnaTested,
  });
  const damPheno = evaluatePhenotype(dam.sex, dam.genotype, {
    posHets: dam.posHets,
    dnaTested: dam.dnaTested,
  });

  return {
    sireNode: {
      name: sire.name,
      morphEn: sirePheno.specialComboName || sirePheno.nameEn.split(' Het ')[0],
      sex: 'M',
      sire: toGrandparent(sire.pedigree?.sire),
      dam: toGrandparent(sire.pedigree?.dam),
    },
    damNode: {
      name: dam.name,
      morphEn: damPheno.specialComboName || damPheno.nameEn.split(' Het ')[0],
      sex: 'F',
      sire: toGrandparent(dam.pedigree?.sire),
      dam: toGrandparent(dam.pedigree?.dam),
    },
  };
}

export function getRarityColorClass(rarity: MorphRarity): string {
  switch (rarity) {
    case 'Common':
      return 'text-[#9BA89E]';
    case 'Uncommon':
      return 'text-[#4ADE80]';
    case 'Rare':
      return 'text-[#38BDF8]';
    case 'Epic':
      return 'text-[#C084FC]';
    case 'Legendary':
      return 'text-[#F59E0B]';
    case 'Mythic':
      return 'text-[#FB7185]';
  }
}

export function getRarityLabelTh(rarity: MorphRarity): string {
  switch (rarity) {
    case 'Common':
      return 'ทั่วไป';
    case 'Uncommon':
      return 'น่าสนใจ';
    case 'Rare':
      return 'หายาก';
    case 'Epic':
      return 'แรร์พิเศษ';
    case 'Legendary':
      return 'ระดับตำนาน';
    case 'Mythic':
      return 'มหาแรร์';
  }
}

export { GENE_MAP };
