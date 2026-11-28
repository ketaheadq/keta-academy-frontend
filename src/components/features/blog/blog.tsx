"use client";

import { Calendar, Clock, User } from "lucide-react";
import BlogRichTextRenderer from "@/components/features/blog/blog-rich-text-renderer";
import ShareComponent from "@/components/ui/share-component";
import type { StrapiBlock, StrapiBlog } from "@/lib/strapi";

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

	const getReadingTime = (content: StrapiBlock[]) => {
		// Calculate reading time based on content length
		const wordsPerMinute = 200;
		let wordCount = 0;

		content.forEach((block) => {
			if (block.children) {
				block.children.forEach((child) => {
					if ("text" in child && child.text) {
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
		<div className="min-h-screen">
			<div className="container mx-auto px-4 py-12">
				<div className="mx-auto max-w-4xl">
					{/* Blog Header */}
					<header className="mb-12 text-center">
						<h1 className="from-primary to-primary text-foreground mb-8 bg-linear-to-r bg-clip-text text-5xl leading-tight font-black">
							{blog.title}
						</h1>

						{/* Blog Meta */}
						<div className="text-muted-foreground mb-8 flex flex-wrap items-center justify-center gap-8">
							<div className="bg-card flex items-center gap-2 rounded-full px-4 py-2 shadow-sm">
								<Calendar className="text-primary h-4 w-4" />
								<span className="font-medium">{formatDate(blog.publishedAt)}</span>
							</div>
							<div className="bg-card flex items-center gap-2 rounded-full px-4 py-2 shadow-sm">
								<Clock className="text-primary h-4 w-4" />
								<span className="font-medium">{readingTime} dk okuma</span>
							</div>
							<div className="bg-card flex items-center gap-2 rounded-full px-4 py-2 shadow-sm">
								<User className="text-primary h-4 w-4" />
								<span className="font-medium">KetaLearn</span>
							</div>
						</div>

						{/* Share Component */}
						<div className="flex justify-center">
							<ShareComponent className="gap-2" />
						</div>
					</header>

					{/* Blog Content */}
					<article className="border-border bg-card rounded-3xl border p-12 shadow-xl">
						<BlogRichTextRenderer content={blog.content} />
					</article>

					{/* Blog Footer */}
					<footer className="from-primary to-primary text-background mt-12 rounded-3xl bg-linear-to-r p-8 shadow-xl">
						<div className="text-center">
							<h3 className="mb-3 text-2xl font-bold">Bu yazıyı beğendiniz mi?</h3>
							<p className="text-primary-foreground mb-6 text-lg font-light">
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
