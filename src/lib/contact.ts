/**
 * Turns a phone number as typed in Strapi ("0555 123 45 67", "+90 555…", "555-123-45-67")
 * into international digits ("905551234567"). Returns null when it isn't a usable number.
 */
export function toInternationalDigits(phone?: string | null): string | null {
	let digits = (phone ?? "").replace(/\D/g, "");
	if (!digits) return null;
	if (digits.startsWith("00")) digits = digits.slice(2);
	// Turkish numbers written nationally: 0 5xx… or 5xx…
	if (digits.length === 11 && digits.startsWith("0")) digits = `90${digits.slice(1)}`;
	if (digits.length === 10 && digits.startsWith("5")) digits = `90${digits}`;
	return digits.length >= 10 ? digits : null;
}

export function whatsappUrl(phone: string | null | undefined, message: string): string | null {
	const digits = toInternationalDigits(phone);
	return digits ? `https://wa.me/${digits}?text=${encodeURIComponent(message)}` : null;
}

export function telUrl(phone?: string | null): string | null {
	const digits = toInternationalDigits(phone);
	return digits ? `tel:+${digits}` : null;
}

/** Pre-filled first WhatsApp message to a tutor. */
export function tutorWhatsappMessage(tutorName: string) {
	return `Merhaba ${tutorName}, KetaLearn üzerinden ulaşıyorum. Ücretsiz deneme dersi hakkında bilgi almak istiyorum.`;
}

/** GA4 "generate_lead" event for contact clicks; no-op when Analytics isn't loaded. */
export function trackTutorContact(method: "whatsapp" | "phone", tutorName: string) {
	const gtag = (globalThis.window as { gtag?: (...args: unknown[]) => void } | undefined)?.gtag;
	if (typeof gtag === "function") {
		gtag("event", "generate_lead", { method, tutor: tutorName });
	}
}
