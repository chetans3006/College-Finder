import { create } from 'zustand';
import { CompareCollege } from '@/types';

interface CompareStore {
  compareList: CompareCollege[];
  addToCompare: (college: CompareCollege) => void;
  removeFromCompare: (collegeId: string) => void;
  isInCompare: (collegeId: string) => boolean;
  clearCompare: () => void;
  canAddMore: () => boolean;
}

export const useCompareStore = create<CompareStore>((set, get) => ({
  compareList: [],
  addToCompare: (college: CompareCollege) => {
    set((state) => {
      const exists = state.compareList.some((c) => c.id === college.id);
      if (exists || state.compareList.length >= 3) {
        return state;
      }
      return { compareList: [...state.compareList, college] };
    });
  },
  removeFromCompare: (collegeId: string) => {
    set((state) => ({
      compareList: state.compareList.filter((c) => c.id !== collegeId),
    }));
  },
  isInCompare: (collegeId: string) => {
    return get().compareList.some((c) => c.id === collegeId);
  },
  clearCompare: () => {
    set({ compareList: [] });
  },
  canAddMore: () => {
    return get().compareList.length < 3;
  },
}));
