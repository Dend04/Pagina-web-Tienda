"use client";

import Link from "next/link";
import Image from "next/image";

export const AppLogo = () => {
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
      <span className="text-xl font-bold bg-linear-to-r from-pucara-primary to-pucara-blue bg-clip-text text-transparent">
        Pucara
      </span>
      <span className="text-xl font-bold text-pucara-primary">.</span>
    </Link>
  );
};