import type { StrapiBlock } from "@/lib/strapi";
import { fetchStrapiData } from "@/lib/strapi";

/** Free mock exams ("deneme sınavları"): types and API calls. */

const STRAPI_URL =
	(typeof window === "undefined" ? process.env.STRAPI_INTERNAL_URL : undefined) ||
	process.env.NEXT_PUBLIC_STRAPI_URL;

export type Media = { url: string; alt: string; width?: number; height?: number } | null;

export type DenemeSummary = {
	documentId: string;
	baslik: string;
	slug: string;
	aciklama: string;
	sinavTuru: "LGS" | "TYT" | "AYT" | "Okul";
	sinif: { title: string; slug: string } | null;
	ders: { title: string; slug: string } | null;
	konular: { ad: string; slug: string }[];
	sureDakika: number;
	soruSayisi: number;
	oneCikan: boolean;
	cozenSayisi: number | null;
	SEO: {
		metaTitle: string;
		metaDescription: string;
		keywords: string | null;
		metaImage: Media;
	} | null;
	publishedAt: string;
};

export type Soru = {
	no: number;
	metin: StrapiBlock[];
	gorsel: Media;
	secenekler: { harf: string; metin: string; gorsel: Media }[];
};

export type DenemeDetail = DenemeSummary & { sorular: Soru[] };

export type SonucOzeti = {
	sonucAnahtari: string;
	dogru: number;
	yanlis: number;
	bos: number;
	net: number;
	soruSayisi: number;
	konular: string[];
};

export type Yakinlik = "Veli" | "Ogrenci" | "Diger";

/** What the parent-number page needs; the report itself is a PDF (`/rapor/<key>`). */
export type RaporOzeti = {
	hazir: boolean;
	ad: string;
	yakinlik: Yakinlik;
	denemeBaslik: string;
	veliNumarasiIstenir: boolean;
};

export const SINAV_TURU_LABEL: Record<DenemeSummary["sinavTuru"], string> = {
	LGS: "LGS",
	TYT: "TYT",
	AYT: "AYT",
	Okul: "Okul sınavı",
};

/** Server components: exam list (empty when the backend isn't reachable). */
export async function getDenemeler(): Promise<DenemeSummary[]> {
	try {
		const response = await fetchStrapiData<{ data: DenemeSummary[] }>("denemeler", {
			revalidate: 60,
		});
		return response.data ?? [];
	} catch (error) {
		console.error("Error fetching denemeler:", error);
		return [];
	}
}

export async function getDeneme(slug: string): Promise<DenemeDetail | null> {
	try {
		const response = await fetchStrapiData<{ data: DenemeDetail }>(
			`denemeler/${encodeURIComponent(slug)}`,
			{
				revalidate: 60,
				allowForbidden: false,
			},
		);
		return response.data ?? null;
	} catch {
		return null;
	}
}

/** Lesson documentId → an exam covering one of its topics ("mini deneme" link). */
export async function getLessonExams(
	lessonDocumentIds: string[],
): Promise<Record<string, { baslik: string; slug: string }>> {
	if (!lessonDocumentIds.length) return {};
	try {
		const response = await fetchStrapiData<{
			data: Record<string, { baslik: string; slug: string }>;
		}>(`denemeler/ders-eslesme?dersler=${lessonDocumentIds.map(encodeURIComponent).join(",")}`, {
			revalidate: 300,
		});
		return response.data ?? {};
	} catch {
		return {};
	}
}

export class DenemeApiError extends Error {
	constructor(
		message: string,
		readonly status: number,
	) {
		super(message);
	}
}

async function post<T>(path: string, body: unknown): Promise<T> {
	const response = await fetch(`${STRAPI_URL}/api/${path}`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(body),
	});
	const json = await response.json().catch(() => null);
	if (!response.ok) {
		throw new DenemeApiError(
			json?.error?.message || "Bir sorun oluştu, lütfen tekrar deneyin.",
			response.status,
		);
	}
	return json.data as T;
}

export function submitDeneme(
	slug: string,
	body: {
		cevaplar: Record<number, string | null>;
		oturumId: string;
		sureSaniye: number;
		kaynak: string;
		utm: Record<string, string> | null;
	},
) {
	return post<SonucOzeti>(`denemeler/${encodeURIComponent(slug)}/sonuc`, body);
}

export type RaporTalebiInput = {
	adSoyad: string;
	telefon: string;
	yakinlik: Yakinlik;
	raporIzni: boolean;
	aramaIzni: boolean;
	kaynak: string;
};

export function requestReport(sonucAnahtari: string, input: RaporTalebiInput) {
	return post<{ telefon: string; raporAnahtari: string }>("denemeler/rapor-talebi", {
		sonucAnahtari,
		...input,
	});
}

export function addParentNumber(raporAnahtari: string, input: Omit<RaporTalebiInput, "yakinlik">) {
	return post<{ telefon: string }>(`raporlar/${encodeURIComponent(raporAnahtari)}/veli`, input);
}

export async function getRaporOzeti(key: string): Promise<RaporOzeti | null> {
	const response = await fetch(`${STRAPI_URL}/api/raporlar/${encodeURIComponent(key)}`, {
		cache: "no-store",
	});
	if (response.status === 404) return null;
	if (!response.ok) throw new Error(`Rapor yüklenemedi (${response.status})`);
	return (await response.json()).data;
}
