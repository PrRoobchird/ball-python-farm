import React, { useMemo, useState } from 'react';
import { DREAM_GOALS, analyzeDreamGoal, getFarmStatsFromEquipment } from '../game/economy';
import {
  bananaStatusLabelTh,
  evaluatePhenotype,
  getBananaStatus,
  getRarityColorClass,
  getRarityLabelTh,
  predictBreedingOutcomes,
} from '../game/genetics';
import { BreedingClutch, GameState, Snake } from '../game/types';
import { PixelSnakeSprite } from './PixelSnakeSprite';
import { Compass, Dna, Egg, Heart, Sparkles, Thermometer } from 'lucide-react';

interface BreedingViewProps {
  state: GameState;
  preselectedSireId: string | null;
  preselectedDamId: string | null;
  onStartBreeding: (sireId: string, damId: string) => void;
  onHatchClutch: (clutchId: string) => void;
  onGoToEquipment: () => void;
}

export const BreedingView: React.FC<BreedingViewProps> = ({
  state,
  preselectedSireId,
  preselectedDamId,
  onStartBreeding,
  onHatchClutch,
  onGoToEquipment,
}) => {
  const matureMales = useMemo(
    () => state.snakes.filter((s) => s.sex === 'M' && s.ageDays >= s.matureDays),
    [state.snakes]
  );
  const matureFemales = useMemo(
    () =>
      state.snakes.filter(
        (s) => s.sex === 'F' && s.ageDays >= s.matureDays && s.cooldownUntilDay <= state.day
      ),
    [state.snakes, state.day]
  );
  const coolingFemales = useMemo(
    () =>
      state.snakes.filter(
        (s) => s.sex === 'F' && s.ageDays >= s.matureDays && s.cooldownUntilDay > state.day
      ),
    [state.snakes, state.day]
  );

  const [sireId, setSireId] = useState<string>(
    preselectedSireId || matureMales[0]?.id || ''
  );
  const [damId, setDamId] = useState<string>(
    preselectedDamId || matureFemales[0]?.id || ''
  );
  const [selectedGoalId, setSelectedGoalId] = useState<string>(DREAM_GOALS[0].id);
  const [showPlanner, setShowPlanner] = useState<boolean>(true);

  const sire: Snake | undefined =
    matureMales.find((m) => m.id === sireId) || matureMales[0];
  const dam: Snake | undefined =
    matureFemales.find((f) => f.id === damId) || matureFemales[0];

  const farmStats = getFarmStatsFromEquipment(state.equipmentLevels);

  const outcomes = useMemo(() => {
    if (!sire || !dam) return [];
    return predictBreedingOutcomes(sire.genotype, dam.genotype);
  }, [sire, dam]);

  const activeGoal = DREAM_GOALS.find((g) => g.id === selectedGoalId) || DREAM_GOALS[0];
  const goalAnalysis = useMemo(
    () => analyzeDreamGoal(activeGoal, state.snakes, state.shopListings),
    [activeGoal, state.snakes, state.shopListings]
  );

  const activeClutches = state.clutches.filter((c) => !c.hatched);
  const completedClutches = state.clutches.filter((c) => c.hatched).slice(0, 4);

  const sireBanana = sire ? getBananaStatus(sire.sex, sire.genotype) : 'none';
  const damBanana = dam ? getBananaStatus(dam.sex, dam.genotype) : 'none';

  return (
    <div className="space-y-6">
      {/* Breeding Environment Stats Bar */}
      <div className="pixel-panel p-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-[#F4F0E2]">
            ห้องผสมพันธุ์และตู้ฟักไข่ (Breeding Lab)
          </h2>
          <p className="text-sm text-[#9BA89E]">
            จับคู่พ่อแม่พันธุ์เพื่อคำนวณตารางพันธุศาสตร์ (Punnett Square) และฟักไข่ลุ้นมอร์ฟใหม่
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="pixel-inset px-3 py-2 flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-[#4ADE80]" />
            <span>
              อัตรารอดลูกงู:{' '}
              <strong className="font-mono-num text-[#4ADE80]">{farmStats.survivalRate}%</strong>
            </span>
          </div>
          <div className="pixel-inset px-3 py-2 flex items-center gap-2">
            <Egg className="w-4 h-4 text-[#EAB308]" />
            <span>
              ไข่ต่อครอก:{' '}
              <strong className="font-mono-num text-[#EAB308]">{farmStats.clutchSize} ใบ</strong>
            </span>
          </div>
          <button
            onClick={() => setShowPlanner(!showPlanner)}
            className="pixel-btn px-3.5 py-2 bg-[#2B3B32] text-[#F4F0E2] font-bold flex items-center gap-1.5 whitespace-nowrap"
          >
            <Compass className="w-4 h-4 text-[#38BDF8]" />
            {showPlanner ? 'ซ่อนตัวช่วยวางแผน' : 'วางแผนมอร์ฟเป้าหมาย'}
          </button>
          <button
            onClick={onGoToEquipment}
            className="pixel-btn px-3.5 py-2 bg-[#2B3B32] text-[#F4F0E2] font-bold whitespace-nowrap"
          >
            อัปเกรดตู้ฟักไข่
          </button>
        </div>
      </div>

      {/* Breeding Goal Planner */}
      {showPlanner && (
        <div className="pixel-panel p-4 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#38BDF8]" />
              <h3 className="text-sm font-bold text-[#F4F0E2]">
                ตัวช่วยวางแผนมอร์ฟเป้าหมาย (Breeding Goal Planner)
              </h3>
            </div>
            <select
              value={selectedGoalId}
              onChange={(e) => setSelectedGoalId(e.target.value)}
              className="pixel-inset px-3 py-1.5 text-xs text-[#F4F0E2] focus:outline-none focus:border-[#38BDF8]"
            >
              {DREAM_GOALS.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.nameEn} ({g.difficultyTh})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div className="md:col-span-8 pixel-inset p-3.5 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-bold text-[#EAB308]">
                  {activeGoal.nameEn} · {activeGoal.nameTh}
                </span>
                <span className="font-mono-num text-xs font-bold text-[#4ADE80]">
                  ความพร้อมยีนในฟาร์ม {goalAnalysis.readinessPct}%
                </span>
              </div>
              <div className="h-2 w-full bg-[#1C2621] border border-black">
                <div
                  className="h-full bg-[#4ADE80] transition-all"
                  style={{ width: `${goalAnalysis.readinessPct}%` }}
                />
              </div>
              <p className="text-xs text-[#9BA89E]">{activeGoal.descriptionTh}</p>
              <div className="text-xs text-[#D1D5DB]">
                คำแนะนำ: <span className="text-[#38BDF8] font-medium">{goalAnalysis.adviceTh}</span>
              </div>
            </div>

            <div className="md:col-span-4 space-y-2 text-xs">
              {goalAnalysis.bestSire && goalAnalysis.bestDam && (
                <button
                  onClick={() => {
                    setSireId(goalAnalysis.bestSire!.id);
                    setDamId(goalAnalysis.bestDam!.id);
                  }}
                  className="pixel-btn w-full py-2.5 px-3 bg-[#365341] text-[#F4F0E2] font-bold whitespace-nowrap"
                >
                  เลือกคู่ที่แนะนำลงช่องผสม
                </button>
              )}
              <div className="pixel-inset p-2.5 text-[11px] text-[#9BA89E]">
                ยีนที่มีแล้ว: {goalAnalysis.ownedKeys.join(', ') || 'ยังไม่มี'}
                {goalAnalysis.missingKeys.length > 0 && (
                  <div className="text-[#F59E0B] mt-0.5">
                    ยังขาด: {goalAnalysis.missingKeys.join(', ')}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Parent Pairing Selector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Sire Selection */}
        <div className="lg:col-span-4 pixel-panel p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#38BDF8]">พ่อพันธุ์ (Sire ♂)</h3>
            <span className="text-xs text-[#9BA89E]">พร้อมผสม {matureMales.length} ตัว</span>
          </div>

          {matureMales.length === 0 ? (
            <div className="pixel-inset p-4 text-xs text-[#9BA89E] text-center">
              ยังไม่มีงูเพศผู้ที่โตเต็มวัย ซื้อจากตลาดหรือรอให้งูโตก่อน
            </div>
          ) : (
            <>
              <select
                value={sire?.id || ''}
                onChange={(e) => setSireId(e.target.value)}
                className="pixel-inset w-full px-3 py-2 text-sm text-[#F4F0E2] focus:outline-none focus:border-[#38BDF8]"
              >
                {matureMales.map((m) => {
                  const ph = evaluatePhenotype(m.sex, m.genotype, {
                    posHets: m.posHets,
                    dnaTested: m.dnaTested,
                  });
                  return (
                    <option key={m.id} value={m.id}>
                      {m.name} — {ph.nameEn}
                    </option>
                  );
                })}
              </select>

              {sire && (
                <div className="pixel-inset p-3 space-y-2">
                  <div className="flex justify-center">
                    <PixelSnakeSprite
                      sex={sire.sex}
                      genotype={sire.genotype}
                      seed={sire.seed}
                      width={196}
                      height={110}
                      isInBlue={sire.isInBlue}
                    />
                  </div>
                  <div className="text-sm font-bold text-[#F4F0E2]">
                    {evaluatePhenotype(sire.sex, sire.genotype, {
                      posHets: sire.posHets,
                      dnaTested: sire.dnaTested,
                    }).nameEn}
                  </div>
                  <div className="text-xs text-[#EAB308]">
                    {evaluatePhenotype(sire.sex, sire.genotype, {
                      posHets: sire.posHets,
                      dnaTested: sire.dnaTested,
                    }).nameTh}
                  </div>
                  {sireBanana !== 'none' && (
                    <div className="text-xs text-[#C084FC] font-semibold">
                      โครโมโซมเพศ: {bananaStatusLabelTh(sireBanana)}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Center: Pair Action & Sex-Linked Note */}
        <div className="lg:col-span-4 pixel-panel p-4 space-y-4 flex flex-col justify-between">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-[#2C3B31] border-2 border-[#EAB308] text-[#FB7185]">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#F4F0E2]">จับคู่ผสมพันธุ์</h3>
            <p className="text-xs text-[#9BA89E] leading-relaxed">
              ลูกงูในครอกใช้เวลาฟัก <span className="font-mono-num text-[#F4F0E2]">3 วัน</span> และแม่พันธุ์จะพักฟื้นหลังวางไข่{' '}
              <span className="font-mono-num text-[#F4F0E2]">2 วัน</span>
            </p>
          </div>

          {(sireBanana !== 'none' || damBanana !== 'none') && (
            <div className="pixel-inset p-3 text-xs space-y-1">
              <div className="font-bold text-[#C084FC]">กลไกยีนโครโมโซมเพศ Banana X/Y</div>
              <p className="text-[#9BA89E] leading-relaxed">
                {sireBanana === 'banana_x_male' &&
                  'พ่อเป็น Banana X (Female Maker): จะส่งยีน Banana ให้ลูกสาวเกือบทั้งหมด และลูกชายจะเป็น Normal'}
                {sireBanana === 'banana_y_male' &&
                  'พ่อเป็น Banana Y (Male Maker): จะส่งยีน Banana ให้ลูกชายเกือบทั้งหมด และลูกสาวจะเป็น Normal'}
                {sireBanana === 'super_banana_male' &&
                  'พ่อเป็น Super Banana (X^B Y^B): ลูกทุกตัวจะได้ยีน Banana 100%!'}
                {damBanana !== 'none' &&
                  ' แม่ Banana (X^B) สามารถส่งยีนให้ได้ทั้งลูกชายและลูกสาว โดยลูกชายที่ได้ยีนจากแม่จะเป็น Banana X!'}
              </p>
            </div>
          )}

          {coolingFemales.length > 0 && (
            <div className="text-[11px] text-[#F59E0B] text-center">
              มีแม่พันธุ์ {coolingFemales.length} ตัวกำลังพักฟื้นหลังวางไข่
            </div>
          )}

          <button
            onClick={() => sire && dam && onStartBreeding(sire.id, dam.id)}
            disabled={!sire || !dam}
            className="pixel-btn w-full py-3 bg-[#EAB308] text-[#111714] font-bold text-sm flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <Sparkles className="w-4 h-4" />
            เริ่มผสมพันธุ์ ({farmStats.clutchSize} ฟอง · รอด {farmStats.survivalRate}%)
          </button>
        </div>

        {/* Dam Selection */}
        <div className="lg:col-span-4 pixel-panel p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#FB7185]">แม่พันธุ์ (Dam ♀)</h3>
            <span className="text-xs text-[#9BA89E]">พร้อมผสม {matureFemales.length} ตัว</span>
          </div>

          {matureFemales.length === 0 ? (
            <div className="pixel-inset p-4 text-xs text-[#9BA89E] text-center">
              {coolingFemales.length > 0
                ? 'แม่พันธุ์ทั้งหมดกำลังพักฟื้นหลังวางไข่ กด "วันถัดไป" เพื่อรอฟื้นตัว'
                : 'ยังไม่มีงูเพศเมียที่โตเต็มวัย ซื้อจากตลาดหรือรอให้งูโตก่อน'}
            </div>
          ) : (
            <>
              <select
                value={dam?.id || ''}
                onChange={(e) => setDamId(e.target.value)}
                className="pixel-inset w-full px-3 py-2 text-sm text-[#F4F0E2] focus:outline-none focus:border-[#FB7185]"
              >
                {matureFemales.map((f) => {
                  const ph = evaluatePhenotype(f.sex, f.genotype, {
                    posHets: f.posHets,
                    dnaTested: f.dnaTested,
                  });
                  return (
                    <option key={f.id} value={f.id}>
                      {f.name} — {ph.nameEn}
                    </option>
                  );
                })}
              </select>

              {dam && (
                <div className="pixel-inset p-3 space-y-2">
                  <div className="flex justify-center">
                    <PixelSnakeSprite
                      sex={dam.sex}
                      genotype={dam.genotype}
                      seed={dam.seed}
                      width={196}
                      height={110}
                      isInBlue={dam.isInBlue}
                    />
                  </div>
                  <div className="text-sm font-bold text-[#F4F0E2]">
                    {evaluatePhenotype(dam.sex, dam.genotype, {
                      posHets: dam.posHets,
                      dnaTested: dam.dnaTested,
                    }).nameEn}
                  </div>
                  <div className="text-xs text-[#EAB308]">
                    {evaluatePhenotype(dam.sex, dam.genotype, {
                      posHets: dam.posHets,
                      dnaTested: dam.dnaTested,
                    }).nameTh}
                  </div>
                  {damBanana !== 'none' && (
                    <div className="text-xs text-[#C084FC] font-semibold">
                      โครโมโซมเพศ: {bananaStatusLabelTh(damBanana)}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Punnett Square Outcomes Preview */}
      {sire && dam && (
        <div className="pixel-panel p-4 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-bold text-[#F4F0E2] flex items-center gap-2">
              <Dna className="w-4 h-4 text-[#EAB308]" />
              ผลลัพธ์ทางพันธุกรรมที่เป็นไปได้ ({outcomes.length} รูปแบบ)
            </h3>
            <span className="text-xs text-[#9BA89E]">
              เรียงตามความน่าจะเป็น (%) จากตาราง Punnett Square
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto pr-1">
            {outcomes.slice(0, 24).map((o, idx) => (
              <div key={idx} className="pixel-inset p-3 flex items-center gap-3">
                <div className="shrink-0 bg-[#1B241F] border border-[#334339] p-1">
                  <PixelSnakeSprite
                    sex={o.sampleSex}
                    genotype={o.sampleGenotype}
                    seed={idx + 7}
                    width={84}
                    height={48}
                    animate={false}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono-num text-xs font-bold text-[#4ADE80]">
                      {(o.probability * 100).toFixed(1)}%
                    </span>
                    <span className="text-[11px] font-mono-num text-[#9BA89E]">
                      {o.sex === 'M' ? '♂ ผู้' : o.sex === 'F' ? '♀ เมีย' : '♂/♀'}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-[#F4F0E2] truncate" title={o.nameEn}>
                    {o.nameEn}
                  </div>
                  <div className="text-[11px] text-[#EAB308] truncate" title={o.nameTh}>
                    {o.nameTh}
                  </div>
                  <div className="flex items-center justify-between text-[11px] mt-0.5">
                    <span className={getRarityColorClass(o.rarity)}>
                      {getRarityLabelTh(o.rarity)}
                    </span>
                    <span className="font-mono-num text-[#9BA89E]">
                      ~฿{o.estimatedPrice.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Incubator Clutches */}
      <div className="pixel-panel p-4 space-y-3">
        <h3 className="text-base font-bold text-[#F4F0E2] flex items-center gap-2">
          <Egg className="w-4 h-4 text-[#EAB308]" />
          ตู้ฟักไข่ปัจจุบัน ({activeClutches.length} ครอก)
        </h3>

        {activeClutches.length === 0 ? (
          <div className="pixel-inset p-5 text-center text-xs text-[#9BA89E]">
            ยังไม่มีไข่ในตู้ฟัก จับคู่พ่อแม่พันธุ์ด้านบนเพื่อเริ่มฟักไข่ชุดแรก
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeClutches.map((clutch) => {
              const daysLeft = Math.max(0, clutch.hatchDay - state.day);
              const isReady = daysLeft === 0;
              const emptySlots = Math.max(0, state.terrariums.length - state.snakes.length);
              const survivedCount = clutch.eggs.filter((e) => e.survived).length;

              return (
                <div key={clutch.id} className="pixel-card p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-bold text-sm text-[#F4F0E2]">
                        {clutch.sireName} × {clutch.damName}
                      </div>
                      <div className="text-xs text-[#9BA89E] mt-0.5">
                        ไข่ {clutch.eggs.length} ใบ
                        <span className="mx-1.5" aria-hidden="true">·</span>
                        อัตรารอดตอนฟัก {clutch.survivalRateSnapshot}%
                      </div>
                    </div>
                    <span
                      className={`font-mono-num text-xs font-bold ${
                        isReady ? 'text-[#4ADE80]' : 'text-[#EAB308]'
                      }`}
                    >
                      {isReady ? 'พร้อมฟักแล้ว!' : `อีก ${daysLeft} วัน`}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 py-1">
                    {clutch.eggs.map((egg) => (
                      <div
                        key={egg.id}
                        className={`w-7 h-9 border-2 flex items-center justify-center font-mono-num text-[10px] ${
                          isReady
                            ? 'bg-[#F4F0E2] border-[#EAB308] text-[#111714] animate-bounce'
                            : 'bg-[#E5DEC9] border-[#394A40] text-[#394A40]'
                        }`}
                      >
                        {isReady ? '!' : 'o'}
                      </div>
                    ))}
                  </div>

                  {isReady ? (
                    <div className="space-y-1.5">
                      {emptySlots < survivedCount && (
                        <div className="text-xs text-[#FB7185]">
                          ต้องการตู้เลี้ยงว่างอย่างน้อย {survivedCount} ตู้ (ตอนนี้ว่าง {emptySlots} ตู้ — ไปเพิ่มตู้ในหน้าฟาร์มก่อน)
                        </div>
                      )}
                      <button
                        onClick={() => onHatchClutch(clutch.id)}
                        disabled={emptySlots < survivedCount}
                        className="pixel-btn w-full py-2.5 bg-[#22C55E] text-[#0B120D] font-bold text-xs whitespace-nowrap"
                      >
                        เปิดกล่องฟักไข่ ({clutch.eggs.length} ใบ)
                      </button>
                    </div>
                  ) : (
                    <div className="text-xs text-[#9BA89E]">
                      กดปุ่ม "วันถัดไป" ที่มุมขวาบนเพื่อเร่งเวลาฟักไข่
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent Hatch History */}
      {completedClutches.length > 0 && (
        <div className="pixel-panel p-4 space-y-3">
          <h3 className="text-sm font-bold text-[#9BA89E]">ประวัติการฟักไข่ล่าสุด</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {completedClutches.map((c: BreedingClutch) => {
              const survived = c.eggs.filter((e) => e.survived);
              return (
                <div key={c.id} className="pixel-inset p-3 text-xs space-y-1">
                  <div className="flex justify-between font-semibold text-[#F4F0E2]">
                    <span>{c.sireName} × {c.damName}</span>
                    <span className="font-mono-num text-[#4ADE80]">
                      รอด {survived.length}/{c.eggs.length} ตัว
                    </span>
                  </div>
                  <div className="text-[#9BA89E] truncate">
                    {survived
                      .map((e) =>
                        evaluatePhenotype(e.sex, e.genotype, {
                          posHets: e.posHets,
                          dnaTested: false,
                        }).nameEn
                      )
                      .join(', ') || 'ไม่มีลูกงูรอดในครอกนี้ — อัปเกรดตู้ฟักเพื่อเพิ่มโอกาสรอด'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
