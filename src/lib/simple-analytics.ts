// lib/simple-analytics.ts

/**
 * Scale 404 tracking using Google Analytics 4
 * No security concerns, handled by Google's infrastructure
 */

type WindowWithAnalytics = Window & {
	gtag?: (command: string, action: string, params?: Record<string, unknown>) => void;
	dataLayer?: Array<Record<string, unknown>>;
};

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

	const win = globalThis.window as WindowWithAnalytics;

	// Check if gtag is available
	if (typeof win.gtag !== "function") {
		console.warn("Google Analytics not loaded");
		return;
	}

	// Send 404 event to GA4
	win.gtag("event", "page_not_found", {
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

	const win = globalThis.window as WindowWithAnalytics;

	// Push to dataLayer for GTM
	win.dataLayer = win.dataLayer ?? [];
	win.dataLayer.push({
		event: "404_error",
		error_type: "404",
		content_type: data.contentType,
		requested_slug: data.requestedSlug,
		parent_slug: data.parentSlug || "",
		page_location: globalThis.window.location.href,
	});

	console.log("📊 404 tracked to Google Tag Manager");
}
