"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth-store";

export function useAuthInit() {
	const { refreshUser, jwt, isAuthenticated } = useAuthStore();

	useEffect(() => {
		// Only refresh if we have a JWT but no user data, or on app startup
		if (jwt && !isAuthenticated) {
			refreshUser();
		}
	}, [jwt, isAuthenticated, refreshUser]);

	return {
		isInitialized: true, // Since we're using persisted state, we're always initialized
	};
}
