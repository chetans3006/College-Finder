import { create } from 'zustand';
import { AuthState, User } from '@/types';

interface AuthStore extends AuthState {
  login: (email: string, password: string) => void;
  signup: (name: string, email: string, password: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticated: false,
  user: null,
  email: '',
  login: (email: string) => {
    set({
      isAuthenticated: true,
      email,
      user: {
        id: Math.random().toString(36).substr(2, 9),
        name: email.split('@')[0],
        email,
      },
    });
  },
  signup: (name: string, email: string) => {
    set({
      isAuthenticated: true,
      email,
      user: {
        id: Math.random().toString(36).substr(2, 9),
        name,
        email,
      },
    });
  },
  logout: () => {
    set({
      isAuthenticated: false,
      user: null,
      email: '',
    });
  },
}));
