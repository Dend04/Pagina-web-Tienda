"use client";

import { ComponentType, SVGProps } from "react";
import { HomeIcon, ChartBarIcon, CubeIcon, ShoppingCartIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

// ------------------------------------------------------------
// Interfaces
// ------------------------------------------------------------
interface NavigationItem {
  name: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  path: string;
}

interface HeaderMenuProps {
  navigationItems: NavigationItem[];
}

// ------------------------------------------------------------
// Menú de navegación con iconos y estado activo (colores Pucara)
// ------------------------------------------------------------
export const HeaderMenu: React.FC<HeaderMenuProps> = ({ navigationItems }) => {
  const pathname = usePathname();

  return (
    <nav className="ml-10 flex space-x-4">
      {navigationItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.path;

        return (
          <Link
            key={item.name}
            href={item.path}
            className={`group relative flex items-center p-2 rounded-lg transition-all duration-200 ${
              isActive
                ? "bg-pucara-red/10 text-pucara-red"
                : "text-gray-600 hover:bg-pucara-red/5 hover:text-pucara-red"
            }`}
          >
            <Icon className="h-6 w-6" />
            <span className="ml-2 text-sm font-medium hidden md:inline">
              {item.name}
            </span>
          </Link>
        );
      })}
    </nav>
  );
};

// ------------------------------------------------------------
// Logo con imagen de Pucara (desde /public)
// ------------------------------------------------------------
export const AppLogo: React.FC = () => {
  return (
    <Link
      href="/"
      className="flex items-center hover:opacity-85 transition-opacity"
      aria-label="Ir a la página principal"
    >
      <div className="relative w-10 h-10 mr-2">
        <Image
          src="/descarga (1).jpg"
          alt="Pucara Logo"
          fill
          sizes="40px"
          className="object-contain"
          priority
        />
      </div>
      <span className="text-xl font-bold text-pucara-black">
        Pucara<span className="text-pucara-red">.</span>
      </span>
    </Link>
  );
};

// ------------------------------------------------------------
// Items de navegación (ajusta rutas según tu proyecto)
// ------------------------------------------------------------
export const headerNavigationItems: NavigationItem[] = [
  { name: "Estadísticas", icon: ChartBarIcon, path: "/estadisticas" },
  { name: "Productos", icon: CubeIcon, path: "/productos" },
];

// ------------------------------------------------------------
// Header principal (sticky, con carrito y usuario)
// ------------------------------------------------------------
export function MainHeader() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          {/* Logo + navegación */}
          <div className="flex items-center">
            <AppLogo />
            <HeaderMenu navigationItems={headerNavigationItems} />
          </div>

          {/* Carrito y usuario */}
          <div className="flex items-center space-x-4">
            <Link
              href="/carrito"
              className="group relative p-2 text-gray-600 hover:text-pucara-red transition-colors"
            >
              <ShoppingCartIcon className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold text-white bg-pucara-red rounded-full min-w-[1.25rem] h-5">
                3
              </span>
              <span className="sr-only">Carrito de compras</span>
            </Link>

            <Link
              href="/"
              className="group flex items-center gap-2 hover:opacity-85 transition-opacity"
            >
              <div className="h-8 w-8 flex items-center justify-center rounded-full bg-pucara-red/10">
                <UserCircleIcon className="h-5 w-5 text-pucara-red" />
              </div>
              <span className="text-gray-700 text-sm font-medium hidden md:inline">
                Iniciar sesión
              </span>
              <span className="sr-only">Acceder a tu cuenta</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}