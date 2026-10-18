import type { Metadata } from "next";
import Fortune from "./Fortune";

export const metadata: Metadata = {
  title: "本週運勢抽籤",
  description: "隨機抽出大吉、中吉等籤詩，看看這一週的運勢",
};

export default function FortunePage() {
  return <Fortune />;
}
