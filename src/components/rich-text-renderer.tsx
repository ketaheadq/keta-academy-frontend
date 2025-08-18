"use client";

import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import Image from "next/image";
import type React from "react";

interface RichTextRendererProps {
	content: any[]; // Using any to avoid type conflicts with BlocksRenderer
	className?: string;
}

const RichTextRenderer: React.FC<RichTextRendererProps> = ({
	content,
	className = "",
}) => {
	return (
		<div className={`prose prose-lg max-w-none ${className}`}>
			<BlocksRenderer
				content={content}
				blocks={{
					paragraph: ({ children }) => (
						<p className="mb-4 text-gray-700 leading-relaxed">{children}</p>
					),
					heading: ({ children, level }) => {
						const headingClasses = {
							1: "text-3xl font-bold text-gray-900 mb-6 mt-8",
							2: "text-2xl font-semibold text-gray-900 mb-4 mt-6",
							3: "text-xl font-semibold text-gray-900 mb-3 mt-5",
							4: "text-lg font-semibold text-gray-900 mb-2 mt-4",
							5: "text-base font-semibold text-gray-900 mb-2 mt-3",
							6: "text-sm font-semibold text-gray-900 mb-2 mt-2",
						};

						switch (level) {
							case 1:
								return <h1 className={headingClasses[level]}>{children}</h1>;
							case 2:
								return <h2 className={headingClasses[level]}>{children}</h2>;
							case 3:
								return <h3 className={headingClasses[level]}>{children}</h3>;
							case 4:
								return <h4 className={headingClasses[level]}>{children}</h4>;
							case 5:
								return <h5 className={headingClasses[level]}>{children}</h5>;
							case 6:
								return <h6 className={headingClasses[level]}>{children}</h6>;
							default:
								return <h2 className={headingClasses[2]}>{children}</h2>;
						}
					},
					list: ({ children, format }) => {
						const Tag = format === "ordered" ? "ol" : "ul";
						const listClass =
							format === "ordered"
								? "list-decimal list-inside mb-4 space-y-2"
								: "list-disc list-inside mb-4 space-y-2";
						return <Tag className={listClass}>{children}</Tag>;
					},
					"list-item": ({ children }) => (
						<li className="text-gray-700">{children}</li>
					),
					quote: ({ children }) => (
						<blockquote className="mb-4 border-blue-500 border-l-4 bg-blue-50 py-2 pl-4 text-gray-700 italic">
							{children}
						</blockquote>
					),
					code: ({ children }) => (
						<pre className="mb-4 overflow-x-auto rounded-lg bg-gray-900 p-4 text-white">
							<code>{children}</code>
						</pre>
					),
					link: ({ children, url }) => (
						<a
							href={url}
							className="text-blue-600 underline hover:text-blue-800"
							target="_blank"
							rel="noopener noreferrer"
						>
							{children}
						</a>
					),
					image: ({ image }) => {
						if (!image?.url) return null;

						return (
							<div className="my-6">
								<Image
									src={image.url}
									alt={image.alternativeText || ""}
									width={image.width || 800}
									height={image.height || 600}
									className="h-auto w-full rounded-lg shadow-md"
									style={{
										maxWidth: "100%",
										height: "auto",
									}}
								/>
								{image.caption && (
									<p className="mt-2 text-center text-gray-600 text-sm italic">
										{image.caption}
									</p>
								)}
							</div>
						);
					},
				}}
				modifiers={{
					bold: ({ children }) => <strong>{children}</strong>,
					italic: ({ children }) => <em>{children}</em>,
					underline: ({ children }) => <u>{children}</u>,
					strikethrough: ({ children }) => <s>{children}</s>,
					code: ({ children }) => (
						<code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-sm">
							{children}
						</code>
					),
				}}
			/>
		</div>
	);
};

export default RichTextRenderer;
