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
    <footer className="bg-gray-900 text-white" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">Site Alt Bilgisi</h2>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-9 gap-8 md:gap-12 lg:gap-14 xl:gap-16">

          {/* Logo and Description */}
          <section aria-labelledby="about-heading" className="lg:col-span-3">
            <h3 id="about-heading" className="sr-only">Hakkımızda</h3>
            <div className="flex items-center space-x-3 mb-4">
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
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              {settings.siteName}, öğrencilerin öğrenme sürecini destekleyen bir
              platformdur.
            </p>
          </section>

          {/* Lessons */}
          <nav aria-labelledby="lessons-heading" className="lg:col-span-2">
            <h4 id="lessons-heading" className="mb-4 font-semibold text-base">Dersler</h4>
            <ul className="space-y-2">
              {lessons.map((lesson) => (
                <li key={lesson.href}>
                  <Link
                    href={lesson.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {lesson.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Levels */}
          <section aria-labelledby="levels-heading" className="lg:col-span-2">
            <h4 id="levels-heading" className="mb-4 font-semibold text-base">Seviye</h4>
            <ul className="space-y-2">
              {levels.map((level) => (
                <li key={level}>
                  <span className="text-gray-400 text-sm">{level}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Support */}
          <nav aria-labelledby="support-heading" className="lg:col-span-2">
            <h4 id="support-heading" className="mb-4 font-semibold text-base">Destek</h4>
            <ul className="space-y-2">
              {supportLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Copyright */}
        <div className="mt-10 border-t border-gray-800 pt-8 pb-2">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mx-auto">
              &copy; {new Date().getFullYear()} {settings.siteName}. Tüm hakları saklıdır.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
