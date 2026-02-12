import Link from "next/link";
import Image from "next/image";

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-20">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="relative w-6 h-6 mr-2">
              <Image
                src="/descarga (1).jpg"
                alt="Pucara"
                fill
                sizes="24px"
                className="object-contain"
              />
            </div>
            <span>© 2026 Pucara Store. Todos los derechos reservados.</span>
          </div>
          <div className="flex space-x-6">
            <Link href="/privacidad" className="hover:text-pucara-red transition-colors">
              Privacidad
            </Link>
            <Link href="/terminos" className="hover:text-pucara-red transition-colors">
              Términos
            </Link>
            <Link href="/ayuda" className="hover:text-pucara-red transition-colors">
              Ayuda
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};