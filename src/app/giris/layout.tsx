import type { Metadata } from "next";
import { canonicalUrl } from "@/lib/seo";

export const metadata: Metadata = {
	title: "Giriş Yap | KetaLearn",
	description:
		"KetaLearn hesabına giriş yap, derslerine ve deneme sınavlarına kaldığın yerden devam et.",
	alternates: { canonical: canonicalUrl("/giris") },
};

export default function GirisLayout({ children }: { children: React.ReactNode }) {
	return children;
}
