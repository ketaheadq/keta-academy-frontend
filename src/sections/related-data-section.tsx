import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RelatedItem {
	title: string;
	href: string;
}

interface RelatedDataSectionProps {
	title?: string;
	items: RelatedItem[];
	className?: string;
}

export default function RelatedDataSection({
	title = "İlgili Sayfalar",
	items,
	className = "",
}: Readonly<RelatedDataSectionProps>) {
	if (!items?.length) return null;

	return (
		<section className={`mb-12 ${className}`.trim()}>
			<Card>
				<CardHeader>
					<CardTitle>{title}</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
						{items.map((item) => (
							<Link
								key={item.href}
								href={item.href}
								className="group bg-secondary hover:bg-accent/10 flex items-center space-x-2 rounded-lg p-3 transition-colors"
							>
								<ExternalLink className="text-accent h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5" />
								<span className="text-foreground group-hover:text-accent truncate text-sm font-medium transition-colors">
									{item.title}
								</span>
							</Link>
						))}
					</div>
				</CardContent>
			</Card>
		</section>
	);
}
