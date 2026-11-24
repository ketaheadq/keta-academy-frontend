export default function Loading() {
	return (
		<div className="bg-background flex min-h-[80vh] flex-col items-center justify-center px-4">
			<div className="relative">
				{/* Decorative Background Elements */}
				<div className="animate-pulse-gentle bg-primary/20 absolute top-1/2 left-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl" />
				<div className="animate-float bg-primary/20 absolute top-1/2 left-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full blur-xl" />

				<div className="relative text-center">
					{/* Modern Spinner */}
					<div className="mb-8 flex justify-center">
						<div className="relative h-16 w-16">
							<div className="border-primary absolute inset-0 animate-spin rounded-full border-4 border-t-blue-600 shadow-sm" />
							<div
								className="border-primary absolute inset-2 animate-spin rounded-full border-4 border-b-indigo-500 shadow-sm"
								style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
							/>
						</div>
					</div>

					{/* Loading Text */}
					<div className="animate-fadeIn space-y-3">
						<h2 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">
							KetaLearn <span className="text-primary">Hazırlanıyor</span>
						</h2>
						<p className="text-muted-foreground text-lg">
							En iyi öğrenme deneyimi için her şey düzenleniyor...
						</p>
					</div>

					{/* Progress Indicator (Fake) */}
					<div className="bg-secondary mx-auto mt-8 h-1 w-48 overflow-hidden rounded-full">
						<div className="from-primary to-primary h-full w-full origin-left animate-[loading-bar_2s_ease-in-out_infinite] bg-linear-to-r" />
					</div>
				</div>
			</div>
		</div>
	);
}
