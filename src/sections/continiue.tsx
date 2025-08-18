"use client";

import Link from "next/link";

// Generic interfaces for dynamic continue functionality
interface ContinuableItem {
	id: string | number;
	progress: number;
	[key: string]: any;
}

interface DynamicContinueProps<T extends ContinuableItem> {
	items: T[];
	renderItem: (item: T) => React.ReactNode;
	title?: React.ReactNode;
	maxItems?: number;
	viewAllLink?: {
		href: string;
		label: string;
	};
	className?: string;
	isLoading?: boolean;
}

export default function DynamicContinue<T extends ContinuableItem>({
	items,
	renderItem,
	title = "📈 Kaldığın Yerden Devam Et:",
	maxItems = 2,
	viewAllLink = { href: "/derslerim", label: "Hepsini Gör" },
	className = "",
	isLoading = false,
}: DynamicContinueProps<T>) {
	// Filter items with progress > 0
	const continueItems = items.filter((item) => item.progress > 0);

	// Don't show if no items in progress
	if (continueItems.length === 0) {
		return null;
	}

	// Show at most maxItems cards
	const displayedItems = continueItems.slice(0, maxItems);
	const hasMoreItems = continueItems.length > maxItems;

	return (
		<section className={`mb-12 ${className}`}>
			<div className="flex items-center justify-between">
				<h2 className="mb-6 flex items-center font-semibold text-2xl text-gray-900">
					{title}
					{isLoading && (
						<span className="ml-2 text-blue-500">(Yükleniyor...)</span>
					)}
				</h2>
				{hasMoreItems && viewAllLink && (
					<div className="mt-6 text-center">
						<Link
							href={viewAllLink.href}
							className="text-gray-600 underline hover:text-blue-800"
						>
							{viewAllLink.label} ({continueItems.length} ders)
						</Link>
					</div>
				)}
			</div>
			<div
				className={`grid ${displayedItems.length > 1 ? "md:grid-cols-2" : "grid-cols-1"} gap-6`}
			>
				{displayedItems.map((item) => renderItem(item))}
			</div>
		</section>
	);
}
