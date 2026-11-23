import React, { useEffect, useRef } from 'react';
import { getBananaStatus } from '../game/genetics';
import { Genotype, Sex } from '../game/types';

interface PixelSnakeSpriteProps {
  sex: Sex;
  genotype: Genotype;
  seed?: number;
  width?: number;
  height?: number;
  animate?: boolean;
  mode?: 'showcase' | 'roam';
  isInBlue?: boolean;
  canvasId?: string;
  className?: string;
}

interface RGB {
  r: number;
  g: number;
  b: number;
}

function hexToRgb(hex: string): RGB {
  const clean = hex.replace('#', '');
  const num = parseInt(clean, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

function shadeRgb(c: RGB, factor: number, add = 0): string {
  const r = Math.max(0, Math.min(255, Math.round(c.r * factor + add)));
  const g = Math.max(0, Math.min(255, Math.round(c.g * factor + add)));
  const b = Math.max(0, Math.min(255, Math.round(c.b * factor + add)));
  return `rgb(${r},${g},${b})`;
}

function mixRgb(a: RGB, b: RGB, t: number): RGB {
  return {
    r: Math.round(a.r + (b.r - a.r) * t),
    g: Math.round(a.g + (b.g - a.g) * t),
    b: Math.round(a.b + (b.b - a.b) * t),
  };
}

interface Palette {
  outline: RGB;
  groundDark: RGB;
  groundMid: RGB;
  saddleMain: RGB;
  saddleRim: RGB;
  saddleHighlight: RGB;
  flankCream: RGB;
  headBase: RGB;
  headStripe: RGB;
  eyeIris: RGB;
  eyePupil: RGB;
  freckles: boolean;
  freckleColor: RGB;
  isPied: boolean;
  isClown: boolean;
  isPinstripe: boolean;
  isSpider: boolean;
  isCalico: boolean;
  isEnchi: boolean;
  isWoma: boolean;
  isPastel: boolean;
  isSuperPastel: boolean;
  isBlackPastel: boolean;
  isBlackHead: boolean;
  isHeadlessAx: boolean;
  isMojave: boolean;
  isLesser: boolean;
  isFire: boolean;
  isLeucistic: boolean;
  isSuperFire: boolean;
  isSuperMojave: boolean;
  isSuperBlack: boolean;
  isAlbino: boolean;
  isLavender: boolean;
  isAxanthic: boolean;
  isHypo: boolean;
}

function buildPalette(sex: Sex, genotype: Genotype): Palette {
  const a = genotype.alleles;
  const has = (id: keyof typeof a, min = 1) => (a[id] || 0) >= min;
  const banana = getBananaStatus(sex, genotype);

  // Authentic Normal / Wild Type base
  let outline = hexToRgb('#140C07');
  let groundDark = hexToRgb('#2A180D');
  let groundMid = hexToRgb('#472A17');
  let saddleMain = hexToRgb('#B87B32');
  let saddleRim = hexToRgb('#E2B565');
  let saddleHighlight = hexToRgb('#F2CD7E');
  let flankCream = hexToRgb('#EFE2C2');
  let headBase = hexToRgb('#351F11');
  let headStripe = hexToRgb('#C88D42');
  let eyeIris = hexToRgb('#2C2018');
  let eyePupil = hexToRgb('#09090B');
  let freckleColor = hexToRgb('#2A1B33');

  const isBel =
    has('mojave', 2) ||
    has('lesser', 2) ||
    (has('mojave', 1) && has('lesser', 1));
  const isSuperFire = has('fire', 2);
  const isLeucistic = isBel || isSuperFire;

  const isSuperBlack =
    has('black_pastel', 2) ||
    has('cinnamon', 2) ||
    has('black_head', 2) ||
    has('headless_axanthic', 2);

  // Co-dom Black Complex
  if (has('black_pastel', 1) || has('cinnamon', 1)) {
    groundDark = hexToRgb('#1A110E');
    groundMid = hexToRgb('#30201A');
    saddleMain = has('cinnamon', 1) ? hexToRgb('#9B5E36') : hexToRgb('#8C6A4C');
    saddleRim = hexToRgb('#C49B74');
    saddleHighlight = hexToRgb('#D6B18D');
    headBase = hexToRgb('#1E1410');
    headStripe = hexToRgb('#A8805B');
  }

  if (has('black_head', 1)) {
    groundDark = hexToRgb('#18100F');
    groundMid = hexToRgb('#331C16');
    saddleMain = hexToRgb('#C9662E');
    saddleRim = hexToRgb('#EB944D');
    saddleHighlight = hexToRgb('#F7B66D');
    headBase = hexToRgb('#0F0C0D');
    headStripe = hexToRgb('#1B1618');
  }

  if (has('headless_axanthic', 1)) {
    groundDark = hexToRgb('#21262D');
    groundMid = hexToRgb('#38404A');
    saddleMain = hexToRgb('#8C94A0');
    saddleRim = hexToRgb('#C4CCD6');
    saddleHighlight = hexToRgb('#DCE2EB');
    headBase = hexToRgb('#363C45');
    headStripe = hexToRgb('#4B525E');
  }

  // Co-dom Bright Complex
  if (has('mojave', 1)) {
    groundDark = hexToRgb('#211916');
    groundMid = hexToRgb('#3D2E25');
    saddleMain = hexToRgb('#CBB054');
    saddleRim = hexToRgb('#EFE297');
    saddleHighlight = hexToRgb('#FBF1B8');
    headBase = hexToRgb('#261F1B');
    headStripe = hexToRgb('#D8C06C');
  }

  if (has('lesser', 1)) {
    groundDark = hexToRgb('#4F3920');
    groundMid = hexToRgb('#725532');
    saddleMain = hexToRgb('#DFBE68');
    saddleRim = hexToRgb('#F7E39C');
    saddleHighlight = hexToRgb('#FFF0BA');
    headBase = hexToRgb('#594227');
    headStripe = hexToRgb('#E8CA7A');
  }

  if (has('fire', 1)) {
    groundMid = mixRgb(groundMid, hexToRgb('#7D582E'), 0.45);
    saddleMain = mixRgb(saddleMain, hexToRgb('#EBAB44'), 0.55);
    saddleRim = hexToRgb('#FCE08B');
    headBase = mixRgb(headBase, hexToRgb('#7A5C38'), 0.5);
  }

  if (has('enchi', 1)) {
    groundDark = hexToRgb('#4A2B14');
    groundMid = hexToRgb('#6E421F');
    saddleMain = hexToRgb('#E58B28');
    saddleRim = hexToRgb('#FFB84D');
    saddleHighlight = hexToRgb('#FFD27A');
    if (has('enchi', 2)) {
      groundDark = hexToRgb('#6E3B16');
      saddleMain = hexToRgb('#F59D26');
      saddleRim = hexToRgb('#FFD06B');
    }
  }

  if (has('woma', 1)) {
    groundDark = hexToRgb('#4A3117');
    saddleMain = hexToRgb('#DA9B3C');
    saddleRim = hexToRgb('#F3C468');
    headBase = hexToRgb('#B88234');
    headStripe = hexToRgb('#DFAA52');
  }

  if (has('pastel', 1)) {
    groundDark = mixRgb(groundDark, hexToRgb('#47351B'), 0.7);
    groundMid = mixRgb(groundMid, hexToRgb('#6B5027'), 0.7);
    saddleMain = hexToRgb('#F0C82E');
    saddleRim = hexToRgb('#FFF078');
    saddleHighlight = hexToRgb('#FFF8AD');
    headBase = mixRgb(headBase, hexToRgb('#9E8A58'), 0.75);
    headStripe = hexToRgb('#E8D89E');
    eyeIris = hexToRgb('#4ADE80');
  }

  if (has('pastel', 2)) {
    groundDark = hexToRgb('#5B4524');
    groundMid = hexToRgb('#806332');
    saddleMain = hexToRgb('#FAE03C');
    saddleRim = hexToRgb('#FFF694');
    saddleHighlight = hexToRgb('#FFFFC4');
    headBase = hexToRgb('#DDD0A8');
    headStripe = hexToRgb('#F7F1DC');
    eyeIris = hexToRgb('#86EFAC');
  }

  // Sex-linked Banana
  let freckles = false;
  if (banana !== 'none') {
    freckles = true;
    const isSuperBan =
      banana === 'super_banana_female' || banana === 'super_banana_male';
    groundDark = isSuperBan ? hexToRgb('#9E7CBA') : hexToRgb('#7C6099');
    groundMid = isSuperBan ? hexToRgb('#B997D4') : hexToRgb('#967BB3');
    saddleMain = isSuperBan ? hexToRgb('#FFE445') : hexToRgb('#F4C83F');
    saddleRim = hexToRgb('#FFF594');
    saddleHighlight = hexToRgb('#FFFBC2');
    headBase = hexToRgb('#A988C4');
    headStripe = hexToRgb('#F7DC6F');
    flankCream = hexToRgb('#FCF6E3');
    freckleColor = hexToRgb('#2B1A38');
  }

  // Super Black forms
  if (isSuperBlack) {
    if (has('black_head', 2)) {
      groundDark = hexToRgb('#100D11');
      groundMid = hexToRgb('#1B161D');
      saddleMain = hexToRgb('#69281D');
      saddleRim = hexToRgb('#A3452C');
      saddleHighlight = hexToRgb('#C9623E');
      headBase = hexToRgb('#0B090C');
      headStripe = hexToRgb('#17131A');
    } else if (has('headless_axanthic', 2)) {
      groundDark = hexToRgb('#1E2229');
      groundMid = hexToRgb('#2A303A');
      saddleMain = hexToRgb('#434C59');
      saddleRim = hexToRgb('#687385');
      saddleHighlight = hexToRgb('#8592A6');
      headBase = hexToRgb('#2F3540');
      headStripe = hexToRgb('#3D4452');
    } else {
      groundDark = hexToRgb('#100F14');
      groundMid = hexToRgb('#1A1821');
      saddleMain = hexToRgb('#221F2B');
      saddleRim = hexToRgb('#332F40');
      saddleHighlight = hexToRgb('#49445C');
      headBase = hexToRgb('#0E0D12');
      headStripe = hexToRgb('#18161F');
      flankCream = hexToRgb('#363342');
    }
  }

  // Recessives
  if (has('hypo', 2)) {
    groundDark = mixRgb(groundDark, hexToRgb('#6B5E6E'), 0.68);
    groundMid = mixRgb(groundMid, hexToRgb('#87788A'), 0.65);
    saddleMain = mixRgb(saddleMain, hexToRgb('#E3C87D'), 0.55);
    saddleRim = hexToRgb('#F7E8B5');
    headBase = mixRgb(headBase, hexToRgb('#807282'), 0.7);
  }

  if (has('axanthic', 2)) {
    outline = hexToRgb('#0B0D10');
    groundDark = hexToRgb('#16191F');
    groundMid = hexToRgb('#2D323B');
    saddleMain = hexToRgb('#8E97A6');
    saddleRim = hexToRgb('#CBD2DC');
    saddleHighlight = hexToRgb('#EDF1F7');
    headBase = hexToRgb('#1E2229');
    headStripe = hexToRgb('#B4BDC9');
    flankCream = hexToRgb('#F1F5F9');
    freckles = false;
  }

  if (has('albino', 2)) {
    outline = hexToRgb('#80541D');
    groundDark = hexToRgb('#F8F4E8');
    groundMid = hexToRgb('#EFE7D1');
    saddleMain = hexToRgb('#F5B418');
    saddleRim = hexToRgb('#FFE15C');
    saddleHighlight = hexToRgb('#FFF29C');
    headBase = hexToRgb('#FAF7EE');
    headStripe = hexToRgb('#F7C83B');
    flankCream = hexToRgb('#FFFFFF');
    eyeIris = hexToRgb('#E11D48');
    eyePupil = hexToRgb('#9F1239');
    freckles = false;
  }

  if (has('lavender', 2)) {
    outline = hexToRgb('#593B75');
    groundDark = hexToRgb('#C3A3E6');
    groundMid = hexToRgb('#D6BEF0');
    saddleMain = hexToRgb('#FA8C2B');
    saddleRim = hexToRgb('#FDBA74');
    saddleHighlight = hexToRgb('#FED7AA');
    headBase = hexToRgb('#CDB0EB');
    headStripe = hexToRgb('#FB9E49');
    flankCream = hexToRgb('#FAF5FF');
    eyeIris = hexToRgb('#E11D48');
    eyePupil = hexToRgb('#9F1239');
  }

  // Leucistic Overrides
  if (isLeucistic) {
    outline = hexToRgb('#64748B');
    groundDark = hexToRgb('#F8FAFC');
    groundMid = hexToRgb('#F1F5F9');
    saddleMain = isSuperFire ? hexToRgb('#FACC15') : hexToRgb('#FFFFFF');
    saddleRim = hexToRgb('#FFFFFF');
    saddleHighlight = hexToRgb('#FFFFFF');
    flankCream = hexToRgb('#FFFFFF');
    headBase = has('mojave', 2) ? hexToRgb('#CBD5E1') : hexToRgb('#F8FAFC');
    headStripe = has('mojave', 2) ? hexToRgb('#E2E8F0') : hexToRgb('#FFFFFF');
    eyeIris = isSuperFire ? hexToRgb('#1E293B') : hexToRgb('#38BDF8');
    eyePupil = hexToRgb('#090D16');
    freckles = false;
  }

  return {
    outline,
    groundDark,
    groundMid,
    saddleMain,
    saddleRim,
    saddleHighlight,
    flankCream,
    headBase,
    headStripe,
    eyeIris,
    eyePupil,
    freckles,
    freckleColor,
    isPied: has('pied', 2),
    isClown: has('clown', 2),
    isPinstripe: has('pinstripe', 1),
    isSpider: has('spider', 1),
    isCalico: has('calico', 1),
    isEnchi: has('enchi', 1),
    isWoma: has('woma', 1),
    isPastel: has('pastel', 1),
    isSuperPastel: has('pastel', 2),
    isBlackPastel: has('black_pastel', 1) || has('cinnamon', 1),
    isBlackHead: has('black_head', 1),
    isHeadlessAx: has('headless_axanthic', 1),
    isMojave: has('mojave', 1),
    isLesser: has('lesser', 1),
    isFire: has('fire', 1),
    isLeucistic,
    isSuperFire,
    isSuperMojave: has('mojave', 2),
    isSuperBlack,
    isAlbino: has('albino', 2),
    isLavender: has('lavender', 2),
    isAxanthic: has('axanthic', 2),
    isHypo: has('hypo', 2),
  };
}

interface SpineNode {
  x: number;
  y: number;
  r: number;
  u: number;
  nx: number;
  ny: number;
}

function getBodyRadius(u: number, scale = 1): number {
  // Authentic Ball Python (Python regius) top-down silhouette:
  // blunt rounded snout -> broad spade/temporal cheeks -> pinched slim neck -> muscular mid-body -> short conical tail
  let r: number;
  if (u < 0.025) {
    r = 1.7 + (u / 0.025) * 1.9; // blunt rounded python snout
  } else if (u < 0.064) {
    r = 3.6 + Math.sin(((u - 0.025) / 0.039) * Math.PI) * 0.58; // broad temporal cheeks (~4.18px half-width)
  } else if (u < 0.115) {
    const t = (u - 0.064) / 0.051;
    r = 3.6 - Math.sin(t * Math.PI * 0.5) * 1.45; // distinct slim neck pinch (~2.15px half-width)
  } else if (u < 0.78) {
    const mid = (u - 0.115) / 0.665;
    r = 2.15 + Math.pow(Math.sin(mid * Math.PI), 0.78) * 2.35; // long, smooth muscular python torso (~4.5px peak half-width)
  } else {
    const tail = (u - 0.78) / 0.22;
    r = Math.max(0.85, 2.15 * Math.pow(1 - tail, 1.08)); // signature short conical Ball Python tail
  }
  return r * scale;
}

function resampleSpineByArcLength(
  guidePts: Array<{ x: number; y: number }>,
  targetCount: number,
  maxArcLength?: number
): Array<{ x: number; y: number }> {
  const cum: number[] = [0];
  for (let i = 1; i < guidePts.length; i++) {
    const dx = guidePts[i].x - guidePts[i - 1].x;
    const dy = guidePts[i].y - guidePts[i - 1].y;
    cum.push(cum[i - 1] + Math.hypot(dx, dy));
  }
  const totalLen = cum[cum.length - 1] || 1;
  const usedLen = maxArcLength ? Math.min(totalLen, maxArcLength) : totalLen;

  const resampled: Array<{ x: number; y: number }> = [];
  let seg = 0;
  for (let i = 0; i < targetCount; i++) {
    const targetD = (i / (targetCount - 1)) * usedLen;
    while (seg < cum.length - 2 && cum[seg + 1] < targetD) {
      seg++;
    }
    const segLen = cum[seg + 1] - cum[seg] || 1;
    const alpha = Math.max(0, Math.min(1, (targetD - cum[seg]) / segLen));
    resampled.push({
      x: guidePts[seg].x + (guidePts[seg + 1].x - guidePts[seg].x) * alpha,
      y: guidePts[seg].y + (guidePts[seg + 1].y - guidePts[seg].y) * alpha,
    });
  }
  return resampled;
}

interface SnakeMotionState {
  travelPhase: number;
  clock: number;
  behavior: 'slither' | 'pause' | 'coil';
  stateTimer: number;
  speedScale: number;
  baseSpeed: number;
  coilWeight: number;
  coilAnchorX: number;
  coilAnchorY: number;
  coilStartAngle: number;
  coilTightness: number;
  coilDir: number;
  pathSeedA: number;
  pathSeedB: number;
  tongueTimer: number;
  tongueOut: boolean;
}

function createInitialMotionState(
  seed: number,
  cols: number,
  rows: number,
  mode: 'showcase' | 'roam',
  allowRandomMotion: boolean
): SnakeMotionState {
  const r1 = Math.sin(seed * 12.9898) * 43758.5453;
  const frac = r1 - Math.floor(r1);
  const randA = allowRandomMotion ? Math.random() : frac;
  const randB = allowRandomMotion ? Math.random() : ((frac * 7.3) % 1);

  let behavior: 'slither' | 'pause' | 'coil' = 'slither';
  let coilWeight = 0;
  let speedScale = 1;
  let stateTimer = 4.5 + randB * 4.5;

  if (mode === 'roam' && allowRandomMotion) {
    if (randA < 0.34) {
      behavior = 'coil';
      coilWeight = 0.92;
      speedScale = 0;
      stateTimer = 3.2 + randB * 4.2;
    } else if (randA < 0.56) {
      behavior = 'pause';
      coilWeight = 0.1;
      speedScale = 0.05;
      stateTimer = 1.6 + randB * 2.2;
    }
  }

  return {
    travelPhase: (seed % 23) * 0.65 + randA * 8.0,
    clock: randB * 12.0,
    behavior,
    stateTimer,
    speedScale,
    baseSpeed: 0.78 + randB * 0.45,
    coilWeight,
    coilAnchorX: cols * (0.34 + randB * 0.32),
    coilAnchorY: rows * (0.4 + randA * 0.2),
    coilStartAngle: randA * Math.PI * 2,
    coilTightness: 0.92 + randB * 0.16,
    coilDir: (seed + (randA > 0.5 ? 1 : 0)) % 2 === 0 ? 1 : -1,
    pathSeedA: (seed % 17) * 0.71 + (allowRandomMotion ? Math.random() * 2.5 : 0),
    pathSeedB: (seed % 13) * 1.13 + (allowRandomMotion ? Math.random() * 2.5 : 0),
    tongueTimer: 1.4 + randB * 3.2,
    tongueOut: false,
  };
}

function getSlitherPoint(
  s: number,
  cols: number,
  rows: number,
  motion: SnakeMotionState
): { x: number; y: number } {
  const localT = motion.travelPhase - s * 3.55;
  const tx = localT * 0.92 + motion.pathSeedA;
  const ty = localT * 1.61803 + motion.pathSeedB; // golden ratio avoids rigid repeating figure-8

  const baseX =
    cols * 0.5 + Math.sin(tx) * (cols * 0.31) + Math.cos(tx * 0.47) * (cols * 0.05);
  const baseY =
    rows * 0.5 + Math.sin(ty) * (rows * 0.21) + Math.cos(ty * 0.53) * (rows * 0.04);

  const dx =
    Math.cos(tx) * 0.92 * (cols * 0.31) - Math.sin(tx * 0.47) * 0.47 * 0.92 * (cols * 0.05);
  const dy =
    Math.cos(ty) * 1.61803 * (rows * 0.21) -
    Math.sin(ty * 0.53) * 0.53 * 1.61803 * (rows * 0.04);
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;

  // Travelling muscular push wave from neck to tail + subtle curious head glance when pausing
  const waveAmp = 2.1 + motion.speedScale * 1.25;
  const bodyWave =
    Math.sin(s * Math.PI * 3.4 - motion.travelPhase * 2.35) * waveAmp * Math.sin(s * Math.PI);
  const headGlance =
    s < 0.14
      ? Math.sin(motion.clock * 1.9 + motion.pathSeedA) *
        (1 - s / 0.14) *
        (motion.behavior === 'pause' ? 2.1 : 0.7)
      : 0;

  return {
    x: baseX + nx * (bodyWave + headGlance),
    y: baseY + ny * (bodyWave + headGlance),
  };
}

function getCoilPoint(
  s: number,
  seed: number,
  motion: SnakeMotionState
): { x: number; y: number } {
  // Natural Ball Python coiled resting posture:
  // Tail & mid-body coil smoothly in ~1.55 turns, while head & neck drape calmly across the inner rim
  const breath = Math.sin(motion.clock * 1.65 + seed) * 0.45;
  const headDrift = Math.sin(motion.clock * 0.85 + seed * 0.7) * 0.2;
  const startRad = 9.0 * motion.coilTightness;
  const endRad = 22.8 * motion.coilTightness;
  const sweep = Math.PI * 3.15;
  const neckJoin = 0.16;

  if (s >= neckJoin) {
    const k = (s - neckJoin) / (1 - neckJoin);
    const theta = motion.coilStartAngle + motion.coilDir * k * sweep;
    const rad =
      startRad +
      k * (endRad - startRad) +
      breath * (0.4 + 0.6 * k) +
      Math.sin(k * Math.PI * 4.0 + seed) * 0.65;
    return {
      x: motion.coilAnchorX + Math.cos(theta) * rad,
      y: motion.coilAnchorY + Math.sin(theta) * rad,
    };
  }

  // Smooth C1-continuous neck-to-head curve resting across the coil rim
  const enterX = motion.coilAnchorX + Math.cos(motion.coilStartAngle) * startRad;
  const enterY = motion.coilAnchorY + Math.sin(motion.coilStartAngle) * startRad;
  const tangentAngle = motion.coilStartAngle - motion.coilDir * (Math.PI * 0.5) + headDrift;
  const fwdX = Math.cos(tangentAngle);
  const fwdY = Math.sin(tangentAngle);
  const sideX = -fwdY * motion.coilDir;
  const sideY = fwdX * motion.coilDir;

  const distBack = (neckJoin - s) * 145; // smooth ~23px head-neck extension draping across the coil
  const arch = Math.sin(((neckJoin - s) / neckJoin) * Math.PI) * 2.2;

  return {
    x: enterX + fwdX * distBack + sideX * arch,
    y: enterY + fwdY * distBack + sideY * arch,
  };
}

function buildSpine(
  cols: number,
  rows: number,
  motion: SnakeMotionState,
  seed: number,
  mode: 'showcase' | 'roam'
): { nodes: SpineNode[]; dirX: number; dirY: number } {
  const count = 150;
  const guideCount = 220;
  const guidePts: Array<{ x: number; y: number }> = [];

  if (mode === 'roam') {
    const w = motion.coilWeight * motion.coilWeight * (3 - 2 * motion.coilWeight);
    for (let i = 0; i < guideCount; i++) {
      const s = i / (guideCount - 1);
      const sl = getSlitherPoint(s, cols, rows, motion);
      if (w > 0.005) {
        const co = getCoilPoint(s, seed, motion);
        guidePts.push({
          x: sl.x * (1 - w) + co.x * w,
          y: sl.y * (1 - w) + co.y * w,
        });
      } else {
        guidePts.push(sl);
      }
    }
  } else {
    // Showcase mode (Breeding / Codex): rhythmic S-curve undulation with subtle pause/head glance
    const startX = 11;
    const endX = cols - 10;
    const centerY = rows * 0.5;
    for (let i = 0; i < guideCount; i++) {
      const s = i / (guideCount - 1);
      const wavePhase = s * Math.PI * 3.5 - motion.travelPhase * 0.95;
      const amp = 7.8 + Math.sin(s * Math.PI) * 10.2;
      const glance = s < 0.12 ? Math.sin(motion.clock * 1.8) * (1 - s / 0.12) * 1.4 : 0;
      const x = startX + s * (endX - startX) + Math.cos(wavePhase) * 2.0;
      const y = centerY + Math.sin(wavePhase) * amp + glance;
      guidePts.push({ x, y });
    }
  }

  // Uniform arc-length resampling keeps Ball Python body length & head proportions constant around bends
  const rawPts = resampleSpineByArcLength(
    guidePts,
    count,
    mode === 'roam' ? 156 : undefined
  );
  const radiusScale = mode === 'roam' ? 1.0 : 0.85;

  const nodes: SpineNode[] = [];
  for (let i = 0; i < count; i++) {
    const prev = rawPts[Math.max(0, i - 1)];
    const next = rawPts[Math.min(count - 1, i + 1)];
    const tx = next.x - prev.x;
    const ty = next.y - prev.y;
    const len = Math.hypot(tx, ty) || 1;
    const nx = -ty / len;
    const ny = tx / len;
    const u = i / (count - 1);
    nodes.push({
      x: rawPts[i].x,
      y: rawPts[i].y,
      r: getBodyRadius(u, radiusScale),
      u,
      nx,
      ny,
    });
  }

  const headDirX = rawPts[0].x - rawPts[5].x;
  const headDirY = rawPts[0].y - rawPts[5].y;
  const hLen = Math.hypot(headDirX, headDirY) || 1;

  return {
    nodes,
    dirX: headDirX / hLen,
    dirY: headDirY / hLen,
  };
}

function renderTopDownSnake(
  ctx: CanvasRenderingContext2D,
  cols: number,
  rows: number,
  sex: Sex,
  genotype: Genotype,
  seed: number,
  motion: SnakeMotionState,
  mode: 'showcase' | 'roam',
  isInBlue: boolean
) {
  ctx.clearRect(0, 0, cols, rows);

  const pal = buildPalette(sex, genotype);
  const { nodes, dirX, dirY } = buildSpine(cols, rows, motion, seed, mode);

  const mask = new Uint8Array(cols * rows);
  const segIdx = new Int16Array(cols * rows);
  const latArr = new Float32Array(cols * rows);

  for (let py = 0; py < rows; py++) {
    for (let px = 0; px < cols; px++) {
      let firstHit = -1;
      let bestDistSq = 9999;
      let bestNodeIdx = -1;
      let bestLat = 0;
      let bestR = 1;

      for (let i = 0; i < nodes.length; i++) {
        // Keep earliest spine run on top so coiled head & loops draw clean 3D separating outlines
        if (firstHit !== -1 && i > firstHit + 24) break;

        const n = nodes[i];
        const maxR = n.r + 1.15;
        const dx = px + 0.5 - n.x;
        if (dx > maxR || dx < -maxR) continue;
        const dy = py + 0.5 - n.y;
        if (dy > maxR || dy < -maxR) continue;

        const d2 = dx * dx + dy * dy;
        if (d2 <= maxR * maxR) {
          if (firstHit === -1) firstHit = i;
          const norm = d2 / (n.r * n.r);
          if (norm < bestDistSq) {
            bestDistSq = norm;
            bestNodeIdx = i;
            bestLat = (dx * n.nx + dy * n.ny) / Math.max(0.75, n.r);
            bestR = n.r;
          }
        }
      }

      if (bestNodeIdx !== -1) {
        const idx = py * cols + px;
        const bestDist = Math.sqrt(bestDistSq) * bestR;
        if (bestDist <= bestR) {
          mask[idx] = 2;
          segIdx[idx] = bestNodeIdx;
          latArr[idx] = Math.max(-1, Math.min(1, bestLat));
        } else {
          mask[idx] = 1;
        }
      }
    }
  }

  // Pass 1: Soft pixel ground contact shadow
  ctx.fillStyle = 'rgba(0,0,0,0.28)';
  for (let py = 0; py < rows - 2; py++) {
    for (let px = 0; px < cols - 1; px++) {
      if (mask[py * cols + px] > 0) {
        const sx = px + 1;
        const sy = py + 2;
        if (mask[sy * cols + sx] === 0) {
          ctx.fillRect(sx, sy, 1, 1);
        }
      }
    }
  }

  // Deterministic Pied patches
  const piedAStart = 0.22 + (seed % 7) * 0.015;
  const piedAEnd = piedAStart + 0.16;
  const piedBStart = 0.58 + (seed % 5) * 0.015;
  const piedBEnd = piedBStart + 0.14;

  // Pass 2 & 3: Outline + Hyper-Detailed Top-Down Scale Patterning
  for (let py = 0; py < rows; py++) {
    for (let px = 0; px < cols; px++) {
      const idx = py * cols + px;
      const m = mask[idx];
      if (m === 0) continue;

      if (m === 1) {
        ctx.fillStyle = shadeRgb(pal.outline, 1);
        ctx.fillRect(px, py, 1, 1);
        continue;
      }

      const node = nodes[segIdx[idx]];
      const u = node.u;
      const v = latArr[idx]; // -1 (left flank) .. 0 (dorsal spine) .. +1 (right flank)
      const absV = Math.abs(v);
      const isHead = u < 0.088;

      // Cylindrical 3D reptile body shading + subtle micro-scale texture
      const lightCurve = 1.12 - absV * 0.32 + (v < 0 ? 0.05 : -0.04);
      const scaleShimmer = ((Math.floor(u * 145) + Math.floor((v + 1) * 6)) % 2 === 0 ? 3 : -2);

      // Piebald white patches
      const inPied =
        pal.isPied &&
        !pal.isLeucistic &&
        ((u >= piedAStart && u <= piedAEnd) || (u >= piedBStart && u <= piedBEnd));

      if (inPied) {
        const edgeBorder =
          Math.abs(u - piedAStart) < 0.012 ||
          Math.abs(u - piedAEnd) < 0.012 ||
          Math.abs(u - piedBStart) < 0.012 ||
          Math.abs(u - piedBEnd) < 0.012;
        if (edgeBorder) {
          // Real Pied hallmark: crisp dark/rich condensation ring right where white meets color
          ctx.fillStyle = shadeRgb(pal.groundDark, 0.9);
        } else {
          const wRgb = hexToRgb('#FFFFFF');
          ctx.fillStyle = shadeRgb(wRgb, 1.0 - absV * 0.12, scaleShimmer * 0.5);
        }
        ctx.fillRect(px, py, 1, 1);
        continue;
      }

      // Head Markings (Realistic Top-Down Ball Python Head Stamp & Eye Stripes)
      if (isHead) {
        let headRgb = pal.headBase;

        if (!pal.isLeucistic && !pal.isSuperBlack) {
          if (pal.isClown) {
            // Clown head mask + pale teardrop/crown stamp
            if (u > 0.025 && u < 0.075 && absV < 0.42) {
              headRgb = pal.saddleHighlight;
            } else if (u > 0.032 && absV > 0.48 && absV < 0.72) {
              headRgb = pal.outline;
            }
          } else if (pal.isPinstripe) {
            if (u > 0.022 && absV < 0.22) {
              headRgb = pal.saddleHighlight;
            } else if (u > 0.032 && absV > 0.45 && absV < 0.72) {
              headRgb = pal.saddleMain;
            }
          } else if (pal.isBlackHead) {
            // Signature solid obsidian black head
            headRgb = pal.headBase;
          } else if (pal.isHeadlessAx) {
            // Signature clean patternless silver-slate head
            headRgb = pal.headBase;
          } else {
            // Classic Ball Python twin pale post-ocular eye-stripes framing dark dorsal skull arrow
            if (u > 0.024 && u < 0.084 && absV > 0.36 && absV < 0.68) {
              headRgb = pal.headStripe;
            } else if (pal.isPastel && absV < 0.28 && u > 0.028 && u < 0.072) {
              headRgb = pal.headStripe; // Pastel head blushing
            }
          }
        }

        ctx.fillStyle = shadeRgb(headRgb, lightCurve, scaleShimmer * 0.6);
        ctx.fillRect(px, py, 1, 1);
        continue;
      }

      // Body & Dorsal Morph Patterns
      let baseRgb = absV < 0.48 ? pal.groundDark : pal.groundMid;

      if (pal.isLeucistic) {
        baseRgb = pal.groundDark;
        if (pal.isSuperFire && Math.sin(u * 46 + seed) > 0.8 && absV < 0.55) {
          baseRgb = pal.saddleMain; // Super Fire bright canary patches
        }
      } else if (pal.isSuperBlack) {
        // Satin obsidian / graphite sheen down the dorsal ridge
        baseRgb =
          absV < 0.15
            ? pal.saddleHighlight
            : absV < 0.42
              ? pal.saddleMain
              : absV < 0.78
                ? pal.groundMid
                : pal.groundDark;
        // Super Black Head subtle burnt copper dorsal flares
        if (pal.isBlackHead && Math.sin(u * 56 + seed) > 0.55 && absV < 0.35) {
          baseRgb = pal.saddleRim;
        }
      } else {
        // Organic wave distortion for natural reptile pattern flow
        const organic = Math.sin(u * 98 + v * 2.5 + seed) * 0.06;

        if (pal.isPinstripe) {
          // Sharp twin longitudinal golden pinstripes + fine side striping
          if (absV >= 0.25 && absV <= 0.48) {
            baseRgb = pal.saddleHighlight;
          } else if (absV > 0.48 && absV <= 0.62) {
            baseRgb = pal.outline; // crisp dark border
          } else if (absV < 0.25) {
            baseRgb = Math.sin(u * 82) > 0.4 ? pal.saddleMain : pal.groundMid;
          } else if (absV > 0.76 && Math.sin(u * 70 + seed) > 0.1) {
            baseRgb = pal.saddleRim;
          } else {
            baseRgb = pal.saddleMain;
          }
        } else if (pal.isClown) {
          // Thick wavy connected dorsal stripe + clean bright flanks with dark edge dots
          const edge = 0.27 + Math.sin(u * 68 + seed) * 0.11;
          if (absV < edge) {
            baseRgb = absV < edge * 0.6 ? pal.saddleHighlight : pal.saddleMain;
          } else if (absV < edge + 0.16) {
            baseRgb = pal.outline; // bold dark Clown border
          } else if (absV > 0.72 && Math.sin(u * 62 + seed) > 0.68) {
            baseRgb = pal.groundDark; // scattered lower side spots
          } else {
            baseRgb = pal.saddleRim;
          }
        } else if (pal.isSpider) {
          // High-white flanks + crisp thin spidery dark dorsal webbing
          const web1 = Math.abs(Math.sin(u * 78 + v * 3.9 + seed));
          const web2 = Math.abs(Math.cos(u * 48 - v * 4.4 + seed * 0.3));
          if (absV > 0.66 + organic) {
            baseRgb = pal.flankCream;
          } else if (web1 < 0.21 || (web2 < 0.14 && absV < 0.45)) {
            baseRgb = pal.groundDark;
          } else {
            baseRgb = absV < 0.4 ? pal.saddleMain : pal.saddleHighlight;
          }
        } else if (pal.isEnchi || pal.isWoma) {
          // Clean reduced golden-amber bands spanning across the dorsal
          const bandVal = Math.sin(u * (pal.isEnchi ? 50 : 56) + seed * 0.7);
          if (bandVal > -0.22 + organic) {
            baseRgb =
              absV < 0.35
                ? pal.saddleHighlight
                : bandVal > 0.65
                  ? pal.saddleRim
                  : pal.saddleMain;
          } else {
            baseRgb = absV > 0.82 ? pal.flankCream : pal.groundDark;
          }
        } else {
          // REALISTIC ALIEN HEAD SADDLES (Normal, Mojave, Lesser, Pastel, Black Pastel, Banana, Albino, Axanthic, Lavender, Hypo)
          // Each saddle cycle along u creates a pair of left & right lateral "Alien Head" ovals
          // with pale rims, golden-caramel interior, and 2 dark round "eye" spots!
          const freq = pal.isBlackPastel ? 26 : 32;
          const phaseU = (u * freq + (seed % 7) * 0.23) % 1;
          const du = phaseU - 0.5; // -0.5 .. +0.5 within each saddle repeat
          const sideDist = Math.abs(absV - 0.54);

          // Oval distance of an Alien Head blotch on left/right side
          const ovalDist = Math.hypot(du * 1.45, sideDist * 1.95) + organic * 0.4;

          // Connected dorsal saddle bridge on Black Pastel / Cinnamon / Mojave
          const dorsalBridge =
            (pal.isBlackPastel || pal.isMojave) &&
            Math.abs(du) < 0.22 &&
            absV < 0.28;

          if (ovalDist < 0.56) {
            if (ovalDist > 0.44) {
              // Bright rim outlining the Alien Head!
              baseRgb = pal.saddleRim;
            } else {
              // Two classic "Alien Eyes" inside each Alien Head!
              const eye1 = Math.hypot((du + 0.14) * 2.4, (absV - 0.52) * 3.0);
              const eye2 = Math.hypot((du - 0.14) * 2.4, (absV - 0.52) * 3.0);
              if (eye1 < 0.22 || eye2 < 0.22) {
                baseRgb = pal.groundDark;
              } else {
                baseRgb = absV < 0.45 ? pal.saddleHighlight : pal.saddleMain;
              }
            }
          } else if (dorsalBridge) {
            baseRgb = pal.saddleMain;
          } else if (absV < 0.2 && Math.abs(du) < 0.15) {
            // Subtle dorsal flame blushing (brighter on Fire / Mojave / Pastel)
            baseRgb = pal.isFire || pal.isPastel || pal.isMojave ? pal.saddleHighlight : pal.groundMid;
          } else if (absV > 0.86) {
            // Belly-flank cream scale edge wrap
            baseRgb = pal.flankCream;
          }
        }

        // Calico snowy white side blushing
        if (pal.isCalico && absV > 0.44 && (px * 5 + py * 7 + seed) % 4 === 0) {
          baseRgb = hexToRgb('#FFFFFF');
        }

        // Banana authentic dark pixel freckles
        if (pal.freckles && (px * 11 + py * 17 + seed) % 27 === 0) {
          baseRgb = pal.freckleColor;
        }
      }

      ctx.fillStyle = shadeRgb(baseRgb, lightCurve, scaleShimmer);
      ctx.fillRect(px, py, 1, 1);
    }
  }

  // Pass 4: Glossy Eyes with White Catchlight Pixel + Forked Tongue
  const eyeNode = nodes[6];
  if (eyeNode) {
    const eOffset = Math.max(1.55, eyeNode.r * 0.48);
    const lx = Math.round(eyeNode.x + eyeNode.nx * eOffset - 0.5);
    const ly = Math.round(eyeNode.y + eyeNode.ny * eOffset - 0.5);
    const rx = Math.round(eyeNode.x - eyeNode.nx * eOffset - 0.5);
    const ry = Math.round(eyeNode.y - eyeNode.ny * eOffset - 0.5);

    // Compact glossy 2x2 eyes seated inside the broad python cheeks (milky sky-blue when In Blue!)
    const irisCss = isInBlue ? '#93C5FD' : shadeRgb(pal.eyeIris, 1);
    const pupilCss = isInBlue ? '#60A5FA' : shadeRgb(pal.eyePupil, 1);

    ctx.fillStyle = irisCss;
    ctx.fillRect(lx, ly, 2, 2);
    ctx.fillRect(rx, ry, 2, 2);

    ctx.fillStyle = pupilCss;
    ctx.fillRect(lx, ly, 1, 1);
    ctx.fillRect(rx, ry, 1, 1);

    if (!isInBlue) {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(lx + 1, ly, 1, 1);
      ctx.fillRect(rx + 1, ry, 1, 1);
    }
  }

  if (motion.tongueOut) {
    const tip = nodes[0];
    ctx.fillStyle = '#FB7185';
    for (let step = 2; step <= 4; step++) {
      ctx.fillRect(
        Math.round(tip.x + dirX * step),
        Math.round(tip.y + dirY * step),
        1,
        1
      );
    }
    const forkX = tip.x + dirX * 5.2;
    const forkY = tip.y + dirY * 5.2;
    ctx.fillRect(Math.round(forkX + tip.nx * 1.4), Math.round(forkY + tip.ny * 1.4), 1, 1);
    ctx.fillRect(Math.round(forkX - tip.nx * 1.4), Math.round(forkY - tip.ny * 1.4), 1, 1);
  }
}

export const PixelSnakeSprite: React.FC<PixelSnakeSpriteProps> = ({
  sex,
  genotype,
  seed = 1,
  width = 224,
  height = 128,
  animate = true,
  mode = 'showcase',
  isInBlue = false,
  canvasId,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const motionRef = useRef<SnakeMotionState | null>(null);
  const keyRef = useRef<string>('');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cols = mode === 'roam' ? 152 : 126;
    const rows = mode === 'roam' ? 86 : 72;
    canvas.width = cols;
    canvas.height = rows;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    const nextKey = `${seed}:${mode}`;
    if (!motionRef.current || keyRef.current !== nextKey) {
      keyRef.current = nextKey;
      motionRef.current = createInitialMotionState(
        seed,
        cols,
        rows,
        mode,
        animate && !prefersReducedMotion
      );
    }

    const draw = () => {
      if (!motionRef.current) return;
      renderTopDownSnake(
        ctx,
        cols,
        rows,
        sex,
        genotype,
        seed,
        motionRef.current,
        mode,
        isInBlue
      );
    };

    draw();

    if (!animate || prefersReducedMotion) return;

    const startCoilFromCurrentPose = (m: SnakeMotionState) => {
      const headPt = getSlitherPoint(0, cols, rows, m);
      const midPt = getSlitherPoint(0.28, cols, rows, m);
      const heading = Math.atan2(headPt.y - midPt.y, headPt.x - midPt.x);
      const dir = Math.random() < 0.5 ? 1 : -1;
      m.behavior = 'coil';
      m.coilAnchorX = Math.max(cols * 0.26, Math.min(cols * 0.74, midPt.x));
      m.coilAnchorY = Math.max(rows * 0.35, Math.min(rows * 0.65, midPt.y));
      m.coilDir = dir;
      m.coilTightness = 0.9 + Math.random() * 0.18;
      m.coilStartAngle = heading + dir * (Math.PI * 0.5);
      m.stateTimer = 4.2 + Math.random() * 4.5;
    };

    const dt = 0.065;
    const interval = setInterval(() => {
      const m = motionRef.current;
      if (!m) return;

      m.clock += dt;
      m.stateTimer -= dt;

      if (mode === 'roam') {
        if (m.stateTimer <= 0) {
          const r = Math.random();
          if (m.behavior === 'slither') {
            if (r < 0.54) {
              startCoilFromCurrentPose(m);
            } else {
              // Pause to inspect surroundings & flick tongue
              m.behavior = 'pause';
              m.stateTimer = 1.8 + Math.random() * 2.4;
            }
          } else if (m.behavior === 'pause') {
            if (r < 0.38) {
              startCoilFromCurrentPose(m);
            } else {
              m.behavior = 'slither';
              m.baseSpeed = 0.72 + Math.random() * 0.55;
              m.stateTimer = 4.5 + Math.random() * 5.0;
            }
          } else {
            // Uncoil and glide away smoothly
            m.behavior = 'slither';
            m.baseSpeed = 0.75 + Math.random() * 0.5;
            m.stateTimer = 4.8 + Math.random() * 5.2;
          }
        }

        const rhythm = 0.84 + 0.22 * Math.sin(m.clock * 1.15 + seed);
        const targetSpeed =
          m.behavior === 'slither'
            ? m.baseSpeed * rhythm
            : m.behavior === 'pause'
              ? 0.03
              : 0;
        const targetCoil =
          m.behavior === 'coil' ? 1.0 : m.behavior === 'pause' ? 0.12 : 0.0;

        m.speedScale += (targetSpeed - m.speedScale) * Math.min(1, dt * 2.4);
        m.coilWeight += (targetCoil - m.coilWeight) * Math.min(1, dt * 1.35);
        m.travelPhase += m.speedScale * 0.095;
      } else {
        // Showcase: occasional brief breathing pause along S-wave
        if (m.stateTimer <= 0) {
          m.behavior = m.behavior === 'slither' ? 'pause' : 'slither';
          m.stateTimer = m.behavior === 'pause' ? 1.6 + Math.random() * 1.6 : 3.5 + Math.random() * 3.5;
        }
        const targetSpeed = m.behavior === 'slither' ? 1.0 : 0.12;
        m.speedScale += (targetSpeed - m.speedScale) * Math.min(1, dt * 2.8);
        m.travelPhase += m.speedScale * 0.11;
      }

      // Randomized forked-tongue flicking (more frequent while exploring/pausing)
      m.tongueTimer -= dt;
      if (m.tongueTimer <= 0) {
        if (m.tongueOut) {
          m.tongueOut = false;
          const delay = m.behavior === 'coil' ? 3.8 + Math.random() * 4.0 : 1.6 + Math.random() * 2.8;
          m.tongueTimer = delay;
        } else {
          m.tongueOut = true;
          m.tongueTimer = 0.28 + Math.random() * 0.18;
        }
      }

      draw();
    }, 65);

    return () => clearInterval(interval);
  }, [sex, genotype, seed, animate, mode, isInBlue]);

  return (
    <canvas
      id={canvasId}
      ref={canvasRef}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        filter: isInBlue ? 'saturate(0.68) brightness(1.06)' : undefined,
      }}
      className={`pixel-canvas block select-none ${className}`}
      aria-label="Ball Python realistic top-down pixel sprite"
    />
  );
};
