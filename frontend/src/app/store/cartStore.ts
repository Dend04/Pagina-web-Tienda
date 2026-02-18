import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface BolsaItem {
  producto_id: number;
  nombre: string;
  precio_unitario: number;
  cantidad: number;
  subtotal: number;
  imagen: string;
}

export interface Bolsa {
  etiqueta: string;
  items: BolsaItem[];
  total: number;
}

export interface Carrito {
  usuario_id: number | null;
  bolsas: Bolsa[];
  total_general: number;
}

interface CartStore {
  carrito: Carrito;
  addItem: (item: Omit<BolsaItem, 'subtotal'> & { etiqueta: string }) => void;
  removeItem: (etiqueta: string, producto_id: number) => void;
  updateItemQuantity: (etiqueta: string, producto_id: number, cantidad: number) => void;
  removeBolsa: (etiqueta: string) => void;
  clearCart: () => void;
  getTotalGeneral: () => number;
  logout: () => void; // para limpiar al cerrar sesión
}

// Función para obtener el userId desde el token JWT
const getUserIdFromToken = (): number | null => {
  if (typeof window === 'undefined') return null;
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.id || null;
  } catch {
    return null;
  }
};

const userIdFromToken = getUserIdFromToken();

const initialCarrito: Carrito = {
  usuario_id: userIdFromToken,
  bolsas: [],
  total_general: 0,
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      carrito: initialCarrito,

      addItem: (item) => {
        const { carrito } = get();
        const { etiqueta, producto_id, nombre, precio_unitario, cantidad, imagen } = item;
        const subtotal = precio_unitario * cantidad;

        // Verificar autenticación
        const currentUserId = getUserIdFromToken();
        if (!currentUserId) return; // No debería pasar porque ya se verificó en el componente

        // Asegurar que el usuario_id esté actualizado
        if (carrito.usuario_id !== currentUserId) {
          carrito.usuario_id = currentUserId;
        }

        // Buscar bolsa por etiqueta (categoría)
        let bolsa = carrito.bolsas.find(b => b.etiqueta === etiqueta);
        if (!bolsa) {
          bolsa = { etiqueta, items: [], total: 0 };
          carrito.bolsas.push(bolsa);
        }

        const itemExistente = bolsa.items.find(i => i.producto_id === producto_id);
        if (itemExistente) {
          // Incrementar cantidad
          itemExistente.cantidad += cantidad;
          itemExistente.subtotal = itemExistente.precio_unitario * itemExistente.cantidad;
        } else {
          // Agregar nuevo item
          bolsa.items.push({
            producto_id,
            nombre,
            precio_unitario,
            cantidad,
            subtotal,
            imagen,
          });
        }

        // Recalcular totales
        bolsa.total = bolsa.items.reduce((sum, i) => sum + i.subtotal, 0);
        carrito.total_general = carrito.bolsas.reduce((sum, b) => sum + b.total, 0);
        set({ carrito: { ...carrito } });
      },

      removeItem: (etiqueta, producto_id) => {
        const { carrito } = get();
        const bolsa = carrito.bolsas.find(b => b.etiqueta === etiqueta);
        if (!bolsa) return;

        bolsa.items = bolsa.items.filter(i => i.producto_id !== producto_id);
        if (bolsa.items.length === 0) {
          carrito.bolsas = carrito.bolsas.filter(b => b.etiqueta !== etiqueta);
        } else {
          bolsa.total = bolsa.items.reduce((sum, i) => sum + i.subtotal, 0);
        }
        carrito.total_general = carrito.bolsas.reduce((sum, b) => sum + b.total, 0);
        set({ carrito: { ...carrito } });
      },

      updateItemQuantity: (etiqueta, producto_id, cantidad) => {
        if (cantidad < 1) return;
        const { carrito } = get();
        const bolsa = carrito.bolsas.find(b => b.etiqueta === etiqueta);
        if (!bolsa) return;

        const item = bolsa.items.find(i => i.producto_id === producto_id);
        if (!item) return;

        item.cantidad = cantidad;
        item.subtotal = item.precio_unitario * cantidad;
        bolsa.total = bolsa.items.reduce((sum, i) => sum + i.subtotal, 0);
        carrito.total_general = carrito.bolsas.reduce((sum, b) => sum + b.total, 0);
        set({ carrito: { ...carrito } });
      },

      removeBolsa: (etiqueta) => {
        const { carrito } = get();
        carrito.bolsas = carrito.bolsas.filter(b => b.etiqueta !== etiqueta);
        carrito.total_general = carrito.bolsas.reduce((sum, b) => sum + b.total, 0);
        set({ carrito: { ...carrito } });
      },

      clearCart: () => set({ carrito: { usuario_id: getUserIdFromToken(), bolsas: [], total_general: 0 } }),

      getTotalGeneral: () => get().carrito.total_general,

      logout: () => {
        set({ carrito: { usuario_id: null, bolsas: [], total_general: 0 } });
      },
    }),
    {
      name: 'cart-storage', // persiste en localStorage
    }
  )
);