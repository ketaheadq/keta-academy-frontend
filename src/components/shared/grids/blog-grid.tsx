"use client";

import { BookOpen } from "lucide-react";
import BlogCard from "@/components/shared/cards/blog-card";
import DynamicGrid from "@/components/shared/grids/dynamic-grid";
import type { StrapiBlog } from "@/lib/strapi";

interface BlogGridProps {
	items: StrapiBlog[];
	title?: string;
	showRelatedData?: boolean;
	itemsPerPage?: number;
	enablePagination?: boolean;
}

export default function BlogGrid({
	items,
	title = "Blog Yazıları",
	showRelatedData = false,
	itemsPerPage = 9,
	enablePagination,
}: Readonly<BlogGridProps>) {
	return (
		<DynamicGrid
			items={items}
			searchFields={["title"]}
			filterConfigs={[]}
			renderItem={(blog: StrapiBlog) => (
				<BlogCard key={blog.id} blog={blog} showRelatedData={showRelatedData} />
			)}
			title={title}
			itemsPerPage={itemsPerPage}
			enablePagination={enablePagination}
			emptyStateConfig={{
				icon: <BookOpen className="mx-auto mb-4 h-12 w-12 text-gray-400" />,
				title: "Blog yazısı bulunamadı",
				description: "Aradığınız kriterlere uygun blog yazısı bulunamadı.",
			}}
		/>
	);
}
