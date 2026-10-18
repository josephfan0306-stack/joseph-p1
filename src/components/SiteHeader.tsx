"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { TOOLS } from "./tools";

export default function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b-4 border-stone-900 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4">
        <Link href="/" className="flex shrink-0 items-center gap-2 font-black">
          <span className="flex size-10 items-center justify-center rounded-xl border-[3px] border-stone-900 bg-yellow-300 text-xl shadow-[0_3px_0_#111]">
            🧰
          </span>
          <span className="text-lg leading-tight">
            Joseph<span className="hidden sm:inline"> 的小工具箱</span>
          </span>
        </Link>

        <nav aria-label="工具選單">
          <ul className="flex items-center gap-1 sm:gap-2">
            {TOOLS.map((tool) => {
              const active = pathname === tool.href;
              return (
                <li key={tool.href}>
                  <Link
                    href={tool.href}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center gap-1 rounded-full border-[3px] px-2.5 py-1 text-sm font-black transition sm:px-3 ${
                      active
                        ? "border-stone-900 shadow-[0_3px_0_#111]"
                        : "border-transparent hover:border-stone-900"
                    }`}
                    style={active ? { backgroundColor: tool.color } : undefined}
                  >
                    <span aria-hidden>{tool.emoji}</span>
                    <span className="hidden sm:inline">{tool.name.replace("笑傲江湖", "")}</span>
                    <span className="sr-only sm:hidden">{tool.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
