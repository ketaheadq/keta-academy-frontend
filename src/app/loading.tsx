export default function Loading() {
	return (
		<div className="flex min-h-screen items-center justify-center bg-background">
			<div className="text-center">
				<div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-primary border-b-2" />
				<p className="text-text">Loading...</p>
			</div>
		</div>
	);
}
