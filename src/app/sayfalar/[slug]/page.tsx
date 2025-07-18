import { notFound } from "next/navigation"
import { Metadata } from "next"
import { getPageBySlug, getAdmissionScoresByPage, getVideosByPage, getBlogsByPage } from "@/lib/strapi"
import { generateSEOMetadata, generateStructuredData } from "@/lib/seo"
import { BreadcrumbNav } from "@/components/layout/breadcrum-nav"
import AdmissionGrid from "@/components/grids/admission-grid"
import VideoGrid from "@/components/grids/video-grid"
import BlogGrid from "@/components/grids/blog-grid"
import AdmissionListing from "@/sections/admission-listing-wrapper"
import VideoListing from "@/sections/video-listing-wrapper"
import BlogListing from "@/sections/blog-listing-wrapper"
import PermissionWarning from "@/components/permission-warning"

interface PageProps {
  params: Promise<{ slug: string }>
}

// Generate metadata for SEO using the reusable utility
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  
  try {
    const page = await getPageBySlug(slug)
    
    if (!page) {
      return {
        title: 'Sayfa Bulunamadı',
        description: 'Aradığınız sayfa mevcut değil.'
      }
    }

    return generateSEOMetadata(page, {
      url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://ketaakademi.com'}/sayfalar/${slug}`,
      type: 'website'
    })
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: 'Keta Akademi',
      description: 'Eğitim platformu'
    }
  }
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params
  
  try {
    const page = await getPageBySlug(slug)
    
    if (!page) {
      notFound()
    }

    // Fetch content based on page type
    let content = null
    let popularContent = null
    let itemCount = 0
    
    switch (page.pageType) {
      case 'Üniversite Taban Puanları':
      case 'Bölüm Taban Puanları':
        const admissionScores = await getAdmissionScoresByPage(slug)
        itemCount = admissionScores.length
        
        if (admissionScores.length === 0) {
          content = (
            <PermissionWarning 
              contentType="Taban Puanları" 
              endpoint={`admission-scores?filters[page][slug][$eq]=${slug}`}
            />
          )
        } else {
          // Popular admission scores
          const popularAdmissionScores = admissionScores.filter(item => item.isPopular)
          if (popularAdmissionScores.length > 0) {
            popularContent = (
              <AdmissionListing
                admissionScores={popularAdmissionScores}
                title={`🔥 Popüler ${page.title}`}
              />
            )
          }
          
          content = (
            <AdmissionGrid
              items={admissionScores}
              title={`🎓 Tüm ${page.title}`}
              showRelatedData={true}
            />
          )
        }
        break
        
      case 'Videolar':
        const videos = await getVideosByPage(slug)
        itemCount = videos.length
        
        if (videos.length === 0) {
          content = (
            <PermissionWarning 
              contentType="Videolar" 
              endpoint={`videos?filters[page][slug][$eq]=${slug}`}
            />
          )
        } else {
          // Popular videos
          const popularVideos = videos.filter(item => item.isPopular)
          if (popularVideos.length > 0) {
            popularContent = (
              <VideoListing
                videos={popularVideos}
                title={`🔥 Popüler ${page.title}`}
              />
            )
          }
          
          content = (
            <VideoGrid
              items={videos}
              title={`Tüm ${page.title}`}
              showRelatedData={true}
            />
          )
        }
        break
        
      case 'Bloglar':
        const blogs = await getBlogsByPage(slug)
        itemCount = blogs.length
        
        if (blogs.length === 0) {
          content = (
            <PermissionWarning 
              contentType="Blog Yazıları" 
              endpoint={`blogs?filters[page][slug][$eq]=${slug}`}
            />
          )
        } else {
          // Popular blogs
          const popularBlogs = blogs.filter(item => item.isPopular)
          if (popularBlogs.length > 0) {
            popularContent = (
              <BlogListing
                blogs={popularBlogs}
                title={`🔥 Popüler ${page.title}`}
              />
            )
          }
          
          content = (
            <BlogGrid
              items={blogs}
              title={`Tüm ${page.title}`}
              showRelatedData={true}
            />
          )
        }
        break
        
      case 'Hesaplama Araçları':
        content = (
          <section className="text-center">
            <h2 className="text-2xl font-bold mb-4">Hesaplama Araçları</h2>
            <p className="text-gray-600">Calculation tools will be implemented here</p>
          </section>
        )
        break
        
      default:
        content = (
          <section className="text-center">
            <div className="prose prose-lg mx-auto">
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Sayfa yüklenemedi.
              </p>
            </div>
          </section>
        )
    }

    // Generate structured data using the utility
    const structuredData = generateStructuredData(page, {
      url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://ketaakademi.com'}/sayfalar/${slug}`
    }) as any

    // Add item count to structured data if available
    if (itemCount > 0) {
      structuredData.mainEntity = {
        "@type": "ItemList",
        "numberOfItems": itemCount,
        "name": page.title
      }
    }

    return (
      <>
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData)
          }}
        />
        
        <div className="min-h-screen ">
        <BreadcrumbNav 
            breadcrumbs={[
              { label: page.title, href: `/sayfalar/${slug}` }
            ]} 
          />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <header className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{page.title}</h1>
              {page.pageType !== 'Üniversite Taban Puanları' && 
               page.pageType !== 'Bölüm Taban Puanları' && 
               page.pageType !== 'Videolar' &&
               page.pageType !== 'Bloglar' }
            </header>
            
            {/* Popular Items Section */}
            {popularContent}
            
            {/* Main Content */}
            {content}
          </main>
        </div>
      </>
    )
  } catch (error) {
    console.error('Error fetching page:', error)
    notFound()
  }
} 