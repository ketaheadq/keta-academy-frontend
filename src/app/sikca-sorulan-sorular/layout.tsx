import type { Metadata } from "next";
import { canonicalUrl } from "@/lib/seo";

export const metadata: Metadata = {
	title: "Sıkça Sorulan Sorular | KetaLearn",
	description: "KetaLearn dersleri, deneme sınavları ve üyeliği hakkında en çok sorulan sorular.",
	alternates: { canonical: canonicalUrl("/sikca-sorulan-sorular") },
};

export default function SikcaSorulanSorularLayout({ children }: { children: React.ReactNode }) {
	return children;
}
