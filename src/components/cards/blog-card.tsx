"use client";

import { Calendar, ExternalLink, FileText } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import type { StrapiBlog } from "@/lib/strapi";

interface BlogCardProps {
	blog: StrapiBlog;
	showRelatedData?: boolean;
}

export default function BlogCard({ blog }: Readonly<BlogCardProps>) {
	const router = useRouter();

	const handleCardClick = () => {
		router.push(`/sayfalar/${blog.page?.slug}/${blog.slug}`);
	};

	// Extract text from blog content blocks for preview
	const getContentPreview = (): string => {
		if (!blog.content || blog.content.length === 0) return "İçerik mevcut";

		for (const block of blog.content) {
			if (block.children && block.children.length > 0) {
				const text = block.children[0]?.text;
				if (text?.trim()) {
					return text;
				}
			}
		}
		return "İçerik mevcut";
	};

	return (
		<Card
			className="cursor-pointer py-0 transition-shadow hover:shadow-lg"
			onClick={handleCardClick}
		>
			<CardContent className="p-0">
				{/* Blog Image */}
				<div className="relative">
					<Image
						src={blog.image ? blog.image.url : "/images/blog.jpg"}
						alt={blog.image ? blog.image.alternativeText || blog.title : "Blog Image"}
						width={blog.image ? blog.image.width || 400 : 400}
						height={blog.image ? blog.image.height || 250 : 250}
						className="h-48 w-full rounded-t-lg object-cover"
						onError={(e) => {
							e.currentTarget.src = "/images/blog.jpg";
						}}
					/>
					<div className="absolute top-2 left-2">
						<Badge variant="secondary">
							<Calendar className="mr-1 h-3 w-3" />
							{new Date(blog.publishedAt).toLocaleDateString("tr-TR")}
						</Badge>
					</div>
					<div className="absolute top-2 right-2">
						{blog.category && (
							<Badge className="bg-blue-500">
								<FileText className="mr-1 h-3 w-3" />
								blog.category
							</Badge>
						)}
					</div>
				</div>

				<div className="p-4">
					{/* Blog Title */}
					<CardTitle className="mb-2 text-lg">{blog.title}</CardTitle>

					{/* Content Preview */}
					<div className="mb-3 text-gray-600 text-sm">
						<p className="line-clamp-3">{getContentPreview()}</p>
					</div>

					<Button
						className="w-full cursor-pointer"
						onClick={(e) => {
							e.stopPropagation();
							handleCardClick();
						}}
					>
						<ExternalLink className="mr-2 h-4 w-4" />
						Yazıyı Oku
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
