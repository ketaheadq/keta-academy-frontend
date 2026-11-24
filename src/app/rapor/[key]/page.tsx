import type { Metadata } from "next";
import { RaporView } from "@/components/features/deneme/rapor-view";

// Personal report behind an unguessable link: never indexed.
export const metadata: Metadata = {
	title: "Deneme raporu | KetaLearn",
	robots: { index: false, follow: false },
};

type PageProps = Readonly<{
	params: Promise<{ key: string }>;
	searchParams: Promise<{ onizleme?: string }>;
}>;

export default async function RaporPage({ params, searchParams }: PageProps) {
	const [{ key }, { onizleme }] = await Promise.all([params, searchParams]);
	return (
		<div className="min-h-screen bg-secondary">
			<div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
				<RaporView raporKey={key} onizleme={onizleme === "1"} />
			</div>
		</div>
	);
}
