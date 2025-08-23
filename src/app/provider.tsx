"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { Toaster, toast } from "sonner";
import errors from "../lib/errors";

function ProvidersContent({ children }: { children: React.ReactNode }) {
	const searchParams = useSearchParams();

	useEffect(() => {
		const errorMessage = searchParams.get("error_message");
		if (errorMessage) {
			toast.error("Hata", {
				description: errors[errorMessage] || "Bilinmeyen bir hata oluştu.",
				position: "bottom-right",
				duration: 4000,
			});
		}
	}, [searchParams]);

	return (
		<>
			<Toaster position="top-right" richColors />
			{children}
		</>
	);
}

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<ProvidersContent>{children}</ProvidersContent>
		</Suspense>
	);
}
