import { create } from "zustand";

interface AuthState {
  isAuthenticated: boolean;
  accessToken: string | null;
  setAccessToken: (accessToken: string | null) => void;
  setAuthenticated: (isAuthenticated: boolean) => void;
  resetAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  accessToken: null,
  setAccessToken: (accessToken) => set({ accessToken }),
  setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
  resetAuth: () => set({ isAuthenticated: false, accessToken: null })
}));
