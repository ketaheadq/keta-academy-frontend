import Link from "next/link";
import BackButton from "@/components/ui/back-button";
import Client404Tracker from "@/components/ui/client-404-tracker";

export default function NotFound() {
	return (
		<>
			{/* Track 404 to Google Analytics */}
			<Client404Tracker contentType="General" requestedSlug="unknown" />

			<div className="flex min-h-[calc(100vh-6rem)] items-center justify-center px-4 sm:px-6 lg:px-8">
				<div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-xl sm:p-10">
					<div className="text-center">
						<div className="flex justify-center">
							<span className="from-destructive to-accent bg-linear-to-r bg-clip-text text-9xl font-extrabold text-transparent">
								404
							</span>
						</div>

						<h1 className="text-foreground mt-6 text-3xl font-bold sm:text-4xl">
							Sayfa Bulunamadı
						</h1>

						<p className="text-muted-foreground mt-4 text-lg">
							Üzgünüz, aradığınız sayfayı bulamadık.
						</p>

						<div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
							<Link
								href="/"
								className="bg-primary text-background hover:bg-primary focus:ring-primary w-full rounded-md border border-transparent px-6 py-3 text-center text-base font-medium transition-colors duration-200 focus:ring-2 focus:ring-offset-2 focus:outline-none sm:w-auto"
							>
								Ana Sayfaya Git
							</Link>

							<BackButton className="border-border text-muted-foreground hover:bg-secondary focus:ring-primary w-full rounded-md border bg-white px-6 py-3 text-base font-medium transition-colors duration-200 focus:ring-2 focus:ring-offset-2 focus:outline-none sm:w-auto">
								Geri Git
							</BackButton>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
