"use client";

import { Calculator, Filter, Search } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
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
import { normalizeTurkish } from "@/lib/utils";

// Generic interfaces for dynamic filtering
interface FilterableItem {
	id: string | number;
	[key: string]: any;
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
	title = <h1 className="font-semibold text-2xl text-gray-900">📚 Öğeler</h1>,
	emptyStateConfig = {
		icon: <Calculator className="mx-auto mb-4 h-12 w-12 text-gray-400" />,
		title: "Sonuç bulunamadı",
		description: "Aradığınızı bulmak için filtrelerinizi ayarlayın.",
	},
	className = "",
	itemsPerPage = 12,
	enablePagination,
}: Readonly<DynamicGridProps<T>>) {
	const [searchTerm, setSearchTerm] = useState("");
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
	const getNestedValue = useCallback((obj: any, path: string): any => {
		return path.split(".").reduce((current, key) => {
			if (current && typeof current === "object") {
				return current[key];
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
					if (typeof val === "object" && val?.title) {
						return val.title === selectedValue;
					}
					// If array contains primitive values
					return String(val) === selectedValue;
				});
			}

			// Handle object fields (like subject.title)
			if (typeof itemValue === "object" && itemValue?.title) {
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
					<h2 className="mb-6 flex items-center font-semibold text-2xl text-gray-900">{title}</h2>
					<div className="flex items-center space-x-4">
						{searchFields.length > 0 && (
							<div className="relative">
								<Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 transform text-gray-400" />
								<Input
									placeholder="Ara..."
									value={searchTerm}
									onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
										setSearchTerm(e.target.value)
									}
									className="w-64 pl-10"
								/>
							</div>
						)}
						{filterConfigs.length > 0 && (
							<Button
								variant="outline"
								onClick={() => setShowFilters(!showFilters)}
								className="flex items-center space-x-2"
							>
								<Filter className="h-4 w-4" />
								<span>Filtreler</span>
							</Button>
						)}
					</div>
				</div>

				{/* Filter Controls */}
				{showFilters && filterConfigs.length > 0 && (
					<div className="mt-4 grid grid-cols-1 gap-4 rounded-lg border bg-white p-4 md:grid-cols-2">
						{filterConfigs.map((config) => {
							const selectId = `filter-${config.field}`; // Unique ID for this select

							return (
								<div key={config.field}>
									<label
										htmlFor={selectId}
										className="mb-2 block font-medium text-gray-700 text-sm"
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
											{config.options?.filter(Boolean).map((option, index) => (
												<SelectItem key={`${config.field}-${index}-${option}`} value={option}>
													{option}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
							);
						})}
					</div>
				)}
			</section>

			{/* Items Grid */}
			<section className="mb-8">
				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					{paginatedItems.map((item, index) => renderItem(item, startIndex + index))}
				</div>

				{filteredItems.length === 0 && (
					<div className="py-12 text-center">
						{emptyStateConfig.icon}
						<h3 className="mb-2 font-semibold text-gray-900 text-lg">{emptyStateConfig.title}</h3>
						<p className="text-gray-600">{emptyStateConfig.description}</p>
					</div>
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
