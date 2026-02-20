"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { useMediaQuery } from "usehooks-ts";

interface UserData {
  nombre_usuario?: string;
  correo?: string;
  imagen?: string;
  rol?: string;
}

interface UserMenuProps {
  user: UserData;
  onLogoutClick: () => void;
}

export const UserMenu = ({ user, onLogoutClick }: UserMenuProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const closeMobileMenu = () => setMobileMenuOpen(false);

  if (!isMobile) {
    // Vista desktop
    return (
      <>
        <span className="text-sm text-gray-700 hidden md:inline">
          {user.nombre_usuario || user.correo}
        </span>
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
        <button
          onClick={onLogoutClick}
          className="group relative p-1 sm:p-2 text-gray-600 hover:text-red-600 transition-colors"
          aria-label="Cerrar sesión"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
            />
          </svg>
          <span className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-2 py-1 text-xs font-medium text-white bg-gray-800 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
            Cerrar sesión
          </span>
        </button>
      </>
    );
  }

  // Vista móvil
  return (
    <div className="relative">
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
      >
        <div className="h-8 w-8 rounded-full bg-pucara-primary/10 overflow-hidden">
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
        <span className="text-sm font-medium text-gray-700 max-w-25 truncate">
          {user.nombre_usuario || user.correo}
        </span>
      </button>

      {mobileMenuOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={closeMobileMenu} />
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
            <Link
              href="/perfil"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-pucara-primary/10 hover:text-pucara-primary transition-colors"
              onClick={closeMobileMenu}
            >
              Perfil
            </Link>
            <button
              onClick={() => {
                closeMobileMenu();
                onLogoutClick();
              }}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              Cerrar sesión
            </button>
          </div>
        </>
      )}
    </div>
  );
};