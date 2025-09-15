"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import type { StrapiPageCategory } from "@/lib/strapi";

interface DesktopDropdownProps {
	category: StrapiPageCategory;
}

export default function DesktopDropdown({ category }: DesktopDropdownProps) {
	return (
		<div className="group relative">
			<button
				type="button"
				className="flex items-center space-x-1 font-medium text-gray-700 transition-colors hover:text-blue-600"
			>
				<span>{category.title}</span>
				<ChevronDown className="h-4 w-4" />
			</button>
			<div className="invisible absolute top-full left-0 z-50 mt-2 w-48 rounded-md border bg-white opacity-0 shadow-lg transition-all duration-200 group-hover:visible group-hover:opacity-100">
				<div className="py-2">
					{category.pages.map((page) => (
						<Link
							key={`page-${page.id}`}
							href={`/sayfalar/${page.slug}`}
							className="block px-4 py-2 text-gray-700 text-sm hover:bg-gray-100 hover:text-blue-600"
						>
							{page.title}
						</Link>
					))}
				</div>
			</div>
		</div>
	);
}
