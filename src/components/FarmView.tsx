import React, { useMemo, useState } from 'react';
import {
  DECOR_ITEMS,
  calculateMarketValue,
  computeDailySaleChance,
  getTerrariumAppealBonus,
} from '../game/economy';
import {
  evaluatePhenotype,
  getGeneListForDisplay,
  getRarityColorClass,
  getRarityLabelTh,
} from '../game/genetics';
import { COMPLEX_LABEL_TH } from '../game/genes';
import {
  DecorSlot,
  GameState,
  Snake,
  TerrariumDecorConfig,
} from '../game/types';
import { TerrariumCanvas } from './TerrariumCanvas';
import { Dna, HeartHandshake, Paintbrush, Plus, Store, Tag } from 'lucide-react';

interface FarmViewProps {
  state: GameState;
  onBuyTerrarium: () => void;
  onToggleSale: (snakeId: string, isForSale: boolean, askingPrice: number) => void;
  onUpdateDecor: (terrariumId: string, slot: DecorSlot, decorId: string) => void;
  onRenameSnake: (snakeId: string, name: string) => void;
  onSendToBreeding: (snake: Snake) => void;
  onGoToShop: () => void;
  onGoToEquipment: () => void;
}

const SLOT_LABELS: Record<DecorSlot, string> = {
  substrate: 'วัสดุปูพื้น',
  backdrop: 'ฉากหลังตู้',
  hide: 'บ้านหลบซ่อน',
  plant: 'ต้นไม้และอุปกรณ์',
};

export const FarmView: React.FC<FarmViewProps> = ({
  state,
  onBuyTerrarium,
  onToggleSale,
  onUpdateDecor,
  onRenameSnake,
  onSendToBreeding,
  onGoToShop,
  onGoToEquipment,
}) => {
  const [selectedSnakeId, setSelectedSnakeId] = useState<string | null>(
    state.snakes[0]?.id || null
  );
  const [customPriceInput, setCustomPriceInput] = useState<number>(0);
  const [activeDecorSlot, setActiveDecorSlot] = useState<DecorSlot>('substrate');
  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState('');

  const selectedSnake = useMemo(
    () => state.snakes.find((s) => s.id === selectedSnakeId) || state.snakes[0] || null,
    [state.snakes, selectedSnakeId]
  );

  const selectedTerrarium = useMemo(() => {
    if (!selectedSnake) return null;
    return state.terrariums.find((t) => t.id === selectedSnake.terrariumId) || state.terrariums[0] || null;
  }, [state.terrariums, selectedSnake]);

  const handleSelectSnake = (snake: Snake) => {
    setSelectedSnakeId(snake.id);
    setCustomPriceInput(snake.askingPrice);
    setEditingName(false);
  };

  const emptyTerrariumsCount = Math.max(0, state.terrariums.length - state.snakes.length);
  const nextTerrariumCost = 2200 + Math.max(0, state.terrariums.length - 2) * 800;

  // Compute inspector metrics
  const selectedPheno = selectedSnake
    ? evaluatePhenotype(selectedSnake.sex, selectedSnake.genotype)
    : null;
  const selectedGenes = selectedSnake
    ? getGeneListForDisplay(selectedSnake.sex, selectedSnake.genotype)
    : [];
  const decorAppeal = selectedTerrarium ? getTerrariumAppealBonus(selectedTerrarium.decor) : 0;
  const valuation = selectedSnake
    ? calculateMarketValue(selectedSnake.sex, selectedSnake.genotype, state.marketTrend, decorAppeal)
    : null;

  const effectivePrice =
    selectedSnake && customPriceInput > 0
      ? customPriceInput
      : selectedSnake?.askingPrice || valuation?.finalMarketPrice || 1200;

  const saleChancePct =
    valuation && selectedSnake
      ? Math.round(
          computeDailySaleChance(
            effectivePrice,
            valuation.finalMarketPrice,
            valuation.matchesTrend,
            decorAppeal
          ) * 100
        )
      : 0;

  return (
    <div className="space-y-6">
      {/* Farm Overview Strip */}
      <div className="pixel-panel p-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-[#F4F0E2]">
            โรงเรือนและตู้เลี้ยงงู ({state.snakes.length}/{state.terrariums.length} ตู้)
          </h2>
          <p className="text-sm text-[#9BA89E]">
            ตู้ว่างพร้อมรับงูใหม่: <span className="font-mono-num text-[#4ADE80] font-semibold">{emptyTerrariumsCount}</span> ตู้
            <span className="mx-2" aria-hidden="true">·</span>
            กดเลือกงูแต่ละตู้เพื่อปรับแต่งฉากหลัง ตั้งราคาขาย หรือส่งเข้าผสมพันธุ์
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onGoToShop}
            className="pixel-btn px-4 py-2 bg-[#2B3B32] text-[#F4F0E2] text-sm font-semibold flex items-center gap-2 whitespace-nowrap shrink-0"
          >
            <Store className="w-4 h-4 text-[#F59E0B]" />
            ไปตลาดซื้อขายงู
          </button>
          <button
            onClick={onBuyTerrarium}
            disabled={state.money < nextTerrariumCost}
            className="pixel-btn px-4 py-2 bg-[#EAB308] text-[#111714] text-sm font-bold flex items-center gap-2 whitespace-nowrap shrink-0"
          >
            <Plus className="w-4 h-4" />
            เพิ่มตู้เลี้ยง (฿{nextTerrariumCost.toLocaleString()})
          </button>
        </div>
      </div>

      {/* Empty State when player starts with 0 snakes */}
      {state.snakes.length === 0 ? (
        <div className="pixel-panel p-8 text-center space-y-4">
          <div className="font-pixel text-xl text-[#F59E0B]">EMPTY TERRARIUM RACK</div>
          <h3 className="text-xl font-bold text-[#F4F0E2]">
            ฟาร์มของคุณพร้อมแล้ว — เริ่มต้นเลือกซื้องูคู่แรกจากตลาด
          </h3>
          <p className="text-sm text-[#9BA89E] max-w-xl mx-auto leading-relaxed">
            คุณมีงบเริ่มต้น <span className="font-mono-num text-[#4ADE80] font-bold">฿{state.money.toLocaleString()}</span> และตู้เลี้ยงว่าง {state.terrariums.length} ตู้
            ลองเข้าไปเลือกซื้อสายพันธุ์จาก 4 ร้านค้าที่มีทั้งงูแบบดั้งเดิม ยีนเด่น ยีนด้อย (Het) โทนเข้ม Black Complex และ Banana X/Y ตามงบประมาณของคุณ
          </p>
          <div className="pt-2">
            <button
              onClick={onGoToShop}
              className="pixel-btn px-6 py-3 bg-[#EAB308] text-[#111714] font-bold text-base inline-flex items-center gap-2 whitespace-nowrap"
            >
              <Store className="w-5 h-5" />
              เข้าสู่ตลาดซื้อขายงู
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Terrarium Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {state.snakes.map((snake) => {
              const pheno = evaluatePhenotype(snake.sex, snake.genotype);
              const terrarium =
                state.terrariums.find((t) => t.id === snake.terrariumId) || state.terrariums[0];
              const isSelected = selectedSnake?.id === snake.id;
              const isMature = snake.ageDays >= snake.matureDays;

              return (
                <button
                  key={snake.id}
                  onClick={() => handleSelectSnake(snake)}
                  className={`text-left p-3 transition-transform cursor-pointer ${
                    isSelected
                      ? 'pixel-card ring-2 ring-[#F59E0B] -translate-y-0.5'
                      : 'pixel-card hover:border-[#5D7868]'
                  }`}
                >
                  <TerrariumCanvas
                    sex={snake.sex}
                    genotype={snake.genotype}
                    seed={snake.seed}
                    decor={terrarium?.decor || state.terrariums[0].decor}
                    compact={true}
                  />

                  <div className="mt-3 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-[#F4F0E2] truncate">{snake.name}</span>
                      <span
                        className={`font-mono-num text-xs font-bold shrink-0 ${
                          snake.sex === 'M' ? 'text-[#38BDF8]' : 'text-[#FB7185]'
                        }`}
                      >
                        {snake.sex === 'M' ? '♂ ผู้' : '♀ เมีย'}
                      </span>
                    </div>

                    <div className="text-xs font-medium text-[#EAB308] truncate">
                      {pheno.nameEn}
                    </div>

                    <div className="flex items-center justify-between text-xs text-[#9BA89E] pt-1">
                      <span className="truncate">
                        {isMature ? 'พร้อมผสมพันธุ์' : `ลูกงู (${snake.ageDays}/${snake.matureDays} วัน)`}
                        <span className="mx-1.5" aria-hidden="true">·</span>
                        <span className={getRarityColorClass(pheno.rarity)}>
                          {getRarityLabelTh(pheno.rarity)}
                        </span>
                      </span>
                      {snake.isForSale && (
                        <span className="font-mono-num text-[#4ADE80] font-bold shrink-0">
                          ขาย ฿{snake.askingPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right: Selected Snake & Terrarium Inspector */}
          {selectedSnake && selectedPheno && selectedTerrarium && valuation && (
            <div className="lg:col-span-5 pixel-panel p-5 space-y-5 lg:sticky lg:top-4">
              {/* Header + Name Edit */}
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  {editingName ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={nameDraft}
                        onChange={(e) => setNameDraft(e.target.value)}
                        maxLength={28}
                        className="pixel-inset px-2.5 py-1 text-sm text-[#F4F0E2] w-full focus:outline-none focus:border-[#EAB308]"
                      />
                      <button
                        onClick={() => {
                          if (nameDraft.trim()) onRenameSnake(selectedSnake.id, nameDraft.trim());
                          setEditingName(false);
                        }}
                        className="pixel-btn px-3 py-1 bg-[#22C55E] text-[#0B120D] text-xs font-bold whitespace-nowrap"
                      >
                        บันทึก
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-[#F4F0E2] truncate">
                        {selectedSnake.name}
                      </h3>
                      <button
                        onClick={() => {
                          setNameDraft(selectedSnake.name);
                          setEditingName(true);
                        }}
                        className="text-xs text-[#9BA89E] hover:text-[#EAB308] underline whitespace-nowrap"
                      >
                        เปลี่ยนชื่อ
                      </button>
                    </div>
                  )}
                  <div className="text-xs text-[#9BA89E] mt-1">
                    {selectedSnake.sex === 'M' ? 'เพศผู้ (XY)' : 'เพศเมีย (XX)'}
                    <span className="mx-1.5" aria-hidden="true">·</span>
                    {COMPLEX_LABEL_TH[selectedPheno.complex]}
                    <span className="mx-1.5" aria-hidden="true">·</span>
                    <span className={getRarityColorClass(selectedPheno.rarity)}>
                      {getRarityLabelTh(selectedPheno.rarity)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onSendToBreeding(selectedSnake)}
                  disabled={selectedSnake.ageDays < selectedSnake.matureDays}
                  className="pixel-btn px-3 py-2 bg-[#365341] text-[#F4F0E2] text-xs font-bold flex items-center gap-1.5 whitespace-nowrap shrink-0"
                >
                  <HeartHandshake className="w-4 h-4 text-[#4ADE80]" />
                  นำไปผสมพันธุ์
                </button>
              </div>

              {/* Full Terrarium Preview */}
              <TerrariumCanvas
                sex={selectedSnake.sex}
                genotype={selectedSnake.genotype}
                seed={selectedSnake.seed}
                decor={selectedTerrarium.decor}
                compact={false}
              />

              {/* Genetics Breakdown */}
              <div className="pixel-inset p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#EAB308] flex items-center gap-1.5">
                    <Dna className="w-4 h-4" />
                    ข้อมูลพันธุกรรม (Genotype)
                  </span>
                  <span className="text-xs text-[#9BA89E]">
                    {selectedSnake.ageDays >= selectedSnake.matureDays
                      ? 'โตเต็มวัยพร้อมผสม'
                      : `กำลังโต (${selectedSnake.ageDays}/${selectedSnake.matureDays} วัน)`}
                  </span>
                </div>

                <div className="text-sm font-semibold text-[#F4F0E2]">
                  {selectedPheno.nameTh}
                </div>
                <div className="text-xs text-[#9BA89E] font-mono-num">
                  {selectedPheno.nameEn}
                </div>

                {selectedGenes.length > 0 ? (
                  <div className="pt-1.5 border-t border-[#2D3B33] space-y-1">
                    {selectedGenes.map((g, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-xs"
                      >
                        <span className={g.isHet ? 'text-[#9BA89E]' : 'text-[#F4F0E2]'}>
                          {g.nameTh}
                        </span>
                        <span
                          className={`font-mono-num ${
                            g.isSuper
                              ? 'text-[#F59E0B] font-bold'
                              : g.isSexLinked
                                ? 'text-[#C084FC]'
                                : g.isHet
                                  ? 'text-[#9BA89E]'
                                  : 'text-[#4ADE80]'
                          }`}
                        >
                          {g.stateLabel}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-[#9BA89E] pt-1">
                    ไม่มียีนกลายพันธุ์ (ยีนดั้งเดิมธรรมชาติ 100%)
                  </div>
                )}

                {selectedSnake.parents && (
                  <div className="text-xs text-[#9BA89E] pt-1.5 border-t border-[#2D3B33]">
                    สายเลือด: พ่อ {selectedSnake.parents.sireName} × แม่ {selectedSnake.parents.damName}
                  </div>
                )}
              </div>

              {/* Market Selling & Custom Pricing */}
              <div className="pixel-inset p-3.5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#4ADE80] flex items-center gap-1.5">
                    <Tag className="w-4 h-4" />
                    ตั้งราคาขายตามความต้องการตลาด
                  </span>
                  <span className="text-xs font-mono-num text-[#9BA89E]">
                    ประเมินตลาด ฿{valuation.finalMarketPrice.toLocaleString()}
                  </span>
                </div>

                {valuation.matchesTrend && (
                  <div className="text-xs text-[#F59E0B]">
                    ตรงกระแสตลาดวันนี้! มูลค่าเพิ่ม {Math.round((valuation.trendMultiplier - 1) * 100)}%
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <span className="text-sm text-[#9BA89E]">฿</span>
                  <input
                    type="number"
                    min={500}
                    step={100}
                    value={customPriceInput || selectedSnake.askingPrice}
                    onChange={(e) => setCustomPriceInput(Math.max(500, Number(e.target.value)))}
                    className="pixel-card px-3 py-1.5 text-sm font-mono-num text-[#F4F0E2] w-full focus:outline-none focus:border-[#EAB308]"
                  />
                  <button
                    onClick={() => setCustomPriceInput(Math.round(valuation.finalMarketPrice * 0.85 / 50) * 50)}
                    className="pixel-btn px-2.5 py-1.5 bg-[#27352D] text-xs text-[#F4F0E2] whitespace-nowrap"
                  >
                    ขายไว
                  </button>
                  <button
                    onClick={() => setCustomPriceInput(valuation.finalMarketPrice)}
                    className="pixel-btn px-2.5 py-1.5 bg-[#27352D] text-xs text-[#F4F0E2] whitespace-nowrap"
                  >
                    ราคากลาง
                  </button>
                </div>

                <div className="flex items-center justify-between text-xs text-[#9BA89E]">
                  <span>โอกาสขายได้ต่อวัน: <strong className="font-mono-num text-[#F4F0E2]">{saleChancePct}%</strong></span>
                  <span>ความสวยงามตู้: <strong className="font-mono-num text-[#EAB308]">+{decorAppeal}</strong></span>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  {selectedSnake.isForSale ? (
                    <>
                      <button
                        onClick={() => onToggleSale(selectedSnake.id, true, effectivePrice)}
                        className="pixel-btn flex-1 py-2 bg-[#22C55E] text-[#0B120D] text-xs font-bold whitespace-nowrap"
                      >
                        อัปเดตราคาประกาศขาย
                      </button>
                      <button
                        onClick={() => onToggleSale(selectedSnake.id, false, effectivePrice)}
                        className="pixel-btn px-3 py-2 bg-[#3B2626] text-[#FCA5A5] text-xs font-bold whitespace-nowrap"
                      >
                        ถอดจากตลาด
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => onToggleSale(selectedSnake.id, true, effectivePrice)}
                      className="pixel-btn w-full py-2 bg-[#EAB308] text-[#111714] text-xs font-bold whitespace-nowrap"
                    >
                      ลงขายในราคา ฿{effectivePrice.toLocaleString()}
                    </button>
                  )}
                </div>
              </div>

              {/* Terrarium Decor Customizer */}
              <div className="pixel-inset p-3.5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#38BDF8] flex items-center gap-1.5">
                    <Paintbrush className="w-4 h-4" />
                    ตกแต่งตู้เลี้ยงนี้
                  </span>
                  <button
                    onClick={onGoToEquipment}
                    className="text-xs text-[#EAB308] hover:underline whitespace-nowrap"
                  >
                    ปลดล็อกของแต่งเพิ่ม →
                  </button>
                </div>

                <div className="grid grid-cols-4 gap-1.5">
                  {(['substrate', 'backdrop', 'hide', 'plant'] as DecorSlot[]).map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setActiveDecorSlot(slot)}
                      className={`px-2 py-1.5 text-xs font-semibold border transition-colors truncate ${
                        activeDecorSlot === slot
                          ? 'bg-[#32443A] border-[#EAB308] text-[#F4F0E2]'
                          : 'bg-[#18201B] border-[#2D3B33] text-[#9BA89E] hover:text-[#F4F0E2]'
                      }`}
                    >
                      {SLOT_LABELS[slot]}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {DECOR_ITEMS.filter((item) => item.slot === activeDecorSlot).map((item) => {
                    const isOwned = state.unlockedDecorIds.includes(item.id);
                    const isEquipped = selectedTerrarium.decor[activeDecorSlot] === item.id;

                    return (
                      <button
                        key={item.id}
                        disabled={!isOwned}
                        onClick={() => onUpdateDecor(selectedTerrarium.id, activeDecorSlot, item.id)}
                        className={`text-left p-2 border text-xs transition-colors ${
                          isEquipped
                            ? 'bg-[#2C3E33] border-[#4ADE80] text-[#F4F0E2]'
                            : isOwned
                              ? 'bg-[#1B241F] border-[#394A40] text-[#D1D5DB] hover:border-[#EAB308]'
                              : 'bg-[#141A17] border-[#252E29] text-[#6B7280] opacity-60 cursor-not-allowed'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className="w-3 h-3 shrink-0 border border-black"
                            style={{ backgroundColor: item.previewColor }}
                          />
                          <span className="font-semibold truncate">{item.nameTh}</span>
                        </div>
                        <div className="text-[11px] text-[#9BA89E] mt-1 truncate">
                          {isEquipped
                            ? 'กำลังใช้งาน'
                            : isOwned
                              ? `ความงาม +${item.appealBonus}`
                              : 'ยังไม่ปลดล็อก'}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
