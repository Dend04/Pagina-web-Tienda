"use client";

import { ComponentType, SVGProps, useEffect, useState } from "react";
import {
  ChartBarIcon,
  CubeIcon,
  ShoppingCartIcon,
  UserCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

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

interface UserData {
  nombre_usuario?: string;
  correo?: string;
  imagen?: string;
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
                ? "bg-pucara-primary/10 text-pucara-primary"
                : "text-gray-600 hover:bg-pucara-primary/5 hover:text-pucara-primary"
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
        Pucara<span className="text-pucara-primary">.</span>
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
// Modal de confirmación para cerrar sesión
// ------------------------------------------------------------
interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onGoHome: () => void;
}

const LogoutModal: React.FC<LogoutModalProps> = ({ isOpen, onClose, onConfirm, onGoHome }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-pucara-primary transition-colors"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex p-3 rounded-full bg-red-100 text-red-500 mb-3">
            <XMarkIcon className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-semibold text-pucara-black">
            ¿Cerrar sesión?
          </h3>
          <p className="text-gray-500 mt-1">
            ¿Estás seguro de que deseas salir de tu cuenta?
          </p>
        </div>

        <div className="space-y-2">
          <button
            onClick={onConfirm}
            className="w-full bg-red-500 text-white py-3 rounded-full hover:bg-red-600 transition-all font-medium"
          >
            Estoy seguro
          </button>
          <button
            onClick={onGoHome}
            className="w-full border border-pucara-primary text-pucara-primary py-3 rounded-full hover:bg-pucara-primary/10 transition-all font-medium"
          >
            Ir a la página principal
          </button>
          <button
            onClick={onClose}
            className="w-full bg-gray-100 text-gray-700 py-3 rounded-full hover:bg-gray-200 transition-all font-medium"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

// ------------------------------------------------------------
// Header principal (sticky, con carrito y usuario)
// ------------------------------------------------------------
export function MainHeader() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser({
          nombre_usuario: parsed.nombre_usuario,
          correo: parsed.correo,
          imagen: parsed.imagen,
        });
      } catch (e) {
        console.error("Error parsing user from localStorage", e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setShowLogoutModal(false);
    router.push("/");
  };

  const handleGoHome = () => {
    setShowLogoutModal(false);
    router.push("/");
  };

  return (
    <>
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
              {/* Carrito con tooltip */}
              <Link
                href="/carrito"
                className="group relative p-2 text-gray-600 hover:text-pucara-primary transition-colors"
              >
                <ShoppingCartIcon className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold text-pucara-white bg-pucara-primary rounded-full min-w-5 h-5">
                  3
                </span>
                <span className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-2 py-1 text-xs font-medium text-white bg-gray-800 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                  Ver carrito
                </span>
                <span className="sr-only">Carrito de compras</span>
              </Link>

              {user ? (
                <>
                  {/* Nombre de usuario */}
                  <span className="text-sm text-gray-700 hidden md:inline">
                    {user.nombre_usuario || user.correo}
                  </span>

                  {/* Avatar con enlace a perfil y tooltip */}
                  <Link
                    href="/perfil"
                    className="group relative flex items-center"
                  >
                    <div className="h-8 w-8 flex items-center justify-center rounded-full bg-pucara-primary/10 overflow-hidden">
                      {user.imagen ? (
                        <Image
                          src={user.imagen}
                          alt="Foto de perfil"
                          width={32}
                          height={32}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <UserCircleIcon className="h-5 w-5 text-pucara-primary" />
                      )}
                    </div>
                    <span className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-2 py-1 text-xs font-medium text-white bg-gray-800 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                      Perfil
                    </span>
                    <span className="sr-only">Perfil</span>
                  </Link>

                  {/* Botón de cerrar sesión con tooltip */}
                  <button
                    onClick={() => setShowLogoutModal(true)}
                    className="group relative p-2 text-gray-600 hover:text-red-600 transition-colors"
                    aria-label="Cerrar sesión"
                  >
                    <XMarkIcon className="w-5 h-5" />
                    <span className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-2 py-1 text-xs font-medium text-white bg-gray-800 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                      Cerrar sesión
                    </span>
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="group flex items-center gap-2 hover:opacity-85 transition-opacity"
                >
                  <div className="h-8 w-8 flex items-center justify-center rounded-full bg-pucara-primary/10">
                    <UserCircleIcon className="h-5 w-5 text-pucara-primary" />
                  </div>
                  <span className="text-gray-700 text-sm font-medium hidden md:inline">
                    Iniciar sesión
                  </span>
                  <span className="sr-only">Acceder a tu cuenta</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Modal de confirmación de cierre de sesión */}
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        onGoHome={handleGoHome}
      />
    </>
  );
}