// Skeleton loader components for better UX

interface SkeletonProps {
  className?: string;
}

/**
 * Generic skeleton with animation
 */
export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-gray-200 rounded ${className}`}
      aria-hidden="true"
    />
  );
}

/**
 * Skeleton for product cards in grid
 */
export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <Skeleton className="w-full h-48 rounded-lg mb-4" />
      <Skeleton className="h-4 w-3/4 mb-2" />
      <Skeleton className="h-3 w-1/2 mb-4" />
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-8 w-24 rounded-full" />
      </div>
    </div>
  );
}

/**
 * Skeleton for product cards in carousel
 */
export function CarouselItemSkeleton() {
  return (
    <div className="flex-shrink-0 w-64 md:w-72 bg-white rounded-xl p-4 shadow-sm mx-2">
      <Skeleton className="w-full h-40 rounded-lg mb-4" />
      <Skeleton className="h-4 w-3/4 mb-2" />
      <Skeleton className="h-3 w-1/2 mb-4" />
      <Skeleton className="h-6 w-20" />
    </div>
  );
}

/**
 * Skeleton for product table row
 */
export function TableRowSkeleton() {
  return (
    <tr className="border-b border-gray-100">
      <td className="py-4 px-4">
        <div className="flex items-center gap-3">
          <Skeleton className="w-12 h-12 rounded-lg" />
          <Skeleton className="h-4 w-32" />
        </div>
      </td>
      <td className="py-4 px-4">
        <Skeleton className="h-4 w-20" />
      </td>
      <td className="py-4 px-4">
        <Skeleton className="h-4 w-16" />
      </td>
      <td className="py-4 px-4">
        <Skeleton className="h-8 w-20 rounded-full" />
      </td>
      <td className="py-4 px-4">
        <div className="flex gap-2">
          <Skeleton className="h-8 w-8 rounded" />
          <Skeleton className="h-8 w-8 rounded" />
        </div>
      </td>
    </tr>
  );
}

/**
 * Skeleton for full product table
 */
export function ProductTableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Producto</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Categoría</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Precio</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Estado</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <TableRowSkeleton key={i} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Skeleton for product grid on main page
 */
export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * Skeleton for carousel section
 */
export function CarouselSkeleton({ items = 4 }: { items?: number }) {
  return (
    <div className="flex overflow-x-auto pb-4 scrollbar-hide">
      {Array.from({ length: items }).map((_, i) => (
        <CarouselItemSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * Skeleton for form fields
 */
export function FormFieldSkeleton() {
  return (
    <div className="space-y-1">
      <Skeleton className="h-4 w-24 mb-2" />
      <Skeleton className="h-10 w-full rounded-lg" />
    </div>
  );
}

/**
 * Skeleton for stats cards
 */
export function StatsCardSkeleton() {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-4 w-16" />
      </div>
      <Skeleton className="h-8 w-24 mb-2" />
      <Skeleton className="h-3 w-20" />
    </div>
  );
}
