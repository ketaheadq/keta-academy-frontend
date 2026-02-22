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
	const settings = await getSettings().catch(() => ({
		siteName: "Keta Akademi",
		logo: null,
	}));

	// Fetch dynamic data for footer
	const subjects = await getSubjects().catch(() => []);
	const blogs = await getBlogs().catch(() => []);

	// Get up to 5 subjects and popular blogs
	const footerSubjects = subjects.slice(0, 5);
	const popularBlogs = blogs.filter((blog) => blog.isPopular).slice(0, 5);

	return (
		<footer className="bg-gray-900 text-white">
			<div className="mx-auto max-w-7xl px-4 pt-16 pb-8 sm:px-6 lg:px-8">
				<div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12 lg:grid-cols-9 lg:gap-14 xl:gap-16">
					{/* Logo and Description */}
					<section className="md:col-span-1 lg:col-span-3">
						<div className="mb-4 flex items-center space-x-3">
							{settings.logo && (
								<div className="relative h-16 w-16 shrink-0">
									<Image
										src={settings.logo.url}
										alt={`${settings.siteName} logosu`}
										fill
										className="object-contain"
									/>
								</div>
							)}
							<span className="font-bold text-xl">{settings.siteName}</span>
						</div>
						<p className="max-w-xs text-gray-400 text-sm leading-relaxed">
							{settings.siteName}, öğrencilerin öğrenme sürecini destekleyen bir platformdur.
						</p>
					</section>

					{/* Konular - Only show if subjects exist */}
					{footerSubjects.length > 0 && (
						<nav className="md:col-span-1 lg:col-span-1">
							<h3 className="mb-3 font-semibold text-white">Konular</h3>
							<ul className="space-y-2">
								{footerSubjects.map((subject) => (
									<li key={subject.slug}>
										<Link
											href={`/konular/${subject.slug}`}
											className="text-gray-400 text-sm transition-colors duration-200 hover:text-white"
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
						<h3 className="mb-3 font-semibold text-white">Popüler Yazılar</h3>
						<ul className="space-y-2">
							{popularBlogs.map((blog) => (
								<li key={blog.slug}>
									<Link
										href={`/sayfalar/${blog.page?.slug}/${blog.slug}`}
										className="line-clamp-2 text-gray-400 text-sm transition-colors duration-200 hover:text-white"
									>
										{blog.title}
									</Link>
								</li>
							))}
						</ul>
					</nav>

					{/* Support */}
					<nav className="md:col-span-1 lg:col-span-2">
						<h3 className="mb-3 font-semibold text-white">Destek</h3>
						<ul className="space-y-2">
							{supportLinks.map((link) => (
								<li key={link.href}>
									<Link
										href={link.href}
										className="text-gray-400 text-sm transition-colors duration-200 hover:text-white"
									>
										{link.name}
									</Link>
								</li>
							))}
						</ul>
					</nav>
				</div>

				{/* Copyright */}
				<div className="mt-10 border-gray-800 border-t pt-8 pb-2">
					<div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
						<p className="text-muted-foreground text-sm">
							&copy; 2025 {settings.siteName}. Tüm hakları saklıdır.
						</p>
						<div className="flex items-center gap-4">
							{/* TODO: add bluesky https://bsky.app/profile/ketaakademi.bsky.social */}
							<Link
								href="https://www.instagram.com/keta.akademi/"
								className="text-muted-foreground transition-colors hover:text-white"
								target="_blank"
								rel="noopener noreferrer"
							>
								<InstagramIcon className="h-5 w-5" />
							</Link>
							<Link
								href="https://www.youtube.com/@ketaakademi"
								className="text-muted-foreground transition-colors hover:text-white"
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
