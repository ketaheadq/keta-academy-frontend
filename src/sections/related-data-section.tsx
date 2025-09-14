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
								className="group flex items-center space-x-2 rounded-lg bg-gray-50 p-3 transition-colors hover:bg-gray-100"
							>
								<ExternalLink className="h-4 w-4 shrink-0 text-blue-600" />
								<span className="truncate font-medium text-gray-900 text-sm">{item.title}</span>
							</Link>
						))}
					</div>
				</CardContent>
			</Card>
		</section>
	);
}
