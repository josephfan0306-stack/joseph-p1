import type { Metadata } from "next";
import Pomodoro from "./Pomodoro";

export const metadata: Metadata = {
  title: "蕃茄鐘",
  description: "專注工作用的蕃茄鐘小工具",
};

export default function PomodoroPage() {
  return <Pomodoro />;
}
