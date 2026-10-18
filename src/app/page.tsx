import Link from "next/link";
import { TOOLS, type Tool } from "@/components/tools";

const stroke = (px: number) => ({ WebkitTextStroke: `${px}px #111`, paintOrder: "stroke fill" as const });

const RIBBON = ["抽獎", "專注", "好運", "效率", "樂趣", "靈感"];

const STEPS = [
  { icon: "👆", title: "挑一個工具", text: "從上方選單或下方卡片，選擇現在需要的小工具。" },
  { icon: "⚡", title: "按下開始", text: "不用註冊、不用安裝，打開就能直接使用。" },
  { icon: "🎉", title: "享受成果", text: "抽出幸運兒、完成一顆蕃茄，或看看本週好運。" },
];

function LotteryArt() {
  return (
    <div className="flex gap-1.5 rounded-xl border-[3px] border-stone-900 bg-sky-500 p-2">
      {["沖", "沖", "沖"].map((c, i) => (
        <span
          key={i}
          className="flex size-11 items-center justify-center rounded-lg border-[3px] border-stone-900 bg-white text-lg font-black text-blue-600"
        >
          {c}
        </span>
      ))}
    </div>
  );
}

function PomodoroArt() {
  return (
    <div className="relative flex size-24 items-center justify-center rounded-full border-[3px] border-stone-900 bg-white">
      <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90">
        <circle cx={50} cy={50} r={38} fill="none" stroke="#fecaca" strokeWidth={10} />
        <circle
          cx={50}
          cy={50}
          r={38}
          fill="none"
          stroke="#ef4444"
          strokeWidth={10}
          strokeLinecap="round"
          strokeDasharray={239}
          strokeDashoffset={70}
        />
      </svg>
      <span className="relative font-mono text-lg font-black">25:00</span>
    </div>
  );
}

function FortuneArt() {
  return (
    <div className="relative flex h-24 items-end">
      <span className="absolute -top-2 left-1/2 flex h-14 w-7 -translate-x-1/2 items-start justify-center rounded-t-md border-[3px] border-stone-900 bg-amber-50 pt-1 text-[10px] font-black text-red-600 [writing-mode:vertical-rl]">
        大吉
      </span>
      <span className="relative flex h-16 w-16 items-center justify-center rounded-b-2xl rounded-t-md border-[3px] border-stone-900 bg-red-600 text-2xl font-black text-amber-300" style={stroke(4)}>
        籤
      </span>
    </div>
  );
}

const ART: Record<string, () => React.ReactNode> = {
  "/lottery": LotteryArt,
  "/pomodoro": PomodoroArt,
  "/fortune": FortuneArt,
};

function ToolCard({ tool, index }: { tool: Tool; index: number }) {
  const Art = ART[tool.href];
  return (
    <Link
      href={tool.href}
      className="group flex flex-col overflow-hidden rounded-3xl border-4 border-stone-900 bg-white shadow-[0_8px_0_#111] transition hover:-translate-y-1.5 hover:shadow-[0_14px_0_#111] focus-visible:-translate-y-1.5 focus-visible:outline-none"
    >
      <div
        className="relative flex h-44 items-center justify-center border-b-4 border-stone-900"
        style={{
          backgroundColor: tool.color,
          backgroundImage: "radial-gradient(#ffffff55 2px, transparent 2px)",
          backgroundSize: "18px 18px",
        }}
      >
        <span className="absolute left-4 top-4 rounded-full border-[3px] border-stone-900 bg-white px-2.5 text-sm font-black">
          0{index + 1}
        </span>
        <span className="absolute right-4 top-3 text-3xl transition group-hover:rotate-12 group-hover:scale-125">
          {tool.emoji}
        </span>
        <div className="transition group-hover:scale-110">
          <Art />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <p className="text-sm font-bold text-stone-500">{tool.tagline}</p>
        <h3 className="mt-1 text-2xl font-black">{tool.name}</h3>
        <p className="mt-3 text-sm leading-relaxed text-stone-700">{tool.description}</p>
        <ul className="mt-4 space-y-1.5 text-sm font-bold">
          {tool.features.map((f) => (
            <li key={f} className="flex items-center gap-2">
              <span
                className="flex size-5 shrink-0 items-center justify-center rounded-full border-2 border-stone-900 text-[10px]"
                style={{ backgroundColor: tool.soft }}
              >
                ✓
              </span>
              {f}
            </li>
          ))}
        </ul>
        <span
          className="mt-6 inline-flex items-center justify-center gap-2 self-start rounded-full border-[3px] border-stone-900 px-5 py-2 font-black shadow-[0_3px_0_#111] transition group-hover:gap-3"
          style={{ backgroundColor: tool.color }}
        >
          開始使用 <span aria-hidden>→</span>
        </span>
      </div>
    </Link>
  );
}

export default function Home() {
  return (
    <main className="flex flex-1 flex-col bg-amber-50 text-stone-900">
      {/* Hero */}
      <section
        className="relative overflow-hidden"
        style={{
          backgroundImage: "radial-gradient(#f59e0b40 2px, transparent 2px)",
          backgroundSize: "24px 24px",
        }}
      >
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:py-24 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border-[3px] border-stone-900 bg-white px-3 py-1 text-sm font-black shadow-[0_3px_0_#111]">
              <span className="size-2.5 rounded-full bg-green-500" /> 3 個小工具，免安裝即用
            </span>
            <h1 className="mt-6 text-5xl font-black leading-tight sm:text-7xl">
              <span className="text-white" style={{ ...stroke(9), textShadow: "0 6px 0 #111" }}>
                Joseph
              </span>
              <br />
              <span className="text-red-500" style={{ ...stroke(9), textShadow: "0 6px 0 #111" }}>
                的小工具箱
              </span>
            </h1>
            <p className="mt-6 max-w-lg text-lg font-bold leading-relaxed text-stone-700">
              抽個獎、專心工作、再看看本週運勢——
              <br className="hidden sm:block" />
              把生活裡的小事，變成有趣的小儀式。
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#tools"
                className="rounded-full border-4 border-stone-900 bg-yellow-300 px-7 py-3 text-lg font-black shadow-[0_5px_0_#111] transition hover:-translate-y-0.5 active:translate-y-1 active:shadow-[0_1px_0_#111]"
              >
                探索工具 ↓
              </a>
              <Link
                href="/pomodoro"
                className="rounded-full border-4 border-stone-900 bg-white px-7 py-3 text-lg font-black shadow-[0_5px_0_#111] transition hover:-translate-y-0.5 active:translate-y-1 active:shadow-[0_1px_0_#111]"
              >
                🍅 立刻專注
              </Link>
            </div>
          </div>

          {/* Floating stickers */}
          <div className="relative mx-auto h-80 w-full max-w-sm" aria-hidden>
            {TOOLS.map((tool, i) => {
              const spots = [
                "left-0 top-2 [--tilt:-8deg]",
                "right-0 top-24 [--tilt:7deg]",
                "left-8 bottom-0 [--tilt:-3deg]",
              ];
              return (
                <div
                  key={tool.href}
                  className={`absolute flex w-52 items-center gap-3 rounded-2xl border-4 border-stone-900 bg-white p-3 shadow-[0_6px_0_#111] ${spots[i]}`}
                  style={{ animation: `float 4s ease-in-out ${i * 0.7}s infinite` }}
                >
                  <span
                    className="flex size-12 shrink-0 items-center justify-center rounded-xl border-[3px] border-stone-900 text-2xl"
                    style={{ backgroundColor: tool.color }}
                  >
                    {tool.emoji}
                  </span>
                  <span>
                    <span className="block text-xs font-bold text-stone-500">0{i + 1}</span>
                    <span className="block font-black leading-tight">{tool.name}</span>
                  </span>
                </div>
              );
            })}
            <span className="absolute right-6 top-0 text-4xl text-red-500" style={stroke(2)}>★</span>
            <span className="absolute bottom-10 right-2 text-3xl text-sky-500" style={stroke(2)}>✦</span>
          </div>
        </div>
      </section>

      {/* Ribbon */}
      <div className="overflow-hidden border-y-4 border-stone-900 bg-red-500 py-3" aria-hidden>
        <div className="flex w-max" style={{ animation: "marquee 20s linear infinite" }}>
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0">
              {[...RIBBON, ...RIBBON].map((word, i) => (
                <span key={i} className="px-6 text-xl font-black text-white" style={stroke(4)}>
                  {word} <span className="pl-6 text-yellow-300">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Tools */}
      <section id="tools" className="mx-auto w-full max-w-6xl scroll-mt-20 px-4 py-20">
        <div className="text-center">
          <p className="font-black text-red-500">TOOLS</p>
          <h2 className="mt-2 text-4xl font-black sm:text-5xl">工具一覽</h2>
          <p className="mt-4 font-bold text-stone-600">每個工具都是一個獨立分頁，點擊卡片就能前往。</p>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {TOOLS.map((tool, i) => (
            <ToolCard key={tool.href} tool={tool} index={i} />
          ))}
        </div>
      </section>

      {/* Steps */}
      <section className="border-y-4 border-stone-900 bg-sky-200">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <h2 className="text-center text-4xl font-black">三步驟，馬上上手</h2>
          <ol className="mt-12 grid gap-6 sm:grid-cols-3">
            {STEPS.map((step, i) => (
              <li
                key={step.title}
                className="relative rounded-3xl border-4 border-stone-900 bg-white p-6 pt-10 shadow-[0_6px_0_#111]"
              >
                <span className="absolute -top-6 left-6 flex size-12 items-center justify-center rounded-full border-4 border-stone-900 bg-yellow-300 text-xl font-black">
                  {i + 1}
                </span>
                <p className="text-3xl">{step.icon}</p>
                <h3 className="mt-2 text-xl font-black">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-700">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto w-full max-w-6xl px-4 py-20">
        <div className="rounded-[40px] border-4 border-stone-900 bg-yellow-300 px-6 py-12 text-center shadow-[0_10px_0_#111]">
          <h2 className="text-3xl font-black sm:text-4xl">今天想先做哪一件事？</h2>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            {TOOLS.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="rounded-full border-4 border-stone-900 bg-white px-6 py-3 font-black shadow-[0_5px_0_#111] transition hover:-translate-y-0.5 active:translate-y-1 active:shadow-[0_1px_0_#111]"
              >
                {tool.emoji} {tool.name}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
