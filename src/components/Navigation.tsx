import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-white shadow-md" role="navigation" aria-label="Navigation principale">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link 
              href="/" 
              className="text-xl font-bold text-green-900"
              aria-label="Accueil StoaViva"
            >
              StoaViva
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4" role="menubar">
              <Link
                href="/produits"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/produits')
                    ? 'bg-green-100 text-green-900'
                    : 'text-gray-700 hover:bg-green-50 hover:text-green-900'
                }`}
                role="menuitem"
                aria-current={isActive('/produits') ? 'page' : undefined}
                accessKey="p"
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
                role="menuitem"
                aria-current={isActive('/services') ? 'page' : undefined}
                accessKey="s"
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
                role="menuitem"
                aria-current={isActive('/impact-ecologique') ? 'page' : undefined}
                accessKey="i"
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
                role="menuitem"
                aria-current={isActive('/personnes') ? 'page' : undefined}
                accessKey="n"
              >
                Personnes
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Menu mobile */}
      <div className="md:hidden" role="navigation" aria-label="Menu mobile">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3" role="menu">
          <Link
            href="/produits"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive('/produits')
                ? 'bg-green-100 text-green-900'
                : 'text-gray-700 hover:bg-green-50 hover:text-green-900'
            }`}
            role="menuitem"
            aria-current={isActive('/produits') ? 'page' : undefined}
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
            role="menuitem"
            aria-current={isActive('/services') ? 'page' : undefined}
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
            role="menuitem"
            aria-current={isActive('/impact-ecologique') ? 'page' : undefined}
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
            role="menuitem"
            aria-current={isActive('/personnes') ? 'page' : undefined}
          >
            Personnes
          </Link>
        </div>
      </div>
    </nav>
  );
}
