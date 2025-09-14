"use client";

import { useEffect } from "react";
import { track404ToGA } from "@/lib/simple-analytics";

interface Client404TrackerProps {
	contentType: string;
	requestedSlug: string;
	parentSlug?: string;
}

/**
 * Client-side component to track 404s after page load
 * This runs safely in the browser, no server-side security concerns
 */
export default function Client404Tracker({
	contentType,
	requestedSlug,
	parentSlug,
}: Client404TrackerProps) {
	useEffect(() => {
		// Small delay to ensure GA is loaded
		const timer = setTimeout(() => {
			track404ToGA({
				contentType,
				requestedSlug,
				parentSlug,
			});
		}, 1000);

		return () => clearTimeout(timer);
	}, [contentType, requestedSlug, parentSlug]);

	// This component doesn't render anything
	return null;
}
