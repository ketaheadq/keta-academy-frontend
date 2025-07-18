# SEO Utility Usage Examples

## 🎯 Overview
The new SEO utility (`src/lib/seo.ts`) can be used across any page type for consistent SEO handling. Here are examples:

## 📝 Basic Usage Pattern

```typescript
import { generateSEOMetadata, generateStructuredData } from "@/lib/seo"

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const content = await getContent(params) // Your content fetching
  
  return generateSEOMetadata(content, {
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/your-path/${params.slug}`,
    type: 'article' // or 'website'
  })
}
```

## 🎓 Course Page Example

```typescript
// src/app/kurslar/[slug]/page.tsx
import { generateSEOMetadata, generateStructuredData } from "@/lib/seo"
import { getCourse } from "@/lib/strapi"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const course = await getCourse(slug)
  
  if (!course) {
    return { title: 'Kurs Bulunamadı' }
  }

  return generateSEOMetadata(course, {
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/kurslar/${slug}`,
    type: 'website',
    description: `${course.title} - ${course.description} ${course.subject.title} dersi.`
  })
}

export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const course = await getCourse(slug)
  
  if (!course) notFound()

  const structuredData = generateStructuredData(course, {
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/kurslar/${slug}`
  })

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {/* Your course content */}
    </>
  )
}
```

## 📰 Blog Post Example

```typescript
// src/app/blogs/[slug]/page.tsx
import { generateSEOMetadata, generateStructuredData } from "@/lib/seo"
import { getBlogBySlug } from "@/lib/strapi"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const blog = await getBlogBySlug(slug)
  
  if (!blog) {
    return { title: 'Blog Yazısı Bulunamadı' }
  }

  return generateSEOMetadata(blog, {
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/blogs/${slug}`,
    type: 'article'
  })
}

export default async function BlogPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const blog = await getBlogBySlug(slug)
  
  if (!blog) notFound()

  const structuredData = generateStructuredData(blog, {
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/blogs/${slug}`
  })

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {/* Your blog content */}
    </>
  )
}
```

## 🎥 Video Page Example

```typescript
// src/app/videos/[slug]/page.tsx
import { generateSEOMetadata, generateStructuredData } from "@/lib/seo"
import { getVideoBySlug } from "@/lib/strapi"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const video = await getVideoBySlug(slug)
  
  if (!video) {
    return { title: 'Video Bulunamadı' }
  }

  return generateSEOMetadata(video, {
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/videos/${slug}`,
    type: 'article', // Videos use article type for better social sharing
    description: `${video.title} - Eğitim videosu`
  })
}
```

## 🏠 Homepage Example

```typescript
// src/app/page.tsx
import { generateSEOMetadata } from "@/lib/seo"

export async function generateMetadata(): Promise<Metadata> {
  // Create a mock content object for homepage
  const homepage = {
    title: 'Keta Akademi - Online Eğitim Platformu',
    slug: '',
    publishedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  return generateSEOMetadata(homepage, {
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://ketaakademi.com',
    type: 'website',
    description: 'Keta Akademi ile online eğitim alın. Üniversite hazırlık, taban puanları, videolar ve daha fazlası.',
    keywords: ['online eğitim', 'üniversite hazırlık', 'taban puanları', 'eğitim videoları', 'YKS']
  })
}
```

## 🔧 Custom SEO Override

```typescript
// When you need to override specific SEO fields
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const content = await getContent(params.slug)
  
  return generateSEOMetadata(content, {
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/custom/${params.slug}`,
    type: 'article',
    title: 'Custom Override Title', // Overrides Strapi SEO
    description: 'Custom description', // Overrides Strapi SEO
    keywords: ['custom', 'keywords'] // Overrides Strapi SEO
  })
}
```

## 🌍 Multilingual Support (Future)

```typescript
// If you add multilingual support later
export async function generateMetadata({ params }: { params: Promise<{ slug: string, locale: string }> }): Promise<Metadata> {
  const { slug, locale } = await params
  const content = await getContent(slug, locale)
  
  return generateSEOMetadata(content, {
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/${slug}`,
    locale: locale === 'en' ? 'en_US' : 'tr_TR',
    type: 'website'
  })
}
```

## ✅ Benefits of This Approach

### **Consistency**
- All pages use the same SEO logic
- Same structured data patterns
- Uniform social media handling

### **Maintainability**
- One place to update SEO logic
- Easy to add new content types
- Centralized configuration

### **Flexibility**
- Can override any SEO field when needed
- Supports Strapi SEO components
- Falls back to smart defaults

### **Performance**
- Reusable utility, no duplication
- Efficient metadata generation
- Minimal code per page

### **SEO Excellence**
- Automatic structured data
- Platform-specific social media
- Turkish language optimization
- Search engine best practices

## 🚀 Quick Migration Guide

To migrate existing pages:

1. **Remove old SEO code**
2. **Import the utility**: `import { generateSEOMetadata, generateStructuredData } from "@/lib/seo"`
3. **Replace generateMetadata**: Use the pattern above
4. **Add structured data**: Include the JSON-LD script
5. **Test**: Check that SEO data appears correctly

This approach makes your entire application SEO-consistent with minimal code duplication! 