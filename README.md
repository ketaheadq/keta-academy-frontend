# KetaLearn Frontend

![KetaLearn](public/favicon/apple-touch-icon.png)

An interactive education platform designed to help students succeed in university entrance exams. KetaLearn provides comprehensive course lectures, up-to-date base-ceiling points, blogs, and interactive publications.

## 🎨 Design System

- **Colors:** [Tailwind CSS 4](https://tailwindcss.com) (primary slate-700 #0891b2, rose-600 (#EC003F))
- **Shadcn UI:** [Shadcn UI](https://ui.shadcn.com)
- **React bits:** [React bits](https://reactbits.dev)

## 🚀 Tech Stack

- **Core:** [Next.js 15+](https://nextjs.org) (App Router), [React 19](https://react.dev)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com), [Shadcn UI](https://ui.shadcn.com)
- **CMS:** [Strapi](https://strapi.io) (Headless)
- **State Management:** [Zustand](https://docs.pmnd.rs/zustand/getting-started/introduction)
- **Icons:** [Lucide React](https://lucide.dev)
- **Quality Tools:** [Biome](https://biomejs.dev) (Linting/Formatting), [Husky](https://typicode.github.io/husky/)
- **Deployment:** Docker & Vercel-ready

## 🛠️ Getting Started

### 1. Prerequisites
- Node.js 20+ 
- pnpm (recommended)

### 2. Installation
```bash
pnpm install
```

### 3. Environment Variables
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_STRAPI_API_URL=your_strapi_url
STRAPI_API_TOKEN=your_api_token
```

### 4. Development
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) to see the result.

## 🗺️ Roadmap to Excellence

This roadmap outlines the planned improvements to make KetaLearn the premier educational platform.

### 📍 Phase 1: Performance & SEO (Immediate)
- [ ] **Structured Data:** Implement JSON-LD for Courses and Organization to enhance search engine snippets.
- [ ] **Image Audit:** Optimize all CMS-delivered images using `next/image` with dynamic blur placeholders.
- [ ] **Expanded Sitemap:** Include individual Courses and dynamic Topic routes in `sitemap.ts`.
- [ ] **Font Optimization:** Fine-tune font loading to eliminate Layout Shift (CLS).

### 📍 Phase 2: Visual & UX Excellence (Premium Feel)
- [ ] **Colors & Design:** change all bg-orange-xxx to primary etc. and make design to be more premium. 
- [ ] **Micro-animations:** Integrate `three.js` for subtle, high-quality interactions and page transitions.
- [ ] **Skeleton States:** Replace basic loading spinners with polished skeleton loaders for a smoother perceived performance.
- [ ] **Glassmorphism:** Apply modern design trends to the Navbar and Sidebar components.
- [ ] **Enhanced Dark Mode:** Refine color palettes for deep dark mode support (premium aesthetic).

### 📍 Phase 3: Robustness & Infrastructure
- [ ] **E2E Testing:** Setup [Playwright](https://playwright.dev) to test critical flows: User Login -> Course Selection -> Video Watching.
- [ ] **Error Resilience:** Implement robust Error Boundaries with user-friendly "Try Again" mechanisms.
- [ ] **CI/CD Pipeline:** Fully automate linting, formatting, and testing on every pull request using GitHub Actions.
- [ ] **Analytics Deep-Dive:** Implement custom event tracking for user engagement on course videos.

### 📍 Phase 4: Advanced Educational Features
- [ ] **Course Progress Dashboard:** Personalized view showing completion percentages and last-watched videos.
- [ ] **Quiz Enhancements:** Expand `quiz.tsx` to support timed exams and detailed performance analytics.
- [ ] **AI Search:** Integrate advanced search with fuzzy matching for topics and videos.
- [ ] **Offline Access:** Explore PWA capabilities for offline reading of blog posts and lecture notes.
- [ ] **Gamification:** Add achievements and certificates upon course completion.

## 📄 License
This project is proprietary. All rights reserved.

## Deneme sınavları

Free mock exams that unlock a detailed report for a phone number. Backend, settings and decisions: see the Strapi repo README ("Deneme sınavları").

| Page | What it does |
|---|---|
| `/deneme-sinavlari` | Exam list with filters by exam type (LGS, TYT…) and grade |
| `/deneme-sinavlari/[slug]` | Exam page: no sign-up, timer, question navigator; resumes after a refresh, submits when time is up. The net shows right away; the topic report is locked behind the phone form (name, phone, relation, KVKK consent, separate call consent) |
| `/rapor/[key]` | The SMS link: streams the PDF report from Strapi (`/api/raporlar/:key/pdf`, noindex, `?onizleme=1` doesn't count as an open). While the report is being prepared or for an unknown key it shows a small HTML page |
| `/rapor/[key]/veli` | Linked from a student's PDF: add a parent's number so the report goes to them too |
| Home | Slider from the panel (Anasayfa Slaytı), "Bu dönemin denemeleri", Çağlar Hoca and parents sections |
| Lesson pages | "Bu konunun mini denemesini çöz" when an exam covers the lesson's topic |

GA4 events (each with the exam name and traffic source): `deneme_sayfasi_goruntuleme`, `deneme_baslat`, `deneme_bitir`, `analiz_sorusu` (`cevap`: evet/hayir, the "Geniş analiz raporunu ister misin?" question after the exam), `ornek_rapor_tiklama`, `rapor_talebi`. Clicks inside the PDF come in as visits with `utm_source=rapor&utm_medium=pdf`; opens are counted in Strapi (`raporAcilmaSayisi`). The sample report on the result screen is `public/ornek-deneme-raporu.pdf` (+ two page images in `public/images`); regenerate it when the PDF template changes. The source is the first landing's `utm_source`, else the referring site, else `dogrudan`; link Instagram posts and ads straight to an exam page with `?utm_source=…`.

No new environment variables on the frontend.
