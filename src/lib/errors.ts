/**
 * Wrapper function that handles notFound() errors properly by re-throwing them
 * while catching and handling other types of errors with a fallback component
 */
export async function withNotFoundHandler<T>(
	asyncFunction: () => Promise<T>,
	fallbackComponent: React.ReactNode,
	trackingData?: {
		contentType: string;
		requestedSlug: string;
		parentSlug?: string;
	},
): Promise<T | React.ReactNode> {
	try {
		return await asyncFunction();
	} catch (error) {
		// Re-throw notFound() errors to let Next.js handle them
		if (
			error &&
			typeof error === "object" &&
			"digest" in error &&
			(error as any).digest?.includes("404")
		) {
			// Just log for server-side, client-side tracking will be handled by the 404 page
			if (trackingData) {
				console.warn(`🔍 404 Event: ${trackingData.contentType} - ${trackingData.requestedSlug}`);
			}

			throw error;
		}

		// Log other errors and return fallback component
		console.error("Error in withNotFoundHandler:", error);
		return fallbackComponent;
	}
}

/**
 * Synchronous version for non-async operations
 */
export function withNotFoundHandlerSync<T>(
	syncFunction: () => T,
	fallbackComponent: React.ReactNode,
): T | React.ReactNode {
	try {
		return syncFunction();
	} catch (error) {
		// Re-throw notFound() errors to let Next.js handle them
		if (
			error &&
			typeof error === "object" &&
			"digest" in error &&
			(error as any).digest?.includes("404")
		) {
			throw error;
		}

		// Log other errors and return fallback component
		console.error("Error in withNotFoundHandlerSync:", error);
		return fallbackComponent;
	}
}
