import React, { useMemo, useState } from 'react';
import { SHOPS, doesMorphMatchTrend, getTerrariumAppealBonus } from '../game/economy';
import {
  evaluatePhenotype,
  getGeneListForDisplay,
  getRarityColorClass,
  getRarityLabelTh,
} from '../game/genetics';
import { COMPLEX_LABEL_TH } from '../game/genes';
import { GameState, ShopId, ShopListing } from '../game/types';
import { PixelSnakeSprite } from './PixelSnakeSprite';
import { Award, RefreshCw, ShoppingBag, TrendingUp, Trophy } from 'lucide-react';

interface MarketViewProps {
  state: GameState;
  onBuyListing: (listing: ShopListing) => void;
  onRefreshShops: () => void;
  onEnterExpo: (snakeId: string) => void;
}

type FilterMode =
  | 'all'
  | 'affordable'
  | 'male'
  | 'female'
  | 'dominant'
  | 'recessive'
  | 'codominant'
  | 'banana';

export const MarketView: React.FC<MarketViewProps> = ({
  state,
  onBuyListing,
  onRefreshShops,
  onEnterExpo,
}) => {
  const [subMode, setSubMode] = useState<'shop' | 'expo'>('shop');
  const [activeShopId, setActiveShopId] = useState<ShopId>('starter_classic');
  const [filterMode, setFilterMode] = useState<FilterMode>('all');
  const [sortBy, setSortBy] = useState<'price_asc' | 'price_desc'>('price_asc');
  const [selectedExpoSnakeId, setSelectedExpoSnakeId] = useState<string>(
    state.snakes[0]?.id || ''
  );

  const emptyTerrariums = Math.max(0, state.terrariums.length - state.snakes.length);
  const activeShop = SHOPS.find((s) => s.id === activeShopId) || SHOPS[0];

  const filteredListings = useMemo(() => {
    return state.shopListings
      .filter((item) => item.shopId === activeShopId)
      .filter((item) => {
        if (filterMode === 'affordable') return item.price <= state.money;
        if (filterMode === 'male') return item.sex === 'M';
        if (filterMode === 'female') return item.sex === 'F';
        const genes = getGeneListForDisplay(item.sex, item.genotype);
        if (filterMode === 'dominant') return genes.some((g) => g.inheritance === 'dominant');
        if (filterMode === 'recessive') return genes.some((g) => g.inheritance === 'recessive');
        if (filterMode === 'codominant') return genes.some((g) => g.inheritance === 'codominant');
        if (filterMode === 'banana') return genes.some((g) => g.isSexLinked);
        return true;
      })
      .sort((a, b) => (sortBy === 'price_asc' ? a.price - b.price : b.price - a.price));
  }, [state.shopListings, activeShopId, filterMode, sortBy, state.money]);

  const listedForSaleSnakes = state.snakes.filter((s) => s.isForSale);
  const alreadyEnteredExpoToday = state.lastExpoDayEntered === state.day;
  const expoSnake =
    state.snakes.find((s) => s.id === selectedExpoSnakeId) || state.snakes[0] || null;

  return (
    <div className="space-y-6">
      {/* Sub-navigation Switch: Shop vs Reptile Expo */}
      <div className="pixel-panel p-3 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSubMode('shop')}
            className={`pixel-btn px-4 py-2 text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap ${
              subMode === 'shop'
                ? 'bg-[#EAB308] text-[#111714]'
                : 'bg-[#212C26] text-[#F4F0E2]'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            ตลาดซื้อขายงู (4 ร้าน)
          </button>
          <button
            onClick={() => setSubMode('expo')}
            className={`pixel-btn px-4 py-2 text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap ${
              subMode === 'expo'
                ? 'bg-[#EAB308] text-[#111714]'
                : 'bg-[#212C26] text-[#F4F0E2]'
            }`}
          >
            <Trophy className="w-4 h-4" />
            งานประกวด Reptile Expo
          </button>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono-num text-[#9BA89E]">
          <span>
            ชื่อเสียงฟาร์ม: <strong className="text-[#EAB308]">{state.reputation}</strong>
          </span>
          <span>
            ถ้วยรางวัล: <strong className="text-[#4ADE80]">{state.trophies}</strong>
          </span>
        </div>
      </div>

      {subMode === 'expo' ? (
        <div className="space-y-6">
          {/* Expo Theme Banner */}
          <div className="pixel-panel p-5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-3 bg-[#2B3320] border-2 border-[#EAB308] text-[#EAB308] shrink-0">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-semibold text-[#EAB308]">
                  เวทีประกวดรอบนี้ · รางวัลที่ 1: ฿{state.currentExpo.firstPrize.toLocaleString()} + ชื่อเสียง +{state.currentExpo.repReward}
                </div>
                <h2 className="text-lg font-bold text-[#F4F0E2] mt-0.5">
                  {state.currentExpo.titleTh}
                </h2>
                <p className="text-xs text-[#9BA89E] mt-1">{state.currentExpo.descriptionTh}</p>
              </div>
            </div>

            <div className="text-xs text-[#9BA89E] space-y-1">
              <div>
                ค่าสมัคร: <strong className="font-mono-num text-[#F4F0E2]">฿{state.currentExpo.entryFee}</strong>
              </div>
              <div>
                โบนัสชื่อเสียง: ราคาขายตลาดเพิ่มขึ้น{' '}
                <strong className="font-mono-num text-[#4ADE80]">
                  +{Math.min(40, Math.round(state.reputation * 0.2))}%
                </strong>
              </div>
            </div>
          </div>

          {state.snakes.length === 0 ? (
            <div className="pixel-panel p-8 text-center text-sm text-[#9BA89E]">
              คุณยังไม่มีงูในฟาร์ม ไปเลือกซื้องูจากแท็บ "ตลาดซื้อขายงู" เพื่อส่งเข้าประกวด!
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Select Snake to Enter */}
              <div className="lg:col-span-6 pixel-panel p-5 space-y-4">
                <h3 className="text-base font-bold text-[#F4F0E2]">
                  เลือกงูในฟาร์มส่งเข้าประกวด
                </h3>

                <select
                  value={expoSnake?.id || ''}
                  onChange={(e) => setSelectedExpoSnakeId(e.target.value)}
                  className="pixel-inset w-full px-3 py-2 text-sm text-[#F4F0E2] focus:outline-none focus:border-[#EAB308]"
                >
                  {state.snakes.map((s) => {
                    const ph = evaluatePhenotype(s.sex, s.genotype, {
                      posHets: s.posHets,
                      dnaTested: s.dnaTested,
                    });
                    return (
                      <option key={s.id} value={s.id}>
                        {s.name} — {ph.nameEn}
                      </option>
                    );
                  })}
                </select>

                {expoSnake && (
                  <div className="pixel-inset p-4 space-y-3">
                    <div className="flex justify-center">
                      <PixelSnakeSprite
                        sex={expoSnake.sex}
                        genotype={expoSnake.genotype}
                        seed={expoSnake.seed}
                        width={224}
                        height={128}
                        isInBlue={expoSnake.isInBlue}
                      />
                    </div>

                    <div className="text-sm font-bold text-[#F4F0E2]">
                      {evaluatePhenotype(expoSnake.sex, expoSnake.genotype, {
                        posHets: expoSnake.posHets,
                        dnaTested: expoSnake.dnaTested,
                      }).nameEn}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-[#9BA89E]">
                      <div>
                        ความอิ่ม: <strong className="text-[#F4F0E2]">{expoSnake.hunger}%</strong>
                      </div>
                      <div>
                        ความสวยตู้:{' '}
                        <strong className="text-[#EAB308]">
                          +{getTerrariumAppealBonus(
                            (state.terrariums.find((t) => t.id === expoSnake.terrariumId) || state.terrariums[0]).decor
                          )}
                        </strong>
                      </div>
                      <div className="col-span-2">
                        สภาพผิว:{' '}
                        {expoSnake.isInBlue ? (
                          <span className="text-[#93C5FD]">กำลังตาขุ่น (คะแนนสีอาจลดลงชั่วคราว)</span>
                        ) : state.day <= expoSnake.freshShedUntilDay ? (
                          <span className="text-[#4ADE80]">เพิ่งลอกคราบเสร็จใหม่ (ได้โบนัสประกวด!)</span>
                        ) : (
                          <span>ปกติ</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => expoSnake && onEnterExpo(expoSnake.id)}
                  disabled={
                    !expoSnake ||
                    alreadyEnteredExpoToday ||
                    state.money < state.currentExpo.entryFee
                  }
                  className="pixel-btn w-full py-3 bg-[#EAB308] text-[#111714] font-bold text-sm flex items-center justify-center gap-2"
                >
                  <Award className="w-4 h-4" />
                  {alreadyEnteredExpoToday
                    ? 'ส่งประกวดรอบวันนี้ไปแล้ว (รอวันถัดไป)'
                    : `ส่งเข้าประกวด (ค่าสมัคร ฿${state.currentExpo.entryFee})`}
                </button>
              </div>

              {/* Recent Expo Results */}
              <div className="lg:col-span-6 pixel-panel p-5 space-y-4">
                <h3 className="text-base font-bold text-[#F4F0E2]">ผลการประกวดล่าสุด</h3>

                {state.expoHistory.length === 0 ? (
                  <div className="pixel-inset p-6 text-center text-xs text-[#9BA89E]">
                    ยังไม่เคยเข้าร่วมประกวด ส่งงูมอร์ฟเด่นหรือที่เพิ่งลอกคราบเสร็จใหม่เข้าประชันเพื่อสะสมชื่อเสียงฟาร์ม!
                  </div>
                ) : (
                  <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                    {state.expoHistory.map((res, idx) => (
                      <div key={idx} className="pixel-inset p-3 flex items-center justify-between gap-3 text-xs">
                        <div className="min-w-0">
                          <div className="font-bold text-[#F4F0E2] truncate">
                            {res.rank === 1
                              ? 'อันดับ 1 (ชนะเลิศ)'
                              : res.rank === 2
                                ? 'อันดับ 2 (รองชนะเลิศ)'
                                : res.rank === 3
                                  ? 'อันดับ 3'
                                  : 'เข้าร่วม'}
                            <span className="mx-1.5 text-[#9BA89E]">·</span>
                            <span className="text-[#EAB308]">{res.snakeName}</span>
                          </div>
                          <div className="text-[#9BA89E] truncate mt-0.5">
                            {res.themeTitleTh} · คะแนน {res.score}
                          </div>
                        </div>
                        <div className="text-right font-mono-num shrink-0">
                          {res.prizeMoney > 0 && (
                            <div className="text-[#4ADE80] font-bold">
                              +฿{res.prizeMoney.toLocaleString()}
                            </div>
                          )}
                          <div className="text-[#38BDF8]">+{res.repGained} Rep</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Dynamic Market Demand Banner */}
          <div className="pixel-panel p-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-[#2E3A26] border-2 border-[#EAB308] text-[#EAB308] shrink-0">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-semibold text-[#EAB308]">
                  ความต้องการตลาดรอบนี้ · มูลค่าเพิ่ม {Math.round((state.marketTrend.multiplier - 1) * 100)}%
                </div>
                <h2 className="text-base font-bold text-[#F4F0E2]">{state.marketTrend.titleTh}</h2>
                <p className="text-xs text-[#9BA89E]">{state.marketTrend.descriptionTh}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right text-xs text-[#9BA89E]">
                <div>
                  ตู้ว่างพร้อมรับงู:{' '}
                  <span
                    className={`font-mono-num font-bold ${
                      emptyTerrariums > 0 ? 'text-[#4ADE80]' : 'text-[#FB7185]'
                    }`}
                  >
                    {emptyTerrariums} ตู้
                  </span>
                </div>
                <div>กำลังลงขาย: {listedForSaleSnakes.length} ตัว</div>
              </div>
              <button
                onClick={onRefreshShops}
                disabled={state.money < 300}
                className="pixel-btn px-3.5 py-2 bg-[#2B3B32] text-[#F4F0E2] text-xs font-bold flex items-center gap-2 whitespace-nowrap shrink-0"
              >
                <RefreshCw className="w-3.5 h-3.5 text-[#EAB308]" />
                รีเฟรชร้านค้า (฿300)
              </button>
            </div>
          </div>

          {/* 4 Shop Selector Tabs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {SHOPS.map((shop) => {
              const count = state.shopListings.filter((l) => l.shopId === shop.id).length;
              const isActive = shop.id === activeShopId;
              return (
                <button
                  key={shop.id}
                  onClick={() => setActiveShopId(shop.id)}
                  className={`text-left p-3.5 transition-transform cursor-pointer ${
                    isActive
                      ? 'pixel-card ring-2 ring-[#EAB308] bg-[#26352D]'
                      : 'pixel-card hover:border-[#5D7868]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-sm text-[#F4F0E2] truncate">{shop.nameTh}</span>
                    <span className="font-mono-num text-xs text-[#EAB308] shrink-0">{count} ตัว</span>
                  </div>
                  <p className="text-xs text-[#9BA89E] mt-1 line-clamp-2">{shop.subtitleTh}</p>
                  <div className="text-[11px] text-[#4ADE80] mt-2 truncate">{shop.specialtyTh}</div>
                </button>
              );
            })}
          </div>

          {/* Filter & Sort Bar */}
          <div className="pixel-panel p-3.5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5">
              {(
                [
                  ['all', 'ทั้งหมด'],
                  ['affordable', 'อยู่ในงบฉัน'],
                  ['male', 'เพศผู้ ♂'],
                  ['female', 'เพศเมีย ♀'],
                  ['dominant', 'ยีนเด่น'],
                  ['recessive', 'ยีนด้อย/Het'],
                  ['codominant', 'ยีนเด่นร่วม'],
                  ['banana', 'Banana X/Y'],
                ] as Array<[FilterMode, string]>
              ).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setFilterMode(key)}
                  className={`px-3 py-1.5 text-xs font-semibold border whitespace-nowrap shrink-0 transition-colors ${
                    filterMode === key
                      ? 'bg-[#EAB308] border-[#090D0B] text-[#111714]'
                      : 'bg-[#161E1A] border-[#334339] text-[#D1D5DB] hover:border-[#EAB308]'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-[#9BA89E]">เรียงราคา:</span>
              <button
                onClick={() => setSortBy(sortBy === 'price_asc' ? 'price_desc' : 'price_asc')}
                className="pixel-btn px-3 py-1.5 bg-[#232F28] text-[#F4F0E2] font-semibold whitespace-nowrap"
              >
                {sortBy === 'price_asc' ? 'ถูก → แพง' : 'แพง → ถูก'}
              </button>
            </div>
          </div>

          {/* Shop Listings Grid */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-base font-bold text-[#F4F0E2]">{activeShop.nameTh}</h3>
              <span className="text-xs text-[#9BA89E]">{activeShop.specialtyTh}</span>
            </div>

            {filteredListings.length === 0 ? (
              <div className="pixel-panel p-8 text-center text-sm text-[#9BA89E]">
                ไม่พบงูที่ตรงกับตัวกรองในร้านนี้ ลองเปลี่ยนตัวกรองหรือกดดูร้านค้าอื่นด้านบน
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredListings.map((listing) => {
                  const pheno = evaluatePhenotype(listing.sex, listing.genotype);
                  const genes = getGeneListForDisplay(listing.sex, listing.genotype);
                  const canAfford = state.money >= listing.price;
                  const hasSpace = emptyTerrariums > 0;
                  const isHot = doesMorphMatchTrend(listing.sex, listing.genotype, state.marketTrend);

                  return (
                    <div key={listing.id} className="pixel-card p-4 flex flex-col justify-between gap-3">
                      <div>
                        <div className="pixel-inset p-2 flex items-center justify-center relative">
                          <PixelSnakeSprite
                            sex={listing.sex}
                            genotype={listing.genotype}
                            seed={listing.seed}
                            width={200}
                            height={114}
                            animate={true}
                          />
                        </div>

                        <div className="mt-3 space-y-1">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-bold text-sm text-[#F4F0E2] leading-snug">
                              {pheno.nameEn}
                            </h4>
                            <span
                              className={`font-mono-num text-xs font-bold shrink-0 ${
                                listing.sex === 'M' ? 'text-[#38BDF8]' : 'text-[#FB7185]'
                              }`}
                            >
                              {listing.sex === 'M' ? '♂ ผู้' : '♀ เมีย'}
                            </span>
                          </div>

                          <div className="text-xs text-[#EAB308]">{pheno.nameTh}</div>

                          <div className="text-xs text-[#9BA89E]">
                            {listing.ageDays >= listing.matureDays
                              ? 'โตเต็มวัยพร้อมผสม'
                              : `ลูกงู (${listing.ageDays}/${listing.matureDays} วัน)`}
                            <span className="mx-1.5" aria-hidden="true">·</span>
                            <span className={getRarityColorClass(pheno.rarity)}>
                              {getRarityLabelTh(pheno.rarity)}
                            </span>
                            {isHot && (
                              <>
                                <span className="mx-1.5" aria-hidden="true">·</span>
                                <span className="text-[#4ADE80] font-semibold">ตรงกระแสตลาด</span>
                              </>
                            )}
                          </div>

                          <div className="text-[11px] text-[#9BA89E]">
                            {COMPLEX_LABEL_TH[pheno.complex]}
                          </div>
                        </div>

                        <div className="mt-3 pt-2.5 border-t border-[#2F3F36] space-y-1">
                          {genes.length === 0 ? (
                            <div className="text-xs text-[#9BA89E]">สายพันธุ์ดั้งเดิม (Normal)</div>
                          ) : (
                            genes.map((g, idx) => (
                              <div key={idx} className="flex items-center justify-between text-xs">
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
                            ))
                          )}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-[#2F3F36] flex items-center justify-between gap-2">
                        <div>
                          <div className="text-[11px] text-[#9BA89E]">ราคา</div>
                          <div
                            className={`font-mono-num text-base font-bold ${
                              canAfford ? 'text-[#4ADE80]' : 'text-[#FB7185]'
                            }`}
                          >
                            ฿{listing.price.toLocaleString()}
                          </div>
                        </div>

                        <button
                          onClick={() => onBuyListing(listing)}
                          disabled={!canAfford || !hasSpace}
                          className="pixel-btn px-4 py-2 bg-[#EAB308] text-[#111714] text-xs font-bold flex items-center gap-1.5 whitespace-nowrap shrink-0"
                        >
                          <ShoppingBag className="w-4 h-4" />
                          {!hasSpace ? 'ตู้เต็ม' : !canAfford ? 'งบไม่พอ' : 'ซื้อเข้าฟาร์ม'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
