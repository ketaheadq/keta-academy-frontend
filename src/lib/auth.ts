// Strapi authentication utilities

function isValidStrapiUser(obj: any): obj is StrapiUser {
	return (
		typeof obj === "object" &&
		obj !== null &&
		typeof obj.id === "number" &&
		typeof obj.username === "string" &&
		typeof obj.email === "string" &&
		typeof obj.confirmed === "boolean"
		// Add other key checks if needed
	);
}

export interface StrapiUser {
	id: number;
	documentId: string;
	username: string;
	email: string;
	provider: string;
	confirmed: boolean;
	blocked: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface StrapiAuthResponse {
	jwt: string;
	user: StrapiUser;
}

export interface AuthError {
	error: {
		status: number;
		name: string;
		message: string;
		details?: any;
	};
}

// Get Google OAuth URL from your custom implementation
export function getGoogleAuthUrl(): string {
	const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL;

	if (!strapiUrl) {
		throw new Error("NEXT_PUBLIC_STRAPI_URL environment variable is required");
	}

	// Debug: Log the URL being used
	console.log("🔍 Strapi URL:", strapiUrl);
	console.log("🔍 Custom Google OAuth URL:", `${strapiUrl}/api/auth/google`);

	// Your custom Google OAuth endpoint
	return `${strapiUrl}/api/auth/google`;
}

// Debug function to help identify the redirect URI issue
export function debugGoogleOAuthConfig() {
	const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL;

	if (!strapiUrl) {
		throw new Error("NEXT_PUBLIC_STRAPI_URL environment variable is required");
	}

	const expectedRedirectUri = `${strapiUrl}/api/auth/google/callback`;

	console.log("🔍 Expected Google redirect URI should be:", expectedRedirectUri);
	console.log("🔍 Make sure this EXACT URL is in your Google Cloud Console");
	console.log("🔍 Using custom Google OAuth implementation");

	return {
		strapiUrl,
		expectedRedirectUri,
		googleOAuthUrl: `${strapiUrl}/api/auth/google`,
	};
}

// Handle auth result when user is redirected back from your custom implementation
export async function handleAuthRedirect(
	searchParams: URLSearchParams,
): Promise<StrapiAuthResponse | AuthError> {
	try {
		// Debug: Log all parameters received
		console.log("🔍 Auth redirect parameters:", Object.fromEntries(searchParams.entries()));

		// Your custom implementation sends these parameters
		const token = searchParams.get("token");
		const userParam = searchParams.get("user");
		const success = searchParams.get("success");
		const error = searchParams.get("error");
		const message = searchParams.get("message");

		if (error || success === "false") {
			console.error("❌ OAuth error from URL:", error, message);
			return {
				error: {
					status: 400,
					name: "OAuthError",
					message: message || error || "OAuth authentication failed",
				},
			};
		}

		if (!token || success !== "true") {
			console.error("❌ No JWT token found in callback URL or success !== true");
			return {
				error: {
					status: 400,
					name: "AuthError",
					message: "No authentication token received or authentication was not successful",
				},
			};
		}

		console.log("✅ JWT token received from URL parameters");

		// Parse user data from URL parameter
		let user: StrapiUser | null = null;
		if (userParam) {
			try {
				const parsed = JSON.parse(decodeURIComponent(userParam));
				if (isValidStrapiUser(parsed)) {
					user = parsed;
				} else {
					console.error("❌ Parsed user data does not match StrapiUser structure");
					return {
						error: {
							status: 0,
							name: "",
							message: "",
						},
					};
				}
				console.log("✅ User data parsed from URL parameter:", user);
			} catch (parseError) {
				console.error("❌ Failed to parse user data from URL:", parseError);
				return {
					error: {
						status: 400,
						name: "ParseError",
						message: "Failed to parse user data from callback URL",
					},
				};
			}
		}

		// If user data is not in URL, fetch it using the token
		if (!user) {
			console.log("🔍 User data not in URL, fetching from API...");
			const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL;

			if (!strapiUrl) {
				return {
					error: {
						status: 500,
						name: "ConfigError",
						message: "NEXT_PUBLIC_STRAPI_URL environment variable is not set",
					},
				};
			}

			const response = await fetch(`${strapiUrl}/api/users/me`, {
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			});

			if (!response.ok) {
				const errorData = await response.json();
				console.error("❌ Failed to get user info:", errorData);
				return {
					error: {
						status: response.status,
						name: "AuthError",
						message: "Failed to get user info",
						details: errorData,
					},
				};
			}

			user = await response.json();
			console.log("✅ User info fetched from API:", user);
		}

		if (!user) {
			return {
				error: {
					status: 400,
					name: "AuthError",
					message: "User information could not be retrieved",
				},
			};
		}

		return {
			jwt: token,
			user,
		};
	} catch (error) {
		console.error("❌ Auth redirect error:", error);
		return {
			error: {
				status: 500,
				name: "NetworkError",
				message: "Network error during authentication",
			},
		};
	}
}

// Keep the old function for backward compatibility, but use the new one
export async function handleStrapiAuthCallback(
	jwt: string,
): Promise<StrapiAuthResponse | AuthError> {
	try {
		const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL;

		if (!strapiUrl) {
			return {
				error: {
					status: 500,
					name: "ConfigError",
					message: "NEXT_PUBLIC_STRAPI_URL environment variable is not set",
				},
			};
		}

		// Get user info with the JWT token
		const response = await fetch(`${strapiUrl}/api/users/me`, {
			headers: {
				Authorization: `Bearer ${jwt}`,
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			const errorData = await response.json();
			return {
				error: {
					status: response.status,
					name: "AuthError",
					message: "Failed to get user info",
					details: errorData,
				},
			};
		}

		const user = await response.json();

		return {
			jwt,
			user,
		};
	} catch (error) {
		console.error("Strapi auth callback error:", error);
		return {
			error: {
				status: 500,
				name: "NetworkError",
				message: "Network error during authentication",
			},
		};
	}
}

// Get current user from Strapi with JWT
export async function getCurrentUser(jwt: string): Promise<StrapiUser | null> {
	try {
		const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL;

		if (!strapiUrl) {
			console.error("NEXT_PUBLIC_STRAPI_URL environment variable is not set");
			return null;
		}

		const response = await fetch(`${strapiUrl}/api/users/me`, {
			headers: {
				Authorization: `Bearer ${jwt}`,
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			return null;
		}

		return await response.json();
	} catch (error) {
		console.error("Error fetching current user:", error);
		return null;
	}
}

// Convert Strapi user to your app's user format
export function convertStrapiUser(strapiUser: StrapiUser): {
	id: string;
	email: string;
	name: string;
	picture?: string;
	verified: boolean;
} {
	return {
		email: strapiUser.email,
		name: strapiUser.username,
		verified: strapiUser.confirmed,
		id: strapiUser.id.toString(),
		// Your custom implementation might include profile picture from Google
		picture: undefined,
	};
}
