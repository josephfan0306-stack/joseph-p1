import type { Metadata } from "next";
import SlotMachine from "./SlotMachine";

export const metadata: Metadata = {
  title: "笑傲江湖抽獎機",
  description: "以笑傲江湖人物為名單的抽獎小工具",
};

const DECORATIONS = [
  { char: "★", className: "left-[6%] top-8 rotate-12 text-red-500" },
  { char: "✦", className: "right-[8%] top-16 -rotate-12 text-sky-500" },
  { char: "●", className: "left-[12%] top-48 text-pink-500" },
  { char: "★", className: "right-[14%] top-56 rotate-45 text-emerald-500" },
  { char: "✦", className: "left-[4%] top-[34rem] text-orange-500" },
  { char: "●", className: "right-[5%] top-[30rem] text-violet-500" },
];

export default function LotteryPage() {
  return (
    <main
      className="relative flex flex-1 flex-col items-center overflow-hidden bg-yellow-300 px-4 pb-16 pt-10 text-stone-900"
      style={{
        backgroundImage: "radial-gradient(#f59e0b55 2px, transparent 2px)",
        backgroundSize: "22px 22px",
      }}
    >
      {DECORATIONS.map((d, i) => (
        <span
          key={i}
          aria-hidden
          className={`pointer-events-none absolute text-3xl [-webkit-text-stroke:2px_#111] ${d.className}`}
        >
          {d.char}
        </span>
      ))}

      <header className="relative text-center">
        <h1
          className="text-6xl font-black tracking-wider text-red-500 sm:text-7xl"
          style={{
            WebkitTextStroke: "8px #111",
            paintOrder: "stroke fill",
            textShadow: "0 6px 0 #111",
          }}
        >
          笑傲江湖
        </h1>
        <p
          className="mt-1 text-4xl font-black tracking-[0.3em] text-white sm:text-5xl"
          style={{ WebkitTextStroke: "6px #111", paintOrder: "stroke fill" }}
        >
          抽獎機
        </p>
        <p className="mt-4 font-bold">轉動江湖抽獎機，看誰是今日天選之人！</p>
        <p className="mt-1 text-sm text-stone-700">參賽人物：12 位　・　三軸連線即中獎</p>
      </header>

      <SlotMachine />
    </main>
  );
}
