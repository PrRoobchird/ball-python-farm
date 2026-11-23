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

function getBodyRadius(u: number): number {
  // Anatomical top-down Ball Python proportions:
  // rounded snout -> broad cheeks -> narrow neck -> heavy muscular mid-body -> short stubby tail
  if (u < 0.035) return 2.0 + (u / 0.035) * 2.1; // rounded snout
  if (u < 0.095) return 4.1 + Math.sin(((u - 0.035) / 0.06) * Math.PI) * 0.7; // temporal cheeks
  if (u < 0.145) {
    const t = (u - 0.095) / 0.05;
    return 4.1 - t * 1.3; // neck taper
  }
  if (u < 0.76) {
    const mid = (u - 0.145) / 0.615;
    return 2.8 + Math.sin(mid * Math.PI) * 2.9 + 1.3; // stout Ball Python girth (~5.7-7.0px half-width)
  }
  const tail = (u - 0.76) / 0.24;
  return Math.max(0.95, 4.1 * Math.pow(1 - tail, 0.85));
}

function buildSpine(
  cols: number,
  rows: number,
  phase: number,
  seed: number,
  mode: 'showcase' | 'roam'
): { nodes: SpineNode[]; dirX: number; dirY: number } {
  const count = 58;
  const rawPts: Array<{ x: number; y: number }> = [];

  if (mode === 'roam') {
    const t = phase * 0.24 + (seed % 19) * 0.35;
    for (let i = 0; i < count; i++) {
      const u = i / (count - 1);
      const localT = t - u * 1.45;
      const cx = cols * 0.5 + Math.sin(localT) * (cols * 0.28);
      const cy =
        rows * 0.53 +
        Math.sin(localT * 2.0 + 0.5) * (rows * 0.2) +
        Math.sin(localT * 5.0 - u * 8.5) * 3.0;
      rawPts.push({ x: cx, y: cy });
    }
  } else {
    // Graceful top-down showcase S-curve filling frame cleanly
    const startX = 16;
    const endX = cols - 14;
    const centerY = rows * 0.51;
    for (let i = 0; i < count; i++) {
      const u = i / (count - 1);
      const wavePhase = u * Math.PI * 2.85 - phase * 1.05;
      const amp = 6.5 + Math.sin(u * Math.PI) * 7.8;
      const x = startX + u * (endX - startX) + Math.cos(wavePhase) * 2.0;
      const y = centerY + Math.sin(wavePhase) * amp;
      rawPts.push({ x, y });
    }
  }

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
      r: getBodyRadius(u),
      u,
      nx,
      ny,
    });
  }

  const headDirX = rawPts[0].x - rawPts[2].x;
  const headDirY = rawPts[0].y - rawPts[2].y;
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
  phase: number,
  tongueOut: boolean,
  mode: 'showcase' | 'roam',
  isInBlue: boolean
) {
  ctx.clearRect(0, 0, cols, rows);

  const pal = buildPalette(sex, genotype);
  const { nodes, dirX, dirY } = buildSpine(cols, rows, phase, seed, mode);

  const mask = new Uint8Array(cols * rows);
  const segIdx = new Int16Array(cols * rows);
  const latArr = new Float32Array(cols * rows);

  for (let py = 0; py < rows; py++) {
    for (let px = 0; px < cols; px++) {
      let bestDistSq = 9999;
      let bestNodeIdx = -1;
      let bestLat = 0;
      let bestR = 1;

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const dx = px + 0.5 - n.x;
        const dy = py + 0.5 - n.y;
        const d2 = dx * dx + dy * dy;
        const maxR = n.r + 1.2;
        if (d2 <= maxR * maxR) {
          const norm = d2 / (n.r * n.r);
          if (norm < bestDistSq) {
            bestDistSq = norm;
            bestNodeIdx = i;
            bestLat = (dx * n.nx + dy * n.ny) / Math.max(0.8, n.r);
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
  const piedAEnd = piedAStart + 0.19;
  const piedBStart = 0.58 + (seed % 5) * 0.015;
  const piedBEnd = piedBStart + 0.16;

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
      const isHead = u < 0.125;

      // Cylindrical 3D reptile body shading + subtle micro-scale texture
      const lightCurve = 1.12 - absV * 0.32 + (v < 0 ? 0.05 : -0.04);
      const scaleShimmer = ((Math.floor(u * 95) + Math.floor((v + 1) * 7)) % 2 === 0 ? 3 : -2);

      // Piebald white patches
      const inPied =
        pal.isPied &&
        !pal.isLeucistic &&
        ((u >= piedAStart && u <= piedAEnd) || (u >= piedBStart && u <= piedBEnd));

      if (inPied) {
        const edgeBorder =
          Math.abs(u - piedAStart) < 0.015 ||
          Math.abs(u - piedAEnd) < 0.015 ||
          Math.abs(u - piedBStart) < 0.015 ||
          Math.abs(u - piedBEnd) < 0.015;
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
            if (u > 0.035 && u < 0.105 && absV < 0.42) {
              headRgb = pal.saddleHighlight;
            } else if (u > 0.05 && absV > 0.48 && absV < 0.72) {
              headRgb = pal.outline;
            }
          } else if (pal.isPinstripe) {
            if (u > 0.03 && absV < 0.22) {
              headRgb = pal.saddleHighlight;
            } else if (u > 0.05 && absV > 0.45 && absV < 0.72) {
              headRgb = pal.saddleMain;
            }
          } else if (pal.isBlackHead) {
            // Signature solid obsidian black head
            headRgb = pal.headBase;
          } else if (pal.isHeadlessAx) {
            // Signature clean patternless silver-slate head
            headRgb = pal.headBase;
          } else {
            // Classic Ball Python twin pale eye-stripes framing a darker head crown
            if (u > 0.04 && u < 0.115 && absV > 0.38 && absV < 0.65) {
              headRgb = pal.headStripe;
            } else if (pal.isPastel && absV < 0.3 && u > 0.04 && u < 0.1) {
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
        if (pal.isSuperFire && Math.sin(u * 30 + seed) > 0.8 && absV < 0.55) {
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
        if (pal.isBlackHead && Math.sin(u * 38 + seed) > 0.55 && absV < 0.35) {
          baseRgb = pal.saddleRim;
        }
      } else {
        // Organic wave distortion for natural reptile pattern flow
        const organic = Math.sin(u * 70 + v * 2.5 + seed) * 0.06;

        if (pal.isPinstripe) {
          // Sharp twin longitudinal golden pinstripes + fine side striping
          if (absV >= 0.25 && absV <= 0.48) {
            baseRgb = pal.saddleHighlight;
          } else if (absV > 0.48 && absV <= 0.62) {
            baseRgb = pal.outline; // crisp dark border
          } else if (absV < 0.25) {
            baseRgb = Math.sin(u * 55) > 0.4 ? pal.saddleMain : pal.groundMid;
          } else if (absV > 0.76 && Math.sin(u * 48 + seed) > 0.1) {
            baseRgb = pal.saddleRim;
          } else {
            baseRgb = pal.saddleMain;
          }
        } else if (pal.isClown) {
          // Thick wavy connected dorsal stripe + clean bright flanks with dark edge dots
          const edge = 0.27 + Math.sin(u * 46 + seed) * 0.11;
          if (absV < edge) {
            baseRgb = absV < edge * 0.6 ? pal.saddleHighlight : pal.saddleMain;
          } else if (absV < edge + 0.16) {
            baseRgb = pal.outline; // bold dark Clown border
          } else if (absV > 0.72 && Math.sin(u * 42 + seed) > 0.68) {
            baseRgb = pal.groundDark; // scattered lower side spots
          } else {
            baseRgb = pal.saddleRim;
          }
        } else if (pal.isSpider) {
          // High-white flanks + crisp thin spidery dark dorsal webbing
          const web1 = Math.abs(Math.sin(u * 54 + v * 3.9 + seed));
          const web2 = Math.abs(Math.cos(u * 32 - v * 4.4 + seed * 0.3));
          if (absV > 0.66 + organic) {
            baseRgb = pal.flankCream;
          } else if (web1 < 0.21 || (web2 < 0.14 && absV < 0.45)) {
            baseRgb = pal.groundDark;
          } else {
            baseRgb = absV < 0.4 ? pal.saddleMain : pal.saddleHighlight;
          }
        } else if (pal.isEnchi || pal.isWoma) {
          // Clean reduced golden-amber bands spanning across the dorsal
          const bandVal = Math.sin(u * (pal.isEnchi ? 34 : 38) + seed * 0.7);
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
          const freq = pal.isBlackPastel ? 18 : 22;
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
  const eyeNode = nodes[3];
  if (eyeNode) {
    const eOffset = Math.max(1.8, eyeNode.r * 0.64);
    const lx = Math.round(eyeNode.x + eyeNode.nx * eOffset);
    const ly = Math.round(eyeNode.y + eyeNode.ny * eOffset);
    const rx = Math.round(eyeNode.x - eyeNode.nx * eOffset);
    const ry = Math.round(eyeNode.y - eyeNode.ny * eOffset);

    // 2x2 glossy eye cluster on 112x64 grid (milky sky-blue when In Blue!)
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

  if (tongueOut) {
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
  const phaseRef = useRef((seed % 20) * 0.4);
  const tongueRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cols = mode === 'roam' ? 136 : 112;
    const rows = mode === 'roam' ? 76 : 64;
    canvas.width = cols;
    canvas.height = rows;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    const draw = () => {
      renderTopDownSnake(
        ctx,
        cols,
        rows,
        sex,
        genotype,
        seed,
        phaseRef.current,
        tongueRef.current,
        mode,
        isInBlue
      );
    };

    draw();

    if (!animate || prefersReducedMotion) return;

    let tickCount = 0;
    const interval = setInterval(() => {
      phaseRef.current += mode === 'roam' ? 0.12 : 0.14;
      tickCount += 1;
      if (tickCount % 42 === 0 && Math.random() < 0.75) {
        tongueRef.current = true;
      } else if (tickCount % 42 === 6) {
        tongueRef.current = false;
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
