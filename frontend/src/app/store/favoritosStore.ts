import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FavoritosState {
  favoritos: number[];
  loading: boolean;
  setFavoritos: (ids: number[]) => void;
  addFavorito: (productoId: number) => void;
  removeFavorito: (productoId: number) => void;
  toggleFavorito: (productoId: number) => void;
  loadFavoritos: () => Promise<void>;
}

export const useFavoritosStore = create<FavoritosState>()(
  persist(
    (set, get) => ({
      favoritos: [],
      loading: false,
      setFavoritos: (ids) => set({ favoritos: ids }),
      addFavorito: (productoId) =>
        set((state) => ({ favoritos: [...state.favoritos, productoId] })),
      removeFavorito: (productoId) =>
        set((state) => ({
          favoritos: state.favoritos.filter((id) => id !== productoId),
        })),
      toggleFavorito: (productoId) => {
        const { favoritos, addFavorito, removeFavorito } = get();
        if (favoritos.includes(productoId)) {
          removeFavorito(productoId);
        } else {
          addFavorito(productoId);
        }
      },
      loadFavoritos: async () => {
        const token = localStorage.getItem('token');
        if (!token) return;
        set({ loading: true });
        try {
          const res = await fetch('/api/favoritos', {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await res.json();
          if (res.ok && data.favoritos) {
            set({ favoritos: data.favoritos });
          }
        } catch (error) {
          console.error('Error cargando favoritos:', error);
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: 'favoritos-storage',
    }
  )
);