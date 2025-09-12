import Image from "next/image";
import Link from "next/link";
import { getSettings } from "@/lib/strapi";

export default async function Footer() {
  const settings = await getSettings().catch(() => ({
    siteName: "Keta Akademi",
    logo: null,
  }));

  return (
    <footer className="bg-gray-900 py-12 text-white">
      <div className="max-w-6xl mx-auto sm:px-6 md:px-4 lg:px-2 xl:px-0">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center space-x-2">
              {settings.logo && (
                <Image
                  src={settings.logo.url}
                  alt={settings.siteName}
                  width={32}
                  height={32}
                  className="h-8 w-8"
                />
              )}
              <span className="font-bold text-lg">{settings.siteName}</span>
            </div>
            <p className="text-gray-400">
              {settings.siteName}, öğrencilerin öğrenme sürecini destekleyen bir
              platformdur.
            </p>
          </div>
          <div>
            <h4 className="mb-4 font-semibold">Dersler</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/konular/matematik" className="hover:text-white">
                  Matematik
                </Link>
              </li>
              <li>
                <Link href="/konular/fizik" className="hover:text-white">
                  Fizik
                </Link>
              </li>
              <li>
                <Link href="/konular/kimya" className="hover:text-white">
                  Kimya
                </Link>
              </li>
              <li>
                <Link href="/konular/programlama" className="hover:text-white">
                  Programlama
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-semibold">Seviye</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Orta Okul</li>
              <li>Lise</li>
              <li>Üniversite</li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-semibold">Destek</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/iletisim" className="hover:text-white">
                  İletişim
                </Link>
              </li>
              <li>
                <Link href="/gizlilik-politikasi" className="hover:text-white">
                  Gizlilik Politikası
                </Link>
              </li>
              <li>
                <Link href="/hizmet-sartlari" className="hover:text-white">
                  Hizmet Şartları
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-gray-800 border-t pt-8 text-center text-gray-400">
          <p>&copy; 2024 {settings.siteName}. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
}
