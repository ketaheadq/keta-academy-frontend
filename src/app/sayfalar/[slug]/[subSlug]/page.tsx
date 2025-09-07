import ExpandableContentCard from "@/components/cards/expandable-content-card";
import { BreadcrumbNav } from "@/components/layout/breadcrum-nav";
import AdmissionScorePage from "@/components/pages/admission-score";
import BlogPage from "@/components/pages/blog";
import VideoPage from "@/components/pages/video";
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

export default async function SayfaDetayi({ params, searchParams }: PageProps) {
	const { slug, subSlug } = await params;
	const { video: videoParam } = await searchParams;

	const page = await getPageBySlug(slug);
	if (!page) {
		return <div>Sayfa bulunamadı</div>;
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
			const admissionScore = await getAdmissionScoreBySlug(subSlug);
			if (!admissionScore) return <div>Veri bulunamadı</div>;

			const relatedData = admissionScore.related_datas?.map((data) => ({
				title: data.title,
				href: `/sayfalar/${slug}/${data.slug}`,
			}));

			return (
				<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
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
							<ExpandableContentCard
								title={
									admissionScore.university
										? "Okul Detayları"
										: admissionScore.department
											? "Bölüm Detayları"
											: "Genel Detaylar"
								}
								content={
									admissionScore.university
										? admissionScore.university.content
										: admissionScore.department
											? admissionScore.department.content
											: admissionScore.content
												? admissionScore.content
												: []
								}
							/>
						) : null}
						<AdmissionScorePage admissionScore={admissionScore} />
					</div>
					{relatedData && (
						<RelatedDataSection title="İlgili Sayfalar" items={relatedData} />
					)}
				</div>
			);
		}

		case "Videolar": {
			const video = await getVideoBySlug(subSlug);
			if (!video) return <div>Video bulunamadı</div>;

			const relatedData = video.related_datas?.map((data) => ({
				title: data.title,
				href: `/sayfalar/${slug}/${data.slug}`,
			}));

			return (
				<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
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
		}

		case "Bloglar": {
			const blog = await getBlogBySlug(subSlug);
			if (!blog) return <div>Blog bulunamadı</div>;

			const relatedData = blog.related_datas?.map((data) => ({
				title: data.title,
				href: `/sayfalar/${slug}/${data.slug}`,
			}));

			return (
				<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
					<BreadcrumbNav
						breadcrumbs={[
							...breadcrumbs.slice(0, 1),
							{ label: blog.title, href: `/sayfalar/${slug}/${subSlug}` },
						]}
					/>
					<BlogPage blog={blog} />
					{relatedData && (
						<div className="container mx-auto px-4 py-6">
							<RelatedDataSection
								title="İlgili Blog Yazıları"
								items={relatedData}
							/>
						</div>
					)}
				</div>
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
