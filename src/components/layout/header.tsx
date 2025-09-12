import { ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getPageCategories, getSettings } from "@/lib/strapi";
import AuthSection from "./auth-section";

export default async function Header() {
  const settings = await getSettings().catch(() => ({
    siteName: "Keta Akademi",
    logo: null,
  }));

  const pageCategories = await getPageCategories();

  return (
    <header className="border-gray-200 border-b bg-white shadow-sm">
      <div className="max-w-6xl mx-auto sm:px-6 md:px-4 lg:px-2 xl:px-0">
        <div className="flex items-center justify-between py-6">
          <Link href="/" className="flex items-center">
            {settings.logo && (
              <Image
                src={settings.logo.url}
                alt={settings.logo.alternativeText || settings.siteName}
                width={120}
                height={40}
                priority
                className="h-8 w-auto"
              />
            )}
            <span className="ml-2 font-bold text-gray-900 text-xl">
              {settings.siteName}
            </span>
          </Link>

          {/* Navigation Menu */}
          <nav className="hidden items-center space-x-8 md:flex">
            {pageCategories.map((category) => (
              <div key={`category-${category.id}`} className="group relative">
                <button
                  type="button"
                  className="flex items-center space-x-1 font-medium text-gray-700 transition-colors hover:text-blue-600"
                >
                  <span>{category.title}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                <div className="invisible absolute top-full left-0 z-50 mt-2 w-48 rounded-md border border-gray-200 bg-white opacity-0 shadow-lg transition-all duration-200 group-hover:visible group-hover:opacity-100">
                  <div className="py-2">
                    {category.pages.map((page) => (
                      <Link
                        key={`page-${page.id}`}
                        href={`/sayfalar/${page.slug}`}
                        className="block px-4 py-2 text-gray-700 text-sm hover:bg-gray-100 hover:text-blue-600"
                      >
                        {page.title}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </nav>

          {/* Authentication Section - Client Component */}
          <AuthSection />
        </div>
      </div>
    </header>
  );
}
