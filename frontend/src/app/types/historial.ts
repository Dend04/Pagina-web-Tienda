export interface HistorialItem {
  producto_id: number;
  nombre: string;
  cantidad: number;
  precio: number;
  subtotal: number;
}

export interface HistorialPedido {
  id: number;
  usuario_id: number;
  fecha: string;
  total: number;
  items: HistorialItem[];
  estado: 'pendiente' | 'aceptado' | 'rechazado' | 'entregado';
  observaciones?: string;
  created_at: string;
  usuarios?: {
    nombre_usuario: string;
    correo: string;
  };
}