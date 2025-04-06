import { ComponentType, SVGProps } from "react"
import { HomeIcon, ChartBarIcon, CubeIcon } from "@heroicons/react/24/outline"
import React from 'react'

// Definición de tipos para JSX IntrinsicElements
declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any
    }
  }
}

// Interfaces
interface NavigationItem {
  name: string
  icon: ComponentType<SVGProps<SVGSVGElement>>
}

interface HeaderMenuProps {
  navigationItems: NavigationItem[]
}

// Componente del menú
export const HeaderMenu: React.FC<HeaderMenuProps> = ({ navigationItems }) => {
  return (
    <nav className="ml-10 flex space-x-8">
      {navigationItems.map((item) => {
        const Icon = item.icon
        return (
          <a
            key={item.name}
            href="#"
            className="flex items-center border-b-2 border-transparent px-1 pb-2 text-gray-500 hover:border-indigo-600 hover:text-indigo-600"
          >
            <Icon className="mr-2 h-5 w-5" />
            {item.name}
          </a>
        )
      })}
    </nav>
  )
}

// Componente del logo
export const AppLogo: React.FC = () => {
  return (
    <div className="flex items-center">
      <div className="h-8 w-8 rounded-lg bg-indigo-600" />
      <span className="ml-2 text-xl font-semibold text-gray-900">StockPro</span>
    </div>
  )
}

// Lista de navegación
export const headerNavigationItems: NavigationItem[] = [
  { name: "Inicio", icon: HomeIcon },
  { name: "Estadísticas", icon: ChartBarIcon },
  { name: "Productos", icon: CubeIcon },
]