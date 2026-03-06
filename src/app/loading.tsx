export default function Loading() {
	return (
		<div className="flex min-h-[80vh] flex-col items-center justify-center bg-background px-4">
			<div className="relative">
				{/* Decorative Background Elements */}
				<div className="absolute top-1/2 left-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 animate-pulse-gentle rounded-full bg-primary/20 blur-2xl" />
				<div className="absolute top-1/2 left-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 animate-float rounded-full bg-primary/20 blur-xl" />

				<div className="relative text-center">
					{/* Modern Spinner */}
					<div className="mb-8 flex justify-center">
						<div className="relative h-16 w-16">
							<div className="absolute inset-0 animate-spin rounded-full border-4 border-primary border-t-blue-600 shadow-sm" />
							<div
								className="absolute inset-2 animate-spin rounded-full border-4 border-primary border-b-indigo-500 shadow-sm"
								style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
							/>
						</div>
					</div>

					{/* Loading Text */}
					<div className="animate-fadeIn space-y-3">
						<h2 className="font-bold text-2xl text-foreground tracking-tight sm:text-3xl">
							Keta Akademi <span className="text-primary">Hazırlanıyor</span>
						</h2>
						<p className="text-lg text-muted-foreground">
							En iyi öğrenme deneyimi için her şey düzenleniyor...
						</p>
					</div>

					{/* Progress Indicator (Fake) */}
					<div className="mx-auto mt-8 h-1 w-48 overflow-hidden rounded-full bg-secondary">
						<div className="h-full w-full origin-left animate-[loading-bar_2s_ease-in-out_infinite] bg-linear-to-r from-primary to-primary" />
					</div>
				</div>
			</div>
		</div>
	);
}
