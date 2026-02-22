import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import AdmissionScoreTableLoading from "@/components/features/admission/admission-score-table-loading";
import AdmissionScoreTableServer from "@/components/features/admission/admission-score-table-server";
import BlogPage from "@/components/features/blog/blog";
import VideoPage from "@/components/features/course/video";
import { BreadcrumbNav } from "@/components/layout/breadcrum-nav";
import ExpandableContentCard from "@/components/shared/cards/expandable-content-card";
import { withNotFoundHandler } from "@/lib/errors";
import { generateSEOMetadata } from "@/lib/seo";
import {
	getAdmissionScoreBySlug,
	getBlogBySlug,
	getPageBySlug,
	getVideoBySlug,
} from "@/lib/strapi";
import RelatedDataSection from "@/sections/related-data-section";

interface PageProps {
	params: Promise<{ slug: string; subSlug: string }>;
	searchParams: Promise<{ video?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const { slug, subSlug } = await params;

	try {
		const page = await getPageBySlug(slug);
		if (!page) {
			return {
				title: "Sayfa Bulunamadı",
				description: "Aradığınız sayfa bulunamadı.",
			};
		}

		// Get the specific content based on page type
		let content: any = null;

		try {
			switch (page.pageType) {
				case "Üniversite Taban Puanları":
				case "Bölüm Taban Puanları": {
					content = await getAdmissionScoreBySlug(subSlug);
					break;
				}
				case "Videolar": {
					content = await getVideoBySlug(subSlug);
					break;
				}
				case "Bloglar": {
					content = await getBlogBySlug(subSlug);
					break;
				}
			}
		} catch (contentError) {
			console.warn(`Warning: Could not fetch content for ${page.pageType}:`, contentError);
			// Continue with page-level SEO if content fetch fails
		}

		// Use content-specific SEO if available, otherwise fall back to page SEO
		const seoContent = content || page;

		return generateSEOMetadata(seoContent, {
			url: `${process.env.NEXT_PUBLIC_FRONTEND_URL || "https://ketaakademi.com"}/sayfalar/${slug}/${subSlug}`,
			type: "article",
		});
	} catch (error) {
		console.error("Error generating metadata:", error);
		return {
			title: "Sayfa Yükleniyor",
			description: "Sayfa yüklenirken bir hata oluştu.",
		};
	}
}

export default async function SayfaDetayi({ params, searchParams }: Readonly<PageProps>) {
	const { slug, subSlug } = await params;
	const { video: videoParam } = await searchParams;

	const page = await getPageBySlug(slug);
	if (!page) {
		notFound();
	}

	// --- Define shared breadcrumb ---
	const breadcrumbs = [
		{ label: page.title, href: `/sayfalar/${slug}` },
		{ label: "Yükleniyor...", href: `/sayfalar/${slug}/${subSlug}` },
	];

	// --- Map pageType to data fetching and rendering ---
	switch (page.pageType) {
		case "Üniversite Taban Puanları":
		case "Bölüm Taban Puanları": {
			return await withNotFoundHandler(
				async () => {
					const admissionScore = await getAdmissionScoreBySlug(subSlug);
					if (!admissionScore) notFound();

					const relatedData = admissionScore.related_datas?.map((data) => ({
						title: data.title,
						href: `/sayfalar/${slug}/${data.slug}`,
					}));

					const getTitle = () => {
						if (admissionScore.university) {
							return "Okul Detayları";
						}
						if (admissionScore.department) {
							return "Bölüm Detayları";
						}
						return "Genel Detaylar";
					};

					const getContent = () => {
						if (admissionScore.university) {
							return admissionScore.university.content;
						}
						if (admissionScore.department) {
							return admissionScore.department.content;
						}
						if (admissionScore.content) {
							return admissionScore.content;
						}
						return [];
					};

					return (
						<div className="min-h-screen">
							<BreadcrumbNav
								breadcrumbs={[
									...breadcrumbs.slice(0, 1),
									{
										label: admissionScore.title,
										href: `/sayfalar/${slug}/${subSlug}`,
									},
								]}
							/>
							<div className="container mx-auto px-4 py-6">
								{admissionScore.university ||
								admissionScore.department ||
								admissionScore.content ? (
									<ExpandableContentCard title={getTitle()} content={getContent()} />
								) : null}
								<Suspense fallback={<AdmissionScoreTableLoading />}>
									<AdmissionScoreTableServer
										slug={admissionScore.slug}
										title={admissionScore.title}
									/>
								</Suspense>
							</div>
							{relatedData && <RelatedDataSection title="İlgili Sayfalar" items={relatedData} />}
						</div>
					);
				},
				<div className="min-h-screen">
					<BreadcrumbNav breadcrumbs={breadcrumbs} />
					<div className="container mx-auto px-4 py-6">
						<div className="text-center">
							<h1 className="mb-4 font-bold text-2xl text-red-600">Veri Yüklenirken Hata Oluştu</h1>
							<p className="text-gray-600">
								{page.pageType} verisi yüklenirken bir hata oluştu. Lütfen daha sonra tekrar
								deneyin.
							</p>
						</div>
					</div>
				</div>,
				{
					contentType: page.pageType,
					requestedSlug: subSlug,
					parentSlug: slug,
				},
			);
		}

		case "Videolar": {
			return await withNotFoundHandler(
				async () => {
					const video = await getVideoBySlug(subSlug);
					if (!video) notFound();

					const relatedData = video.related_datas?.map((data) => ({
						title: data.title,
						href: `/sayfalar/${slug}/${data.slug}`,
					}));

					return (
						<div className="min-h-screen">
							<BreadcrumbNav
								breadcrumbs={[
									...breadcrumbs.slice(0, 1),
									{ label: video.title, href: `/sayfalar/${slug}/${subSlug}` },
								]}
							/>
							<VideoPage video={video} currentVideoSlug={videoParam} />
							{relatedData && (
								<div className="container mx-auto px-4 py-6">
									<RelatedDataSection title="İlgili Videolar" items={relatedData} />
								</div>
							)}
						</div>
					);
				},
				<div className="min-h-screen">
					<BreadcrumbNav breadcrumbs={breadcrumbs} />
					<div className="container mx-auto px-4 py-6">
						<div className="text-center">
							<h1 className="mb-4 font-bold text-2xl text-red-600">Veri Yüklenirken Hata Oluştu</h1>
							<p className="text-gray-600">
								Video verisi yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.
							</p>
						</div>
					</div>
				</div>,
				{
					contentType: "Videolar",
					requestedSlug: subSlug,
					parentSlug: slug,
				},
			);
		}

		case "Bloglar": {
			return await withNotFoundHandler(
				async () => {
					const blog = await getBlogBySlug(subSlug);
					if (!blog) notFound();

					const relatedData = blog.related_datas?.map((data) => ({
						title: data.title,
						href: `/sayfalar/${slug}/${data.slug}`,
					}));

					return (
						<div className="min-h-screen">
							<BreadcrumbNav
								breadcrumbs={[
									...breadcrumbs.slice(0, 1),
									{ label: blog.title, href: `/sayfalar/${slug}/${subSlug}` },
								]}
							/>
							<BlogPage blog={blog} />
							{relatedData && (
								<div className="container mx-auto px-6">
									<RelatedDataSection title="İlgili Blog Yazıları" items={relatedData} />
								</div>
							)}
						</div>
					);
				},
				<div className="min-h-screen">
					<BreadcrumbNav breadcrumbs={breadcrumbs} />
					<div className="container mx-auto px-4 py-6">
						<div className="text-center">
							<h1 className="mb-4 font-bold text-2xl text-red-600">Veri Yüklenirken Hata Oluştu</h1>
							<p className="text-gray-600">
								Blog verisi yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.
							</p>
						</div>
					</div>
				</div>,
				{
					contentType: "Bloglar",
					requestedSlug: subSlug,
					parentSlug: slug,
				},
			);
		}

		default:
			return (
				<div className="container mx-auto px-4 py-8 text-center">
					<h1 className="font-bold text-2xl">Desteklenmeyen sayfa türü</h1>
				</div>
			);
	}
}
