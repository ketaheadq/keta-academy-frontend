"use client";

import { AlertCircle, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function CoursesError() {
	const router = useRouter();

	return (
		<section className="relative py-12 md:py-24">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<div className="mx-auto max-w-2xl text-center">
					<Card className="border-gray-200 bg-white p-8">
						<div className="mb-6 flex justify-center">
							<div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
								<AlertCircle className="h-8 w-8 text-red-600" />
							</div>
						</div>

						<h2 className="mb-4 font-bold text-2xl text-gray-900">Dersler Yüklenemedi</h2>

						<p className="mb-6 text-gray-600 leading-relaxed">
							Derslerimizi yüklerken bir sorun oluştu. Lütfen sayfayı yenileyin veya daha sonra
							tekrar deneyin.
						</p>

						<Button
							onClick={() => router.refresh()}
							className="bg-blue-600 text-white transition-colors duration-200 hover:bg-blue-700"
						>
							<RefreshCw className="mr-2 h-4 w-4" />
							Sayfayı Yenile
						</Button>
					</Card>
				</div>
			</div>
		</section>
	);
}
