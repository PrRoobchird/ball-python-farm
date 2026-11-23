import React from 'react';
import { Genotype, Sex, TerrariumDecorConfig } from '../game/types';
import { PixelSnakeSprite } from './PixelSnakeSprite';

interface TerrariumCanvasProps {
  sex: Sex;
  genotype: Genotype;
  seed: number;
  decor: TerrariumDecorConfig;
  compact?: boolean;
}

const BACKDROP_STYLES: Record<string, { bg: string; accent: string }> = {
  bg_rack: { bg: '#1D2520', accent: '#27332C' },
  bg_cork: { bg: '#473123', accent: '#5D402D' },
  bg_jungle: { bg: '#183626', accent: '#245238' },
  bg_night: { bg: '#12172A', accent: '#1E2747' },
};

const SUBSTRATE_STYLES: Record<string, { base: string; speck: string; top: string }> = {
  sub_paper: { base: '#CEC6B0', speck: '#B8AF98', top: '#E0D9C5' },
  sub_coco: { base: '#593722', speck: '#73482E', top: '#6B4229' },
  sub_moss: { base: '#275231', speck: '#397346', top: '#31633C' },
  sub_slate: { base: '#252B33', speck: '#363F4B', top: '#303842' },
};

export const TerrariumCanvas: React.FC<TerrariumCanvasProps> = ({
  sex,
  genotype,
  seed,
  decor,
  compact = false,
}) => {
  const backdrop = BACKDROP_STYLES[decor.backdrop] || BACKDROP_STYLES.bg_rack;
  const substrate = SUBSTRATE_STYLES[decor.substrate] || SUBSTRATE_STYLES.sub_paper;

  return (
    <div
      className="relative w-full overflow-hidden border-2 border-[#3C4F43] bg-[#121815]"
      style={{ height: compact ? '148px' : '188px' }}
    >
      {/* Pixel Backdrop Layer */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: backdrop.bg }}
      >
        {/* Cork texture */}
        {decor.backdrop === 'bg_cork' && (
          <svg className="w-full h-full opacity-40" viewBox="0 0 80 48" preserveAspectRatio="none">
            <rect x="4" y="4" width="12" height="8" fill={backdrop.accent} />
            <rect x="24" y="10" width="16" height="6" fill={backdrop.accent} />
            <rect x="52" y="5" width="14" height="9" fill={backdrop.accent} />
            <rect x="10" y="20" width="18" height="7" fill={backdrop.accent} />
            <rect x="44" y="18" width="22" height="8" fill={backdrop.accent} />
          </svg>
        )}

        {/* Jungle canopy */}
        {decor.backdrop === 'bg_jungle' && (
          <svg className="w-full h-full" viewBox="0 0 80 48" preserveAspectRatio="none">
            <rect x="0" y="0" width="80" height="48" fill="#183626" />
            <rect x="6" y="0" width="4" height="30" fill="#234F37" />
            <rect x="2" y="6" width="12" height="4" fill="#2E6B47" />
            <rect x="64" y="0" width="5" height="28" fill="#234F37" />
            <rect x="56" y="8" width="16" height="5" fill="#2E6B47" />
            <rect x="28" y="0" width="2" height="14" fill="#3B8759" />
            <rect x="34" y="0" width="2" height="18" fill="#3B8759" />
          </svg>
        )}

        {/* Moonlight night sky */}
        {decor.backdrop === 'bg_night' && (
          <svg className="w-full h-full" viewBox="0 0 80 48" preserveAspectRatio="none">
            <rect x="0" y="0" width="80" height="48" fill="#12172A" />
            <rect x="60" y="5" width="8" height="8" fill="#FDE68A" />
            <rect x="62" y="5" width="6" height="6" fill="#12172A" />
            <rect x="12" y="7" width="2" height="2" fill="#E2E8F0" />
            <rect x="26" y="12" width="1" height="1" fill="#E2E8F0" />
            <rect x="42" y="6" width="2" height="2" fill="#BAE6FD" />
            <rect x="72" y="14" width="1" height="1" fill="#E2E8F0" />
            <rect x="0" y="24" width="80" height="12" fill="#1B233D" />
          </svg>
        )}
      </div>

      {/* Heat lamp warm glow when lantern equipped */}
      {decor.plant === 'plant_lantern' && (
        <div
          className="absolute top-0 right-4 w-24 h-24 pointer-events-none opacity-35"
          style={{
            background: 'radial-gradient(circle, rgba(245,158,11,0.55) 0%, rgba(245,158,11,0) 70%)',
          }}
        />
      )}

      {/* Pixel Substrate Floor */}
      <div
        className="absolute bottom-0 inset-x-0 h-11 border-t-2 border-black/35"
        style={{ backgroundColor: substrate.base }}
      >
        <div
          className="h-2 w-full opacity-70"
          style={{ backgroundColor: substrate.top }}
        />
        <svg className="w-full h-8 opacity-65" viewBox="0 0 80 12" preserveAspectRatio="none">
          <rect x="5" y="3" width="3" height="2" fill={substrate.speck} />
          <rect x="16" y="6" width="4" height="2" fill={substrate.speck} />
          <rect x="28" y="2" width="3" height="2" fill={substrate.speck} />
          <rect x="42" y="7" width="5" height="2" fill={substrate.speck} />
          <rect x="58" y="3" width="4" height="2" fill={substrate.speck} />
          <rect x="70" y="6" width="3" height="2" fill={substrate.speck} />
        </svg>
      </div>

      {/* Left Hide Decoration */}
      <div className="absolute bottom-5 left-3 pointer-events-none">
        {decor.hide === 'hide_plastic' && (
          <svg width="46" height="28" viewBox="0 0 23 14" className="pixel-canvas">
            <rect x="1" y="3" width="21" height="11" fill="#2A3036" />
            <rect x="0" y="2" width="23" height="2" fill="#3B424A" />
            <rect x="7" y="7" width="9" height="7" fill="#0F1215" />
          </svg>
        )}
        {decor.hide === 'hide_wood' && (
          <svg width="52" height="30" viewBox="0 0 26 15" className="pixel-canvas">
            <rect x="2" y="4" width="22" height="11" fill="#6E472B" />
            <rect x="0" y="6" width="26" height="7" fill="#593720" />
            <rect x="4" y="3" width="18" height="2" fill="#8A5B39" />
            <rect x="8" y="8" width="9" height="7" fill="#1C110A" />
          </svg>
        )}
        {decor.hide === 'hide_rock' && (
          <svg width="54" height="32" viewBox="0 0 27 16" className="pixel-canvas">
            <rect x="3" y="4" width="21" height="12" fill="#555E68" />
            <rect x="6" y="1" width="14" height="4" fill="#6C7782" />
            <rect x="1" y="8" width="25" height="8" fill="#464E57" />
            <rect x="9" y="9" width="9" height="7" fill="#13161A" />
          </svg>
        )}
        {decor.hide === 'hide_temple' && (
          <svg width="58" height="36" viewBox="0 0 29 18" className="pixel-canvas">
            <rect x="2" y="6" width="25" height="12" fill="#7D7051" />
            <rect x="5" y="3" width="19" height="4" fill="#948562" />
            <rect x="9" y="0" width="11" height="3" fill="#ACA07C" />
            <rect x="10" y="10" width="9" height="8" fill="#19160F" />
            <rect x="4" y="8" width="3" height="3" fill="#4D6B4A" />
          </svg>
        )}
      </div>

      {/* Right Plant / Water Bowl / Lantern */}
      <div className="absolute bottom-5 right-3 pointer-events-none flex items-end gap-1.5">
        {decor.plant === 'plant_none' && (
          <svg width="34" height="16" viewBox="0 0 17 8" className="pixel-canvas">
            <rect x="1" y="2" width="15" height="6" fill="#475569" />
            <rect x="0" y="1" width="17" height="2" fill="#64748B" />
            <rect x="3" y="2" width="11" height="2" fill="#38BDF8" />
          </svg>
        )}
        {decor.plant === 'plant_fern' && (
          <svg width="48" height="40" viewBox="0 0 24 20" className="pixel-canvas">
            <rect x="10" y="10" width="3" height="10" fill="#2E6B36" />
            <rect x="4" y="8" width="8" height="3" fill="#3E8E41" />
            <rect x="12" y="6" width="9" height="3" fill="#4CAF50" />
            <rect x="2" y="12" width="8" height="3" fill="#3E8E41" />
            <rect x="13" y="11" width="8" height="3" fill="#4CAF50" />
            <rect x="6" y="15" width="12" height="5" fill="#475569" />
            <rect x="8" y="15" width="8" height="2" fill="#38BDF8" />
          </svg>
        )}
        {decor.plant === 'plant_monstera' && (
          <svg width="52" height="44" viewBox="0 0 26 22" className="pixel-canvas">
            <rect x="12" y="8" width="2" height="12" fill="#15803D" />
            <rect x="4" y="3" width="8" height="6" fill="#16A34A" />
            <rect x="6" y="5" width="2" height="2" fill="#121815" />
            <rect x="14" y="2" width="9" height="7" fill="#22C55E" />
            <rect x="18" y="4" width="2" height="2" fill="#121815" />
            <rect x="8" y="16" width="12" height="6" fill="#64748B" />
            <rect x="10" y="16" width="8" height="2" fill="#38BDF8" />
          </svg>
        )}
        {decor.plant === 'plant_lantern' && (
          <svg width="54" height="54" viewBox="0 0 27 27" className="pixel-canvas">
            <rect x="16" y="0" width="9" height="4" fill="#334155" />
            <rect x="17" y="4" width="7" height="2" fill="#F59E0B" />
            <rect x="3" y="12" width="2" height="15" fill="#15803D" />
            <rect x="1" y="14" width="6" height="3" fill="#22C55E" />
            <rect x="5" y="18" width="6" height="3" fill="#4ADE80" />
            <rect x="11" y="21" width="13" height="6" fill="#475569" />
            <rect x="13" y="21" width="9" height="2" fill="#38BDF8" />
          </svg>
        )}
      </div>

      {/* Snake Sprite */}
      <div className="absolute inset-x-0 bottom-2 flex justify-center pointer-events-none">
        <PixelSnakeSprite
          sex={sex}
          genotype={genotype}
          seed={seed}
          width={compact ? 168 : 204}
          height={compact ? 96 : 116}
          animate={true}
        />
      </div>

      {/* Crisp Glass Reflection Lines */}
      <div className="absolute top-2 left-2 w-8 h-0.5 bg-white/15 pointer-events-none" />
      <div className="absolute top-4 left-2 w-4 h-0.5 bg-white/10 pointer-events-none" />
    </div>
  );
};
