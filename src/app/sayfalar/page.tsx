import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbNav } from "@/components/layout/breadcrum-nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { canonicalUrl } from "@/lib/seo";
import { getPageCategories } from "@/lib/strapi";

export const metadata: Metadata = {
	title: "Tüm Sayfalar | KetaLearn",
	description:
		"Üniversite taban puanları, bölüm tanıtımları, videolar ve blog yazıları — tüm KetaLearn içerikleri.",
	alternates: { canonical: canonicalUrl("/sayfalar") },
};

export default async function SayfalarPage() {
	const pageCategories = await getPageCategories();

	return (
		<div className="mx-auto min-h-screen max-w-6xl">
			<BreadcrumbNav breadcrumbs={[{ label: "Sayfalar", href: "/sayfalar" }]} />

			<div className="py-8">
				<h1 className="text-foreground mb-8 text-3xl font-bold">Tüm Sayfalar</h1>

				<div className="grid gap-8">
					{pageCategories.map((category) => (
						<Card key={category.id}>
							<CardHeader>
								<CardTitle className="text-xl">{category.title}</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="grid gap-2">
									{category.pages.map((page) => (
										<Link
											key={page.id}
											href={`/sayfalar/${page.slug}`}
											className="group hover:border-accent/40 hover:bg-accent/10 block rounded-lg border p-3 transition-colors"
										>
											<h3 className="text-foreground group-hover:text-accent font-medium transition-colors">
												{page.title}
											</h3>
											{page.pageType && (
												<p className="text-muted-foreground mt-1 text-sm">Tür: {page.pageType}</p>
											)}
										</Link>
									))}
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		</div>
	);
}
