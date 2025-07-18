# Strapi SEO Setup Guide

## 🎯 Overview
This guide will help you set up SEO components in Strapi so content managers can control all SEO aspects without touching code.

## 📋 Step 1: Create SEO Component

### 1.1 Create SEO Component
In Strapi Admin Panel:

1. Go to **Content-Type Builder**
2. Click **Create new component**
3. **Display name**: `SEO`
4. **Category**: `seo` (create new category)
5. Add the following fields:

#### Required Fields:
```
metaTitle (Text - Short text)
- Required: Yes
- Max length: 60
- Description: "Title that appears in search results"

metaDescription (Text - Long text)
- Required: Yes  
- Max length: 160
- Description: "Description that appears in search results"
```

#### Optional Fields:
```
keywords (Text - Long text)
- Required: No
- Description: "Comma-separated keywords for this page"

canonicalURL (Text - Short text)
- Required: No
- Description: "Canonical URL for this page (leave empty for auto-generate)"

preventIndexing (Boolean)
- Required: No
- Default: false
- Description: "Check this to prevent search engines from indexing this page"

metaImage (Media - Single media)
- Required: No
- Description: "Image for social media sharing (recommended: 1200x630px)"
```

### 1.2 Create Social Media Component

1. **Create new component**
2. **Display name**: `Social Media`
3. **Category**: `seo`
4. Add fields:

```
socialNetwork (Enumeration)
- Values: Facebook, Twitter, LinkedIn, Instagram
- Required: Yes

title (Text - Short text)
- Required: Yes
- Max length: 60

description (Text - Long text)
- Required: Yes
- Max length: 160

image (Media - Single media)
- Required: No
```

### 1.3 Update SEO Component
Add to the SEO component:

```
socialMedia (Component - Repeatable)
- Component: Social Media
- Required: No
- Min: 0
- Max: 4
```

## 📋 Step 2: Add SEO to Page Content Type

1. Go to **Content-Type Builder**
2. Select **Page** content type
3. Click **Add another field**
4. Select **Component**
5. **Display name**: `SEO`
6. **Select component**: `seo.SEO`
7. **Type**: Single component
8. **Required**: No

## 📋 Step 3: Configure Permissions

1. Go to **Settings → Roles → Public**
2. Under **Page** permissions:
   - ✅ Enable **find**
   - ✅ Enable **findOne**
3. **Save**

## 📋 Step 4: Add SEO Data to Pages

Now content managers can:

### 4.1 Edit Any Page
1. Go to **Content Manager → Page**
2. Click on any page
3. Scroll down to find **SEO** section
4. Fill in:
   - **Meta Title**: "2024 Üniversite Taban Puanları | Keta Akademi"
   - **Meta Description**: "Güncel üniversite taban puanları, sıralama bilgileri ve detaylı analiz. YKS tercih rehberi."
   - **Keywords**: "taban puanları, üniversite, YKS, tercih rehberi"

### 4.2 Add Social Media Data
1. Click **Add an entry** under Social Media
2. Select **Facebook**:
   - **Title**: "2024 Üniversite Taban Puanları"
   - **Description**: "En güncel üniversite taban puanları burada!"
   - **Image**: Upload 1200x630px image
3. Add **Twitter** entry similarly

### 4.3 Advanced Options
- **Canonical URL**: Leave empty for auto-generation
- **Prevent Indexing**: Check only for test/private pages
- **Meta Image**: Upload for default social sharing

## 🎨 Content Manager Benefits

### ✅ **Full Control**
- Change page titles without developer
- Update descriptions for better search results
- Add social media specific content
- Control search engine indexing

### ✅ **SEO Best Practices**
- Character limits enforced automatically
- Required fields ensure completeness
- Preview how content appears in search/social

### ✅ **Multi-Platform Optimization**
- Different content for Google vs Facebook vs Twitter
- Platform-specific image sizes
- Tailored messaging per platform

## 🔍 Testing Your SEO

### Google Search Preview
After setting up SEO data, your pages will show:
```
2024 Üniversite Taban Puanları | Keta Akademi
https://yourdomain.com/sayfalar/universite-taban-puanlari
Güncel üniversite taban puanları, sıralama bilgileri ve detaylı analiz. YKS tercih rehberi.
```

### Facebook/Social Sharing
When shared on social media:
- **Title**: Your custom social media title
- **Description**: Your custom social description  
- **Image**: Your uploaded social image
- **URL**: Clean, SEO-friendly URL

## 🚀 Advanced Features

### Structured Data
The system automatically generates:
- **WebPage schema** for better search understanding
- **Breadcrumb schema** for search result enhancement
- **ItemList schema** for content collections

### Dynamic Fallbacks
If SEO fields are empty:
- **Auto-generates** titles from page title
- **Creates** descriptions based on page type
- **Builds** keywords from content type and title
- **Uses** default images from site settings

## 📱 Mobile & Performance
- **Responsive meta tags** automatically included
- **Fast loading** with Next.js optimization
- **Turkish language** support with proper locale tags
- **Image optimization** for social media previews

This setup gives content managers complete control over SEO while maintaining technical excellence! 