"use client";

/**
 * Traffic source and GA4 events for the mock exam funnel.
 * Every event carries the exam name and the source (Instagram, ads, Google…), per the plan's
 * "Ölçüm" table.
 */

const SOURCE_KEY = "keta-deneme-kaynak";
const SESSION_KEY = "keta-deneme-oturum";

type Source = { kaynak: string; utm: Record<string, string> | null };

/** First landing of the visit wins: UTM parameters, else the referring site, else "dogrudan". */
export function getTrafficSource(): Source {
	if (typeof window === "undefined") return { kaynak: "dogrudan", utm: null };
	const stored = sessionStorage.getItem(SOURCE_KEY);
	if (stored) {
		try {
			return JSON.parse(stored) as Source;
		} catch {
			// fall through and recompute
		}
	}
	const params = new URLSearchParams(window.location.search);
	const utm: Record<string, string> = {};
	for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"]) {
		const value = params.get(key);
		if (value) utm[key] = value.slice(0, 100);
	}
	let kaynak = utm.utm_source ?? "";
	if (!kaynak && document.referrer) {
		try {
			const host = new URL(document.referrer).hostname.replace(/^www\./, "");
			if (host !== window.location.hostname) kaynak = host;
		} catch {
			// invalid referrer
		}
	}
	const source: Source = {
		kaynak: kaynak || "dogrudan",
		utm: Object.keys(utm).length ? utm : null,
	};
	sessionStorage.setItem(SOURCE_KEY, JSON.stringify(source));
	return source;
}

/** Anonymous id for this browser tab's visit; no sign-up needed. */
export function getSessionId(): string {
	let id = sessionStorage.getItem(SESSION_KEY);
	if (!id) {
		id = crypto.randomUUID();
		sessionStorage.setItem(SESSION_KEY, id);
	}
	return id;
}

export type DenemeEvent =
	| "deneme_sayfasi_goruntuleme"
	| "deneme_baslat"
	| "deneme_bitir"
	| "rapor_talebi"
	| "rapor_acildi"
	| "rapor_video_tiklama"
	| "gorusme_tiklama";

export function trackDeneme(
	event: DenemeEvent,
	deneme: string,
	extra: Record<string, unknown> = {},
) {
	const gtag = (window as { gtag?: (...args: unknown[]) => void }).gtag;
	if (typeof gtag !== "function") return;
	gtag("event", event, { deneme, kaynak: getTrafficSource().kaynak, ...extra });
}
