"use client";

import { AlertTriangle, Home, RotateCw } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

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
		<div className="flex min-h-[80vh] items-center justify-center p-4">
			<Card className="w-full max-w-md border-destructive/20 shadow-destructive/5 shadow-lg">
				<CardHeader className="text-center">
					<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
						<AlertTriangle className="h-8 w-8 text-destructive" />
					</div>
					<CardTitle className="font-bold text-2xl text-foreground tracking-tight">
						Bir şeyler yanlış gitti!
					</CardTitle>
				</CardHeader>
				<CardContent className="text-center text-muted-foreground">
					<p>
						Beklenmedik bir hata oluştu. Sorunu çözmek için çalışıyoruz. Lütfen sayfayı yenilemeyi
						veya ana sayfaya dönmeyi deneyin.
					</p>
					{process.env.NODE_ENV === "development" && (
						<div className="mt-4 rounded-md bg-muted p-4 text-left font-mono text-destructive text-xs">
							{error.message || "Bilinmeyen hata"}
						</div>
					)}
				</CardContent>
				<CardFooter className="flex flex-col gap-3 sm:flex-row sm:justify-center">
					<Button onClick={() => reset()} className="w-full gap-2 sm:w-auto" variant="default">
						<RotateCw className="h-4 w-4" />
						Tekrar Dene
					</Button>
					<Button asChild variant="outline" className="w-full gap-2 sm:w-auto">
						<Link href="/">
							<Home className="h-4 w-4" />
							Ana Sayfa
						</Link>
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
