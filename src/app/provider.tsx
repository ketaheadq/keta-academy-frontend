"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { toast } from "sonner";
import MotionProvider from "@/components/motion/motion-provider";
import { CourseProgressProvider } from "@/components/shared/course-progress-provider";
import { PageLoadingSkeleton } from "@/components/shared/loading-skeletons";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import errors from "../lib/error-messages";

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
	// Outside the Suspense boundary so the fallback below — which animates too —
	// is already inside LazyMotion when it mounts.
	return (
		<ThemeProvider>
			<MotionProvider>
				<Suspense fallback={<PageLoadingSkeleton />}>
					<ProvidersContent>{children}</ProvidersContent>
				</Suspense>
			</MotionProvider>
		</ThemeProvider>
	);
}
