import { getAdmissionScoreBySlug, getBlogBySlug, getPageBySlug, getVideoBySlug } from "@/lib/strapi";
import AdmissionScorePage from "@/components/pages/admission-score";
import VideoPage from "@/components/pages/video";
import BlogPage from "@/components/pages/blog";
import { BreadcrumbNav } from "@/components/layout/breadcrum-nav";
import ExpandableContentCard from "@/components/expandable-content-card";
import RelatedDataSection from "@/sections/related-data-section";

interface PageProps {
    params: Promise<{ slug: string, subSlug: string }>
    searchParams: Promise<{ video?: string }>
}

export default async function SayfaDetayi({ params, searchParams }: PageProps) {
    const { slug, subSlug } = await params
    const { video: videoParam } = await searchParams

    let video = undefined;
    let blog = undefined;
    let admissionScore = undefined;

    const page = await getPageBySlug(slug)

    let relatedData = undefined

    switch(page?.pageType) {   
        case "Üniversite Taban Puanları":
            admissionScore = await getAdmissionScoreBySlug(subSlug)
            relatedData = admissionScore?.related_datas?.map((data) => ({
                title: data.title,
                href: `/sayfalar/${slug}/${data.slug}`
            }))
            break;
        case "Bölüm Taban Puanları":
            admissionScore = await getAdmissionScoreBySlug(subSlug)
            relatedData = admissionScore?.related_datas?.map((data) => ({
                title: data.title,
                href: `/sayfalar/${slug}/${data.slug}`
            }))
            break;
        case "Videolar":
            video = await getVideoBySlug(subSlug)
            relatedData = video?.related_datas?.map((data) => ({
                title: data.title,
                href: `/sayfalar/${slug}/${data.slug}`
            }))
            break;
        case "Bloglar":
            blog = await getBlogBySlug(subSlug)
            relatedData = blog?.related_datas?.map((data) => ({
                title: data.title,
                href: `/sayfalar/${slug}/${data.slug}`
            }))
            break;
    }

    // Handle admission score page
    if (admissionScore) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
                <BreadcrumbNav 
                    breadcrumbs={[
                        { label: page?.title || '', href: `/sayfalar/${slug}` },
                        { label: admissionScore?.title || '', href: `/sayfalar/${slug}/${subSlug}` }
                    ]} 
                />
                {admissionScore.university || admissionScore.department ? (
                    <div className="container mx-auto px-4 py-6">
                        <ExpandableContentCard 
                            title="Okul Detayları" 
                            content={admissionScore.university ? 
                                admissionScore.university.content : 
                                admissionScore.department ? admissionScore.department.content : []} 
                        />
                    </div>
                ) : (
                    <AdmissionScorePage admissionScore={admissionScore} />
                )}
                <AdmissionScorePage admissionScore={admissionScore} />
                {relatedData && <RelatedDataSection title="İlgili Sayfalar" items={relatedData} />}
            </div>
        )
    }

    // Handle video page
    if (video) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
                <BreadcrumbNav 
                    breadcrumbs={[
                        { label: page?.title || '', href: `/sayfalar/${slug}` },
                        { label: video?.title || '', href: `/sayfalar/${slug}/${subSlug}` }
                    ]} 
                />
                <VideoPage video={video} currentVideoSlug={videoParam} />
                {relatedData && (
                    <div className="container mx-auto px-4 py-6">
                        <RelatedDataSection title="İlgili Videolar" items={relatedData} />
                    </div>
                )}
            </div>
        )
    }

    // Handle blog page
    if (blog) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
                <BreadcrumbNav 
                    breadcrumbs={[
                        { label: page?.title || '', href: `/sayfalar/${slug}` },
                        { label: blog?.title || '', href: `/sayfalar/${slug}/${subSlug}` }
                    ]} 
                />
                <BlogPage blog={blog} />
                {relatedData && (
                    <div className="container mx-auto px-4 py-6">
                        <RelatedDataSection title="İlgili Blog Yazıları" items={relatedData} />
                    </div>
                )}
            </div>
        )
    }

    
    return (
        <div>
            <h1>Sayfa Detayı</h1>
            {/* Add other page type renderers here */}
        </div>
    )
}