"use client";

// Generic interfaces for dynamic listing
interface ListableItem {
	id: string | number;
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
}: DynamicListingProps<T>) {
	const displayedItems = items.slice(0, maxItems);

	const gridClasses = `grid ${gridColumns.md ? `md:grid-cols-${gridColumns.md}` : ""} ${gridColumns.lg ? `lg:grid-cols-${gridColumns.lg}` : ""} gap-6`;

	return (
		<section className={`mb-12 ${className}`}>
			<div className="mb-6">
				<h2 className="mb-6 flex items-center font-semibold text-2xl text-gray-900">{title}</h2>
			</div>
			<div className={gridClasses}>{displayedItems.map((item) => renderItem(item))}</div>
		</section>
	);
}
