import { create } from "zustand";

interface AuthState {
  isAuthenticated: boolean;
  accessToken: string | null;
  isBootstrapping: boolean;
  setAccessToken: (accessToken: string | null) => void;
  setAuthenticated: (isAuthenticated: boolean) => void;
  setBootstrapping: (isBootstrapping: boolean) => void;
  resetAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  accessToken: null,
  isBootstrapping: true,
  setAccessToken: (accessToken) => set({ accessToken }),
  setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
  setBootstrapping: (isBootstrapping) => set({ isBootstrapping }),
  resetAuth: () => set({ isAuthenticated: false, accessToken: null, isBootstrapping: false })
}));
