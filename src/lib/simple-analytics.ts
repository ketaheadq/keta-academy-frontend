// lib/simple-analytics.ts

/**
 * Scale 404 tracking using Google Analytics 4
 * No security concerns, handled by Google's infrastructure
 */

/**
 * Track 404 events to Google Analytics
 */
export function track404ToGA(data: {
	contentType: string;
	requestedSlug: string;
	parentSlug?: string;
}) {
	// Only run on client side
	if (globalThis.window === undefined) return;

	// Check if gtag is available
	if (typeof (globalThis.window as any).gtag !== "function") {
		console.warn("Google Analytics not loaded");
		return;
	}

	// Send 404 event to GA4
	(globalThis.window as any).gtag("event", "page_not_found", {
		event_category: "Error",
		event_label: `${data.contentType}: ${data.requestedSlug}`,
		custom_parameters: {
			content_type: data.contentType,
			requested_slug: data.requestedSlug,
			parent_slug: data.parentSlug || "",
			page_location: globalThis.window.location.href,
		},
	});

	console.log("📊 404 tracked to Google Analytics");
}

/**
 * Alternative: Track to Google Tag Manager
 */
export function track404ToGTM(data: {
	contentType: string;
	requestedSlug: string;
	parentSlug?: string;
}) {
	if (globalThis.window === undefined) return;

	// Push to dataLayer for GTM
	(globalThis.window as any).dataLayer = (globalThis.window as any).dataLayer || [];
	(globalThis.window as any).dataLayer.push({
		event: "404_error",
		error_type: "404",
		content_type: data.contentType,
		requested_slug: data.requestedSlug,
		parent_slug: data.parentSlug || "",
		page_location: globalThis.window.location.href,
	});

	console.log("📊 404 tracked to Google Tag Manager");
}
