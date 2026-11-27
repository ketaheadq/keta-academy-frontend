import Image from "next/image";
import Link from "next/link";
import { InstagramIcon, YoutubeIcon } from "@/components/ui/brand-icons";
import { getBlogs, getSettings, getSubjects } from "@/lib/strapi";

// Define reusable menu items
const supportLinks = [
	{ name: "Sıkça Sorulan Sorular", href: "/sikca-sorulan-sorular" },
	{ name: "İletişim", href: "/iletisim" },
	{ name: "Gizlilik Politikası", href: "/gizlilik-politikasi" },
	{ name: "Hizmet Şartları", href: "/hizmet-sartlari" },
];

export default async function Footer() {
	const currentYear = new Date().getFullYear();

	const [settings, subjects, blogs] = await Promise.all([
		getSettings().catch(() => ({
			siteName: "KetaLearn",
		})),
		getSubjects().catch(() => []),
		getBlogs().catch(() => []),
	]);

	// Get up to 5 subjects and popular blogs
	const footerSubjects = subjects.slice(0, 5);
	const popularBlogs = blogs.filter((blog) => blog.isPopular).slice(0, 5);

	return (
		<footer className="bg-slate-950 text-slate-100">
			<div className="mx-auto max-w-7xl px-4 pt-16 pb-8 sm:px-6 lg:px-8">
				<div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12 lg:grid-cols-9 lg:gap-14 xl:gap-16">
					{/* Logo and Description */}
					<section className="md:col-span-1 lg:col-span-3">
						<div className="mb-4 flex items-center space-x-3">
							<Image
								src="/images/ketalearn-logo.png"
								alt=""
								width={40}
								height={40}
								className="shrink-0"
							/>
							<span className="text-xl font-bold">{settings.siteName}</span>
						</div>
						<p className="max-w-xs text-sm leading-relaxed text-slate-400">
							{settings.siteName}, öğrencilerin öğrenme sürecini destekleyen bir platformdur.
						</p>
					</section>

					{/* Konular - Only show if subjects exist */}
					{footerSubjects.length > 0 && (
						<nav className="md:col-span-1 lg:col-span-1">
							<h2 className="mb-3 font-semibold text-slate-100">Konular</h2>
							<ul className="space-y-2">
								{footerSubjects.map((subject) => (
									<li key={subject.slug}>
										<Link
											href={`/konular/${subject.slug}`}
											className="accent-link inline-block text-sm text-slate-400"
										>
											{subject.title}
										</Link>
									</li>
								))}
							</ul>
						</nav>
					)}

					{/* Popular Blogs */}
					<nav className="md:col-span-1 lg:col-span-3">
						<h2 className="mb-3 font-semibold text-slate-100">Popüler Yazılar</h2>
						<ul className="space-y-2">
							{popularBlogs.map((blog) => (
								<li key={blog.slug}>
									<Link
										href={`/sayfalar/${blog.page?.slug}/${blog.slug}`}
										className="accent-link line-clamp-2 inline-block text-sm text-slate-400"
									>
										{blog.title}
									</Link>
								</li>
							))}
						</ul>
					</nav>

					{/* Support */}
					<nav className="md:col-span-1 lg:col-span-2">
						<h2 className="mb-3 font-semibold text-slate-100">Destek</h2>
						<ul className="space-y-2">
							{supportLinks.map((link) => (
								<li key={link.href}>
									<Link
										href={link.href}
										className="accent-link inline-block text-sm text-slate-400"
									>
										{link.name}
									</Link>
								</li>
							))}
						</ul>
					</nav>
				</div>

				{/* Copyright */}
				<div className="mt-10 border-t border-slate-800 pt-8 pb-2">
					<div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
						<p className="text-sm text-slate-400">
							&copy; {currentYear} {settings.siteName}. Tüm hakları saklıdır.
						</p>
						<div className="flex items-center gap-4">
							<Link
								href="https://www.instagram.com/keta.akademi/"
								aria-label="KetaLearn Instagram sayfası (yeni sekmede açılır)"
								className="accent-link inline-flex text-slate-400 transition-transform duration-200 hover:-translate-y-0.5"
								target="_blank"
								rel="noopener noreferrer"
							>
								<InstagramIcon className="h-5 w-5" />
							</Link>
							<Link
								href="https://www.youtube.com/@ketalearn"
								aria-label="KetaLearn YouTube kanalı (yeni sekmede açılır)"
								className="accent-link inline-flex text-slate-400 transition-transform duration-200 hover:-translate-y-0.5"
								target="_blank"
								rel="noopener noreferrer"
							>
								<YoutubeIcon className="h-5 w-5" />
							</Link>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}
