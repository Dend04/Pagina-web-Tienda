import { AppLogo, HeaderMenu, headerNavigationItems } from "@/app/components/HeadersComponents"
import { ShoppingCartIcon, UserCircleIcon } from "@heroicons/react/24/outline"

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AppLogo />
              <HeaderMenu navigationItems={headerNavigationItems} />
            </div>

            {/* Sección derecha */}
            <div className="flex items-center space-x-4">
              <button
                type="button"
                className="p-1 text-gray-600 hover:text-indigo-600"
              >
                <ShoppingCartIcon className="h-6 w-6" />
              </button>
              <div className="flex items-center">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100">
                  <UserCircleIcon className="h-5 w-5 text-indigo-600" />
                </div>
                <span className="ml-2 text-gray-600">John Doe</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Resto del contenido */}
    </div>
  )
}