import React, { useEffect, useRef, useState } from 'react';
import { getBananaStatus } from '../game/genetics';
import { Genotype, Sex } from '../game/types';

interface PixelSnakeSpriteProps {
  sex: Sex;
  genotype: Genotype;
  seed?: number;
  width?: number;
  height?: number;
  animate?: boolean;
  className?: string;
}

interface Palette {
  outline: string;
  baseDark: string;
  baseMid: string;
  patternMain: string;
  patternHighlight: string;
  belly: string;
  headTint: string;
  eye: string;
  freckles: boolean;
  isPied: boolean;
  isClown: boolean;
  isPinstripe: boolean;
  isSpider: boolean;
  isCalico: boolean;
  isLeucistic: boolean;
  isSuperBlack: boolean;
}

function buildPalette(sex: Sex, genotype: Genotype): Palette {
  const a = genotype.alleles;
  const has = (id: keyof typeof a, min = 1) => (a[id] || 0) >= min;
  const banana = getBananaStatus(sex, genotype);

  // Defaults: Normal / Wild Type
  let outline = '#120C08';
  let baseDark = '#3E2414';
  let baseMid = '#58351E';
  let patternMain = '#C68B3C';
  let patternHighlight = '#E5B45B';
  let belly = '#F2E7CA';
  let headTint = '#3A2112';
  let eye = '#111111';

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

  // 1. Co-dominant / Black Complex base shifts
  if (has('black_pastel', 1) || has('cinnamon', 1)) {
    baseDark = '#261813';
    baseMid = '#38241C';
    patternMain = '#9C6C45';
    patternHighlight = '#BC895C';
    headTint = '#20130E';
  }
  if (has('black_head', 1)) {
    baseDark = '#231614';
    baseMid = '#3F231C';
    patternMain = '#B66335';
    patternHighlight = '#DF8B4B';
    headTint = '#140E0D';
  }
  if (has('headless_axanthic', 1)) {
    baseDark = '#2B2F36';
    baseMid = '#434952';
    patternMain = '#8E949E';
    patternHighlight = '#B9BFC9';
    headTint = '#2A2E35';
  }

  // 2. Co-dominant Bright Complex
  if (has('pastel', 1)) {
    baseDark = '#4B3619';
    baseMid = '#6A4C22';
    patternMain = '#E8C538';
    patternHighlight = '#FFF078';
    headTint = '#7A6338';
    eye = '#5EA849';
  }
  if (has('pastel', 2)) {
    baseDark = '#624822';
    baseMid = '#87632E';
    patternMain = '#F6DB4C';
    patternHighlight = '#FFF8A3';
    headTint = '#CDBB8B';
    eye = '#7AD95B';
  }
  if (has('enchi', 1)) {
    patternMain = '#DF872C';
    patternHighlight = '#F8B84E';
    if (has('enchi', 2)) {
      baseDark = '#6B3814';
      patternMain = '#F49D2A';
      patternHighlight = '#FFD066';
    }
  }
  if (has('fire', 1)) {
    patternMain = '#D99E44';
    patternHighlight = '#F7CA6A';
    headTint = '#5D4023';
  }
  if (has('mojave', 1)) {
    baseDark = '#322620';
    baseMid = '#4D3B2F';
    patternMain = '#D1B35A';
    patternHighlight = '#EFE094';
    headTint = '#2F2622';
  }
  if (has('lesser', 1)) {
    baseDark = '#5E452A';
    baseMid = '#7F5F3A';
    patternMain = '#E0C070';
    patternHighlight = '#F7E29E';
    headTint = '#6B5234';
  }
  if (has('woma', 1)) {
    baseDark = '#56391A';
    patternMain = '#DC9D40';
    patternHighlight = '#F5C469';
    headTint = '#C68C3B';
  }

  // 3. Sex-linked Banana
  let freckles = false;
  if (banana !== 'none') {
    freckles = true;
    const isSuperBan =
      banana === 'super_banana_female' || banana === 'super_banana_male';
    baseDark = isSuperBan ? '#9D7BB8' : '#7D6399';
    baseMid = isSuperBan ? '#B796D1' : '#967BB2';
    patternMain = isSuperBan ? '#FFE247' : '#F4CA44';
    patternHighlight = '#FFF49C';
    headTint = '#B596C9';
    belly = '#FBF6E3';
  }

  // 4. Super Dark forms override
  if (isSuperBlack) {
    if (has('black_head', 2)) {
      baseDark = '#151216';
      baseMid = '#1D181E';
      patternMain = '#572720';
      patternHighlight = '#8F3F2B';
      headTint = '#0E0C0F';
    } else if (has('headless_axanthic', 2)) {
      baseDark = '#23272E';
      baseMid = '#2D323B';
      patternMain = '#464E59';
      patternHighlight = '#6B7482';
      headTint = '#252930';
    } else {
      baseDark = '#141317';
      baseMid = '#1B1A20';
      patternMain = '#232129';
      patternHighlight = '#34323D';
      headTint = '#111014';
      belly = '#302E38';
    }
  }

  // 5. Recessive Overrides
  if (has('hypo', 2)) {
    baseDark = '#5F5461';
    baseMid = '#786B7A';
    patternMain = '#D7BC76';
    patternHighlight = '#EDE0A6';
    headTint = '#746775';
  }

  if (has('axanthic', 2)) {
    baseDark = '#1E2229';
    baseMid = '#333942';
    patternMain = '#9BA4B0';
    patternHighlight = '#D8DEE6';
    headTint = '#22262E';
    belly = '#EEF2F6';
    freckles = false;
  }

  if (has('albino', 2)) {
    outline = '#5C3B16';
    baseDark = '#F7F3E6';
    baseMid = '#EDE4CA';
    patternMain = '#F4B41A';
    patternHighlight = '#FFE36E';
    headTint = '#F9F6EC';
    belly = '#FFFFFF';
    eye = '#E11D48';
    freckles = false;
  }

  if (has('lavender', 2)) {
    outline = '#4B3263';
    baseDark = '#C4A5E6';
    baseMid = '#D7C0F0';
    patternMain = '#FB923C';
    patternHighlight = '#FDBA74';
    headTint = '#CCB0EB';
    belly = '#F9F5FF';
    eye = '#E11D48';
  }

  // 6. Leucistic Overrides (highest visual brightness)
  if (isLeucistic) {
    outline = '#64748B';
    baseDark = '#F8FAFC';
    baseMid = '#F1F5F9';
    patternMain = isSuperFire ? '#FDE047' : '#FFFFFF';
    patternHighlight = '#FFFFFF';
    belly = '#FFFFFF';
    headTint = has('mojave', 2) ? '#CBD5E1' : '#F8FAFC';
    eye = isSuperFire ? '#111827' : '#38BDF8';
    freckles = false;
  }

  return {
    outline,
    baseDark,
    baseMid,
    patternMain,
    patternHighlight,
    belly,
    headTint,
    eye,
    freckles,
    isPied: has('pied', 2),
    isClown: has('clown', 2),
    isPinstripe: has('pinstripe', 1),
    isSpider: has('spider', 1),
    isCalico: has('calico', 1),
    isLeucistic,
    isSuperBlack,
  };
}

// 56x36 coiled Ball Python pixel silhouette template
// Legend:
// '.' = transparent
// 'O' = outline
// 'B' = coiled body
// 'D' = dorsal ridge
// 'L' = belly / lower flank
// 'H' = head
// 'E' = eye
const SNAKE_GRID: string[] = [
  '........................................................',
  '........................................................',
  '....................OOOOOOOOOOOOOO......................',
  '.................OOOBBBBBBBBBBBBBBOOO...................',
  '...............OOBBBBDDDDDDDDDDDDDBBBBOO................',
  '..............OBBBDDDDDDDDDDDDDDDDDDBBBBO...............',
  '.............OBBDDDDBBBBBBBBBBBBBBDDDDBBBO..............',
  '............OBBDDDBBBOOOOOOOOOOOOBBBDDDBBBO.............',
  '...........OBBDDDBBO..OOOOOOOOO...OBBDDDBBBO............',
  '..........OBBDDDBBO..OHHHHHHHHHHO..OBBDDDBBBO...........',
  '.........OBBDDDBBO..OHHHHHHHHHHHHO..OBBDDDBBBO..........',
  '........OBBDDDBBO..OHHHHEHHHHHHHHHO..OBBDDDBBBO.........',
  '........OBBDDDBBO..OHHHHHHHHHHHHHHO..OBBDDDBBBO.........',
  '.......OBBDDDBBBO..OHHHHHHHHHHHHHHO..OBBBDDDBBBO........',
  '.......OBBDDDBBBO...OHHHHHHHHHHHHO....OBBDDDBBBO........',
  '......OBBBDDDBBBO....OOOOOOOOOOOO.....OBBDDDBBBBO.......',
  '......OBBDDDBBBBBO...................OBBBDDDBBBBO.......',
  '......OBBDDDDBBBBBBOOOOO.......OOOOOOBBBBDDDDBBBO.......',
  '......OBBDDDDDBBBBBBBBBBOOOOOOOBBBBBBBBBDDDDDBBBO.......',
  '......OBBBDDDDDDDBBBBBBBBBBBBBBBBBBBBBDDDDDDDBBBO.......',
  '.......OBBBDDDDDDDDDBBBBBBBBBBBBBBBBDDDDDDDDBBBO........',
  '.......OBLLLBBBBDDDDDDDDDDDDDDDDDDDDDDDDBBBBLLBO........',
  '........OBLLLLLBBBBBBBDDDDDDDDDDDDDBBBBBBBLLLLBO........',
  '.........OOBLLLLLLLBBBBBBBBBBBBBBBBBBBBLLLLLLBOO........',
  '..........OOOBLLLLLLLLLLLLLLLLLLLLLLLLLLLLBOOO..........',
  '............OOOOBBBBBLLLLLLLLLLLLLLBBBBBOOOO............',
  '...............OOOOOOBBBBBBBBBBBBBBOOOOOO...............',
  '...................OOOOOOOOOOOOOOOOOO...................',
  '........................................................',
];

export const PixelSnakeSprite: React.FC<PixelSnakeSpriteProps> = ({
  sex,
  genotype,
  seed = 1,
  width = 224,
  height = 128,
  animate = true,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [tongueOut, setTongueOut] = useState(false);

  useEffect(() => {
    if (!animate) return;
    const interval = setInterval(() => {
      if (Math.random() < 0.45) {
        setTongueOut(true);
        setTimeout(() => setTongueOut(false), 320);
      }
    }, 2400 + (seed % 11) * 180);
    return () => clearInterval(interval);
  }, [animate, seed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rows = SNAKE_GRID.length;
    const cols = SNAKE_GRID[0].length;
    canvas.width = cols;
    canvas.height = rows;

    ctx.clearRect(0, 0, cols, rows);
    const pal = buildPalette(sex, genotype);

    // Subtle soft ground shadow under snake
    ctx.fillStyle = 'rgba(0,0,0,0.28)';
    for (let x = 13; x <= 44; x++) {
      ctx.fillRect(x, 27, 1, 1);
    }
    for (let x = 10; x <= 47; x++) {
      ctx.fillRect(x, 26, 1, 1);
    }

    const piedZoneStart = 20 + (seed % 9);
    const piedZoneEnd = piedZoneStart + 11;
    const piedSecondStart = 8 + (seed % 5);
    const piedSecondEnd = piedSecondStart + 6;

    for (let y = 0; y < rows; y++) {
      const row = SNAKE_GRID[y];
      for (let x = 0; x < cols; x++) {
        const ch = row[x];
        if (ch === '.') continue;

        if (ch === 'O') {
          ctx.fillStyle = pal.outline;
          ctx.fillRect(x, y, 1, 1);
          continue;
        }

        if (ch === 'E') {
          ctx.fillStyle = pal.eye;
          ctx.fillRect(x, y, 1, 1);
          continue;
        }

        if (ch === 'H') {
          let color = pal.headTint;
          // Clown or Pastel head blush / teardrop
          if (pal.isClown && (y === 10 || y === 11) && (x >= 26 && x <= 30)) {
            color = pal.patternMain;
          } else if (pal.isPinstripe && y === 10 && x >= 24 && x <= 30) {
            color = pal.patternHighlight;
          }
          ctx.fillStyle = color;
          ctx.fillRect(x, y, 1, 1);
          continue;
        }

        // Piebald white patch masking on body/dorsal/belly
        const inPiedPatch =
          pal.isPied &&
          !pal.isLeucistic &&
          ((x >= piedZoneStart && x <= piedZoneEnd && y >= 15) ||
            (x >= piedSecondStart && x <= piedSecondEnd && y <= 14));

        if (inPiedPatch) {
          ctx.fillStyle = (x + y) % 7 === 0 ? '#E2E8F0' : '#FFFFFF';
          ctx.fillRect(x, y, 1, 1);
          continue;
        }

        if (ch === 'L') {
          // Belly & lower flank (Calico or Spider high-white speckles)
          if (pal.isCalico && (x * 3 + y * 5 + seed) % 3 === 0) {
            ctx.fillStyle = '#FFFFFF';
          } else if (pal.isSpider && (x + y) % 2 === 0) {
            ctx.fillStyle = '#F8FAFC';
          } else {
            ctx.fillStyle = pal.belly;
          }
          ctx.fillRect(x, y, 1, 1);
          continue;
        }

        // Body ('B') & Dorsal ('D') procedural morph pattern
        let color = ch === 'D' ? pal.baseMid : pal.baseDark;

        if (!pal.isLeucistic && !pal.isSuperBlack) {
          const hash = Math.abs(Math.sin(x * 0.45 + y * 0.25 + (seed % 17)) * 10);

          if (pal.isPinstripe) {
            // Crisp longitudinal stripes
            if (ch === 'D' && y % 2 === 0) {
              color = pal.patternHighlight;
            } else if ((x + y) % 5 === 0 && ch === 'B') {
              color = pal.patternMain;
            }
          } else if (pal.isSpider) {
            // Thin spidery webbing
            if ((x % 4 === 0 && y % 3 !== 0) || (y % 5 === 0 && x % 2 === 0)) {
              color = pal.patternHighlight;
            } else if (hash > 7.8) {
              color = pal.patternMain;
            }
          } else if (pal.isClown) {
            // Bold connected dorsal stripe + clean dark sides
            if (ch === 'D') {
              color = (x + y) % 6 === 0 ? pal.patternMain : pal.patternHighlight;
            } else if (x % 7 === 0 && y % 4 === 0) {
              color = pal.patternMain;
            }
          } else {
            // Classic alien-head saddles
            const saddleCycle = (x + (seed % 4)) % 7;
            if (ch === 'D' && saddleCycle >= 1 && saddleCycle <= 4) {
              color = saddleCycle === 2 || saddleCycle === 3 ? pal.patternHighlight : pal.patternMain;
            } else if (ch === 'B' && (saddleCycle === 2 || saddleCycle === 3) && y % 3 !== 0) {
              color = pal.patternMain;
            } else if (ch === 'B' && (x + y) % 9 === 0) {
              color = pal.patternHighlight;
            }
          }

          // Banana dark freckles
          if (pal.freckles && (x * 7 + y * 13 + seed) % 19 === 0) {
            color = '#2E1E38';
          }

          // Calico flank speckles
          if (pal.isCalico && y >= 18 && (x * 5 + y * 7 + seed) % 5 === 0) {
            color = '#FFFFFF';
          }
        } else if (pal.isSuperBlack) {
          // Glossy scale pixel shimmer on black morphs
          if ((x + y * 2) % 9 === 0 && ch === 'D') {
            color = pal.patternHighlight;
          }
        } else if (pal.isLeucistic) {
          // Subtle soft shading on pure white morphs
          if (ch === 'B' && y >= 20 && (x + y) % 4 === 0) {
            color = '#E2E8F0';
          }
          if (pal.patternMain !== '#FFFFFF' && (x * 7 + y * 3 + seed) % 23 === 0) {
            color = pal.patternMain; // Super Fire subtle yellow patch
          }
        }

        ctx.fillStyle = color;
        ctx.fillRect(x, y, 1, 1);
      }
    }

    // Animated tiny forked pink pixel tongue!
    if (tongueOut) {
      ctx.fillStyle = '#FB7185';
      ctx.fillRect(19, 13, 1, 1);
      ctx.fillRect(18, 13, 1, 1);
      ctx.fillRect(17, 12, 1, 1);
      ctx.fillRect(17, 14, 1, 1);
    }
  }, [sex, genotype, seed, tongueOut]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: `${width}px`, height: `${height}px` }}
      className={`pixel-canvas block select-none ${className}`}
      aria-label="Ball Python pixel sprite"
    />
  );
};
