// types/cart.ts
export interface BolsaItem {
  producto_id: number;
  nombre: string;       // para mostrar
  precio_unitario: number;
  cantidad: number;
  subtotal: number;     // precio_unitario * cantidad
  imagen?: string;      // para mostrar
}

export interface Bolsa {
  id?: number;          // temporal (para el store local, podría ser null)
  etiqueta: string;     // categoría
  items: BolsaItem[];
  total: number;        // suma de subtotales
}

export interface Carrito {
  id?: number;
  usuario_id: number | null;
  bolsas: Bolsa[];
  total_general: number;
}