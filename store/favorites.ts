import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FavoritesStore {
  favorites: string[];
  addFavorite: (collegeId: string) => void;
  removeFavorite: (collegeId: string) => void;
  isFavorite: (collegeId: string) => boolean;
  clearFavorites: () => void;
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      favorites: [],
      addFavorite: (collegeId: string) => {
        set((state) => ({
          favorites: [...new Set([...state.favorites, collegeId])],
        }));
      },
      removeFavorite: (collegeId: string) => {
        set((state) => ({
          favorites: state.favorites.filter((id) => id !== collegeId),
        }));
      },
      isFavorite: (collegeId: string) => {
        return get().favorites.includes(collegeId);
      },
      clearFavorites: () => {
        set({ favorites: [] });
      },
    }),
    {
      name: 'favorites-storage',
    }
  )
);
