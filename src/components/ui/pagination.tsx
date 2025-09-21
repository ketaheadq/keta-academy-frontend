"use client";

import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateSimpleId } from "@/lib/utils";

interface PaginationProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
	itemsPerPage: number;
	totalItems: number;
	className?: string;
}

export default function Pagination({
	currentPage,
	totalPages,
	onPageChange,
	itemsPerPage,
	totalItems,
	className = "",
}: Readonly<PaginationProps>) {
	// Calculate the range of items being shown
	const startItem = (currentPage - 1) * itemsPerPage + 1;
	const endItem = Math.min(currentPage * itemsPerPage, totalItems);

	// Generate page numbers to display
	const getPageNumbers = () => {
		const pages: (number | string)[] = [];
		const maxVisiblePages = 7;

		if (totalPages <= maxVisiblePages) {
			return getAllPages();
		}

		return getPaginatedPages(pages);
	};

	const getAllPages = (): (number | string)[] => {
		const pages: (number | string)[] = [];
		for (let i = 1; i <= totalPages; i++) {
			pages.push(i);
		}
		return pages;
	};

	const getPaginatedPages = (pages: (number | string)[]): (number | string)[] => {
		// Always show first page
		pages.push(1);

		if (currentPage <= 4) {
			return handleBeginning(pages);
		}
		if (currentPage >= totalPages - 3) {
			return handleEnd(pages);
		}
		return handleMiddle(pages);
	};

	const handleBeginning = (pages: (number | string)[]): (number | string)[] => {
		for (let i = 2; i <= 5; i++) {
			pages.push(i);
		}
		pages.push("ellipsis");
		pages.push(totalPages);
		return pages;
	};

	const handleEnd = (pages: (number | string)[]): (number | string)[] => {
		pages.push("ellipsis");
		for (let i = totalPages - 4; i <= totalPages; i++) {
			pages.push(i);
		}
		return pages;
	};

	const handleMiddle = (pages: (number | string)[]): (number | string)[] => {
		pages.push("ellipsis");
		for (let i = currentPage - 1; i <= currentPage + 1; i++) {
			pages.push(i);
		}
		pages.push("ellipsis");
		pages.push(totalPages);
		return pages;
	};

	if (totalPages <= 1) {
		return null;
	}

	return (
		<div className={`flex flex-col items-center space-y-4 ${className}`}>
			{/* Items info */}
			<div className="text-gray-600 text-sm">
				{totalItems > 0 ? (
					<span>
						{startItem}-{endItem} arası gösteriliyor, toplam {totalItems} öğe
					</span>
				) : (
					<span>Gösterilecek öğe bulunamadı</span>
				)}
			</div>

			{/* Pagination controls */}
			<div className="flex items-center space-x-1">
				{/* Previous button */}
				<Button
					variant="outline"
					size="sm"
					onClick={() => onPageChange(currentPage - 1)}
					disabled={currentPage === 1}
					className="flex items-center space-x-1"
				>
					<ChevronLeft className="h-4 w-4" />
					<span className="hidden sm:inline">Önceki</span>
				</Button>

				{/* Page numbers */}
				{getPageNumbers().map((page) => {
					if (page === "ellipsis") {
						return (
							<div key={generateSimpleId()} className="px-2">
								<MoreHorizontal className="h-4 w-4 text-gray-400" />
							</div>
						);
					}

					const pageNumber = page as number;
					const isActive = pageNumber === currentPage;

					return (
						<Button
							key={pageNumber}
							variant={isActive ? "default" : "outline"}
							size="sm"
							onClick={() => onPageChange(pageNumber)}
							className={`min-w-[2.5rem] ${
								isActive ? "bg-blue-600 text-white hover:bg-blue-700" : ""
							}`}
						>
							{pageNumber}
						</Button>
					);
				})}

				{/* Next button */}
				<Button
					variant="outline"
					size="sm"
					onClick={() => onPageChange(currentPage + 1)}
					disabled={currentPage === totalPages}
					className="flex items-center space-x-1"
				>
					<span className="hidden sm:inline">Sonraki</span>
					<ChevronRight className="h-4 w-4" />
				</Button>
			</div>
		</div>
	);
}
