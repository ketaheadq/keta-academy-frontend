"use client";

import { ArrowUpDown, Filter, School, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { StrapiAdmissionScore } from "@/lib/strapi";

interface AdmissionScorePageProps {
	admissionScore: StrapiAdmissionScore;
}

interface DynamicTableData {
	id: number;
	[key: string]: any;
}

interface ColumnInfo {
	key: string;
	label: string;
	type: "text" | "number" | "badge";
}

export default function AdmissionScorePage({
	admissionScore,
}: AdmissionScorePageProps) {
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedFilters, setSelectedFilters] = useState<
		Record<string, string>
	>({});
	const [showFilters, setShowFilters] = useState(false);
	const [sortField, setSortField] = useState<string | null>(null);
	const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

	// Parse CSV data and extract columns dynamically
	const { parsedData, columns, filterableColumns } = useMemo(() => {
		if (!admissionScore.tableData)
			return { parsedData: [], columns: [], filterableColumns: [] };

		try {
			const lines = admissionScore.tableData.trim().split("\n");
			if (lines.length < 2)
				return { parsedData: [], columns: [], filterableColumns: [] };

			// Parse header line to get column names
			const headerLine = lines[0];
			const headerMatches = headerLine.match(/(".*?"|[^,]+)(?=\s*,|\s*$)/g);
			if (!headerMatches)
				return { parsedData: [], columns: [], filterableColumns: [] };

			const headers = headerMatches.map((match) =>
				match.replace(/^"(.*)"$/, "$1").trim(),
			);

			// Create column info with smart typing
			const columns: ColumnInfo[] = headers.map((header, index) => {
				const key = `col_${index}`;
				const label = header;

				// Determine column type based on header content
				let type: "text" | "number" | "badge" = "text";
				const lowerHeader = header.toLowerCase();

				if (
					lowerHeader.includes("puan") ||
					lowerHeader.includes("sıra") ||
					lowerHeader.includes("kontenjan") ||
					lowerHeader.includes("sayı")
				) {
					type = "number";
				} else if (
					lowerHeader.includes("tür") ||
					lowerHeader.includes("type") ||
					lowerHeader.includes("kategori")
				) {
					type = "badge";
				}

				return { key, label, type };
			});

			// Parse data lines
			const dataLines = lines.slice(1);
			const parsedData: DynamicTableData[] = dataLines
				.map((line, index) => {
					const matches = line.match(/(".*?"|[^,]+)(?=\s*,|\s*$)/g);
					if (!matches) return null;

					const rowData: DynamicTableData = { id: index };

					matches.forEach((match, colIndex) => {
						const value = match.replace(/^"(.*)"$/, "$1").trim();
						const colKey = `col_${colIndex}`;
						rowData[colKey] = value;
					});

					return rowData;
				})
				.filter(Boolean) as DynamicTableData[];

			// Identify filterable columns (text columns with reasonable number of unique values)
			const filterableColumns = columns.filter((col) => {
				if (col.type === "number") return false;

				const uniqueValues = [
					...new Set(parsedData.map((row) => row[col.key])),
				];
				return uniqueValues.length > 1 && uniqueValues.length <= 50; // Reasonable filter limit
			});

			return { parsedData, columns, filterableColumns };
		} catch (error) {
			console.error("Error parsing admission score data:", error);
			return { parsedData: [], columns: [], filterableColumns: [] };
		}
	}, [admissionScore.tableData]);

	// Get unique values for each filterable column
	const filterOptions = useMemo(() => {
		const options: Record<string, string[]> = {};

		filterableColumns.forEach((col) => {
			const uniqueValues = [...new Set(parsedData.map((row) => row[col.key]))];
			options[col.key] = uniqueValues
				.filter(
					(value): value is string =>
						Boolean(value) && typeof value === "string",
				)
				.sort();
		});

		return options;
	}, [parsedData, filterableColumns]);

	// Initialize filters
	useMemo(() => {
		const initialFilters: Record<string, string> = {};
		filterableColumns.forEach((col) => {
			if (!selectedFilters[col.key]) {
				initialFilters[col.key] = `Tüm ${col.label}`;
			}
		});
		setSelectedFilters((prev) => ({ ...prev, ...initialFilters }));
	}, [filterableColumns]);

	// Helper function to normalize Turkish characters for search
	const normalizeTurkish = (str: string): string => {
		if (!str) return "";
		return str
			.replace(/ğ/g, "g")
			.replace(/ü/g, "u")
			.replace(/ş/g, "s")
			.replace(/ı/g, "i")
			.replace(/ö/g, "o")
			.replace(/ç/g, "c")
			.replace(/İ/g, "i")
			.replace(/Ğ/g, "g")
			.replace(/Ü/g, "u")
			.replace(/Ş/g, "s")
			.replace(/I/g, "i")
			.replace(/Ö/g, "o")
			.replace(/Ç/g, "c")
			.toLowerCase();
	};

	// Filter and search data
	const filteredData = useMemo(() => {
		const filtered = parsedData.filter((item) => {
			// Search filter - search across all text columns
			const matchesSearch =
				!searchTerm ||
				columns.some((col) => {
					const value = item[col.key];
					return (
						value &&
						normalizeTurkish(String(value)).includes(
							normalizeTurkish(searchTerm),
						)
					);
				});

			// Filter by selected filters
			const matchesFilters = filterableColumns.every((col) => {
				const selectedValue = selectedFilters[col.key];
				const allLabel = `Tüm ${col.label}`;

				if (!selectedValue || selectedValue === allLabel) return true;

				return item[col.key] === selectedValue;
			});

			return matchesSearch && matchesFilters;
		});

		// Sort data
		if (sortField) {
			filtered.sort((a, b) => {
				const aVal = a[sortField];
				const bVal = b[sortField];

				// Find column type for smart sorting
				const column = columns.find((col) => col.key === sortField);

				if (column?.type === "number") {
					// Handle numeric sorting
					const aNum = Number.parseFloat(
						String(aVal)?.replace(/[",]/g, "") || "0",
					);
					const bNum = Number.parseFloat(
						String(bVal)?.replace(/[",]/g, "") || "0",
					);
					if (!isNaN(aNum) && !isNaN(bNum)) {
						return sortDirection === "asc" ? aNum - bNum : bNum - aNum;
					}
				}

				// String sorting
				const aStr = String(aVal || "");
				const bStr = String(bVal || "");
				const comparison = aStr.localeCompare(bStr, "tr");
				return sortDirection === "asc" ? comparison : -comparison;
			});
		}

		return filtered;
	}, [
		parsedData,
		searchTerm,
		selectedFilters,
		sortField,
		sortDirection,
		columns,
		filterableColumns,
	]);

	const handleSort = (field: string) => {
		if (sortField === field) {
			setSortDirection(sortDirection === "asc" ? "desc" : "asc");
		} else {
			setSortField(field);
			setSortDirection("asc");
		}
	};

	const getSortIcon = (field: string) => {
		if (sortField !== field) return <ArrowUpDown className="h-4 w-4" />;
		return (
			<ArrowUpDown
				className={`h-4 w-4 ${sortDirection === "desc" ? "rotate-180" : ""}`}
			/>
		);
	};

	const handleFilterChange = (columnKey: string, value: string) => {
		setSelectedFilters((prev) => ({
			...prev,
			[columnKey]: value,
		}));
	};

	const clearAllFilters = () => {
		const clearedFilters: Record<string, string> = {};
		filterableColumns.forEach((col) => {
			clearedFilters[col.key] = `Tüm ${col.label}`;
		});
		setSelectedFilters(clearedFilters);
		setSearchTerm("");
		setSortField(null);
	};

	const renderCellValue = (value: any, column: ColumnInfo) => {
		if (!value) return "-";

		const stringValue = String(value);

		switch (column.type) {
			case "badge":
				return <Badge variant="outline">{stringValue}</Badge>;
			case "number":
				if (stringValue.toLowerCase() === "dolmadı") {
					return <Badge variant="secondary">Dolmadı</Badge>;
				}
				return <span className="font-bold text-grey-400">{stringValue}</span>;
			default:
				return (
					<div className="max-w-xs whitespace-normal break-words">
						<span>{stringValue}</span>
					</div>
				);
		}
	};

	return (
		<div className="container mx-auto px-4 py-8">
			{/* Show message if no data available */}
			{parsedData.length === 0 && (
				<div className="py-12 text-center">
					<School className="mx-auto mb-4 h-12 w-12 text-gray-400" />
					<h3 className="mb-2 font-semibold text-gray-900 text-lg">
						Veri Bulunamadı
					</h3>
					<p className="text-gray-600">
						Bu sayfa için henüz tablo verisi mevcut değil.
					</p>
				</div>
			)}

			{/* Only show table interface if we have data */}
			{parsedData.length > 0 && (
				<>
					{/* Search and Filter Section */}
					<section className="mb-8">
						<div className="flex flex-col items-center justify-between gap-4 md:flex-row">
							<h2 className="font-semibold text-2xl text-gray-900">
								{admissionScore.title}
							</h2>
							<div className="flex items-center space-x-4">
								<div className="relative">
									<Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 transform text-gray-400" />
									<Input
										placeholder="Tabloda ara..."
										value={searchTerm}
										onChange={(e) => setSearchTerm(e.target.value)}
										className="w-64 pl-10"
									/>
								</div>
								{filterableColumns.length > 0 && (
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
						{showFilters && filterableColumns.length > 0 && (
							<div className="mt-4 rounded-lg border bg-white p-4">
								<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
									{filterableColumns.map((column) => (
										<div key={column.key}>
											<label className="mb-2 block font-medium text-gray-700 text-sm">
												{column.label}
											</label>
											<Select
												value={
													selectedFilters[column.key] || `Tüm ${column.label}`
												}
												onValueChange={(value) =>
													handleFilterChange(column.key, value)
												}
											>
												<SelectTrigger>
													<SelectValue />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value={`Tüm ${column.label}`}>
														Tüm {column.label}
													</SelectItem>
													{filterOptions[column.key]?.map((option) => (
														<SelectItem key={option} value={option}>
															{option}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</div>
									))}
								</div>
								<div className="mt-4">
									<Button
										variant="outline"
										onClick={clearAllFilters}
										className="w-full md:w-auto"
									>
										Filtreleri Temizle
									</Button>
								</div>
							</div>
						)}
					</section>

					{/* Results Count */}
					<div className="mb-4">
						<p className="text-gray-600">
							<span className="font-semibold">{filteredData.length}</span> sonuç
							bulundu
							{parsedData.length !== filteredData.length && (
								<span> (toplam {parsedData.length} kayıt)</span>
							)}
						</p>
					</div>

					{/* Dynamic Table */}
					<section className="mb-12">
						<Card>
							<CardContent className="p-0">
								<div className="overflow-x-auto">
									<Table>
										<TableHeader>
											<TableRow>
												{columns.map((column, index) => (
													<TableHead
														key={column.key}
														className={`cursor-pointer hover:bg-gray-50 ${index === 0 ? "pl-4 text-left" : "text-center"}`}
														onClick={() => handleSort(column.key)}
													>
														<div
															className={`flex items-center space-x-2 ${index === 0 ? "justify-start" : "justify-center"}`}
														>
															<span>{column.label}</span>
															{getSortIcon(column.key)}
														</div>
													</TableHead>
												))}
											</TableRow>
										</TableHeader>
										<TableBody>
											{filteredData.map((row) => (
												<TableRow key={row.id} className="hover:bg-gray-50">
													{columns.map((column, index) => (
														<TableCell
															key={column.key}
															className={
																index === 0 ? "pl-4 text-left" : "text-center"
															}
														>
															{renderCellValue(row[column.key], column)}
														</TableCell>
													))}
												</TableRow>
											))}
										</TableBody>
									</Table>
								</div>
							</CardContent>
						</Card>

						{filteredData.length === 0 && (
							<div className="py-12 text-center">
								<School className="mx-auto mb-4 h-12 w-12 text-gray-400" />
								<h3 className="mb-2 font-semibold text-gray-900 text-lg">
									Sonuç bulunamadı
								</h3>
								<p className="text-gray-600">
									Arama kriterlerinizi değiştirmeyi deneyin.
								</p>
							</div>
						)}
					</section>
				</>
			)}
		</div>
	);
}
