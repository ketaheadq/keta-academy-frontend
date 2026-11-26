import type { Metadata } from "next";
import { canonicalUrl } from "@/lib/seo";

export const metadata: Metadata = {
	title: "Hizmet Şartları | KetaLearn",
	description: "KetaLearn platformunu kullanırken geçerli olan koşullar ve yükümlülükler.",
	alternates: { canonical: canonicalUrl("/hizmet-sartlari") },
};

export default function HizmetSartlariLayout({ children }: { children: React.ReactNode }) {
	return children;
}
