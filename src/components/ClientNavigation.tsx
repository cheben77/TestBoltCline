'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function ClientNavigation() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-bold text-green-900">
              StoaViva
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <Link
                href="/produits"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/produits')
                    ? 'bg-green-100 text-green-900'
                    : 'text-gray-700 hover:bg-green-50 hover:text-green-900'
                }`}
              >
                Produits
              </Link>

              <Link
                href="/services"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/services')
                    ? 'bg-green-100 text-green-900'
                    : 'text-gray-700 hover:bg-green-50 hover:text-green-900'
                }`}
              >
                Services
              </Link>

              <Link
                href="/impact-ecologique"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/impact-ecologique')
                    ? 'bg-green-100 text-green-900'
                    : 'text-gray-700 hover:bg-green-50 hover:text-green-900'
                }`}
              >
                Impact Écologique
              </Link>

              <Link
                href="/personnes"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/personnes')
                    ? 'bg-green-100 text-green-900'
                    : 'text-gray-700 hover:bg-green-50 hover:text-green-900'
                }`}
              >
                Personnes
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Menu mobile */}
      <div className="md:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link
            href="/produits"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive('/produits')
                ? 'bg-green-100 text-green-900'
                : 'text-gray-700 hover:bg-green-50 hover:text-green-900'
            }`}
          >
            Produits
          </Link>

          <Link
            href="/services"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive('/services')
                ? 'bg-green-100 text-green-900'
                : 'text-gray-700 hover:bg-green-50 hover:text-green-900'
            }`}
          >
            Services
          </Link>

          <Link
            href="/impact-ecologique"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive('/impact-ecologique')
                ? 'bg-green-100 text-green-900'
                : 'text-gray-700 hover:bg-green-50 hover:text-green-900'
            }`}
          >
            Impact Écologique
          </Link>

          <Link
            href="/personnes"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive('/personnes')
                ? 'bg-green-100 text-green-900'
                : 'text-gray-700 hover:bg-green-50 hover:text-green-900'
            }`}
          >
            Personnes
          </Link>
        </div>
      </div>
    </nav>
  );
}
