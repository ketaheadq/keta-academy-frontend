# Keta Akademi Frontend

![Keta Akademi](public/favicon/apple-touch-icon.png)

An interactive education platform designed to help students succeed in university entrance exams. Keta Akademi provides comprehensive course lectures, up-to-date base-ceiling points, blogs, and interactive publications.

## 🎨 Design System

- **Colors:** [Tailwind CSS 4](https://tailwindcss.com) (slate-900 (#0F172B), slate-500 (#64748b),sky-50 (#f0f9ff), amber-500 (#FD9A00), sky-400 (#00BCFF), rose-600 (#EC003F))
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

This roadmap outlines the planned improvements to make Keta Akademi the premier educational platform.

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
