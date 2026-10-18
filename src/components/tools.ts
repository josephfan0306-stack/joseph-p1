export type Tool = {
  href: string;
  emoji: string;
  name: string;
  tagline: string;
  description: string;
  features: string[];
  color: string;
  soft: string;
};

export const TOOLS: Tool[] = [
  {
    href: "/lottery",
    emoji: "🎰",
    name: "笑傲江湖抽獎機",
    tagline: "三軸連線，天選之人就是你",
    description: "以《笑傲江湖》12 位人物為名單的拉霸抽獎機，轉軸依序停下，揭曉今天的幸運兒。",
    features: ["三轉軸拉霸動畫", "跑馬燈閃爍特效", "群俠榜記錄中獎次數"],
    color: "#facc15",
    soft: "#fef9c3",
  },
  {
    href: "/pomodoro",
    emoji: "🍅",
    name: "蕃茄鐘",
    tagline: "25 分鐘，只做一件事",
    description: "專注與休息交替的計時器，每完成 4 顆蕃茄自動進入長休息，幫你維持穩定的工作節奏。",
    features: ["專注／短休息／長休息", "分頁標題同步倒數", "記錄今日完成任務"],
    color: "#f87171",
    soft: "#fee2e2",
  },
  {
    href: "/fortune",
    emoji: "🎋",
    name: "本週運勢籤",
    tagline: "搖一搖籤筒，看看這週運氣",
    description: "從大吉到大凶隨機抽籤，附上籤詩、四大運勢星等與本週幸運小物。",
    features: ["七種籤等級", "事業、財運、感情、健康", "幸運色、數字與方位"],
    color: "#fb923c",
    soft: "#ffedd5",
  },
];
