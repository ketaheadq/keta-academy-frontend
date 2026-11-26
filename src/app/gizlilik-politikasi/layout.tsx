import type { Metadata } from "next";
import { canonicalUrl } from "@/lib/seo";

export const metadata: Metadata = {
	title: "Gizlilik Politikası | KetaLearn",
	description: "KetaLearn kişisel verilerinizi hangi amaçlarla toplar, nasıl işler ve korur.",
	alternates: { canonical: canonicalUrl("/gizlilik-politikasi") },
};

export default function GizlilikPolitikasiLayout({ children }: { children: React.ReactNode }) {
	return children;
}
