"use client";

import { ArrowUpDown, Filter, School, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
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
import { cn, normalizeTurkish } from "@/lib/utils";

// Types
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

	// Parse CSV data
	const { parsedData, columns, filterableColumns } = useMemo(() => {
		if (!admissionScore.tableData)
			return { parsedData: [], columns: [], filterableColumns: [] };

		try {
			const lines = admissionScore.tableData.trim().split("\n");
			if (lines.length < 2)
				return { parsedData: [], columns: [], filterableColumns: [] };

			const headerLine = lines[0];
			const headerMatches = headerLine.match(/(".*?"|[^,]+)(?=\s*,|\s*$)/g);
			if (!headerMatches)
				return { parsedData: [], columns: [], filterableColumns: [] };

			const headers = headerMatches.map((match) =>
				match.replace(/^"(.*)"$/, "$1").trim(),
			);

			const columns: ColumnInfo[] = headers.map((header, index) => {
				const key = `col_${index}`;
				const label = header;
				const lowerHeader = header.toLowerCase();

				let type: "text" | "number" | "badge" = "text";
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

			const dataLines = lines.slice(1);
			const parsedData: DynamicTableData[] = dataLines
				.map((line, index) => {
					const matches = line.match(/(".*?"|[^,]+)(?=\s*,|\s*$)/g);
					if (!matches) return null;

					const rowData: DynamicTableData = { id: index };
					matches.forEach((match, colIndex) => {
						const value = match.replace(/^"(.*)"$/, "$1").trim();
						rowData[`col_${colIndex}`] = value;
					});
					return rowData;
				})
				.filter((row): row is DynamicTableData => row !== null);

			const filterableColumns = columns.filter((col) => {
				if (col.type !== "text") return false;
				const values = parsedData.map((row) => row[col.key]);
				const uniqueValues = new Set(values.filter(Boolean));
				return uniqueValues.size > 1 && uniqueValues.size <= 50;
			});

			return { parsedData, columns, filterableColumns };
		} catch (error) {
			console.error("Error parsing admission score ", error);
			return { parsedData: [], columns: [], filterableColumns: [] };
		}
	}, [admissionScore.tableData]);

	// Filter options
	const filterOptions = useMemo(() => {
		const options: Record<string, string[]> = {};
		filterableColumns.forEach((col) => {
			const values = parsedData
				.map((row) => row[col.key])
				.filter(
					(value): value is string =>
						Boolean(value) && typeof value === "string",
				);
			options[col.key] = [...new Set(values)].sort((a, b) =>
				a.localeCompare(b, "tr"),
			);
		});
		return options;
	}, [parsedData, filterableColumns]);

	// Initialize filters
	useEffect(() => {
		if (filterableColumns.length === 0) return;

		setSelectedFilters((prev) => {
			const newFilters: Record<string, string> = {};
			filterableColumns.forEach((col) => {
				if (!(col.key in prev)) {
					newFilters[col.key] = `Tüm ${col.label}`;
				}
			});
			return Object.keys(newFilters).length > 0
				? { ...prev, ...newFilters }
				: prev;
		});
	}, [filterableColumns]);

	// Filter and sort data
	const filteredData = useMemo(() => {
		const filtered = parsedData.filter((item) => {
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

			const matchesFilters = filterableColumns.every((col) => {
				const selected = selectedFilters[col.key];
				const allLabel = `Tüm ${col.label}`;
				return !selected || selected === allLabel || item[col.key] === selected;
			});

			return matchesSearch && matchesFilters;
		});

		if (sortField) {
			const column = columns.find((col) => col.key === sortField);
			filtered.sort((a, b) => {
				const av = a[sortField];
				const bv = b[sortField];

				if (column?.type === "number") {
					const an = Number.parseFloat(String(av).replace(/[",]/g, "")) || 0;
					const bn = Number.parseFloat(String(bv).replace(/[",]/g, "")) || 0;
					return sortDirection === "asc" ? an - bn : bn - an;
				}

				const astr = String(av || "");
				const bstr = String(bv || "");
				const cmp = astr.localeCompare(bstr, "tr");
				return sortDirection === "asc" ? cmp : -cmp;
			});
		}

		return filtered;
	}, [
		parsedData,
		columns,
		filterableColumns,
		selectedFilters,
		searchTerm,
		sortField,
		sortDirection,
		normalizeTurkish,
	]);

	const handleSort = (field: string) => {
		setSortField(field);
		setSortDirection((prev) =>
			sortField === field ? (prev === "asc" ? "desc" : "asc") : "asc",
		);
	};

	const getSortIcon = (field: string) => {
		if (sortField !== field)
			return (
				<ArrowUpDown className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
			);
		return (
			<ArrowUpDown
				className={cn(
					"h-4 w-4 transition-transform",
					sortDirection === "desc" ? "rotate-180" : "",
				)}
			/>
		);
	};

	const handleFilterChange = (columnKey: string, value: string) => {
		setSelectedFilters((prev) => ({ ...prev, [columnKey]: value }));
	};

	const clearAllFilters = () => {
		const resetFilters = Object.fromEntries(
			filterableColumns.map((col) => [col.key, `Tüm ${col.label}`]),
		);
		setSelectedFilters(resetFilters);
		setSearchTerm("");
		setSortField(null);
	};

	const renderCellValue = (value: any, column: ColumnInfo) => {
		if (!value) return <span className="text-muted-foreground">—</span>;

		const stringValue = String(value);

		switch (column.type) {
			case "badge":
				return (
					<Badge variant="outline" className="font-medium">
						{stringValue}
					</Badge>
				);
			case "number":
				return stringValue.toLowerCase() === "dolmadı" ? (
					<Badge
						variant="secondary"
						className="bg-orange-100 text-orange-800 hover:bg-orange-100"
					>
						Dolmadı
					</Badge>
				) : (
					<span className="font-medium font-mono text-foreground">
						{stringValue}
					</span>
				);
			default: {
				const shouldWrap = stringValue.length > 30;
				return (
					<span
						className={cn(
							"block",
							shouldWrap
								? "whitespace-normal break-words"
								: "max-w-xs truncate md:max-w-none",
						)}
						title={stringValue}
					>
						{stringValue}
					</span>
				);
			}
		}
	};

	// Render
	return (
		<div className="container mx-auto">
			{/* Header */}
			<div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
				<h1 className="font-bold text-3xl text-foreground tracking-tight">
					{admissionScore.title}
				</h1>
				<div className="flex items-center gap-3">
					<div className="relative">
						<Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
						<Input
							placeholder="Ara..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="w-full pl-10 md:w-64 lg:w-72"
						/>
					</div>
					{filterableColumns.length > 0 && (
						<Button
							variant="outline"
							size="sm"
							onClick={() => setShowFilters(!showFilters)}
							className="gap-2"
						>
							<Filter className="h-4 w-4" />
							Filtreler
						</Button>
					)}
				</div>
			</div>

			{/* Filters */}
			{showFilters && filterableColumns.length > 0 && (
				<Card className="mb-6 overflow-hidden">
					<CardContent className="p-4">
						<div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
							{filterableColumns.map((column) => {
								const selectId = `filter-${column.key}`; // Unique ID for this select

								return (
									<div key={column.key} className="space-y-1.5">
										<label
											htmlFor={selectId}
											className="block font-medium text-foreground text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
										>
											{column.label}
										</label>
										<Select
											value={
												selectedFilters[column.key] ?? `Tüm ${column.label}`
											}
											onValueChange={(value) =>
												handleFilterChange(column.key, value)
											}
										>
											<SelectTrigger id={selectId} className="h-10">
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value={`Tüm ${column.label}`}>
													Tüm {column.label}
												</SelectItem>
												{filterOptions[column.key]?.map((opt) => (
													<SelectItem key={opt} value={opt}>
														{opt}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
								);
							})}
						</div>
						<Button
							variant="ghost"
							size="sm"
							onClick={clearAllFilters}
							className="text-muted-foreground hover:text-foreground"
						>
							Filtreleri Temizle
						</Button>
					</CardContent>
				</Card>
			)}

			{/* No Data */}
			{parsedData.length === 0 ? (
				<div className="flex flex-col items-center justify-center py-16 text-center">
					<School className="mb-4 h-16 w-16 text-muted-foreground" />
					<h3 className="mb-1 font-semibold text-xl">Veri Bulunamadı</h3>
					<p className="text-muted-foreground">
						Bu sayfa için henüz tablo verisi mevcut değil.
					</p>
				</div>
			) : (
				<>
					{/* Results Count */}
					<p className="mb-4 text-muted-foreground text-sm">
						<span className="font-medium">{filteredData.length}</span> sonuç
						bulundu
						{filteredData.length !== parsedData.length && (
							<span className="text-muted-foreground">
								{" "}
								(toplam {parsedData.length})
							</span>
						)}
					</p>

					{/* Table */}
					<CardContent className="rounded-lg border bg-white p-0">
						<div className="max-h-96 overflow-auto rounded-lg border">
							<div className="min-w-full">
								<Table>
									<TableHeader className="sticky top-0 z-10 bg-white">
										<TableRow className="bg-muted hover:bg-muted">
											{columns.map((column) => (
												<TableHead
													key={column.key}
													onClick={() => handleSort(column.key)}
													className="group cursor-pointer select-none bg-muted text-left font-semibold text-muted-foreground transition-colors first:pl-6 last:pr-6 hover:bg-accent"
												>
													<div className="flex items-center gap-1">
														<span>{column.label}</span>
														{getSortIcon(column.key)}
													</div>
												</TableHead>
											))}
										</TableRow>
									</TableHeader>
									<TableBody>
										{filteredData.length > 0 ? (
											filteredData.map((row) => (
												<TableRow
													key={row.id}
													className="transition-colors hover:bg-accent"
												>
													{columns.map((column) => (
														<TableCell
															key={column.key}
															className="py-3 text-left first:pl-6 last:pr-6"
														>
															{renderCellValue(row[column.key], column)}
														</TableCell>
													))}
												</TableRow>
											))
										) : (
											<TableRow>
												<TableCell
													colSpan={columns.length}
													className="h-24 text-center text-muted-foreground"
												>
													Sonuç bulunamadı. Arama kriterlerinizi değiştirin.
												</TableCell>
											</TableRow>
										)}
									</TableBody>
								</Table>
							</div>
						</div>
					</CardContent>
				</>
			)}
		</div>
	);
}
