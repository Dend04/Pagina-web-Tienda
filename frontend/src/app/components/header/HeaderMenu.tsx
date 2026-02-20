"use client";

import { ComponentType, SVGProps } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export interface NavigationItem {
  name: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  path: string;
  roles?: string[];
}

interface HeaderMenuProps {
  navigationItems: NavigationItem[];
}

export const HeaderMenu = ({ navigationItems }: HeaderMenuProps) => {
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