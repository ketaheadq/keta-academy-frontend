export default function Loading() {
	return (
		<div className="flex min-h-screen items-center justify-center bg-background">
			<div className="text-center">
				{/* Simple spinner using tw-animate-css */}
				<div className="mb-6">
					<div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
				</div>

				{/* Text with fade in animation */}
				<div className="animate-fadeIn space-y-2">
					<h2 className="font-medium text-gray-800 text-lg">Yükleniyor</h2>
					<p className="text-gray-600 text-sm">Lütfen bekleyin...</p>
				</div>
			</div>
		</div>
	);
}
