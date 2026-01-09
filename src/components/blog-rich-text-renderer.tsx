"use client";

import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import { Code2, ExternalLink, Quote } from "lucide-react";
import type React from "react";
import { ImageModifierComponent } from "./ui/blocks";
import {
	BoldModifierComponent,
	CodeModifierComponent,
	ItalicModifierComponent,
	StrikethroughModifierComponent,
	UnderlineModifierComponent,
} from "./ui/modifiers";

interface BlogRichTextRendererProps {
	content: any[];
	className?: string;
}

const BlogRichTextRenderer: React.FC<BlogRichTextRendererProps> = ({ content, className = "" }) => {
	const modifiers = {
		bold: BoldModifierComponent,
		italic: ItalicModifierComponent,
		underline: UnderlineModifierComponent,
		strikethrough: StrikethroughModifierComponent,
		code: CodeModifierComponent,
	};
	return (
		<div className={`blog-content ${className}`}>
			<BlocksRenderer
				content={content}
				blocks={{
					paragraph: ({ children }) => (
						<p className="mb-6 font-light text-gray-800 text-lg leading-relaxed tracking-wide">
							{children}
						</p>
					),
					heading: ({ children, level }) => {
						const headingStyles = {
							1: "text-5xl font-black text-gray-900 mb-8 mt-12 leading-tight bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent",
							2: "text-4xl font-bold text-gray-900 mb-6 mt-10 leading-tight relative before:content-[''] before:absolute before:left-0 before:-bottom-2 before:w-16 before:h-1 before:bg-linear-to-r before:from-blue-500 before:to-purple-500 before:rounded-full",
							3: "text-3xl font-bold text-gray-800 mb-5 mt-8 leading-tight",
							4: "text-2xl font-semibold text-gray-800 mb-4 mt-6 leading-tight",
							5: "text-xl font-semibold text-gray-700 mb-3 mt-5 leading-tight",
							6: "text-lg font-semibold text-gray-700 mb-2 mt-4 leading-tight",
						};

						switch (level) {
							case 1:
								return <h1 className={headingStyles[1]}>{children}</h1>;
							case 2:
								return <h2 className={headingStyles[2]}>{children}</h2>;
							case 3:
								return <h3 className={headingStyles[3]}>{children}</h3>;
							case 4:
								return <h4 className={headingStyles[4]}>{children}</h4>;
							case 5:
								return <h5 className={headingStyles[5]}>{children}</h5>;
							case 6:
								return <h6 className={headingStyles[6]}>{children}</h6>;
							default:
								return <h2 className={headingStyles[2]}>{children}</h2>;
						}
					},
					list: ({ children, format }) => {
						const Tag = format === "ordered" ? "ol" : "ul";
						const listClass =
							format === "ordered"
								? "list-none counter-reset-item mb-8 space-y-3"
								: "list-none mb-8 space-y-3";
						return <Tag className={listClass}>{children}</Tag>;
					},
					"list-item": ({ children }) => (
						<li className="relative pl-8 font-light text-gray-800 text-lg leading-relaxed before:absolute before:left-0 before:font-bold before:text-blue-500 before:content-['▶']">
							{children}
						</li>
					),
					quote: ({ children }) => (
						<div className="relative my-10 rounded-2xl border-blue-500 border-l-4 bg-linear-to-r from-blue-50 to-purple-50 p-8 shadow-lg">
							<Quote className="absolute top-4 left-4 h-6 w-6 text-blue-400 opacity-60" />
							<blockquote className="pl-8 font-medium text-gray-700 text-xl italic leading-relaxed">
								{children}
							</blockquote>
						</div>
					),
					code: ({ children }) => (
						<div className="relative my-8 overflow-hidden rounded-2xl shadow-xl">
							<div className="flex items-center gap-2 bg-gray-900 px-4 py-3">
								<Code2 className="h-4 w-4 text-green-400" />
								<span className="font-mono text-gray-300 text-sm">Code</span>
								<div className="ml-auto flex gap-1">
									<div className="h-3 w-3 rounded-full bg-red-500" />
									<div className="h-3 w-3 rounded-full bg-yellow-500" />
									<div className="h-3 w-3 rounded-full bg-green-500" />
								</div>
							</div>
							<pre className="overflow-x-auto bg-gray-950 p-6 text-green-400">
								<code className="font-mono text-sm leading-relaxed">{children}</code>
							</pre>
						</div>
					),
					link: ({ children, url }) => (
						<a
							href={url}
							className="inline-flex items-center gap-1 font-medium text-blue-600 decoration-2 underline-offset-4 transition-all duration-200 hover:text-blue-800 hover:underline"
							target="_blank"
							rel="noopener noreferrer"
						>
							{children}
							<ExternalLink className="h-3 w-3 opacity-70" />
						</a>
					),
					image: ImageModifierComponent,
				}}
				modifiers={modifiers}
			/>
		</div>
	);
};

export default BlogRichTextRenderer;
