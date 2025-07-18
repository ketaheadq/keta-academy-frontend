import { Metadata } from "next"
import { StrapiPage, StrapiCourse, StrapiBlog, StrapiVideo, StrapiAdmissionScore, StrapiPageSEO, StrapiSocialMedia } from "./strapi"

// Types for different content that can have SEO
export type SEOContent = StrapiPage | StrapiCourse | StrapiBlog | StrapiVideo | StrapiAdmissionScore

export interface SEOConfig {
  title?: string
  description?: string
  keywords?: string[]
  type?: 'website' | 'article'
  image?: string
  url?: string
  siteName?: string
  twitterHandle?: string
  locale?: string
}

// Default SEO configuration
const DEFAULT_SEO: SEOConfig = {
  siteName: 'Keta Akademi',
  twitterHandle: '@ketaakademi',
  locale: 'tr_TR',
  type: 'website'
}

/**
 * Generate metadata for any content type with SEO support
 */
export function generateSEOMetadata(
  content: SEOContent,
  config: Partial<SEOConfig> = {}
): Metadata {
  const seoConfig = { ...DEFAULT_SEO, ...config }
  
  // Extract SEO data if available (for pages)
  const seoData: StrapiPageSEO | undefined = 'SEO' in content ? content.SEO : undefined
  
  // Generate title
  const title = seoData?.metaTitle || 
                config.title || 
                generateDefaultTitle(content, seoConfig.siteName!)
  
  // Generate description
  const description = seoData?.metaDescription || 
                     config.description || 
                     generateDefaultDescription(content)
  
  // Generate keywords
  const keywords = seoData?.keywords || 
                  config.keywords?.join(', ') || 
                  generateDefaultKeywords(content)
  
  // Generate canonical URL
  const canonicalUrl = seoData?.canonicalURL || 
                      config.url || 
                      generateDefaultURL(content)
  
  // Check if indexing is prevented
  const preventIndexing = seoData?.preventIndexing || false
  
  // Get images
  const metaImage = seoData?.metaImage
  const ogImage = seoData?.socialMedia?.find((sm: StrapiSocialMedia) => sm.socialNetwork === 'Facebook')?.image || metaImage
  const twitterImage = seoData?.socialMedia?.find((sm: StrapiSocialMedia) => sm.socialNetwork === 'Twitter')?.image || metaImage
  
  // Generate social media content
  const ogTitle = seoData?.socialMedia?.find((sm: StrapiSocialMedia) => sm.socialNetwork === 'Facebook')?.title || title
  const ogDescription = seoData?.socialMedia?.find((sm: StrapiSocialMedia) => sm.socialNetwork === 'Facebook')?.description || description
  const twitterTitle = seoData?.socialMedia?.find((sm: StrapiSocialMedia) => sm.socialNetwork === 'Twitter')?.title || title
  const twitterDescription = seoData?.socialMedia?.find((sm: StrapiSocialMedia) => sm.socialNetwork === 'Twitter')?.description || description

  return {
    title,
    description: description.substring(0, 160),
    keywords,
    authors: [{ name: seoConfig.siteName! }],
    robots: {
      index: !preventIndexing,
      follow: !preventIndexing,
      googleBot: {
        index: !preventIndexing,
        follow: !preventIndexing,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription.substring(0, 160),
      type: seoConfig.type!,
      locale: seoConfig.locale!,
      url: canonicalUrl,
      siteName: seoConfig.siteName!,
      ...(ogImage && {
        images: [{
          url: ogImage.url,
          width: ogImage.width,
          height: ogImage.height,
          alt: ogImage.alternativeText || title,
        }]
      })
    },
    twitter: {
      card: 'summary_large_image',
      title: twitterTitle,
      description: twitterDescription.substring(0, 160),
      site: seoConfig.twitterHandle!,
      ...(twitterImage && {
        images: [{
          url: twitterImage.url,
          alt: twitterImage.alternativeText || title,
        }]
      })
    },
    alternates: {
      canonical: canonicalUrl,
    },
  }
}

/**
 * Generate structured data for any content type
 */
export function generateStructuredData(
  content: SEOContent,
  config: Partial<SEOConfig> = {}
): object {
  const seoConfig = { ...DEFAULT_SEO, ...config }
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ketaakademi.com'
  
  const baseSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": content.title,
    "description": generateDefaultDescription(content),
    "url": config.url || generateDefaultURL(content),
    "inLanguage": "tr-TR",
    "isPartOf": {
      "@type": "WebSite",
      "name": seoConfig.siteName!,
      "url": baseUrl
    }
  }

  // Add specific schema based on content type
  if ('pageType' in content) {
    // Page content
    return {
      ...baseSchema,
      "breadcrumb": {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Ana Sayfa",
            "item": baseUrl
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": content.title,
            "item": config.url || generateDefaultURL(content)
          }
        ]
      }
    }
  } else if ('videoURL' in content || 'href' in content) {
    // Video content
    return {
      ...baseSchema,
      "@type": "VideoObject",
      "name": content.title,
      "description": generateDefaultDescription(content),
      "uploadDate": content.publishedAt
    }
  } else if ('content' in content && Array.isArray(content.content)) {
    // Blog/Article content
    return {
      ...baseSchema,
      "@type": "Article",
      "headline": content.title,
      "datePublished": content.publishedAt,
      "dateModified": content.updatedAt,
      "author": {
        "@type": "Organization",
        "name": seoConfig.siteName!
      }
    }
  }

  return baseSchema
}

// Helper functions
function generateDefaultTitle(content: SEOContent, siteName: string): string {
  return `${content.title} | ${siteName}`
}

function generateDefaultDescription(content: SEOContent): string {
  if ('pageType' in content) {
    // Page content
    switch (content.pageType) {
      case 'Üniversite Taban Puanları':
        return `${content.title} - Güncel üniversite taban puanları, sıralama bilgileri ve detaylı analiz. 2024 YKS taban puanları ve başarı sıralamaları.`
      case 'Bölüm Taban Puanları':
        return `${content.title} - Bölüm bazında taban puanları, kontenjanlar ve yerleştirme bilgileri. YKS tercih rehberi.`
      case 'Videolar':
        return `${content.title} - Eğitim videoları, ders anlatımları ve motivasyon içerikleri. Ücretsiz online eğitim videoları.`
      case 'Bloglar':
        return `${content.title} - Eğitim blog yazıları, sınav hazırlık ipuçları ve akademik rehberlik içerikleri.`
      default:
        return `${content.title} - Keta Akademi`
    }
  } else if ('description' in content) {
    // Course or other content with description
    return content.description
  } else if ('content' in content && Array.isArray(content.content)) {
    // Blog content - extract text from first block
    for (const block of content.content) {
      if (block.children && block.children.length > 0) {
        const text = block.children[0]?.text
        if (text && text.trim()) {
          return text.substring(0, 160)
        }
      }
    }
    return `${content.title} - Keta Akademi blog yazısı`
  }
  
  return `${content.title} - Keta Akademi`
}

function generateDefaultKeywords(content: SEOContent): string {
  const baseKeywords = ['Keta Akademi', 'eğitim', 'online eğitim']
  
  if ('pageType' in content) {
    switch (content.pageType) {
      case 'Üniversite Taban Puanları':
      case 'Bölüm Taban Puanları':
        baseKeywords.push('taban puanları', 'üniversite', 'YKS', 'sınav hazırlık', 'tercih rehberi')
        break
      case 'Videolar':
        baseKeywords.push('eğitim videoları', 'ders anlatımı', 'online ders', 'video dersler')
        break
      case 'Bloglar':
        baseKeywords.push('blog', 'eğitim makaleleri', 'sınav ipuçları', 'akademik rehberlik')
        break
    }
  } else if ('subject' in content && content.subject) {
    // Course content
    baseKeywords.push('kurs', 'ders', content.subject.title)
  } else if ('href' in content) {
    // Video content
    baseKeywords.push('video', 'eğitim videosu', 'ders anlatımı')
  } else if ('content' in content && Array.isArray(content.content)) {
    // Blog content
    baseKeywords.push('blog', 'makale', 'eğitim yazısı')
  }
  
  baseKeywords.push(content.title)
  return baseKeywords.join(', ')
}

function generateDefaultURL(content: SEOContent): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ketaakademi.com'
  
  if ('pageType' in content) {
    return `${baseUrl}/sayfalar/${content.slug}`
  } else if ('subject' in content) {
    return `${baseUrl}/kurslar/${content.slug}`
  } else if ('href' in content) {
    return `${baseUrl}/videos/${content.slug}`
  } else if ('content' in content && Array.isArray(content.content)) {
    return `${baseUrl}/blogs/${content.slug}`
  }
  
  return baseUrl
} 