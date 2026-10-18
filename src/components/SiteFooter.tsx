import Link from "next/link";
import { TOOLS } from "./tools";

export default function SiteFooter() {
  return (
    <footer className="border-t-4 border-stone-900 bg-stone-900 text-stone-300">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-3">
        <div>
          <p className="flex items-center gap-2 text-lg font-black text-white">
            <span className="flex size-9 items-center justify-center rounded-lg border-[3px] border-white bg-yellow-300 text-lg">
              🧰
            </span>
            Joseph 的小工具箱
          </p>
          <p className="mt-3 text-sm leading-relaxed">
            收集日常用得到的小工具，讓工作與生活多一點專注、多一點樂趣。
          </p>
        </div>

        <div>
          <h2 className="font-black text-white">工具</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {TOOLS.map((tool) => (
              <li key={tool.href}>
                <Link href={tool.href} className="transition hover:text-yellow-300">
                  {tool.emoji} {tool.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-black text-white">關於</h2>
          <p className="mt-3 text-sm leading-relaxed">
            使用 Next.js 與 Tailwind CSS 打造。所有工具都在瀏覽器中執行，不需要登入。
          </p>
        </div>
      </div>
      <div className="border-t border-stone-700">
        <p className="mx-auto max-w-6xl px-4 py-4 text-xs text-stone-500">
          © 2026 Joseph. Made with ❤️ and 🍅.
        </p>
      </div>
    </footer>
  );
}
