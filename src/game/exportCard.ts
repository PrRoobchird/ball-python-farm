import { evaluatePhenotype, getGeneListForDisplay, getRarityLabelTh } from './genetics';
import { COMPLEX_LABEL_TH } from './genes';
import { Snake } from './types';

/**
 * Generates and downloads a crisp retro pixel Morph Collector Card PNG for a snake
 */
export function downloadMorphCardPng(
  snake: Snake,
  sourceCanvas: HTMLCanvasElement | null,
  farmReputation: number
) {
  const pheno = evaluatePhenotype(snake.sex, snake.genotype, {
    posHets: snake.posHets,
    dnaTested: snake.dnaTested,
  });
  const genes = getGeneListForDisplay(snake.sex, snake.genotype, {
    posHets: snake.posHets,
    dnaTested: snake.dnaTested,
  });

  const width = 960;
  const height = 560;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Card Background & Pixel Border
  ctx.fillStyle = '#121815';
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = '#1D2621';
  ctx.fillRect(16, 16, width - 32, height - 32);

  ctx.strokeStyle = '#EAB308';
  ctx.lineWidth = 4;
  ctx.strokeRect(16, 16, width - 32, height - 32);

  ctx.strokeStyle = '#394A40';
  ctx.lineWidth = 2;
  ctx.strokeRect(26, 26, width - 52, height - 52);

  // Header Strip
  ctx.fillStyle = '#141B17';
  ctx.fillRect(28, 28, width - 56, 62);

  ctx.fillStyle = '#EAB308';
  ctx.font = 'bold 22px monospace';
  ctx.fillText('BALL PYTHON PIXEL · MORPH CARD', 48, 66);

  ctx.fillStyle = '#9BA89E';
  ctx.font = 'bold 16px sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText(`Farm Rep: ${farmReputation}`, width - 48, 66);
  ctx.textAlign = 'left';

  // Left Frame: Snake Pixel Canvas Preview
  ctx.fillStyle = '#111714';
  ctx.fillRect(48, 114, 420, 260);
  ctx.strokeStyle = '#394A40';
  ctx.lineWidth = 3;
  ctx.strokeRect(48, 114, 420, 260);

  if (sourceCanvas) {
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(sourceCanvas, 66, 134, 384, 220);
  }

  // Pedigree Box below sprite
  ctx.fillStyle = '#151D19';
  ctx.fillRect(48, 392, 420, 120);
  ctx.strokeStyle = '#2E3D34';
  ctx.lineWidth = 2;
  ctx.strokeRect(48, 392, 420, 120);

  ctx.fillStyle = '#4ADE80';
  ctx.font = 'bold 15px sans-serif';
  ctx.fillText('สายเลือด (Pedigree)', 64, 420);

  ctx.fillStyle = '#D1D5DB';
  ctx.font = '14px sans-serif';
  if (snake.pedigree) {
    ctx.fillText(`พ่อ: ${snake.pedigree.sire?.name || '-'} (${snake.pedigree.sire?.morphEn || ''})`, 64, 448);
    ctx.fillText(`แม่: ${snake.pedigree.dam?.name || '-'} (${snake.pedigree.dam?.morphEn || ''})`, 64, 474);
  } else if (snake.parents) {
    ctx.fillText(`พ่อ: ${snake.parents.sireName}`, 64, 448);
    ctx.fillText(`แม่: ${snake.parents.damName}`, 64, 474);
  } else {
    ctx.fillStyle = '#9BA89E';
    ctx.fillText('สายพันธุ์นำเข้าจากตลาด (Foundation Breeder)', 64, 456);
  }

  // Right Info Panel
  const rx = 500;
  ctx.fillStyle = '#F4F0E2';
  ctx.font = 'bold 28px sans-serif';
  ctx.fillText(snake.name.slice(0, 26), rx, 146);

  ctx.fillStyle = snake.sex === 'M' ? '#38BDF8' : '#FB7185';
  ctx.font = 'bold 18px sans-serif';
  ctx.fillText(snake.sex === 'M' ? '♂ เพศผู้ (Male)' : '♀ เพศเมีย (Female)', rx, 178);

  ctx.fillStyle = '#EAB308';
  ctx.font = 'bold 20px sans-serif';
  ctx.fillText(pheno.nameEn.slice(0, 34), rx, 218);

  ctx.fillStyle = '#D1D5DB';
  ctx.font = '16px sans-serif';
  ctx.fillText(pheno.nameTh.slice(0, 44), rx, 246);

  ctx.fillStyle = '#9BA89E';
  ctx.font = '14px sans-serif';
  ctx.fillText(
    `${COMPLEX_LABEL_TH[pheno.complex]} · ${getRarityLabelTh(pheno.rarity)}`,
    rx,
    276
  );

  // Genes List
  ctx.fillStyle = '#151D19';
  ctx.fillRect(rx, 298, 412, 214);
  ctx.strokeStyle = '#2E3D34';
  ctx.strokeRect(rx, 298, 412, 214);

  ctx.fillStyle = '#EAB308';
  ctx.font = 'bold 15px sans-serif';
  ctx.fillText('องค์ประกอบทางพันธุกรรม (Genes)', rx + 16, 326);

  if (genes.length === 0) {
    ctx.fillStyle = '#9BA89E';
    ctx.font = '14px sans-serif';
    ctx.fillText('Normal / Wild Type (ยีนดั้งเดิมธรรมชาติ)', rx + 16, 358);
  } else {
    genes.slice(0, 6).forEach((g, idx) => {
      const y = 356 + idx * 25;
      ctx.fillStyle = g.isPosHet ? '#F59E0B' : g.isHet ? '#9BA89E' : '#F4F0E2';
      ctx.font = '14px sans-serif';
      ctx.fillText(`• ${g.nameTh}`, rx + 16, y);

      ctx.fillStyle = g.isSuper ? '#F59E0B' : g.isSexLinked ? '#C084FC' : '#4ADE80';
      ctx.font = 'bold 13px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(g.stateLabel, rx + 396, y);
      ctx.textAlign = 'left';
    });
  }

  // Trigger download
  const link = document.createElement('a');
  const safeName = snake.name.replace(/[^a-zA-Z0-9ก-๙_-]/g, '_');
  link.download = `morph-card-${safeName}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}
