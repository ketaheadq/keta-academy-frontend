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
				const firstChild = block.children[0];
				const text = firstChild && "text" in firstChild ? firstChild.text : undefined;
				if (text?.trim()) {
					return text;
				}
			}
		}
		return "İçerik mevcut";
	};

	return (
		<Card
			className="group cursor-pointer overflow-hidden py-0 transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-lg"
			onClick={handleCardClick}
		>
			<CardContent className="p-0">
				{/* Blog Image */}
				<div className="relative aspect-[2/1] overflow-hidden">
					<Image
						src={blog.image ? blog.image.url : "/images/blog.jpg"}
						alt={blog.image ? blog.image.alternativeText || blog.title : "Blog Image"}
						fill
						sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
						className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
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
							<Badge className="bg-primary">
								<FileText className="mr-1 h-3 w-3" />
								{blog.category}
							</Badge>
						)}
					</div>
				</div>

				<div className="p-4">
					{/* Blog Title */}
					<CardTitle className="group-hover:text-accent mb-2 text-lg transition-colors">
						{blog.title}
					</CardTitle>

					{/* Content Preview */}
					<div className="text-muted-foreground mb-3 text-sm">
						<p className="line-clamp-3">{getContentPreview()}</p>
					</div>

					<Button
						className="w-full cursor-pointer transition-transform duration-200 ease-out group-hover:scale-[1.02] active:scale-[0.98]"
						onClick={(e) => {
							e.stopPropagation();
							handleCardClick();
						}}
					>
						<ExternalLink className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
						Yazıyı Oku
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
