// src/app/types/product.ts
export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  description?: string;
  rating?: number;
  stock?: number;
  minQuantity?: number;
  maxQuantity?: number;
  createdAt?: string;
  updatedAt?: string;
}