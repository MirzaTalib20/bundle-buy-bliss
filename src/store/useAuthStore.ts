import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  isAuthenticated: boolean;
  credentials: {
    username: string;
    password: string;
  } | null;
  login: (username: string, password: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      credentials: null,
      login: (username: string, password: string) => 
        set({ 
          isAuthenticated: true, 
          credentials: { username, password } 
        }),
      logout: () => 
        set({ 
          isAuthenticated: false, 
          credentials: null 
        }),
    }),
    {
      name: 'auth-storage',
    }
  )
);