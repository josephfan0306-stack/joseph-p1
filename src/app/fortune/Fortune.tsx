"use client";

import { useState } from "react";

type Tier = "good" | "mid" | "bad";

type Level = {
  name: string;
  weight: number;
  score: number;
  color: string;
  poem: [string, string];
  summary: string;
  advice: string;
};

const LEVELS: Level[] = [
  {
    name: "大吉",
    weight: 10,
    score: 5,
    color: "#dc2626",
    poem: ["春風得意馬蹄疾", "一日看盡長安花"],
    summary: "本週氣勢如虹，想做的事放手去做，貴人與好運都站在你這邊。",
    advice: "勇敢提出想法，機會不等人。",
  },
  {
    name: "中吉",
    weight: 18,
    score: 4,
    color: "#ea580c",
    poem: ["長風破浪會有時", "直掛雲帆濟滄海"],
    summary: "整體運勢穩中帶升，只要按部就班，週末前會看到成果。",
    advice: "把重要的事排在週初完成。",
  },
  {
    name: "小吉",
    weight: 20,
    score: 4,
    color: "#d97706",
    poem: ["小荷才露尖尖角", "早有蜻蜓立上頭"],
    summary: "小確幸不斷的一週，細心留意身邊的小機會，會有意外收穫。",
    advice: "多說一句謝謝，好運會跟著來。",
  },
  {
    name: "吉",
    weight: 20,
    score: 3,
    color: "#16a34a",
    poem: ["行到水窮處", "坐看雲起時"],
    summary: "平順安穩的一週，沒有大起大落，適合整理步調、累積實力。",
    advice: "維持節奏，不必急著求變。",
  },
  {
    name: "末吉",
    weight: 16,
    score: 3,
    color: "#0891b2",
    poem: ["山重水複疑無路", "柳暗花明又一村"],
    summary: "週初略有阻礙，但越到後面越順，耐心是本週的關鍵字。",
    advice: "遇到卡關先休息一下，答案會自己浮現。",
  },
  {
    name: "凶",
    weight: 11,
    score: 2,
    color: "#6d28d9",
    poem: ["欲渡黃河冰塞川", "將登太行雪滿山"],
    summary: "本週容易遇到小狀況，凡事多確認一次，就能把麻煩化小。",
    advice: "重要文件與約定，再檢查一遍。",
  },
  {
    name: "大凶",
    weight: 5,
    score: 1,
    color: "#1f2937",
    poem: ["屋漏偏逢連夜雨", "否極終將泰自來"],
    summary: "低潮期正是蓄力的時候，放慢腳步、照顧好自己，壞運很快就過去。",
    advice: "大凶之後必轉吉，把籤綁起來，把壞運留下！",
  },
];

const ASPECTS: { key: string; icon: string; texts: Record<Tier, string[]> }[] = [
  {
    key: "事業",
    icon: "💼",
    texts: {
      good: ["提案容易被採納，主動爭取會有好結果。", "主管看見你的努力，有機會接到重要任務。", "團隊合作順利，適合推動卡住已久的專案。"],
      mid: ["工作量平穩，專心處理手邊的事最有效率。", "例行事務多，善用清單就不會遺漏。", "適合學習新技能，為下一步做準備。"],
      bad: ["溝通容易產生誤會，重要事項請寫下來確認。", "進度可能延遲，提早預留緩衝時間。", "避免在情緒上頭時做決定。"],
    },
  },
  {
    key: "財",
    icon: "💰",
    texts: {
      good: ["正財穩定，可能有意外的小獎金或回饋。", "適合檢視理財規劃，會發現不錯的方向。", "朋友間的好消息可能帶來財運。"],
      mid: ["收支平衡，小額消費要記帳。", "不宜衝動購物，先放購物車三天再決定。", "存一點小錢，週末會感謝自己。"],
      bad: ["容易有預期外的支出，錢包看緊一點。", "借貸往來要謹慎，避免口頭承諾。", "網購前多比價，小心踩雷。"],
    },
  },
  {
    key: "感情",
    icon: "💖",
    texts: {
      good: ["桃花朵朵開，單身者有機會認識聊得來的人。", "與另一半默契十足，適合安排小約會。", "真誠的關心會讓關係更進一步。"],
      mid: ["感情平穩，多一點傾聽就很加分。", "老朋友會帶來溫暖的問候。", "給彼此一點空間，關係會更舒服。"],
      bad: ["說話前先想三秒，避免無心的話傷人。", "情緒起伏較大，先照顧好自己的心情。", "避免翻舊帳，專注在當下。"],
    },
  },
  {
    key: "健康",
    icon: "🌿",
    texts: {
      good: ["精神飽滿，很適合開始新的運動習慣。", "睡得好、吃得香，整個人閃閃發光。", "活力充沛，戶外走走會更有靈感。"],
      mid: ["記得多喝水，久坐要起來伸展。", "作息稍微調整，早點睡會更有精神。", "飲食清淡一點，身體會更輕盈。"],
      bad: ["容易疲勞，別硬撐，該休息就休息。", "注意肩頸痠痛，螢幕時間別太長。", "天氣變化大，出門多帶件外套。"],
    },
  },
];

const LUCKY_COLORS = [
  { name: "朱紅", hex: "#dc2626" },
  { name: "金黃", hex: "#f59e0b" },
  { name: "翠綠", hex: "#16a34a" },
  { name: "天藍", hex: "#0ea5e9" },
  { name: "紫藤", hex: "#8b5cf6" },
  { name: "櫻粉", hex: "#f472b6" },
  { name: "米白", hex: "#f5f0e1" },
  { name: "墨黑", hex: "#1f2937" },
];
const LUCKY_ITEMS = ["保溫杯", "筆記本", "耳機", "雨傘", "鑰匙圈", "藍色原子筆", "小盆栽", "巧克力", "手帕", "帆布袋"];
const LUCKY_DIRECTIONS = ["東方", "南方", "西方", "北方", "東南方", "西北方"];
const WEEKDAYS = ["週一", "週二", "週三", "週四", "週五", "週六", "週日"];

type Result = {
  stick: number;
  level: Level;
  week: string;
  aspects: { key: string; icon: string; stars: number; text: string }[];
  color: (typeof LUCKY_COLORS)[number];
  number: number;
  day: string;
  item: string;
  direction: string;
};

const SHAKE_MS = 1600;
const RISE_MS = 700;

function pick<T>(list: readonly T[]): T {
  return list[Math.floor(Math.random() * list.length)];
}

function pickLevel(): Level {
  const total = LEVELS.reduce((sum, l) => sum + l.weight, 0);
  let roll = Math.random() * total;
  for (const level of LEVELS) {
    roll -= level.weight;
    if (roll < 0) return level;
  }
  return LEVELS[LEVELS.length - 1];
}

function weekRange() {
  const now = new Date();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const fmt = (d: Date) => `${d.getMonth() + 1}/${d.getDate()}`;
  return `${fmt(monday)} – ${fmt(sunday)}`;
}

function drawFortune(): Result {
  const level = pickLevel();
  return {
    stick: Math.floor(Math.random() * 100) + 1,
    level,
    week: weekRange(),
    aspects: ASPECTS.map((a) => {
      // Each aspect wobbles around the overall luck, so a 大吉 week can still have a weak spot.
      const stars = Math.min(5, Math.max(1, level.score + Math.floor(Math.random() * 3) - 1));
      const tier: Tier = stars >= 4 ? "good" : stars === 3 ? "mid" : "bad";
      return { key: a.key, icon: a.icon, stars, text: pick(a.texts[tier]) };
    }),
    color: pick(LUCKY_COLORS),
    number: Math.floor(Math.random() * 9) + 1,
    day: pick(WEEKDAYS),
    item: pick(LUCKY_ITEMS),
    direction: pick(LUCKY_DIRECTIONS),
  };
}

const stroke = (px: number) => ({ WebkitTextStroke: `${px}px #111`, paintOrder: "stroke fill" as const });

export default function Fortune() {
  const [phase, setPhase] = useState<"idle" | "shaking" | "rising" | "revealed">("idle");
  const [result, setResult] = useState<Result | null>(null);

  function draw() {
    if (phase === "shaking" || phase === "rising") return;
    setResult(drawFortune());
    setPhase("shaking");
    setTimeout(() => setPhase("rising"), SHAKE_MS);
    setTimeout(() => setPhase("revealed"), SHAKE_MS + RISE_MS + 300);
  }

  const busy = phase === "shaking" || phase === "rising";

  return (
    <main
      className="flex flex-1 flex-col items-center bg-orange-200 px-4 pb-16 pt-10 text-stone-900"
      style={{
        backgroundImage: "radial-gradient(#fb923c55 2px, transparent 2px)",
        backgroundSize: "22px 22px",
      }}
    >
      <h1 className="text-5xl font-black tracking-wider text-red-600 sm:text-6xl" style={{ ...stroke(7), textShadow: "0 5px 0 #111" }}>
        本週運勢籤
      </h1>
      <p className="mt-3 font-bold">心中默念想問的事，誠心搖一搖籤筒</p>

      {/* Tube */}
      <div className="relative mt-10 flex h-64 w-40 items-end justify-center">
        <div
          className="relative flex h-full w-full items-end justify-center"
          style={phase === "shaking" ? { animation: `tube-shake 0.4s ease-in-out ${SHAKE_MS / 400}` } : undefined}
        >
          {/* Sticks peeking out of the tube */}
          {[-36, -18, 0, 18, 36].map((x, i) => (
            <span
              key={x}
              className="absolute bottom-36 h-20 w-3 rounded-t-md border-[3px] border-stone-900 bg-amber-100"
              style={{ left: `calc(50% + ${x}px - 6px)`, transform: `rotate(${(i - 2) * 5}deg)` }}
            />
          ))}

          {/* The chosen stick */}
          {(phase === "rising" || phase === "revealed") && result && (
            <span
              className="absolute bottom-36 flex h-28 w-8 items-start justify-center rounded-t-lg border-[3px] border-stone-900 bg-amber-50 pt-1 text-xs font-black text-red-600 [writing-mode:vertical-rl]"
              style={{ animation: `stick-rise ${RISE_MS}ms ease-out forwards` }}
            >
              第<span className="[text-combine-upright:all]">{result.stick}</span>籤
            </span>
          )}

          <div className="relative z-10 flex h-40 w-full flex-col items-center justify-center rounded-b-3xl rounded-t-lg border-4 border-stone-900 bg-red-600 shadow-[0_6px_0_#111]">
            <span className="absolute inset-x-0 top-3 h-2 border-y-[3px] border-stone-900 bg-amber-400" />
            <span className="absolute inset-x-0 bottom-5 h-2 border-y-[3px] border-stone-900 bg-amber-400" />
            <span className="text-5xl font-black text-amber-300" style={stroke(5)}>
              籤
            </span>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={draw}
        disabled={busy}
        className="mt-8 rounded-full border-4 border-stone-900 bg-red-600 px-10 py-3 text-2xl font-black text-white shadow-[0_5px_0_#111] transition hover:bg-red-500 active:translate-y-1 active:shadow-[0_1px_0_#111] disabled:cursor-not-allowed disabled:bg-red-300"
        style={stroke(4)}
      >
        {busy ? "搖籤中…" : result ? "再抽一次" : "抽籤"}
      </button>

      {/* Slip */}
      {phase === "revealed" && result && (
        <article
          className="mt-10 w-full max-w-md origin-top rounded-2xl border-4 border-stone-900 bg-amber-50 shadow-[0_8px_0_#111]"
          style={{ animation: "slip-open 0.5s ease-out" }}
          aria-live="polite"
        >
          <header className="flex items-center justify-between rounded-t-xl border-b-4 border-stone-900 bg-red-600 px-4 py-2 font-black text-amber-200">
            <span>第 {result.stick} 籤</span>
            <span className="text-sm">本週 {result.week}</span>
          </header>

          <div className="px-5 pb-6 pt-5">
            <div className="flex items-center gap-5">
              <div
                className="flex size-28 shrink-0 items-center justify-center rounded-full border-4 border-stone-900 text-5xl font-black text-white shadow-[0_4px_0_#111]"
                style={{ backgroundColor: result.level.color, ...stroke(5) }}
              >
                {result.level.name}
              </div>
              <div className="font-serif text-lg font-bold leading-relaxed">
                <p>{result.level.poem[0]}</p>
                <p>{result.level.poem[1]}</p>
              </div>
            </div>

            <p className="mt-5 rounded-xl border-[3px] border-dashed border-stone-900 bg-white px-4 py-3 font-bold">
              {result.level.summary}
            </p>

            <ul className="mt-5 space-y-3">
              {result.aspects.map((a) => (
                <li key={a.key} className="rounded-xl border-[3px] border-stone-900 bg-white px-4 py-2">
                  <div className="flex items-center justify-between">
                    <span className="font-black">
                      {a.icon} {a.key}運
                    </span>
                    <span className="tracking-wider text-amber-500" aria-label={`${a.stars} 顆星`}>
                      {"★".repeat(a.stars)}
                      <span className="text-stone-300">{"★".repeat(5 - a.stars)}</span>
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-stone-700">{a.text}</p>
                </li>
              ))}
            </ul>

            <h2 className="mt-6 font-black">本週幸運小物</h2>
            <dl className="mt-2 grid grid-cols-2 gap-2 text-sm sm:grid-cols-3">
              {[
                ["幸運色", <span key="c" className="inline-flex items-center gap-1"><span className="inline-block size-3 rounded-full border-2 border-stone-900" style={{ backgroundColor: result.color.hex }} />{result.color.name}</span>],
                ["幸運數字", result.number],
                ["幸運日", result.day],
                ["幸運物", result.item],
                ["開運方位", result.direction],
              ].map(([label, value]) => (
                <div key={String(label)} className="rounded-lg border-[3px] border-stone-900 bg-white px-3 py-2">
                  <dt className="text-xs font-bold text-stone-500">{label}</dt>
                  <dd className="font-black">{value}</dd>
                </div>
              ))}
            </dl>

            <p className="mt-6 rounded-xl border-[3px] border-stone-900 bg-red-600 px-4 py-3 text-center font-black text-white">
              籤語建議：{result.level.advice}
            </p>
          </div>
        </article>
      )}

      <p className="mt-8 text-xs text-stone-600">抽籤結果為隨機產生，僅供娛樂參考 🙏</p>
    </main>
  );
}
