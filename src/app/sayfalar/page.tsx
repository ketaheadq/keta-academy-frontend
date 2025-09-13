import Link from "next/link";
import { BreadcrumbNav } from "@/components/layout/breadcrum-nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPageCategories } from "@/lib/strapi";

export default async function SayfalarPage() {
	const pageCategories = await getPageCategories();

	return (
		<div className="mx-auto min-h-screen max-w-6xl">
			<BreadcrumbNav breadcrumbs={[{ label: "Sayfalar", href: "/sayfalar" }]} />

			<div className="py-8">
				<h1 className="mb-8 font-bold text-3xl text-gray-900">Tüm Sayfalar</h1>

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
											className="block rounded-lg border border-gray-200 p-3 transition-colors hover:border-blue-300 hover:bg-blue-50"
										>
											<h3 className="font-medium text-gray-900">{page.title}</h3>
											{page.pageType && (
												<p className="mt-1 text-gray-500 text-sm">Tür: {page.pageType}</p>
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
