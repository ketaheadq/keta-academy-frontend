"use client";

import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import { Code2, ExternalLink, Quote } from "lucide-react";
import type React from "react";
import type { JSX } from "react";
import { ImageModifierComponent } from "@/components/ui/blocks";
import {
	BoldModifierComponent,
	CodeModifierComponent,
	ItalicModifierComponent,
	StrikethroughModifierComponent,
	UnderlineModifierComponent,
} from "@/components/ui/modifiers";

interface BlogRichTextRendererProps {
	content: any[];
	className?: string;
}

const MODIFIERS = {
	bold: BoldModifierComponent,
	italic: ItalicModifierComponent,
	underline: UnderlineModifierComponent,
	strikethrough: StrikethroughModifierComponent,
	code: CodeModifierComponent,
};

const ParagraphBlock = ({ children }: { children?: React.ReactNode }) => (
	<p className="mb-6 font-light text-foreground text-lg leading-relaxed tracking-wide">
		{children}
	</p>
);

const HeadingBlock = ({
	children,
	level,
}: {
	children?: React.ReactNode;
	level: 1 | 2 | 3 | 4 | 5 | 6;
}) => {
	const headingStyles = {
		1: "text-5xl font-black text-foreground mb-8 mt-12 leading-tight bg-linear-to-r from-primary to-primary bg-clip-text text-transparent",
		2: "text-4xl font-bold text-foreground mb-6 mt-10 leading-tight relative before:content-[''] before:absolute before:left-0 before:-bottom-2 before:w-16 before:h-1 before:bg-linear-to-r before:from-primary before:to-primary before:rounded-full",
		3: "text-3xl font-bold text-foreground mb-5 mt-8 leading-tight",
		4: "text-2xl font-semibold text-foreground mb-4 mt-6 leading-tight",
		5: "text-xl font-semibold text-muted-foreground mb-3 mt-5 leading-tight",
		6: "text-lg font-semibold text-muted-foreground mb-2 mt-4 leading-tight",
	};

	const Tag = `h${level}` as keyof JSX.IntrinsicElements;
	return <Tag className={headingStyles[level]}>{children}</Tag>;
};

const ListBlock = ({
	children,
	format,
}: {
	children?: React.ReactNode;
	format: "ordered" | "unordered";
}) => {
	const Tag = format === "ordered" ? "ol" : "ul";
	const listClass =
		format === "ordered"
			? "list-none counter-reset-item mb-8 space-y-3"
			: "list-none mb-8 space-y-3";
	return <Tag className={listClass}>{children}</Tag>;
};

const ListItemBlock = ({ children }: { children?: React.ReactNode }) => (
	<li className="relative pl-8 font-light text-foreground text-lg leading-relaxed before:absolute before:left-0 before:font-bold before:text-primary before:content-['▶']">
		{children}
	</li>
);

const QuoteBlock = ({ children }: { children?: React.ReactNode }) => (
	<div className="relative my-10 rounded-2xl border-primary border-l-4 bg-linear-to-r from-primary/20 to-primary/20 p-8 shadow-lg">
		<Quote className="absolute top-4 left-4 h-6 w-6 text-primary opacity-60" />
		<blockquote className="pl-8 font-medium text-muted-foreground text-xl italic leading-relaxed">
			{children}
		</blockquote>
	</div>
);

const CodeBlock = ({ children }: { children?: React.ReactNode }) => (
	<div className="relative my-8 overflow-hidden rounded-2xl shadow-xl">
		<div className="flex items-center gap-2 bg-foreground px-4 py-3">
			<Code2 className="h-4 w-4 text-primary" />
			<span className="font-mono text-muted-foreground text-sm">Code</span>
			<div className="ml-auto flex gap-1">
				<div className="h-3 w-3 rounded-full bg-destructive" />
				<div className="h-3 w-3 rounded-full bg-accent" />
				<div className="h-3 w-3 rounded-full bg-primary" />
			</div>
		</div>
		<pre className="overflow-x-auto bg-foreground p-6 text-primary">
			<code className="font-mono text-sm leading-relaxed">{children}</code>
		</pre>
	</div>
);

const LinkBlock = ({ children, url }: { children?: React.ReactNode; url: string }) => (
	<a
		href={url}
		className="inline-flex items-center gap-1 font-medium text-primary decoration-2 underline-offset-4 transition-all duration-200 hover:text-primary hover:underline"
		target="_blank"
		rel="noopener noreferrer"
	>
		{children}
		<ExternalLink className="h-3 w-3 opacity-70" />
	</a>
);

const BLOCKS = {
	paragraph: ParagraphBlock,
	heading: HeadingBlock,
	list: ListBlock,
	"list-item": ListItemBlock,
	quote: QuoteBlock,
	code: CodeBlock,
	link: LinkBlock,
	image: ImageModifierComponent,
};

const BlogRichTextRenderer: React.FC<BlogRichTextRendererProps> = ({ content, className = "" }) => {
	return (
		<div className={`blog-content ${className}`}>
			<BlocksRenderer content={content} blocks={BLOCKS} modifiers={MODIFIERS} />
		</div>
	);
};

export default BlogRichTextRenderer;
