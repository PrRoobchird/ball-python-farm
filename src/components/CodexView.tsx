import React, { useState } from 'react';
import {
  ALL_GENES,
  COMPLEX_LABEL_TH,
  INHERITANCE_LABEL_TH,
} from '../game/genes';
import { getRarityColorClass, getRarityLabelTh } from '../game/genetics';
import { GameState, GeneInheritance } from '../game/types';
import { PixelSnakeSprite } from './PixelSnakeSprite';
import { BookOpen, Dna } from 'lucide-react';

interface CodexViewProps {
  state: GameState;
}

export const CodexView: React.FC<CodexViewProps> = ({ state }) => {
  const [tab, setTab] = useState<'discovered' | 'genetics'>('discovered');
  const [geneFilter, setGeneFilter] = useState<'all' | GeneInheritance>('all');

  const discoveredList = Object.values(state.discoveredMorphs).sort(
    (a, b) => b.firstDiscoveredDay - a.firstDiscoveredDay
  );

  const filteredGenes = ALL_GENES.filter((g) =>
    geneFilter === 'all' ? true : g.inheritance === geneFilter
  );

  return (
    <div className="space-y-6">
      {/* Header & Mode Switch */}
      <div className="pixel-panel p-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-[#F4F0E2] flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#EAB308]" />
            สารานุกรมมอร์ฟและพันธุศาสตร์งูบอลไพธอน
          </h2>
          <p className="text-sm text-[#9BA89E]">
            ค้นพบมอร์ฟแล้ว <strong className="font-mono-num text-[#4ADE80]">{discoveredList.length}</strong> รูปแบบ จากชุดยีนที่ผสมผสานได้นับพันแบบ
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setTab('discovered')}
            className={`pixel-btn px-4 py-2 text-xs font-bold whitespace-nowrap ${
              tab === 'discovered'
                ? 'bg-[#EAB308] text-[#111714]'
                : 'bg-[#212C26] text-[#F4F0E2]'
            }`}
          >
            มอร์ฟที่ค้นพบ ({discoveredList.length})
          </button>
          <button
            onClick={() => setTab('genetics')}
            className={`pixel-btn px-4 py-2 text-xs font-bold whitespace-nowrap ${
              tab === 'genetics'
                ? 'bg-[#EAB308] text-[#111714]'
                : 'bg-[#212C26] text-[#F4F0E2]'
            }`}
          >
            คู่มือยีนทั้งหมด ({ALL_GENES.length} ยีน)
          </button>
        </div>
      </div>

      {tab === 'discovered' ? (
        discoveredList.length === 0 ? (
          <div className="pixel-panel p-8 text-center text-sm text-[#9BA89E]">
            ยังไม่มีมอร์ฟที่บันทึกในสารานุกรม ซื้องูตัวแรกหรือฟักลูกงูเพื่อเริ่มสะสมคอลเลกชัน!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {discoveredList.map((entry) => (
              <div key={entry.key} className="pixel-card p-4 space-y-2.5">
                <div className="pixel-inset p-2 flex justify-center">
                  <PixelSnakeSprite
                    sex={entry.sampleSex}
                    genotype={entry.sampleGenotype}
                    seed={entry.firstDiscoveredDay * 13 + entry.countProduced}
                    width={180}
                    height={102}
                    animate={false}
                  />
                </div>
                <div className="flex items-start justify-between gap-2">
                  <div className="font-bold text-sm text-[#F4F0E2]">{entry.nameEn}</div>
                  <span className={`text-xs font-semibold shrink-0 ${getRarityColorClass(entry.rarity)}`}>
                    {getRarityLabelTh(entry.rarity)}
                  </span>
                </div>
                <div className="text-xs text-[#EAB308]">{entry.nameTh}</div>
                <div className="text-xs text-[#9BA89E] flex items-center justify-between pt-1 border-t border-[#2F3F36]">
                  <span>{COMPLEX_LABEL_TH[entry.complex]}</span>
                  <span className="font-mono-num">
                    วันที่ {entry.firstDiscoveredDay} · {entry.countProduced} ตัว
                  </span>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="space-y-6">
          {/* 4 Inheritance Laws Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="pixel-card p-4 space-y-1.5">
              <div className="text-sm font-bold text-[#4ADE80]">1. ยีนเด่น (Dominant)</div>
              <p className="text-xs text-[#D1D5DB] leading-relaxed">
                แสดงลักษณะออกมาได้ทันทีแม้ได้รับยีนมาเพียงชุดเดียวจากพ่อหรือแม่ (50% หากพ่อหรือแม่มียีน 1 ชุด) เช่น Pinstripe, Spider, Woma, Calico
              </p>
            </div>
            <div className="pixel-card p-4 space-y-1.5">
              <div className="text-sm font-bold text-[#38BDF8]">2. ยีนด้อย (Recessive)</div>
              <p className="text-xs text-[#D1D5DB] leading-relaxed">
                ต้องได้รับยีนด้อยครบทั้ง 2 ชุด (จากทั้งพ่อและแม่) จึงจะแสดงสี/ลวดลายออกมา หากมีเพียง 1 ชุดจะเป็นเพียงตัวพาหะ (Het) เช่น Albino, Piebald, Clown, Axanthic
              </p>
            </div>
            <div className="pixel-card p-4 space-y-1.5">
              <div className="text-sm font-bold text-[#F59E0B]">3. ยีนเด่นร่วม (Co-dominant / Incomplete Dominant)</div>
              <p className="text-xs text-[#D1D5DB] leading-relaxed">
                มียีน 1 ชุดแสดงลักษณะแบบหนึ่ง และเมื่อเข้าคู่กัน 2 ชุดจะกลายเป็น <strong className="text-[#F4F0E2]">Super Form</strong> ที่โดดเด่นขึ้นไปอีกขั้น เช่น Black Pastel → Super Black Pastel (ดำสนิท), Black Head, Headless Axanthic, Mojave → Blue-Eyed Leucistic
              </p>
            </div>
            <div className="pixel-card p-4 space-y-1.5">
              <div className="text-sm font-bold text-[#C084FC]">4. ยีนโครโมโซมเพศ (Sex-Linked: Banana X / Y)</div>
              <p className="text-xs text-[#D1D5DB] leading-relaxed">
                ยีน Banana เกาะบนโครโมโซมเพศ: พ่อ <strong className="text-[#F4F0E2]">Banana X (Female Maker)</strong> จะถ่ายทอด Banana ให้ลูกสาวเกือบทั้งหมด ส่วนพ่อ <strong className="text-[#F4F0E2]">Banana Y (Male Maker)</strong> จะถ่ายทอดให้ลูกชายเกือบทั้งหมด!
              </p>
            </div>
          </div>

          {/* Filter by Inheritance */}
          <div className="flex flex-wrap items-center gap-2">
            {(
              [
                ['all', 'ยีนทั้งหมด'],
                ['dominant', 'ยีนเด่น'],
                ['recessive', 'ยีนด้อย'],
                ['codominant', 'ยีนเด่นร่วม (Super)'],
                ['sex_linked', 'โครโมโซมเพศ (X/Y)'],
              ] as Array<['all' | GeneInheritance, string]>
            ).map(([k, label]) => (
              <button
                key={k}
                onClick={() => setGeneFilter(k)}
                className={`px-3 py-1.5 text-xs font-semibold border whitespace-nowrap ${
                  geneFilter === k
                    ? 'bg-[#EAB308] border-[#090D0B] text-[#111714]'
                    : 'bg-[#161E1A] border-[#334339] text-[#D1D5DB]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* All Genes Table/Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredGenes.map((g) => (
              <div key={g.id} className="pixel-card p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-bold text-sm text-[#F4F0E2] flex items-center gap-1.5">
                      <Dna className="w-3.5 h-3.5 text-[#EAB308]" />
                      {g.nameEn}
                    </div>
                    <div className="text-xs text-[#EAB308]">{g.nameTh}</div>
                  </div>
                  <span className="font-mono-num text-[11px] text-[#9BA89E]">{g.shortCode}</span>
                </div>

                <div className="text-[11px] text-[#4ADE80]">
                  {INHERITANCE_LABEL_TH[g.inheritance]} · {COMPLEX_LABEL_TH[g.complex]}
                </div>

                {g.superNameEn && (
                  <div className="text-xs text-[#F59E0B] font-semibold">
                    Super Form: {g.superNameEn}
                  </div>
                )}

                <p className="text-xs text-[#9BA89E] leading-relaxed">{g.descriptionTh}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
