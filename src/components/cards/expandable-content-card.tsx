"use client";

import { ChevronDown, ChevronUp, FileText, School } from "lucide-react";
import { useEffect, useState } from "react";
import RichTextRenderer from "@/components/rich-text-renderer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { StrapiBlock } from "@/lib/strapi";

interface ExpandableContentCardProps {
	title?: string;
	content?: StrapiBlock[];
}

export default function ExpandableContentCard({
	title = "İçerik",
	content,
}: ExpandableContentCardProps) {
	const [isExpanded, setIsExpanded] = useState(false);
	const [previewContent, setPreviewContent] = useState<StrapiBlock[]>([]);

	useEffect(() => {
		if (!content || content.length === 0) return;

		// Create preview content with only the first paragraph truncated
		const generatePreviewContent = () => {
			const previewBlocks: StrapiBlock[] = [];
			let foundFirstParagraph = false;

			for (const block of content) {
				if (block.type === "paragraph" && !foundFirstParagraph) {
					if (block.children && block.children.length > 0) {
						// Find the first text node with content
						const firstTextChild = block.children.find(
							(child) => child.text && child.text.trim() !== "",
						);

						if (firstTextChild) {
							const text = firstTextChild.text;
							const sentenceEndRegex = /[.!?]+/;
							const match = sentenceEndRegex.exec(text);

							if (match && match.index < text.length - 1) {
								// Truncate after first sentence
								const sentenceEndIndex = match.index + 1;
								const truncatedText = text.substring(0, sentenceEndIndex);

								// Create new paragraph with truncated text
								const truncatedChildren = block.children.map((child) =>
									child === firstTextChild ? { ...child, text: truncatedText } : child,
								);

								previewBlocks.push({
									...block,
									children: truncatedChildren,
								});
								foundFirstParagraph = true;
							} else {
								// If no sentence break, show the whole paragraph
								previewBlocks.push(block);
							}
						} else {
							previewBlocks.push(block);
						}
					} else {
						previewBlocks.push(block);
					}
				} else if (block.type !== "paragraph" && !foundFirstParagraph) {
					// Include other blocks (headings, lists, etc.) before first paragraph
					previewBlocks.push(block);
				} else if (foundFirstParagraph) {
					// Stop after processing the first paragraph
					break;
				}
			}

			setPreviewContent(previewBlocks);
		};

		generatePreviewContent();
	}, [content]);

	if (!content || content.length === 0) {
		return null;
	}

	const hasMoreContent = JSON.stringify(content) !== JSON.stringify(previewContent);

	return (
		<Card className="mb-6 w-full overflow-hidden transition-all duration-300 hover:shadow-md">
			<CardHeader className="pb-0">
				<div className="flex items-center justify-between">
					<CardTitle className="flex items-center space-x-2 text-lg">
						<School className="h-5 w-5 text-primary" />
						<span>{title}</span>
					</CardTitle>
				</div>
			</CardHeader>

			<CardContent className="-mt-10 pt-0">
				{isExpanded ? (
					<div className="fade-in animate-in duration-300">
						<RichTextRenderer content={content} />
						{hasMoreContent && (
							<div className="flex justify-between">
								<p>. . .</p>
								<Button
									variant="outline"
									size="sm"
									onClick={() => setIsExpanded(!isExpanded)}
									className="flex items-center space-x-1 transition-all duration-300"
									aria-expanded={isExpanded}
								>
									<span className="text-sm">Daha Az Göster</span>
									{isExpanded && (
										<ChevronUp className="h-4 w-4 transition-transform duration-300" />
									)}
								</Button>
							</div>
						)}
					</div>
				) : (
					<div className="space-y-4">
						{previewContent.length > 0 ? (
							<div className="fade-in animate-in duration-300">
								<RichTextRenderer content={previewContent} />
								{hasMoreContent && (
									<div className="flex justify-between">
										<p>...</p>
										<Button
											variant="outline"
											size="sm"
											onClick={() => setIsExpanded(!isExpanded)}
											className="flex items-center space-x-1 transition-all duration-300"
											aria-expanded={isExpanded}
										>
											<span className="text-sm">Devamını Oku</span>
											{!isExpanded && (
												<ChevronDown className="h-4 w-4 transition-transform duration-300" />
											)}
										</Button>
									</div>
								)}
							</div>
						) : (
							<div className="py-6 text-center text-muted-foreground">
								<FileText className="mx-auto mb-2 h-8 w-8" />
								<p>İçerik bulunamadı</p>
							</div>
						)}
					</div>
				)}
			</CardContent>
		</Card>
	);
}
