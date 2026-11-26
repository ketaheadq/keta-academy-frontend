/**
 * Report links the visitor received on this device, so the home page and the exam page can
 * show them again after the result screen is closed. Kept in localStorage only: no account
 * needed, nothing sent anywhere. Reports are deleted on the server after a year, so older
 * entries are dropped too.
 */

export type SavedReport = {
	raporKey: string;
	denemeSlug: string;
	denemeBaslik: string;
	net: number;
	soruSayisi: number;
	/** ISO date the report was requested. */
	tarih: string;
};

const STORAGE_KEY = "keta_deneme_raporlari";
const CHANGE_EVENT = "keta-deneme-raporlari";
const MAX_REPORTS = 10;
const MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000;

function read(): SavedReport[] {
	try {
		const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
		if (!Array.isArray(parsed)) return [];
		const oldest = Date.now() - MAX_AGE_MS;
		return parsed.filter(
			(r): r is SavedReport =>
				typeof r?.raporKey === "string" &&
				typeof r?.denemeBaslik === "string" &&
				Date.parse(r?.tarih) > oldest,
		);
	} catch {
		return [];
	}
}

function write(reports: SavedReport[]) {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(reports.slice(0, MAX_REPORTS)));
		window.dispatchEvent(new Event(CHANGE_EVENT));
	} catch {
		// Private mode or storage full: the report link is still on the result screen.
	}
}

/** Newest first. */
export function getSavedReports(): SavedReport[] {
	return read().sort((a, b) => Date.parse(b.tarih) - Date.parse(a.tarih));
}

export function saveReport(report: Omit<SavedReport, "tarih">) {
	const rest = read().filter((r) => r.raporKey !== report.raporKey);
	write([{ ...report, tarih: new Date().toISOString() }, ...rest]);
}

export function removeReport(raporKey: string) {
	write(read().filter((r) => r.raporKey !== raporKey));
}

/** Calls `listener` when the saved reports change (in this tab or another one). */
export function onSavedReportsChange(listener: () => void) {
	const onStorage = (event: StorageEvent) => {
		if (event.key === STORAGE_KEY) listener();
	};
	window.addEventListener(CHANGE_EVENT, listener);
	window.addEventListener("storage", onStorage);
	return () => {
		window.removeEventListener(CHANGE_EVENT, listener);
		window.removeEventListener("storage", onStorage);
	};
}
