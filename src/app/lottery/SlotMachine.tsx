"use client";

import { useState, type TransitionEvent } from "react";

type Hero = { name: string; title: string; mark: string; color: string };

const HEROES: Hero[] = [
  { name: "令狐沖", title: "獨孤九劍", mark: "沖", color: "#2563eb" },
  { name: "任盈盈", title: "日月聖姑", mark: "盈", color: "#db2777" },
  { name: "岳靈珊", title: "華山小師妹", mark: "珊", color: "#f472b6" },
  { name: "林平之", title: "辟邪劍法", mark: "平", color: "#0d9488" },
  { name: "岳不群", title: "君子劍", mark: "岳", color: "#4b5563" },
  { name: "東方不敗", title: "葵花寶典", mark: "東", color: "#dc2626" },
  { name: "任我行", title: "吸星大法", mark: "任", color: "#7c3aed" },
  { name: "向問天", title: "天王老子", mark: "向", color: "#ea580c" },
  { name: "風清揚", title: "劍宗前輩", mark: "風", color: "#0891b2" },
  { name: "儀琳", title: "恆山小尼", mark: "琳", color: "#a3a3a3" },
  { name: "田伯光", title: "萬里獨行", mark: "田", color: "#65a30d" },
  { name: "左冷禪", title: "嵩山掌門", mark: "左", color: "#1e3a8a" },
];

const COUNT = HEROES.length;
const LOOPS = 9;
const STRIP = Array.from({ length: COUNT * LOOPS }, (_, i) => HEROES[i % COUNT]);
const REEL_COUNT = 3;
const BASE_SPIN_MS = 2200;
const REEL_DELAY_MS = 700;

type Reel = { pos: number; duration: number };

function Avatar({ hero, size }: { hero: Hero; size: number }) {
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full border-[3px] border-stone-900 font-black text-white"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.48,
        backgroundColor: hero.color,
        WebkitTextStroke: "4px #111",
        paintOrder: "stroke fill",
        boxShadow: "inset 0 -5px 0 rgba(0,0,0,0.25)",
      }}
    >
      {hero.mark}
    </div>
  );
}

function Bulbs({ count, spinning }: { count: number; spinning: boolean }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          className={`size-3 rounded-full border-2 border-stone-900 ${i % 2 ? "bg-white" : "bg-yellow-200"}`}
          style={
            spinning
              ? { animation: `bulb-blink 0.4s steps(1) ${i % 2 ? "0.2s" : "0s"} infinite` }
              : undefined
          }
        />
      ))}
    </>
  );
}

export default function SlotMachine() {
  const [reels, setReels] = useState<Reel[]>(() =>
    Array.from({ length: REEL_COUNT }, (_, i) => ({ pos: i, duration: 0 })),
  );
  const [spinning, setSpinning] = useState(false);
  const [pending, setPending] = useState<number | null>(null);
  const [winner, setWinner] = useState<number | null>(null);
  const [counts, setCounts] = useState<number[]>(() => HEROES.map(() => 0));

  function spin() {
    if (spinning) return;
    const index = Math.floor(Math.random() * COUNT);
    setPending(index);
    setWinner(null);
    setSpinning(true);
    // Snap each reel back to the first loop without animating, then spin
    // forward several loops so every reel lands on the winner.
    setReels((prev) => prev.map((r) => ({ pos: r.pos % COUNT, duration: 0 })));
    requestAnimationFrame(() =>
      requestAnimationFrame(() =>
        setReels(
          Array.from({ length: REEL_COUNT }, (_, i) => ({
            pos: (LOOPS - REEL_COUNT + i) * COUNT + index,
            duration: BASE_SPIN_MS + i * REEL_DELAY_MS,
          })),
        ),
      ),
    );
  }

  function handleLastReelEnd(e: TransitionEvent<HTMLDivElement>) {
    if (e.target !== e.currentTarget || pending === null) return;
    setWinner(pending);
    setCounts((prev) => prev.map((c, i) => (i === pending ? c + 1 : c)));
    setPending(null);
    setSpinning(false);
  }

  const total = counts.reduce((a, b) => a + b, 0);

  return (
    <div className="relative mt-14 flex w-full max-w-xl flex-col items-center">
      {/* Machine */}
      <div className="relative w-full">
        {/* Start lever */}
        <div className="absolute -right-2 -top-12 z-20 flex flex-col items-center sm:-right-6">
          <button
            type="button"
            onClick={spin}
            disabled={spinning}
            className="flex size-20 items-center justify-center rounded-full border-4 border-stone-900 bg-red-500 text-2xl font-black text-white shadow-[0_6px_0_#111] transition hover:bg-red-400 active:translate-y-1 active:shadow-[0_2px_0_#111] disabled:cursor-not-allowed disabled:bg-red-300 sm:size-24 sm:text-3xl"
            style={{ WebkitTextStroke: "4px #111", paintOrder: "stroke fill" }}
          >
            {spinning ? "…" : "開始"}
          </button>
          <span className="h-10 w-3 rounded-b border-x-4 border-b-4 border-stone-900 bg-stone-300" />
        </div>

        <div className="relative rounded-[32px] border-4 border-stone-900 bg-sky-500 p-7 shadow-[0_8px_0_#111]">
          <div className="pointer-events-none absolute inset-x-8 top-2 flex justify-between">
            <Bulbs count={12} spinning={spinning} />
          </div>
          <div className="pointer-events-none absolute inset-x-8 bottom-2 flex justify-between">
            <Bulbs count={12} spinning={spinning} />
          </div>
          <div className="pointer-events-none absolute inset-y-8 left-2 flex flex-col justify-between">
            <Bulbs count={5} spinning={spinning} />
          </div>
          <div className="pointer-events-none absolute inset-y-8 right-2 flex flex-col justify-between">
            <Bulbs count={5} spinning={spinning} />
          </div>

          {/* Reels */}
          <div className="grid grid-cols-3 gap-2 rounded-2xl border-4 border-stone-900 bg-stone-800 p-2 sm:gap-3 sm:p-3">
            {reels.map((reel, r) => (
              <div
                key={r}
                className="relative h-32 overflow-hidden rounded-xl border-4 border-stone-900 bg-white sm:h-40"
              >
                <div
                  className="absolute inset-x-0 top-0"
                  style={{
                    height: `${STRIP.length * 100}%`,
                    transform: `translateY(-${(reel.pos * 100) / STRIP.length}%)`,
                    transition: reel.duration
                      ? `transform ${reel.duration}ms cubic-bezier(0.15, 0.6, 0.2, 1)`
                      : "none",
                  }}
                  onTransitionEnd={r === REEL_COUNT - 1 ? handleLastReelEnd : undefined}
                >
                  {STRIP.map((hero, i) => (
                    <div
                      key={i}
                      className="flex flex-col items-center justify-center gap-1 sm:gap-2"
                      style={{ height: `${100 / STRIP.length}%` }}
                    >
                      <Avatar hero={hero} size={56} />
                      <span className="text-sm font-black sm:text-base">{hero.name}</span>
                    </div>
                  ))}
                </div>
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/25" />
              </div>
            ))}
          </div>

          <p className="mt-3 rounded-full border-[3px] border-stone-900 bg-red-500 px-3 py-1 text-center text-sm font-bold text-white sm:text-base">
            點擊「開始」按鈕，抽出江湖天選之人！
          </p>
        </div>

        {/* Feet */}
        <div className="flex justify-between px-12">
          <span className="h-5 w-14 rounded-b-xl border-x-4 border-b-4 border-stone-900 bg-sky-700" />
          <span className="h-5 w-14 rounded-b-xl border-x-4 border-b-4 border-stone-900 bg-sky-700" />
        </div>
      </div>

      {/* Result */}
      <div className="mt-6 flex min-h-24 items-center justify-center" aria-live="polite">
        {winner !== null ? (
          <div className="flex items-center gap-4 rounded-3xl border-4 border-stone-900 bg-white px-6 py-3 shadow-[0_6px_0_#111]">
            <Avatar hero={HEROES[winner]} size={64} />
            <div>
              <p className="text-sm font-bold text-stone-600">恭喜中獎</p>
              <p
                className="text-3xl font-black text-red-500"
                style={{ WebkitTextStroke: "5px #111", paintOrder: "stroke fill" }}
              >
                {HEROES[winner].name}
              </p>
            </div>
          </div>
        ) : (
          <p className="font-bold text-stone-700">
            {spinning ? "轉軸轉動中……" : "準備好了就按「開始」！"}
          </p>
        )}
      </div>

      {/* Roster */}
      <section className="mt-8 w-full">
        <h2
          className="mb-2 text-center text-3xl font-black text-white"
          style={{ WebkitTextStroke: "6px #111", paintOrder: "stroke fill" }}
        >
          江湖群俠榜
        </h2>
        <p className="mb-4 text-center text-sm font-bold">已抽 {total} 次</p>
        <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {HEROES.map((hero, i) => (
            <li
              key={hero.name}
              className={`relative flex flex-col items-center gap-1 rounded-2xl border-4 border-stone-900 px-1 pb-2 pt-3 shadow-[0_4px_0_#111] transition ${
                winner === i ? "scale-105 bg-amber-100 ring-4 ring-red-500" : "bg-white"
              }`}
            >
              {counts[i] > 0 && (
                <span className="absolute -right-2 -top-2 rounded-full border-2 border-stone-900 bg-red-500 px-2 text-xs font-black text-white">
                  ×{counts[i]}
                </span>
              )}
              <Avatar hero={hero} size={48} />
              <span className="rounded-full border-2 border-stone-900 bg-red-500 px-2 text-sm font-black text-white">
                {hero.name}
              </span>
              <span className="text-xs font-bold text-stone-600">{hero.title}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
