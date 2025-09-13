"use client";

import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import Image from "next/image";
import React from "react";

interface BlogRichTextRendererProps {
	content: any[];
	className?: string;
}

const BlogRichTextRenderer: React.FC<BlogRichTextRendererProps> = ({ content, className = "" }) => {
	const renderHeading = (children: React.ReactNode, level: number) => {
		const HeadingTag = `h${level}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

		return React.createElement(
			HeadingTag,
			{
				className:
					level === 1
						? "text-2xl font-bold tracking-tight prose-gray mx-auto dark:prose-invert"
						: "text-xl font-semibold prose-gray mx-auto dark:prose-invert",
			},
			children,
		);
	};

	return (
		<article className={`relative ${className}`}>
			{/* Artistic Background Elements */}
			<div className="-z-10 pointer-events-none fixed inset-0 overflow-hidden">
				<div className="absolute top-20 left-10 h-72 w-72 animate-pulse rounded-full bg-gradient-to-br from-pink-200/20 via-purple-200/20 to-blue-200/20 blur-3xl" />
				<div
					className="absolute top-96 right-20 h-96 w-96 animate-pulse rounded-full bg-gradient-to-bl from-yellow-200/15 via-orange-200/15 to-red-200/15 blur-3xl"
					style={{ animationDelay: "2s" }}
				/>
				<div
					className="absolute bottom-20 left-1/3 h-80 w-80 animate-pulse rounded-full bg-gradient-to-tr from-green-200/10 via-teal-200/10 to-cyan-200/10 blur-3xl"
					style={{ animationDelay: "4s" }}
				/>
			</div>

			<BlocksRenderer
				content={content}
				blocks={{
					paragraph: ({ children }) => {
						// Check if `children` already contains block-level elements
						const hasBlockElements = React.Children.toArray(children).some(
							(child) =>
								React.isValidElement(child) &&
								(child.type === "h1" || child.type === "h2" || child.type === "div"),
						);

						// If block elements are present, don't wrap in <p>
						if (hasBlockElements) {
							return <>{children}</>;
						}

						// Safe to wrap inline content in <p>
						return <p className="max-w-3xl text-gray-600 text-lg leading-relaxed">{children}</p>;
					},

					heading: ({ children, level }) => {
						return renderHeading(children, level);
					},
					image: ({ image }) => {
						if (!image || !image.url) {
							console.error("Invalid image data", image);
							return null;
						}
						const { url, alternativeText, width, height } = image;
						return (
							<Image
								src={url}
								alt={alternativeText || ""}
								width={width || 500}
								height={height || 300}
								layout="responsive"
								className="prose-image mx-auto"
							/>
						);
					},
					quote: (props) => (
						<blockquote className="my-4 border-gray-500 border-l-4 pl-4 italic">
							<p>{props.children}</p>
						</blockquote>
					),
					list: ({ children, format }) => {
						return format === "ordered" ? (
							<ol className="my-4 list-inside list-decimal space-y-2 pl-5">{children}</ol>
						) : (
							<ul className="my-4 list-inside list-disc space-y-2 pl-5">{children}</ul>
						);
					},
					"list-item": ({ children }) => <li className="ml-2">{children}</li>,
				}}
				modifiers={{
					bold: ({ children }) => <strong className="font-bold">{children}</strong>,
					italic: ({ children }) => <span className="italic">{children}</span>,
					strikethrough: ({ children }) => <span className="line-through">{children}</span>,
				}}
			/>
		</article>
	);
};

export default BlogRichTextRenderer;
