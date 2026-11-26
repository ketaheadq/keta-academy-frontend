# KetaLearn Frontend

![KetaLearn](public/favicon/apple-touch-icon.png)

An interactive education platform designed to help students succeed in university entrance exams. KetaLearn provides comprehensive course lectures, up-to-date base-ceiling points, blogs, and interactive publications.

## 🎨 Design System

- **Colors:** [Tailwind CSS 4](https://tailwindcss.com) (primary slate-700 #0891b2, rose-600 (#EC003F))
- **Shadcn UI:** [Shadcn UI](https://ui.shadcn.com)
- **React bits:** [React bits](https://reactbits.dev)

## 🚀 Tech Stack

- **Core:** [Next.js 16](https://nextjs.org) (App Router, Turbopack), [React 19](https://react.dev)
- **Language:** [TypeScript 7](https://devblogs.microsoft.com/typescript/typescript-native-port/) (`@typescript/native-preview`)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com), [Shadcn UI](https://ui.shadcn.com)
- **CMS:** [Strapi](https://strapi.io) (Headless)
- **State Management:** [Zustand](https://docs.pmnd.rs/zustand/getting-started/introduction)
- **Icons:** [Lucide React](https://lucide.dev)
- **Quality Tools:** [Biome](https://biomejs.dev) (Linting/Formatting), [Husky](https://typicode.github.io/husky/) + lint-staged
- **Deployment:** Docker (standalone output) & GitHub Actions

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
# Public, inlined at build time. Changing either requires a rebuild, not a restart.
NEXT_PUBLIC_STRAPI_URL=https://admin.ketalearn.cloud
NEXT_PUBLIC_FRONTEND_URL=https://ketalearn.cloud

# Optional: server-only Strapi address used for /uploads/* rewrites inside Docker.
# Falls back to NEXT_PUBLIC_STRAPI_URL when unset.
STRAPI_INTERNAL_URL=

# Optional: exposes the demo login on /giris when set.
NEXT_PUBLIC_KETA_DEMO_LOGIN=
```

There is no `STRAPI_API_TOKEN`: public content is read anonymously, and per-user
calls (progress, quizzes, reviews) forward the signed-in user's own JWT.

### 4. Development

```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) to see the result.

### 5. Checks

```bash
pnpm lint:check   # Biome, no writes (what CI runs)
pnpm lint         # Biome, auto-fixes
pnpm typecheck    # tsc --noEmit
pnpm build        # production build
```

## 🗺️ Roadmap to Excellence

### ✅ Recently completed

- [x] **Expanded Sitemap:** `sitemap.ts` now emits courses, subjects (`/konular/[slug]`), tutors, mock exams and CMS pages, and no longer advertises `/konular`, which is a 404 (there is no listing route, only `/konular/[slug]`).
- [x] **Canonical safety:** `generateDefaultURL` no longer invents `/videos/[slug]` and `/blogs/[slug]` canonicals — those routes do not exist, and a canonical pointing at a 404 drops the page from the index. Content under `/sayfalar/[page]/[slug]` now derives its canonical from its parent page, or omits it.
- [x] **Sitemap is prerenderable:** it no longer calls a `revalidate: 0` fetch, which made it dynamic and threw `DYNAMIC_SERVER_USAGE` at build time (silently dropping every course URL).
- [x] **CI gate:** `deploy.yml` now runs lint + typecheck + build before the SSH deploy, instead of rebuilding production from whatever landed on `main`.
- [x] **Query-param safety:** every slug interpolated into a Strapi filter is `encodeURIComponent`-ed (a slug containing `&` or `]` could previously alter the query).
- [x] **Colors:** the `bg-orange-*` migration to design tokens is finished (0 occurrences remain).

### 📍 Phase 1: Caching & Rendering (highest leverage next)

Every route except `robots.txt` and `sitemap.xml` currently renders on demand. `/ozel-ders` takes ~1.5 s and `/konular/[slug]` ~0.65 s per request, versus ~20 ms for a prerendered route.

- [ ] **⚠️ Removing `await connection()` from `layout.tsx` is not safe yet — tried and reverted.** It is the only dynamic-API call in the app, and dropping it does flip 14 of 25 routes to static. But the prerendered HTML for `/` and `/kurslar` then degrades to the `loading.tsx` spinner with an errored Suspense boundary (`<!--$!-->`, empty `data-dgst`) — **zero `<a>` tags in the document**, so crawlers would see an empty page. Fix the underlying build-time failure first, then retry. Do not remove it on its own.
- [ ] **Cache Components (`use cache`):** Next.js 16's caching primitive. `/ozel-ders` and `/ozel-ders/[slug]` are dynamic only because `getTutorRatingSummaries()` uses `revalidate: 0` ("a new review shows up right away"). Wrapping just that lookup in `use cache` makes both pages static with a single fresh hole.
- [ ] **Partial Prerendering (PPR):** serve the static shell instantly and stream the per-user parts (navbar auth state, progress). This is also the proper fix for the Suspense-fallback problem above.
- [ ] **`generateStaticParams`:** `/kurslar/[slug]`, `/konular/[slug]` and `/deneme-sinavlari/[slug]` have no static params, so every visit is a server render. Course and subject slugs are a small, known set.
- [ ] **Audit remaining `revalidate: 0` reads:** `getCoursesByDocumentIds`, `getPublishedCourses` and `getTutorRatingSummaries`. Each one silently opts its whole route out of caching.
- [ ] **Wire `STRAPI_INTERNAL_URL`** into `docker-compose.yml` (the Dockerfile declares the ARG, compose never passes it), so `/uploads/*` rewrites and server-side fetches stay inside the Docker network instead of round-tripping the public internet.

### 📍 Phase 2: Correctness & Observability

- [ ] **Runtime validation with [Zod](https://zod.dev):** `StrapiBlock` is `any`-indexed and the type guards are hand-written. A renamed field in Strapi currently surfaces as an undefined-crash in a server component rather than a clear error. Parse at the boundary and infer the types.
- [ ] **Error tracking ([Sentry](https://sentry.io) / GlitchTip):** failures are only `console.error`-ed into Docker logs today — there is no visibility into production errors.
- [ ] **`global-error.tsx`:** missing. `error.tsx` cannot catch a throw in the root layout, which is exactly where the Strapi settings fetch lives.
- [ ] **Tests:** there are none. Start with [Vitest](https://vitest.dev) + React Testing Library for `lib/` (progress maths, net/score calculation, `seo.ts` URL derivation), then [Playwright](https://playwright.dev) for the exam flow: start → answer → submit → phone form → report.
- [ ] **Fail-fast env validation:** a missing `NEXT_PUBLIC_STRAPI_URL` currently produces empty pages rather than a build error.

### 📍 Phase 3: SEO & Content Discovery

- [ ] **JSON-LD coverage:** only `/ozel-ders` and `/sayfalar/[slug]` emit structured data. Add `Course` on `/kurslar/[slug]`, `Organization` + `WebSite` sitewide, `BreadcrumbList` on all detail routes, and `FAQPage` on `/sikca-sorulan-sorular` (already an FAQ page, currently unmarked-up).
- [ ] **Dynamic OG images ([`next/og`](https://nextjs.org/docs/app/api-reference/file-conventions/og-image-generation)):** per-course and per-exam social cards. Exam pages are shared on WhatsApp, so this is directly on the growth path.
- [ ] **Image pipeline:** 3 `next/image` usages pass `unoptimized`, bypassing resizing. Strapi already returns `formats.small`/`thumbnail` — pick a rendition instead of the raw upload, and add blur placeholders.
- [ ] **Search with [Pagefind](https://pagefind.app):** static, client-side, zero infrastructure cost — a better first step than a hosted search service, and it works with prerendered pages.
- [ ] **Publish the Strapi single types (blocker, CMS-side):** `setting`, `contact-page`, `privacy-policy` and `term-and-condition` all return 404 on production because they have no published entry. Until `setting` is published, the site title/description fall back to hardcoded defaults and `/gizlilik-politikasi` + `/hizmet-sartlari` render empty. This is not a frontend bug.

### 📍 Phase 4: UX & Visual

- [ ] **Dark mode:** there are currently **zero** `dark:` variants. Needs a token pass in `globals.css` plus [next-themes](https://github.com/pacocoursey/next-themes) — treat as new work, not refinement.
- [ ] **Micro-animations:** prefer the [View Transitions API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API) and [Motion](https://motion.dev) over `three.js`. A WebGL runtime is ~150 KB+ of JS on a content site whose Core Web Vitals matter for SEO; reserve it for a single hero flourish if at all.
- [ ] **Skeleton states:** extend the existing `loading.tsx` files to the listing routes still missing them.
- [ ] **URL state with [nuqs](https://nuqs.dev):** `?ders_ismi=` and `?video=` are parsed by hand. nuqs gives type-safe searchParam state and removes a reason those routes must stay dynamic.

### 📍 Phase 5: Product

- [ ] **Course progress dashboard:** `/derslerim` lists started courses; add completion percentages and last-watched lesson.
- [ ] **Quiz enhancements:** timed exams and per-topic performance analytics in `quiz.tsx`.
- [ ] **PWA / offline:** [Serwist](https://serwist.pages.dev) for offline reading of blog posts and lecture notes.
- [ ] **Gamification:** achievements and certificates on course completion.
- [ ] **KVKK / İYS review (legal, not technical):** the parent ("veli") form collects a separate marketing-call consent. Outbound commercial calls and SMS require İYS registration under 6563 sayılı Kanun, and this applies to a natural person as data controller too — worth confirming before that checkbox is used for anything beyond sending the report.

## 📄 License

This project is proprietary. All rights reserved.

## Deneme sınavları

Free mock exams that unlock a detailed report for a phone number. Backend, settings and decisions: see the Strapi repo README ("Deneme sınavları").

| Page                       | What it does                                                                                                                                                                                                                                                       |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `/deneme-sinavlari`        | Exam list with filters by exam type (LGS, TYT…) and grade                                                                                                                                                                                                          |
| `/deneme-sinavlari/[slug]` | Exam page: no sign-up, timer, question navigator; resumes after a refresh, submits when time is up. The net shows right away; the topic report is locked behind the phone form (name, phone, relation, KVKK consent, separate call consent)                        |
| `/rapor/[key]`             | The report link (shown after the form, shareable on WhatsApp): streams the PDF report from Strapi (`/api/raporlar/:key/pdf`, noindex, `?onizleme=1` doesn't count as an open). While the report is being prepared or for an unknown key it shows a small HTML page |
| `/rapor/[key]/veli`        | Linked from a student's PDF: add a parent's number so the report goes to them too                                                                                                                                                                                  |
| Home                       | Slider from the panel (Anasayfa Slaytı), "Bu dönemin denemeleri", Çağlar Hoca and parents sections                                                                                                                                                                 |
| Lesson pages               | "Bu konunun mini denemesini çöz" when an exam covers the lesson's topic                                                                                                                                                                                            |

GA4 events (each with the exam name and traffic source): `deneme_sayfasi_goruntuleme`, `deneme_baslat`, `deneme_bitir`, `analiz_sorusu` (`cevap`: evet/hayir, the "Geniş analiz raporunu ister misin?" question after the exam), `ornek_rapor_tiklama`, `rapor_talebi`, `rapor_ac_tiklama`, `rapor_paylas`. Clicks inside the PDF come in as visits with `utm_source=rapor&utm_medium=pdf`; opens are counted in Strapi (`raporAcilmaSayisi`). The sample report on the result screen is `public/ornek-deneme-raporu.pdf` (+ two page images in `public/images`); regenerate it when the PDF template changes. The source is the first landing's `utm_source`, else the referring site, else `dogrudan`; link Instagram posts and ads straight to an exam page with `?utm_source=…`.

No new environment variables on the frontend.
