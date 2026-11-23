import React from 'react';
import {
  DECOR_ITEMS,
  EQUIPMENT_UPGRADES,
  getEquipmentCost,
  getFarmStatsFromEquipment,
} from '../game/economy';
import { DecorItem, DecorSlot, GameState } from '../game/types';
import { ArrowUpCircle, Check, Lock, Paintbrush, ShieldCheck, Sparkles } from 'lucide-react';

interface EquipmentViewProps {
  state: GameState;
  onUpgradeEquipment: (equipmentId: string) => void;
  onBuyDecor: (decorId: string) => void;
}

const SLOT_TITLES: Record<DecorSlot, string> = {
  substrate: 'วัสดุปูพื้นตู้ (Substrate)',
  backdrop: 'ฉากหลังตู้เลี้ยง (Backdrop)',
  hide: 'บ้านหลบซ่อน (Hide Cave)',
  plant: 'ต้นไม้และไฟประดับ (Plants & Props)',
};

export const EquipmentView: React.FC<EquipmentViewProps> = ({
  state,
  onUpgradeEquipment,
  onBuyDecor,
}) => {
  const farmStats = getFarmStatsFromEquipment(state.equipmentLevels);
  const discoveredCount = Object.keys(state.discoveredMorphs).length;

  const isDecorUnlocked = (item: DecorItem): boolean => {
    if (item.unlockType === 'free') return true;
    if (item.unlockType === 'morphs') return discoveredCount >= item.unlockCount;
    if (item.unlockType === 'day') return state.day >= item.unlockCount;
    if (item.unlockType === 'bred') return state.totalBred >= item.unlockCount;
    return false;
  };

  return (
    <div className="space-y-8">
      {/* Section 1: Care & Incubator Upgrades */}
      <div className="space-y-4">
        <div className="pixel-panel p-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-[#F4F0E2] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#4ADE80]" />
              อัปเกรดอุปกรณ์เลี้ยงและตู้ฟักไข่
            </h2>
            <p className="text-sm text-[#9BA89E]">
              อุปกรณ์ที่ดีช่วยเพิ่มโอกาสรอดชีวิตของลูกงู เพิ่มจำนวนไข่ต่อครอก และเร่งการเจริญเติบโต
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono-num">
            <div className="pixel-inset px-3 py-2">
              โอกาสรอดปัจจุบัน: <strong className="text-[#4ADE80]">{farmStats.survivalRate}%</strong>
            </div>
            <div className="pixel-inset px-3 py-2">
              ไข่/ครอก: <strong className="text-[#EAB308]">{farmStats.clutchSize} ใบ</strong>
            </div>
            <div className="pixel-inset px-3 py-2">
              โตไว: <strong className="text-[#38BDF8]">{farmStats.growthPerDay}x</strong>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {EQUIPMENT_UPGRADES.map((eq) => {
            const level = state.equipmentLevels[eq.id] || 0;
            const isMax = level >= eq.maxLevel;
            const nextCost = getEquipmentCost(eq, level);
            const canAfford = state.money >= nextCost;

            return (
              <div key={eq.id} className="pixel-card p-4 flex flex-col justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-bold text-sm text-[#F4F0E2]">{eq.nameTh}</h3>
                    <span className="font-mono-num text-xs font-bold text-[#EAB308]">
                      Lv.{level}/{eq.maxLevel}
                    </span>
                  </div>

                  {/* Level blocks */}
                  <div className="flex gap-1">
                    {Array.from({ length: eq.maxLevel }).map((_, idx) => (
                      <div
                        key={idx}
                        className={`h-2 flex-1 border border-black ${
                          idx < level ? 'bg-[#4ADE80]' : 'bg-[#131A16]'
                        }`}
                      />
                    ))}
                  </div>

                  <p className="text-xs text-[#9BA89E] leading-relaxed">{eq.descriptionTh}</p>

                  <div className="pixel-inset p-2.5 text-xs space-y-1 text-[#D1D5DB]">
                    {eq.survivalBonusPerLevel > 0 && (
                      <div>โอกาสรอดลูกงู: +{eq.survivalBonusPerLevel}% ต่อระดับ</div>
                    )}
                    {eq.clutchSizeBonusPerLevel > 0 && (
                      <div>จำนวนไข่ต่อครอก: +{eq.clutchSizeBonusPerLevel} ใบ ต่อระดับ</div>
                    )}
                    {eq.growthSpeedBonusPerLevel > 0 && (
                      <div>ความเร็วการโต: +{eq.growthSpeedBonusPerLevel} วัน/วัน ต่อระดับ</div>
                    )}
                  </div>
                </div>

                {isMax ? (
                  <div className="py-2 text-center text-xs font-bold text-[#4ADE80] border-2 border-[#2C4A38] bg-[#16271D]">
                    อัปเกรดระดับสูงสุดแล้ว
                  </div>
                ) : (
                  <button
                    onClick={() => onUpgradeEquipment(eq.id)}
                    disabled={!canAfford}
                    className="pixel-btn w-full py-2.5 bg-[#EAB308] text-[#111714] text-xs font-bold flex items-center justify-center gap-2 whitespace-nowrap"
                  >
                    <ArrowUpCircle className="w-4 h-4" />
                    อัปเกรด (฿{nextCost.toLocaleString()})
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 2: Terrarium Decor Shop & Unlockables */}
      <div className="space-y-4">
        <div className="pixel-panel p-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-[#F4F0E2] flex items-center gap-2">
              <Paintbrush className="w-5 h-5 text-[#38BDF8]" />
              ร้านของตกแต่งตู้เลี้ยงและชุดปลดล็อกพิเศษ
            </h2>
            <p className="text-sm text-[#9BA89E]">
              สะสมมอร์ฟใหม่และเพาะพันธุ์ลูกงูเพื่อปลดล็อกของตกแต่งหายาก เมื่อซื้อแล้วสามารถนำไปแต่งได้ทุกตู้ในฟาร์ม
            </p>
          </div>

          <div className="text-xs text-[#9BA89E] font-mono-num">
            ปลดล็อกแล้ว {state.unlockedDecorIds.length}/{DECOR_ITEMS.length} ชิ้น
            <span className="mx-2" aria-hidden="true">·</span>
            มอร์ฟที่ค้นพบ {discoveredCount} แบบ
          </div>
        </div>

        <div className="space-y-5">
          {(['substrate', 'backdrop', 'hide', 'plant'] as DecorSlot[]).map((slot) => (
            <div key={slot} className="pixel-panel p-4 space-y-3">
              <h3 className="text-sm font-bold text-[#EAB308]">{SLOT_TITLES[slot]}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {DECOR_ITEMS.filter((d) => d.slot === slot).map((item) => {
                  const owned = state.unlockedDecorIds.includes(item.id);
                  const unlocked = isDecorUnlocked(item);
                  const canAfford = state.money >= item.cost;

                  return (
                    <div
                      key={item.id}
                      className={`pixel-card p-3.5 flex flex-col justify-between gap-3 ${
                        !unlocked && !owned ? 'opacity-70' : ''
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-7 h-7 border-2 border-black shrink-0"
                            style={{ backgroundColor: item.previewColor }}
                          />
                          <div className="min-w-0">
                            <div className="font-bold text-xs text-[#F4F0E2] truncate">
                              {item.nameTh}
                            </div>
                            <div className="text-[11px] text-[#4ADE80] font-mono-num">
                              ความงามตู้ +{item.appealBonus}
                            </div>
                          </div>
                        </div>
                        <p className="text-xs text-[#9BA89E] leading-relaxed">
                          {item.descriptionTh}
                        </p>
                      </div>

                      {owned ? (
                        <div className="py-1.5 px-2 text-center text-xs font-bold text-[#4ADE80] bg-[#16271D] border border-[#2C4A38] flex items-center justify-center gap-1.5">
                          <Check className="w-3.5 h-3.5" />
                          มีในคลังแล้ว
                        </div>
                      ) : !unlocked ? (
                        <div className="py-1.5 px-2 text-center text-[11px] text-[#F59E0B] bg-[#241E14] border border-[#4D3B1A] flex items-center justify-center gap-1.5">
                          <Lock className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{item.unlockRequirementTh}</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => onBuyDecor(item.id)}
                          disabled={!canAfford}
                          className="pixel-btn w-full py-2 bg-[#38BDF8] text-[#09121A] text-xs font-bold flex items-center justify-center gap-1.5 whitespace-nowrap"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          ซื้อปลดล็อก (฿{item.cost.toLocaleString()})
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
