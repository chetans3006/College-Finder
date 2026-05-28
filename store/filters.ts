import { create } from 'zustand';
import { FilterState } from '@/types';

interface FiltersStore extends FilterState {
  setSearch: (search: string) => void;
  setLocation: (location: string[]) => void;
  setFeesRange: (range: [number, number]) => void;
  setRatingRange: (range: [number, number]) => void;
  setSortBy: (sortBy: 'rating' | 'fees-low' | 'fees-high' | 'placement') => void;
  resetFilters: () => void;
}

const DEFAULT_FILTERS: FilterState = {
  search: '',
  location: [],
  feesRange: [0, 300000],
  ratingRange: [0, 5],
  sortBy: 'rating',
};

export const useFiltersStore = create<FiltersStore>((set) => ({
  ...DEFAULT_FILTERS,
  setSearch: (search: string) => set({ search }),
  setLocation: (location: string[]) => set({ location }),
  setFeesRange: (feesRange: [number, number]) => set({ feesRange }),
  setRatingRange: (ratingRange: [number, number]) => set({ ratingRange }),
  setSortBy: (sortBy: FilterState['sortBy']) => set({ sortBy }),
  resetFilters: () => set(DEFAULT_FILTERS),
}));
