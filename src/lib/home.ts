import type { Slide } from "@/components/features/home/home-slider";
import { fetchStrapiData } from "@/lib/strapi";

type StrapiSlide = {
	id: number;
	baslik: string;
	altMetin: string | null;
	butonYazisi: string | null;
	link: string | null;
	gorsel: { url: string } | null;
};

/** The current hero, used when no slide is set up in the panel yet. */
export const DEFAULT_SLIDES: Slide[] = [
	{
		id: "dersler",
		baslik: "Ücretsiz derslerle kendi hızında öğren.",
		altMetin: "Ders videolarını izle, ilerlemeni takip et ve öğrendiklerini quizlerle pekiştir.",
		butonYazisi: "Dersleri keşfet",
		link: "/kurslar",
	},
	{
		id: "deneme",
		baslik: "Ücretsiz deneme çöz, eksiklerini gör.",
		altMetin: "Kayıt olmadan çöz, netini hemen öğren, soru soru PDF analizini al.",
		butonYazisi: "Ücretsiz deneme çöz",
		link: "/deneme-sinavlari",
	},
];

export async function getHomeSlides(): Promise<Slide[]> {
	try {
		const response = await fetchStrapiData<{ data: StrapiSlide[] }>(
			"anasayfa-slaytlari?filters[aktif][$eq]=true&sort[0]=sira:asc&populate[gorsel][fields][0]=url&pagination[pageSize]=10",
			{ revalidate: 300 },
		);
		const slides = (response.data ?? []).map((s) => ({
			id: s.id,
			baslik: s.baslik,
			altMetin: s.altMetin,
			butonYazisi: s.butonYazisi,
			link: s.link,
			gorselUrl: s.gorsel?.url
				? s.gorsel.url.startsWith("/")
					? `${process.env.NEXT_PUBLIC_STRAPI_URL ?? ""}${s.gorsel.url}`
					: s.gorsel.url
				: null,
		}));
		return slides.length ? slides : DEFAULT_SLIDES;
	} catch {
		return DEFAULT_SLIDES;
	}
}
