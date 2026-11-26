"use client";

import { AlertTriangle, Home, RotateCw } from "lucide-react";
import { m } from "motion/react";
import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DURATION, EASE_OUT } from "@/lib/motion";

export default function ErrorPage({
	error,
	reset,
}: Readonly<{
	error: Error & { digest?: string };
	reset: () => void;
}>) {
	useEffect(() => {
		// Log the error to an error reporting service
		console.error(error);
	}, [error]);

	return (
		<m.div
			className="flex min-h-[80vh] items-center justify-center p-4"
			initial={{ opacity: 0, y: 16 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: DURATION.slow, ease: EASE_OUT }}
		>
			<Card className="border-destructive/20 shadow-destructive/5 w-full max-w-md shadow-lg">
				<CardHeader className="text-center">
					<m.div
						className="bg-destructive/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
						initial={{ scale: 0.7, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						transition={{ type: "spring", stiffness: 380, damping: 18, delay: 0.1 }}
					>
						<AlertTriangle className="text-destructive h-8 w-8" />
					</m.div>
					<CardTitle className="text-foreground text-2xl font-bold tracking-tight">
						Bir şeyler yanlış gitti!
					</CardTitle>
				</CardHeader>
				<CardContent className="text-muted-foreground text-center">
					<p>
						Beklenmedik bir hata oluştu. Sorunu çözmek için çalışıyoruz. Lütfen sayfayı yenilemeyi
						veya ana sayfaya dönmeyi deneyin.
					</p>
					{process.env.NODE_ENV === "development" && (
						<div className="bg-muted text-destructive mt-4 rounded-md p-4 text-left font-mono text-xs">
							{error.message || "Bilinmeyen hata"}
						</div>
					)}
				</CardContent>
				<CardFooter className="flex flex-col gap-3 sm:flex-row sm:justify-center">
					<Button
						onClick={() => reset()}
						className="group w-full gap-2 transition-transform duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 sm:w-auto"
						variant="default"
					>
						<RotateCw className="h-4 w-4 transition-transform duration-500 ease-out group-hover:rotate-180" />
						Tekrar Dene
					</Button>
					<Button
						asChild
						variant="outline"
						className="w-full gap-2 transition-transform duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 sm:w-auto"
					>
						<Link href="/">
							<Home className="h-4 w-4" />
							Ana Sayfa
						</Link>
					</Button>
				</CardFooter>
			</Card>
		</m.div>
	);
}
