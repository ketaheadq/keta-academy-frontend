import Image from "next/image";
import Link from "next/link";
import { getSettings } from "@/lib/strapi";

// Define reusable menu items
const lessons = [
	{ name: "Matematik", href: "/konular/matematik" },
	{ name: "Fizik", href: "/konular/fizik" },
	{ name: "Kimya", href: "/konular/kimya" },
	{ name: "Programlama", href: "/konular/programlama" },
];

const levels = ["Orta Okul", "Lise", "Üniversite"];

const supportLinks = [
	{ name: "İletişim", href: "/iletisim" },
	{ name: "Gizlilik Politikası", href: "/gizlilik-politikasi" },
	{ name: "Hizmet Şartları", href: "/hizmet-sartlari" },
];

export default async function Footer() {
	const settings = await getSettings().catch(() => ({
		siteName: "Keta Akademi",
		logo: null,
	}));

	return (
		<footer className="bg-gray-900 text-white">
			<div className="mx-auto max-w-7xl px-4 pt-16 pb-8 sm:px-6 lg:px-8">
				<div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12 lg:grid-cols-9 lg:gap-14 xl:gap-16">
					{/* Logo and Description */}
					<section className="lg:col-span-3">
						<div className="mb-4 flex items-center space-x-3">
							{settings.logo && (
								<div className="relative h-10 w-10 flex-shrink-0">
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

					{/* Lessons */}
					<nav className="lg:col-span-2">
						<ul className="space-y-2">
							{lessons.map((lesson) => (
								<li key={lesson.href}>
									<Link
										href={lesson.href}
										className="text-gray-400 text-sm transition-colors duration-200 hover:text-white"
									>
										{lesson.name}
									</Link>
								</li>
							))}
						</ul>
					</nav>

					{/* Levels */}
					<section className="lg:col-span-2">
						<ul className="space-y-2">
							{levels.map((level) => (
								<li key={level}>
									<span className="text-gray-400 text-sm">{level}</span>
								</li>
							))}
						</ul>
					</section>

					{/* Support */}
					<nav className="lg:col-span-2">
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
					<div className="flex flex-col items-center justify-between md:flex-row">
						<p className="mx-auto text-gray-500 text-sm">
							&copy; {new Date().getFullYear()} {settings.siteName}. Tüm hakları saklıdır.
						</p>
					</div>
				</div>
			</div>
		</footer>
	);
}
