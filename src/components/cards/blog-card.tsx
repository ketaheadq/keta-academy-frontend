"use client";

import { BookOpen, Calendar, ExternalLink, FileText } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { StrapiBlog } from "@/lib/strapi";

interface BlogCardProps {
	blog: StrapiBlog;
	showRelatedData?: boolean;
}

export default function BlogCard({
	blog,
	showRelatedData = false,
}: BlogCardProps) {
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
		<Card className="cursor-pointer transition-shadow hover:shadow-lg">
			<CardHeader className="pb-3">
				<div className="flex items-start justify-between">
					<div className="flex-1">
						<div className="mb-2 flex items-center space-x-2">
							<Badge variant="secondary">
								<Calendar className="mr-1 h-3 w-3" />
								{new Date(blog.publishedAt).toLocaleDateString("tr-TR")}
							</Badge>
							<Badge className="bg-green-500">
								<BookOpen className="mr-1 h-3 w-3" />
								Blog
							</Badge>
							{blog.content && blog.content.length > 0 && (
								<Badge className="bg-blue-500">
									<FileText className="mr-1 h-3 w-3" />
									İçerik
								</Badge>
							)}
						</div>

						<CardTitle className="mb-2 text-lg">{blog.title}</CardTitle>

						{/* Content Preview */}
						<div className="mb-3 text-gray-600 text-sm">
							<p className="line-clamp-3">{getContentPreview()}</p>
						</div>

						{/* Related Data */}
						{showRelatedData &&
							blog.related_datas &&
							blog.related_datas.length > 0 && (
								<div className="space-y-1">
									<span className="block font-medium text-gray-700 text-sm">
										İlgili Blog Yazıları ({blog.related_datas.length})
									</span>
									<div className="flex flex-wrap gap-1">
										{blog.related_datas.slice(0, 2).map((related) => (
											<Badge
												key={related.id}
												variant="outline"
												className="text-xs"
											>
												{related.title}
											</Badge>
										))}
										{blog.related_datas.length > 2 && (
											<Badge variant="outline" className="text-xs">
												+{blog.related_datas.length - 2} daha
											</Badge>
										)}
									</div>
								</div>
							)}

						{/* Page Reference */}
						{blog.page && (
							<div className="mt-2 text-gray-500 text-xs">
								<strong>Sayfa:</strong> {blog.page.title}
							</div>
						)}
					</div>
				</div>
			</CardHeader>

			<CardContent>
				<Link href={`/sayfalar/${blog.page?.slug}/${blog.slug}`}>
					<Button className="w-full">
						<ExternalLink className="mr-2 h-4 w-4" />
						Yazıyı Oku
					</Button>
				</Link>
			</CardContent>
		</Card>
	);
}
