"use client";
import { ComponentType, SVGProps } from "react";
import { HomeIcon, ChartBarIcon, CubeIcon, ShoppingCartIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Interfaces
interface NavigationItem {
  name: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  path: string;
}

interface HeaderMenuProps {
  navigationItems: NavigationItem[];
}

// Componente del menú con efecto hover
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
                ? "bg-indigo-100 text-indigo-600"
                : "text-gray-500 hover:bg-indigo-50 hover:text-indigo-500"
            }`}
          >
            <Icon className="h-6 w-6" />
            
            <span className={`tooltip`}>
              {item.name}
            </span>
          </Link>
        );
      })}
    </nav>
  );
};

// Componente del logo optimizado
export const AppLogo: React.FC = () => {
  return (
    <Link 
      href="/" 
      className="flex items-center hover:opacity-80 transition-opacity"
      aria-label="Ir a la página principal"
    >
      <div className="h-8 w-8 rounded-lg bg-indigo-600" />
      <span className="ml-2 text-xl font-semibold text-gray-900">StockPro</span>
    </Link>
  );
};

// Lista de navegación
export const headerNavigationItems: NavigationItem[] = [
  { name: "Inicio", icon: HomeIcon, path: "/" },
  { name: "Estadísticas", icon: ChartBarIcon, path: "/estadisticas" },
  { name: "Productos", icon: CubeIcon, path: "/productos" },
];

// Componente del header completo
export function MainHeader() {
  return (
    <header className="bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <AppLogo />
            <HeaderMenu navigationItems={headerNavigationItems} />
          </div>

          {/* Sección derecha con carrito y usuario */}
          <div className="flex items-center gap-4">
            {/* Carrito con contador */}
            <Link 
              href="/carrito" 
              className="group relative p-1 text-gray-600 hover:text-indigo-600 transition-colors"
            >
              <ShoppingCartIcon className="h-7 w-7" />
              <span className="absolute -top-1 -right-1 bg-indigo-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                3
              </span>
              <span className="tooltip">Carrito de compras</span>
            </Link>

            {/* Botón de inicio de sesión */}
            <Link 
              href="/login" 
              className="group flex items-center gap-2 hover:opacity-85 transition-opacity"
            >
              <div className="h-8 w-8 flex items-center justify-center rounded-full bg-indigo-100">
                <UserCircleIcon className="h-5 w-5 text-indigo-600" />
              </div>
              <span className="text-gray-600">Iniciar sesión</span>
              <span className="tooltip">Acceder a tu cuenta</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}