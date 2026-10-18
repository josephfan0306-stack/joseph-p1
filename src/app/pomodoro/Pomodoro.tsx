"use client";

import { useEffect, useRef, useState } from "react";

type Mode = "focus" | "short" | "long";

const MODES: Record<Mode, { label: string; hint: string; color: string; bg: string }> = {
  focus: { label: "專注", hint: "關掉通知，一次只做一件事", color: "#ef4444", bg: "#fca5a5" },
  short: { label: "短休息", hint: "起來走走、喝口水", color: "#16a34a", bg: "#86efac" },
  long: { label: "長休息", hint: "好好放鬆，你做得很好", color: "#0284c7", bg: "#7dd3fc" },
};

const MODE_ORDER: Mode[] = ["focus", "short", "long"];
const LONG_BREAK_EVERY = 4;
const RING_RADIUS = 120;
const RING_LENGTH = 2 * Math.PI * RING_RADIUS;

type Done = { task: string; at: string };

function format(ms: number) {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const m = String(Math.floor(total / 60)).padStart(2, "0");
  const s = String(total % 60).padStart(2, "0");
  return `${m}:${s}`;
}

function playChime() {
  try {
    const ctx = new AudioContext();
    [0, 0.35, 0.7].forEach((offset) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.25, ctx.currentTime + offset);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + offset + 0.3);
      osc.connect(gain).connect(ctx.destination);
      osc.start(ctx.currentTime + offset);
      osc.stop(ctx.currentTime + offset + 0.3);
    });
  } catch {
    // Audio is a nice-to-have; ignore browsers that block it.
  }
}

export default function Pomodoro() {
  const [minutes, setMinutes] = useState<Record<Mode, number>>({ focus: 25, short: 5, long: 15 });
  const [mode, setMode] = useState<Mode>("focus");
  const [remaining, setRemaining] = useState(25 * 60 * 1000);
  const [running, setRunning] = useState(false);
  const [autoStart, setAutoStart] = useState(false);
  const [task, setTask] = useState("");
  const [completed, setCompleted] = useState(0);
  const [log, setLog] = useState<Done[]>([]);

  // Wall-clock deadline, so the timer stays accurate even if the tab is throttled.
  const endAt = useRef(0);
  const finishRef = useRef<() => void>(() => {});

  const total = minutes[mode] * 60 * 1000;
  const theme = MODES[mode];

  function switchTo(next: Mode, start: boolean) {
    const ms = minutes[next] * 60 * 1000;
    setMode(next);
    setRemaining(ms);
    endAt.current = Date.now() + ms;
    setRunning(start);
  }

  function start() {
    endAt.current = Date.now() + remaining;
    setRunning(true);
  }

  function pause() {
    setRemaining(Math.max(0, endAt.current - Date.now()));
    setRunning(false);
  }

  function reset() {
    setRunning(false);
    setRemaining(total);
  }

  function finish() {
    playChime();
    if (mode === "focus") {
      const count = completed + 1;
      setCompleted(count);
      setLog((prev) => [
        {
          task: task.trim() || "未命名任務",
          at: new Date().toLocaleTimeString("zh-TW", { hour: "2-digit", minute: "2-digit" }),
        },
        ...prev,
      ]);
      switchTo(count % LONG_BREAK_EVERY === 0 ? "long" : "short", autoStart);
    } else {
      switchTo("focus", autoStart);
    }
  }

  function changeMinutes(target: Mode, value: number) {
    const clamped = Math.min(120, Math.max(1, Math.round(value) || 1));
    setMinutes((prev) => ({ ...prev, [target]: clamped }));
    if (target === mode && !running) setRemaining(clamped * 60 * 1000);
  }

  useEffect(() => {
    finishRef.current = finish;
  });

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      const left = endAt.current - Date.now();
      if (left <= 0) {
        finishRef.current();
      } else {
        setRemaining(left);
      }
    }, 250);
    return () => clearInterval(id);
  }, [running]);

  useEffect(() => {
    document.title = running ? `${format(remaining)} ${theme.label}｜蕃茄鐘` : "蕃茄鐘｜Joseph 的小工具箱";
  }, [running, remaining, theme.label]);

  useEffect(() => () => void (document.title = "蕃茄鐘｜Joseph 的小工具箱"), []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.code !== "Space" || e.target instanceof HTMLInputElement) return;
      e.preventDefault();
      document.getElementById("pomodoro-toggle")?.click();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const progress = total > 0 ? 1 - remaining / total : 0;
  const cyclePos = completed % LONG_BREAK_EVERY;

  return (
    <main
      className="flex flex-1 flex-col items-center px-4 pb-16 pt-10 text-stone-900 transition-colors duration-700"
      style={{
        backgroundColor: theme.bg,
        backgroundImage: "radial-gradient(#ffffff66 2px, transparent 2px)",
        backgroundSize: "22px 22px",
      }}
    >
      <h1
        className="text-5xl font-black tracking-wider text-white sm:text-6xl"
        style={{ WebkitTextStroke: "7px #111", paintOrder: "stroke fill", textShadow: "0 5px 0 #111" }}
      >
        🍅 蕃茄鐘
      </h1>
      <p className="mt-3 font-bold">{theme.hint}</p>

      <div className="mt-8 w-full max-w-md rounded-[32px] border-4 border-stone-900 bg-white p-5 shadow-[0_8px_0_#111] sm:p-7">
        {/* Mode tabs */}
        <div className="grid grid-cols-3 gap-2" role="tablist">
          {MODE_ORDER.map((m) => (
            <button
              key={m}
              type="button"
              role="tab"
              aria-selected={mode === m}
              onClick={() => switchTo(m, false)}
              className={`rounded-full border-[3px] border-stone-900 py-1.5 text-sm font-black transition sm:text-base ${
                mode === m ? "text-white shadow-[0_3px_0_#111]" : "bg-white hover:bg-stone-100"
              }`}
              style={mode === m ? { backgroundColor: MODES[m].color } : undefined}
            >
              {MODES[m].label}
            </button>
          ))}
        </div>

        {/* Timer ring */}
        <div className="relative mx-auto mt-6 aspect-square w-full max-w-[280px]">
          <svg viewBox="0 0 280 280" className="size-full -rotate-90">
            <circle cx={140} cy={140} r={RING_RADIUS} fill="none" stroke="#e7e5e4" strokeWidth={18} />
            <circle
              cx={140}
              cy={140}
              r={RING_RADIUS}
              fill="none"
              stroke={theme.color}
              strokeWidth={18}
              strokeLinecap="round"
              strokeDasharray={RING_LENGTH}
              strokeDashoffset={RING_LENGTH * (1 - progress)}
              style={{ transition: "stroke-dashoffset 0.25s linear, stroke 0.7s" }}
            />
            <circle cx={140} cy={140} r={RING_RADIUS + 13} fill="none" stroke="#111" strokeWidth={4} />
            <circle cx={140} cy={140} r={RING_RADIUS - 13} fill="none" stroke="#111" strokeWidth={4} />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-mono text-6xl font-black tabular-nums" aria-live="off">
              {format(remaining)}
            </span>
            <span className="mt-1 text-sm font-bold text-stone-500">
              {running ? `${theme.label}中…` : remaining < total ? "已暫停" : "準備開始"}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="rounded-full border-[3px] border-stone-900 bg-white px-4 py-2 font-black shadow-[0_3px_0_#111] active:translate-y-0.5 active:shadow-none"
          >
            重設
          </button>
          <button
            id="pomodoro-toggle"
            type="button"
            onClick={running ? pause : start}
            className="rounded-full border-4 border-stone-900 px-10 py-3 text-2xl font-black text-white shadow-[0_5px_0_#111] transition active:translate-y-1 active:shadow-[0_1px_0_#111]"
            style={{ backgroundColor: theme.color, WebkitTextStroke: "4px #111", paintOrder: "stroke fill" }}
          >
            {running ? "暫停" : "開始"}
          </button>
          <button
            type="button"
            onClick={() => switchTo(mode === "focus" ? "short" : "focus", false)}
            className="rounded-full border-[3px] border-stone-900 bg-white px-4 py-2 font-black shadow-[0_3px_0_#111] active:translate-y-0.5 active:shadow-none"
          >
            跳過
          </button>
        </div>
        <p className="mt-3 text-center text-xs text-stone-500">按空白鍵可開始／暫停</p>

        {/* Current task */}
        <label className="mt-6 block">
          <span className="text-sm font-black">現在要專心做的事</span>
          <input
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="例如：寫完報告第一段"
            className="mt-1 w-full rounded-xl border-[3px] border-stone-900 px-3 py-2 font-bold outline-none focus:ring-4 focus:ring-amber-300"
          />
        </label>

        {/* Cycle progress */}
        <div className="mt-6 flex items-center justify-between">
          <span className="text-sm font-black">本輪進度</span>
          <div className="flex gap-2" aria-label={`本輪已完成 ${cyclePos} / ${LONG_BREAK_EVERY}`}>
            {Array.from({ length: LONG_BREAK_EVERY }, (_, i) => (
              <span
                key={i}
                className={`flex size-8 items-center justify-center rounded-full border-[3px] border-stone-900 text-base ${
                  i < cyclePos ? "bg-red-100" : "bg-stone-100 grayscale opacity-40"
                }`}
              >
                🍅
              </span>
            ))}
          </div>
        </div>
        <p className="mt-1 text-right text-xs text-stone-500">每完成 {LONG_BREAK_EVERY} 顆蕃茄，進入一次長休息</p>
      </div>

      {/* Settings */}
      <details className="mt-6 w-full max-w-md rounded-2xl border-4 border-stone-900 bg-white p-4 shadow-[0_5px_0_#111]">
        <summary className="cursor-pointer font-black">⚙️ 設定</summary>
        <div className="mt-4 grid grid-cols-3 gap-3">
          {MODE_ORDER.map((m) => (
            <label key={m} className="text-sm font-bold">
              {MODES[m].label}（分）
              <input
                type="number"
                min={1}
                max={120}
                value={minutes[m]}
                onChange={(e) => changeMinutes(m, Number(e.target.value))}
                className="mt-1 w-full rounded-lg border-[3px] border-stone-900 px-2 py-1 font-mono font-bold"
              />
            </label>
          ))}
        </div>
        <label className="mt-4 flex items-center gap-2 text-sm font-bold">
          <input
            type="checkbox"
            checked={autoStart}
            onChange={(e) => setAutoStart(e.target.checked)}
            className="size-4 accent-red-500"
          />
          時間到自動開始下一段
        </label>
      </details>

      {/* Log */}
      <section className="mt-6 w-full max-w-md rounded-2xl border-4 border-stone-900 bg-white p-4 shadow-[0_5px_0_#111]">
        <div className="flex items-baseline justify-between">
          <h2 className="font-black">今日完成</h2>
          <span className="text-sm font-bold text-stone-500">共 {completed} 顆 🍅</span>
        </div>
        {log.length === 0 ? (
          <p className="mt-2 text-sm text-stone-500">完成第一顆蕃茄後會記錄在這裡。</p>
        ) : (
          <ul className="mt-2 divide-y-2 divide-dashed divide-stone-200">
            {log.map((item, i) => (
              <li key={i} className="flex justify-between gap-3 py-2 text-sm">
                <span className="font-bold">🍅 {item.task}</span>
                <span className="shrink-0 font-mono text-stone-500">{item.at}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
