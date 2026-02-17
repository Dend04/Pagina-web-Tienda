// types/product.ts
export interface ProductBase {
  id: number;
  name: string;
  price: number;
  category: string;
  description?: string;
  rating?: number;
  stock?: number;
  minQuantity?: number;
  maxQuantity?: number;
  createdAt?: string;
  updatedAt?: string;
}

// Para listados (con una sola imagen)
export interface ProductListItem extends ProductBase {
  image: string;
}

// Para detalle/edición (con todas las imágenes)
export interface ProductDetail extends ProductBase {
  images: string[];
}