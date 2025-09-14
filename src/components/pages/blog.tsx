"use client";

import { Calendar, Clock, User } from "lucide-react";
import BlogRichTextRenderer from "@/components/blog-rich-text-renderer";
import ShareComponent from "@/components/ui/share-component";
import type { StrapiBlog } from "@/lib/strapi";

interface BlogPageProps {
	blog: StrapiBlog;
}

export default function BlogPage({ blog }: Readonly<BlogPageProps>) {
	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("tr-TR", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	const getReadingTime = (content: any[]) => {
		// Calculate reading time based on content length
		const wordsPerMinute = 200;
		let wordCount = 0;

		content.forEach((block) => {
			if (block.children) {
				block.children.forEach((child: any) => {
					if (child.text) {
						wordCount += child.text.split(" ").length;
					}
				});
			}
		});

		const readingTime = Math.ceil(wordCount / wordsPerMinute);
		return readingTime > 0 ? readingTime : 1;
	};

	const readingTime = getReadingTime(blog.content);

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
			<div className="container mx-auto px-4 py-12">
				<div className="mx-auto max-w-4xl">
					{/* Blog Header */}
					<header className="mb-12 text-center">
						<h1 className="mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text font-black text-5xl text-gray-900 leading-tight">
							{blog.title}
						</h1>

						{/* Blog Meta */}
						<div className="mb-8 flex flex-wrap items-center justify-center gap-8 text-gray-600">
							<div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm">
								<Calendar className="h-4 w-4 text-blue-500" />
								<span className="font-medium">{formatDate(blog.publishedAt)}</span>
							</div>
							<div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm">
								<Clock className="h-4 w-4 text-green-500" />
								<span className="font-medium">{readingTime} dk okuma</span>
							</div>
							<div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm">
								<User className="h-4 w-4 text-purple-500" />
								<span className="font-medium">Keta Akademi</span>
							</div>
						</div>

						{/* Share Component */}
						<div className="flex justify-center">
							<ShareComponent className="gap-2" />
						</div>
					</header>

					{/* Blog Content */}
					<article className="rounded-3xl border border-gray-100 bg-white p-12 shadow-xl">
						<BlogRichTextRenderer content={blog.content} />
					</article>

					{/* Blog Footer */}
					<footer className="mt-12 rounded-3xl bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white shadow-xl">
						<div className="text-center">
							<h3 className="mb-3 font-bold text-2xl">Bu yazıyı beğendiniz mi?</h3>
							<p className="mb-6 font-light text-blue-100 text-lg">
								Daha fazla eğitim içeriği için blog sayfamızı takip edin.
							</p>
							<ShareComponent className="justify-center gap-4" />
						</div>
					</footer>
				</div>
			</div>
		</div>
	);
}
