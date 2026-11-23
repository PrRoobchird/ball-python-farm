import React from 'react';
import { Genotype, Sex, TerrariumDecorConfig } from '../game/types';
import { PixelSnakeSprite } from './PixelSnakeSprite';

interface TerrariumCanvasProps {
  sex: Sex;
  genotype: Genotype;
  seed: number;
  decor: TerrariumDecorConfig;
  compact?: boolean;
  isInBlue?: boolean;
  canvasId?: string;
}

const BACKDROP_WALL_STYLES: Record<string, { wall: string; trim: string }> = {
  bg_rack: { wall: '#1B231E', trim: '#2E3B33' },
  bg_cork: { wall: '#4B3324', trim: '#6B4933' },
  bg_jungle: { wall: '#173826', trim: '#2B6644' },
  bg_night: { wall: '#11172B', trim: '#26345E' },
};

const SUBSTRATE_FLOOR_STYLES: Record<string, { base: string; speckA: string; speckB: string; speckC: string }> = {
  sub_paper: { base: '#CEC6B0', speckA: '#BFB69F', speckB: '#DBD4C1', speckC: '#B0A68F' },
  sub_coco: { base: '#593722', speckA: '#70472D', speckB: '#442817', speckC: '#855739' },
  sub_moss: { base: '#26502F', speckA: '#356E42', speckB: '#1B3B22', speckC: '#478A55' },
  sub_slate: { base: '#252C35', speckA: '#333C48', speckB: '#1A1F26', speckC: '#414D5C' },
};

export const TerrariumCanvas: React.FC<TerrariumCanvasProps> = ({
  sex,
  genotype,
  seed,
  decor,
  compact = false,
  isInBlue = false,
  canvasId,
}) => {
  const wallStyle = BACKDROP_WALL_STYLES[decor.backdrop] || BACKDROP_WALL_STYLES.bg_rack;
  const floorStyle = SUBSTRATE_FLOOR_STYLES[decor.substrate] || SUBSTRATE_FLOOR_STYLES.sub_paper;

  return (
    <div
      className="relative w-full overflow-hidden border-2 border-[#3C4F43] shadow-inner"
      style={{
        height: compact ? '168px' : '218px',
        backgroundColor: floorStyle.base,
      }}
    >
      {/* Top-Down Pixel Substrate Floor Texture */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 136 80"
        preserveAspectRatio="none"
      >
        <rect x="0" y="0" width="136" height="80" fill={floorStyle.base} />
        {decor.substrate === 'sub_slate' ? (
          <>
            <rect x="3" y="18" width="30" height="18" fill={floorStyle.speckA} />
            <rect x="4" y="19" width="28" height="2" fill={floorStyle.speckC} />
            <rect x="37" y="20" width="32" height="19" fill={floorStyle.speckB} />
            <rect x="73" y="17" width="28" height="17" fill={floorStyle.speckA} />
            <rect x="105" y="21" width="27" height="20" fill={floorStyle.speckB} />
            <rect x="10" y="42" width="34" height="20" fill={floorStyle.speckB} />
            <rect x="49" y="44" width="30" height="20" fill={floorStyle.speckA} />
            <rect x="50" y="45" width="28" height="2" fill={floorStyle.speckC} />
            <rect x="84" y="42" width="38" height="22" fill={floorStyle.speckB} />
          </>
        ) : (
          <>
            <rect x="10" y="20" width="5" height="3" fill={floorStyle.speckA} />
            <rect x="26" y="34" width="4" height="2" fill={floorStyle.speckC} />
            <rect x="42" y="24" width="6" height="3" fill={floorStyle.speckB} />
            <rect x="68" y="20" width="5" height="3" fill={floorStyle.speckA} />
            <rect x="94" y="32" width="6" height="3" fill={floorStyle.speckB} />
            <rect x="116" y="24" width="5" height="3" fill={floorStyle.speckC} />
            <rect x="18" y="54" width="7" height="3" fill={floorStyle.speckB} />
            <rect x="48" y="60" width="5" height="3" fill={floorStyle.speckA} />
            <rect x="76" y="52" width="6" height="3" fill={floorStyle.speckC} />
            <rect x="104" y="64" width="5" height="3" fill={floorStyle.speckA} />
          </>
        )}
      </svg>

      {/* Top Backdrop Wall Rim */}
      <div
        className="absolute top-0 inset-x-0 h-5 border-b-2 border-black/45 pointer-events-none"
        style={{ backgroundColor: wallStyle.wall }}
      >
        <svg className="w-full h-full" viewBox="0 0 136 12" preserveAspectRatio="none">
          {decor.backdrop === 'bg_cork' && (
            <>
              <rect x="6" y="2" width="16" height="6" fill={wallStyle.trim} />
              <rect x="34" y="3" width="22" height="5" fill={wallStyle.trim} />
              <rect x="70" y="2" width="20" height="6" fill={wallStyle.trim} />
              <rect x="104" y="3" width="18" height="5" fill={wallStyle.trim} />
            </>
          )}
          {decor.backdrop === 'bg_jungle' && (
            <>
              <rect x="0" y="0" width="136" height="4" fill="#23573A" />
              <rect x="12" y="4" width="12" height="6" fill="#2E754D" />
              <rect x="54" y="4" width="14" height="7" fill="#368759" />
              <rect x="98" y="4" width="16" height="6" fill="#2E754D" />
            </>
          )}
          {decor.backdrop === 'bg_night' && (
            <>
              <rect x="18" y="3" width="2" height="2" fill="#E2E8F0" />
              <rect x="48" y="5" width="2" height="2" fill="#BAE6FD" />
              <rect x="84" y="2" width="2" height="2" fill="#FDE68A" />
              <rect x="114" y="3" width="5" height="5" fill="#FDE68A" />
            </>
          )}
        </svg>
      </div>

      {/* Subtle Vivarium Basking Warmth & Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            decor.plant === 'plant_lantern'
              ? 'radial-gradient(circle at 80% 18%, rgba(245,158,11,0.28) 0%, rgba(0,0,0,0.18) 85%)'
              : 'radial-gradient(circle at 50% 48%, rgba(255,255,255,0.03) 40%, rgba(0,0,0,0.22) 100%)',
        }}
      />

      {/* Top-Down Hide Decoration with Ground Shadow */}
      <div className="absolute top-7 left-2.5 pointer-events-none drop-shadow-[2px_3px_0px_rgba(0,0,0,0.4)]">
        {decor.hide === 'hide_plastic' && (
          <svg width="42" height="34" viewBox="0 0 21 17" className="pixel-canvas">
            <rect x="1" y="1" width="19" height="15" fill="#252A30" />
            <rect x="2" y="2" width="17" height="11" fill="#363E47" />
            <rect x="3" y="3" width="15" height="2" fill="#46505C" />
            <rect x="6" y="12" width="9" height="5" fill="#0E1013" />
          </svg>
        )}
        {decor.hide === 'hide_wood' && (
          <svg width="48" height="34" viewBox="0 0 24 17" className="pixel-canvas">
            <rect x="1" y="3" width="22" height="12" fill="#4F301C" />
            <rect x="3" y="4" width="18" height="8" fill="#6E462A" />
            <rect x="5" y="5" width="14" height="2" fill="#8C5B39" />
            <rect x="7" y="9" width="9" height="1" fill="#4F301C" />
            <rect x="18" y="5" width="5" height="8" fill="#170D08" />
          </svg>
        )}
        {decor.hide === 'hide_rock' && (
          <svg width="48" height="38" viewBox="0 0 24 19" className="pixel-canvas">
            <rect x="2" y="2" width="20" height="15" fill="#3F4750" />
            <rect x="4" y="3" width="15" height="11" fill="#58636E" />
            <rect x="6" y="5" width="10" height="6" fill="#707D8A" />
            <rect x="8" y="14" width="8" height="5" fill="#121519" />
          </svg>
        )}
        {decor.hide === 'hide_temple' && (
          <svg width="50" height="40" viewBox="0 0 25 20" className="pixel-canvas">
            <rect x="1" y="2" width="23" height="16" fill="#6B5F44" />
            <rect x="4" y="4" width="17" height="11" fill="#8A7B58" />
            <rect x="7" y="6" width="11" height="7" fill="#A6976E" />
            <rect x="3" y="4" width="3" height="3" fill="#387346" />
            <rect x="17" y="11" width="3" height="3" fill="#387346" />
            <rect x="9" y="14" width="7" height="6" fill="#17140D" />
          </svg>
        )}
      </div>

      {/* Top-Down Water Dish & Foliage with Ground Shadow */}
      <div className="absolute bottom-2.5 right-2.5 pointer-events-none flex items-end gap-1.5 drop-shadow-[2px_3px_0px_rgba(0,0,0,0.4)]">
        {decor.plant === 'plant_none' && (
          <svg width="34" height="28" viewBox="0 0 17 14" className="pixel-canvas">
            <rect x="2" y="2" width="13" height="10" fill="#475569" />
            <rect x="1" y="3" width="15" height="8" fill="#64748B" />
            <rect x="3" y="4" width="11" height="6" fill="#38BDF8" />
            <rect x="4" y="5" width="5" height="1" fill="#BAE6FD" />
          </svg>
        )}
        {decor.plant === 'plant_fern' && (
          <svg width="48" height="36" viewBox="0 0 24 18" className="pixel-canvas">
            <rect x="12" y="5" width="10" height="9" fill="#475569" />
            <rect x="14" y="7" width="6" height="5" fill="#38BDF8" />
            <rect x="3" y="4" width="7" height="3" fill="#2A6332" />
            <rect x="1" y="8" width="9" height="3" fill="#3E8E41" />
            <rect x="4" y="12" width="7" height="3" fill="#4CAF50" />
            <rect x="5" y="6" width="4" height="5" fill="#22C55E" />
          </svg>
        )}
        {decor.plant === 'plant_monstera' && (
          <svg width="52" height="40" viewBox="0 0 26 20" className="pixel-canvas">
            <rect x="14" y="7" width="10" height="9" fill="#64748B" />
            <rect x="16" y="9" width="6" height="5" fill="#38BDF8" />
            <rect x="2" y="3" width="8" height="6" fill="#16A34A" />
            <rect x="4" y="5" width="2" height="2" fill={floorStyle.base} />
            <rect x="6" y="10" width="8" height="7" fill="#22C55E" />
            <rect x="9" y="12" width="2" height="2" fill={floorStyle.base} />
          </svg>
        )}
        {decor.plant === 'plant_lantern' && (
          <svg width="54" height="42" viewBox="0 0 27 21" className="pixel-canvas">
            <rect x="15" y="9" width="10" height="9" fill="#475569" />
            <rect x="17" y="11" width="6" height="5" fill="#38BDF8" />
            <rect x="2" y="6" width="10" height="4" fill="#22C55E" />
            <rect x="5" y="12" width="8" height="4" fill="#4ADE80" />
            <rect x="17" y="1" width="8" height="4" fill="#334155" />
            <rect x="18" y="4" width="6" height="2" fill="#F59E0B" />
          </svg>
        )}
      </div>

      {/* Realistic Roaming Slithering Top-Down Ball Python */}
      <div className="absolute inset-0 pt-4 flex items-center justify-center pointer-events-none">
        <PixelSnakeSprite
          sex={sex}
          genotype={genotype}
          seed={seed}
          width={compact ? 250 : 320}
          height={compact ? 140 : 180}
          animate={true}
          mode="roam"
          isInBlue={isInBlue}
          canvasId={canvasId}
        />
      </div>

      {/* Terrarium Glass Highlight */}
      <div className="absolute top-6 left-2 w-8 h-0.5 bg-white/20 pointer-events-none" />
    </div>
  );
};
