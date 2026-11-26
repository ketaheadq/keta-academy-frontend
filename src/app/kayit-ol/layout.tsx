import type { Metadata } from "next";
import { canonicalUrl } from "@/lib/seo";

export const metadata: Metadata = {
	title: "Kayıt Ol | KetaLearn",
	description:
		"Ücretsiz kayıt ol, ders videolarını izle, deneme sınavı çöz ve ilerlemeni takip et.",
	alternates: { canonical: canonicalUrl("/kayit-ol") },
};

export default function KayitOlLayout({ children }: { children: React.ReactNode }) {
	return children;
}
