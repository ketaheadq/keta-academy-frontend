"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { Toaster, toast } from "sonner";
import errors from "../lib/errors";

export function Providers({ children }: { children: React.ReactNode }) {
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
		// TODO check if we need toast here
	}, [searchParams]);

	return (
		<>
			<Toaster position="top-right" richColors />
			{children}
		</>
	);
}
