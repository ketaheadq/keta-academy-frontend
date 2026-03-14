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
							<span className="bg-linear-to-r from-destructive to-accent bg-clip-text font-extrabold text-9xl text-transparent">
								404
							</span>
						</div>

						<h1 className="mt-6 font-bold text-3xl text-foreground sm:text-4xl">
							Sayfa Bulunamadı
						</h1>

						<p className="mt-4 text-lg text-muted-foreground">
							Üzgünüz, aradığınız sayfayı bulamadık.
						</p>

						<div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
							<Link
								href="/"
								className="w-full rounded-md border border-transparent bg-primary px-6 py-3 text-center font-medium text-background text-base transition-colors duration-200 hover:bg-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 sm:w-auto"
							>
								Ana Sayfaya Git
							</Link>

							<BackButton className="w-full rounded-md border border-border bg-white px-6 py-3 font-medium text-base text-muted-foreground transition-colors duration-200 hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 sm:w-auto">
								Geri Git
							</BackButton>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
