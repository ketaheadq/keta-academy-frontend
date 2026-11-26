"use client";

import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";

// Generic interfaces for dynamic listing
interface ListableItem {
	id: string | number;
	// biome-ignore lint/suspicious/noExplicitAny: generic item properties
	[key: string]: any;
}

interface DynamicListingProps<T extends ListableItem> {
	items: T[];
	title: React.ReactNode;
	renderItem: (item: T) => React.ReactNode;
	maxItems?: number;
	gridColumns?: {
		md?: number;
		lg?: number;
	};
	className?: string;
}

export default function DynamicListing<T extends ListableItem>({
	items,
	title,
	renderItem,
	maxItems = 3,
	gridColumns = { md: 2, lg: 3 },
	className = "",
}: Readonly<DynamicListingProps<T>>) {
	const displayedItems = items.slice(0, maxItems);

	const gridClasses = [
		"grid",
		gridColumns.md && `md:grid-cols-${gridColumns.md}`,
		gridColumns.lg && `lg:grid-cols-${gridColumns.lg}`,
		"gap-6",
	]
		.filter(Boolean)
		.join(" ");

	return (
		<section className={`mb-12 ${className}`}>
			<Reveal className="mb-6">
				<h2 className="text-foreground mb-6 flex items-center text-2xl font-semibold">{title}</h2>
			</Reveal>
			<RevealGroup className={gridClasses} gap={0.08}>
				{displayedItems.map((item) => (
					<RevealItem key={String(item.id)} className="[&>*]:h-full">
						{renderItem(item)}
					</RevealItem>
				))}
			</RevealGroup>
		</section>
	);
}
