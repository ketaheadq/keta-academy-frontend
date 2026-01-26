import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
	convertStrapiUser,
	getCurrentUser,
	getGoogleAuthUrl,
	handleAuthRedirect,
	handleStrapiAuthCallback,
} from "@/lib/auth";

interface User {
	id: string;
	email: string;
	name: string;
	picture?: string;
	verified: boolean;
}

interface AuthState {
	user: User | null;
	jwt: string | null;
	isLoading: boolean;
	isAuthenticated: boolean;
	error: string | null;
}

interface AuthActions {
	signInWithGoogle: () => Promise<void>;
	signOut: () => Promise<void>;
	clearError: () => void;
	setLoading: (loading: boolean) => void;
	handleAuthRedirect: (searchParams: URLSearchParams) => Promise<void>;
	refreshUser: () => Promise<void>;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
	persist(
		(set, get) => ({
			// State
			user: null,
			jwt: null,
			isLoading: false,
			isAuthenticated: false,
			error: null,

			// Actions
			signInWithGoogle: async () => {
				try {
					set({ isLoading: true, error: null });

					// Redirect to Strapi's Google OAuth endpoint
					const googleAuthUrl = getGoogleAuthUrl();

					globalThis.window.location.href = googleAuthUrl;
				} catch (error) {
					console.error("Failed to initiate Google sign-in:", error);
					set({
						error: "Failed to start Google sign-in. Please try again.",
						isLoading: false,
					});
				}
			},

			handleAuthRedirect: async (searchParams: URLSearchParams) => {
				set({ isLoading: true, error: null });

				try {
					const authResult = await handleAuthRedirect(searchParams);

					if ("error" in authResult) {
						throw new Error(authResult.error.message);
					}

					const convertedUser = convertStrapiUser(authResult.user);

					set({
						user: convertedUser,
						jwt: authResult.jwt,
						isAuthenticated: true,
						isLoading: false,
						error: null,
					});

					// Redirect to dashboard or previous page
					const redirectUrl = sessionStorage.getItem("auth_redirect") || "/";
					sessionStorage.removeItem("auth_redirect");
					globalThis.window.location.href = redirectUrl;
				} catch (error) {
					console.error("Authentication redirect failed:", error);
					set({
						error:
							error instanceof Error ? error.message : "Authentication failed. Please try again.",
						isLoading: false,
					});
				}
			},

			// Keep the old callback method for backward compatibility
			handleAuthCallback: async (jwt: string) => {
				set({ isLoading: true, error: null });

				try {
					const authResult = await handleStrapiAuthCallback(jwt);

					if ("error" in authResult) {
						throw new Error(authResult.error.message);
					}

					const convertedUser = convertStrapiUser(authResult.user);

					set({
						user: convertedUser,
						jwt: authResult.jwt,
						isAuthenticated: true,
						isLoading: false,
						error: null,
					});

					// Redirect to dashboard or previous page
					const redirectUrl = sessionStorage.getItem("auth_redirect") || "/";
					sessionStorage.removeItem("auth_redirect");
					globalThis.window.location.href = redirectUrl;
				} catch (error) {
					console.error("Authentication callback failed:", error);
					set({
						error:
							error instanceof Error ? error.message : "Authentication failed. Please try again.",
						isLoading: false,
					});
				}
			},

			refreshUser: async () => {
				const { jwt } = get();

				if (!jwt) {
					set({ user: null, isAuthenticated: false });
					return;
				}

				try {
					const strapiUser = await getCurrentUser(jwt);

					if (!strapiUser) {
						// JWT is invalid, sign out
						get().signOut();
						return;
					}

					const convertedUser = convertStrapiUser(strapiUser);
					set({ user: convertedUser, isAuthenticated: true });
				} catch (error) {
					console.error("Failed to refresh user:", error);
					// Don't sign out on network errors, just keep current state
				}
			},

			signOut: async () => {
				set({ isLoading: true, error: null });

				try {
					// Clear auth state immediately (Strapi doesn't require server-side logout for JWT)
					set({
						user: null,
						jwt: null,
						isAuthenticated: false,
						isLoading: false,
						error: null,
					});

					// Redirect to home page
					globalThis.window.location.href = "/";
				} catch (error) {
					console.error("Sign-out failed:", error);
					set({
						error: "Failed to sign out. Please try again.",
						isLoading: false,
					});
				}
			},

			clearError: () => set({ error: null }),

			setLoading: (loading: boolean) => set({ isLoading: loading }),
		}),
		{
			name: "auth-storage",
			partialize: (state) => ({
				user: state.user,
				jwt: state.jwt,
				isAuthenticated: state.isAuthenticated,
			}),
		},
	),
);

// Computed selectors (keeping the same interface)
export const useUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useAuthLoading = () => useAuthStore((state) => state.isLoading);
export const useAuthError = () => useAuthStore((state) => state.error);

// Additional selectors for JWT access
export const useJWT = () => useAuthStore((state) => state.jwt);
