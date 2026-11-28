"use client";

import { Calculator, Filter, Search } from "lucide-react";
import { AnimatePresence, m } from "motion/react";
import { useCallback, useId, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Pagination from "@/components/ui/pagination";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { DURATION, EASE_OUT } from "@/lib/motion";
import { normalizeTurkish } from "@/lib/utils";

// Generic interfaces for dynamic filtering
interface FilterableItem {
	id: string | number;
}

interface FilterConfig {
	field: string;
	label: string;
	type: "select" | "search" | "multi-select";
	options?: string[];
	allLabel?: string; // e.g., "All Grades", "All Topics"
}

interface DynamicGridProps<T extends FilterableItem> {
	items: T[];
	filterConfigs: FilterConfig[];
	searchFields: string[]; // fields to search in
	renderItem: (item: T, index: number) => React.ReactNode;
	title?: React.ReactNode;
	emptyStateConfig?: {
		icon?: React.ReactNode;
		title: string;
		description: string;
	};
	className?: string;
	itemsPerPage?: number; // number of items per page (default: 12)
	enablePagination?: boolean; // whether to enable pagination (default: true for items > 12)
}

export default function DynamicGrid<T extends FilterableItem>({
	items,
	filterConfigs,
	searchFields,
	renderItem,
	title = <h1 className="text-foreground text-2xl font-semibold">📚 Öğeler</h1>,
	emptyStateConfig = {
		icon: <Calculator className="text-muted-foreground mx-auto mb-4 h-12 w-12" />,
		title: "Sonuç bulunamadı",
		description: "Aradığınızı bulmak için filtrelerinizi ayarlayın.",
	},
	className = "",
	itemsPerPage = 12,
	enablePagination,
}: Readonly<DynamicGridProps<T>>) {
	const [searchTerm, setSearchTerm] = useState("");
	const id = useId();
	const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>(() => {
		const initialFilters: Record<string, string> = {};
		filterConfigs.forEach((config) => {
			if (config.type === "select") {
				initialFilters[config.field] = config.allLabel || `All ${config.label}`;
			}
		});
		return initialFilters;
	});
	const [showFilters, setShowFilters] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);

	// Determine if pagination should be enabled
	const shouldShowPagination = enablePagination ?? items.length > itemsPerPage;

	// Helper function to get nested property value - now memoized
	const getNestedValue = useCallback((obj: unknown, path: string): unknown => {
		return path.split(".").reduce<unknown>((current, key) => {
			if (current && typeof current === "object") {
				return (current as Record<string, unknown>)[key];
			}
			return current;
		}, obj);
	}, []);

	// Helper function to check if item matches filter - now memoized
	const matchesFilter = useCallback(
		(item: T, config: FilterConfig): boolean => {
			const selectedValue = selectedFilters[config.field];
			const allLabel = config.allLabel || `All ${config.label}`;

			if (selectedValue === allLabel) return true;

			const itemValue = getNestedValue(item, config.field);

			// Handle array fields (like grades)
			if (Array.isArray(itemValue)) {
				return itemValue.some((val) => {
					// If array contains objects with title property
					if (typeof val === "object" && val !== null && "title" in val && val.title) {
						return val.title === selectedValue;
					}
					// If array contains primitive values
					return String(val) === selectedValue;
				});
			}

			// Handle object fields (like subject.title)
			if (
				typeof itemValue === "object" &&
				itemValue !== null &&
				"title" in itemValue &&
				itemValue.title
			) {
				return itemValue.title === selectedValue;
			}

			// Handle primitive values
			return String(itemValue) === selectedValue;
		},
		[selectedFilters, getNestedValue],
	);

	const filteredItems = useMemo(() => {
		return items.filter((item) => {
			// Search filter
			const matchesSearch =
				searchFields.length === 0 ||
				searchFields.some((field) => {
					const value = getNestedValue(item, field);
					return normalizeTurkish(String(value)).includes(normalizeTurkish(searchTerm));
				});

			// Other filters
			const matchesFilters = filterConfigs.every((config) => matchesFilter(item, config));

			return matchesSearch && matchesFilters;
		});
	}, [items, searchTerm, searchFields, filterConfigs, getNestedValue, matchesFilter]);

	// Calculate pagination
	const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
	const startIndex = (currentPage - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;
	const paginatedItems = shouldShowPagination
		? filteredItems.slice(startIndex, endIndex)
		: filteredItems;

	// Deliberately excludes searchTerm: remounting the grid on every keystroke would
	// restart the stagger while the user is still typing. Filters and paging are
	// discrete actions, so they earn the transition.
	const resultKey = `${currentPage}|${JSON.stringify(selectedFilters)}`;

	// Reset to first page when filters change
	useMemo(() => {
		setCurrentPage(1);
	}, []);

	const handleFilterChange = (field: string, value: string) => {
		setSelectedFilters((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	return (
		<div className={className}>
			{/* Search and Filter Section */}
			<section className="mb-8">
				<div className="flex flex-col items-center justify-between gap-4 md:flex-row">
					{title && (
						<h2 className="text-foreground mb-6 flex items-center text-2xl font-semibold">
							{title}
						</h2>
					)}
					<div className="flex w-full items-center gap-2 sm:w-auto sm:gap-4">
						{searchFields.length > 0 && (
							<div className="relative min-w-0 flex-1">
								<Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
								<Input
									placeholder="Ara..."
									value={searchTerm}
									onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
										setSearchTerm(e.target.value)
									}
									className="w-full pl-10 sm:w-64"
								/>
							</div>
						)}
						{filterConfigs.length > 0 && (
							<Button
								variant="outline"
								aria-expanded={showFilters}
								onClick={() => setShowFilters(!showFilters)}
								className="flex items-center space-x-2 transition-transform duration-200 ease-out active:scale-[0.97]"
							>
								<Filter
									className={`h-4 w-4 transition-transform duration-300 ease-out ${showFilters ? "rotate-90" : ""}`}
								/>
								<span>Filtreler</span>
							</Button>
						)}
					</div>
				</div>

				{/* Filter Controls */}
				<AnimatePresence initial={false}>
					{showFilters && filterConfigs.length > 0 && (
						<m.div
							key="filter-panel"
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: "auto" }}
							exit={{ opacity: 0, height: 0 }}
							transition={{ duration: DURATION.base, ease: EASE_OUT }}
							className="overflow-hidden"
						>
							<m.div
								variants={{
									hidden: {},
									shown: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
								}}
								initial="hidden"
								animate="shown"
								className="bg-card mt-4 grid grid-cols-1 gap-4 rounded-lg border p-4 md:grid-cols-2"
							>
								{filterConfigs.map((config) => {
									const selectId = `filter-${config.field}`; // Unique ID for this select

									return (
										<m.div
											key={config.field}
											variants={{
												hidden: { opacity: 0, y: 10 },
												shown: { opacity: 1, y: 0 },
											}}
										>
											<label
												htmlFor={selectId}
												className="text-muted-foreground mb-2 block text-sm font-medium"
											>
												{config.label}
											</label>
											<Select
												value={selectedFilters[config.field]}
												onValueChange={(value) => handleFilterChange(config.field, value)}
											>
												<SelectTrigger id={selectId}>
													<SelectValue />
												</SelectTrigger>
												<SelectContent>
													<SelectItem
														key={`all-${config.field}`}
														value={config.allLabel || `All ${config.label}`}
													>
														{config.allLabel || `All ${config.label}`}
													</SelectItem>
													{config.options?.filter(Boolean).map((option) => (
														<SelectItem key={`${id}-${config.field}-${option}`} value={option}>
															{option}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</m.div>
									);
								})}
							</m.div>
						</m.div>
					)}
				</AnimatePresence>
			</section>

			{/* Items Grid */}
			<section className="mb-8">
				<AnimatePresence mode="wait" initial={false}>
					<m.div
						key={resultKey}
						variants={{
							hidden: {},
							shown: { transition: { staggerChildren: 0.04, delayChildren: 0.03 } },
						}}
						initial="hidden"
						animate="shown"
						exit={{ opacity: 0, transition: { duration: 0.1 } }}
						className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
					>
						{paginatedItems.map((item, index) => (
							<m.div
								key={String(item.id)}
								variants={{
									hidden: { opacity: 0, y: 12 },
									shown: { opacity: 1, y: 0 },
								}}
								/* The wrapper is the grid item now, so the card has to be told to fill the row. */
								className="[&>*]:h-full"
							>
								{renderItem(item, startIndex + index)}
							</m.div>
						))}
					</m.div>
				</AnimatePresence>

				{filteredItems.length === 0 && (
					<m.div
						initial={{ opacity: 0, y: 12 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: DURATION.base, ease: EASE_OUT, delay: 0.08 }}
						className="py-12 text-center"
					>
						{emptyStateConfig.icon}
						<h3 className="text-foreground mb-2 text-lg font-semibold">{emptyStateConfig.title}</h3>
						<p className="text-muted-foreground">{emptyStateConfig.description}</p>
					</m.div>
				)}
			</section>

			{/* Pagination */}
			{shouldShowPagination && filteredItems.length > 0 && (
				<section className="mt-8">
					<Pagination
						currentPage={currentPage}
						totalPages={totalPages}
						onPageChange={setCurrentPage}
						itemsPerPage={itemsPerPage}
						totalItems={filteredItems.length}
					/>
				</section>
			)}
		</div>
	);
}
