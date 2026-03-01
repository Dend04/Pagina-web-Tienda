"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChartBarIcon, CubeIcon } from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";

import { AppLogo } from "./AppLogo";
import { HeaderMenu, NavigationItem } from "./HeaderMenu";
import { CartIcon } from "./CartIcon";
import { PendingOrdersIcon } from "./PendingOrdersIcon";
import { UserMenu } from "./UserMenu";
import { LogoutModal } from "./LogoutModal";
import { useCartStore } from "@/app/store/cartStore";
import { useFavoritosStore } from "@/app/store/favoritosStore";

const allNavigationItems: NavigationItem[] = [
  { name: "Estadísticas", icon: ChartBarIcon, path: "/estadisticas", roles: ["comercial"] },
  { name: "Productos", icon: CubeIcon, path: "/productos", roles: ["comercial"] },
];

interface UserData {
  nombre_usuario?: string;
  correo?: string;
  imagen?: string;
  rol?: string;
}

export function MainHeader() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const logoutCart = useCartStore((state) => state.logout);
  const { loadFavoritos, setFavoritos } = useFavoritosStore();

  // Cargar usuario y favoritos al montar
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser({
          nombre_usuario: parsed.nombre_usuario,
          correo: parsed.correo,
          imagen: parsed.imagen,
          rol: parsed.rol,
        });
        if (token) {
          loadFavoritos();
        }
      } catch (e) {
        console.error("Error parsing user from localStorage", e);
      }
    }
  }, [loadFavoritos]);

  // Fetch del contador de pedidos pendientes con React Query (polling cada 30s)
  const { data: pendientesCount = 0 } = useQuery({
    queryKey: ['pendientesCount', user?.rol],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token");
      const res = await fetch('/api/pedidos/pendientes/count', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Error al obtener conteo");
      const data = await res.json();
      return data.count || 0;
    },
    enabled: !!user && user.rol === 'comercial',
    refetchInterval: 30000, // Equivalente al setInterval anterior
    initialData: 0,
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    logoutCart();
    setFavoritos([]);
    setUser(null);
    setShowLogoutModal(false);
    router.push("/");
  };

  const handleGoHome = () => {
    setShowLogoutModal(false);
    router.push("/");
  };

  // Filtrar items de navegación según rol
  const navigationItems = allNavigationItems.filter(item => {
    if (!item.roles) return true;
    if (!user) return false;
    return item.roles.includes(user.rol || '');
  });

  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            <div className="flex items-center">
              <AppLogo />
              <HeaderMenu navigationItems={navigationItems} />
            </div>

            <div className="flex items-center space-x-4">
              {user?.rol === 'comercial' && (
                <PendingOrdersIcon count={pendientesCount} />
              )}

              <CartIcon />

              {user ? (
                <UserMenu user={user} onLogoutClick={() => setShowLogoutModal(true)} />
              ) : (
                <Link
                  href="/login"
                  className="group flex items-center gap-2 hover:opacity-85 transition-opacity"
                >
                  <div className="h-8 w-8 flex items-center justify-center rounded-full bg-pucara-primary/10">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-5 w-5 text-pucara-primary"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                      />
                    </svg>
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

      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        onGoHome={handleGoHome}
      />
    </>
  );
}