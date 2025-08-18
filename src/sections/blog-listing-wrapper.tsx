"use client";

import BlogCard from "@/components/blog-card";
import type { StrapiBlog } from "@/lib/strapi";
import DynamicListing from "./dynamic-listing";

interface BlogListingProps {
	blogs: StrapiBlog[];
	title: React.ReactNode;
}

export default function BlogListing({ blogs, title }: BlogListingProps) {
	return (
		<DynamicListing
			items={blogs}
			title={title}
			renderItem={(blog) => (
				<BlogCard key={blog.id} blog={blog} showRelatedData={true} />
			)}
			maxItems={3}
			gridColumns={{ md: 2, lg: 3 }}
		/>
	);
}
