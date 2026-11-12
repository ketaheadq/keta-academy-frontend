"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { Toaster, toast } from "sonner";
import { CourseProgressProvider } from "@/components/shared/course-progress-provider";
import errors from "../lib/error-messages";
import Loading from "./loading";

function ProvidersContent({ children }: Readonly<{ children: React.ReactNode }>) {
	const searchParams = useSearchParams();

	useEffect(() => {
		const errorMessage = searchParams.get("error_message");
		if (errorMessage) {
			toast.error("Hata", {
				description: errorMessage
					? errors[errorMessage as keyof typeof errors]
					: "Bilinmeyen bir hata oluştu.",
				position: "bottom-right",
				duration: 4000,
			});
		}
	}, [searchParams]);

	return (
		<>
			<Toaster position="top-right" richColors />
			<CourseProgressProvider>{children}</CourseProgressProvider>
		</>
	);
}

export function Providers({ children }: Readonly<{ children: React.ReactNode }>) {
	return (
		<Suspense fallback={<Loading />}>
			<ProvidersContent>{children}</ProvidersContent>
		</Suspense>
	);
}
