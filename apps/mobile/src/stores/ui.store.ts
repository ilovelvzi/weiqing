import { create } from "zustand";

export type AppTab = "home" | "records" | "trend" | "profile";

interface ToastState {
  message: string;
  type: "success" | "error" | "info";
}

interface UiState {
  activeTab: AppTab;
  toast: ToastState | null;
  setActiveTab: (activeTab: AppTab) => void;
  showToast: (toast: ToastState) => void;
  hideToast: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  activeTab: "home",
  toast: null,
  setActiveTab: (activeTab) => set({ activeTab }),
  showToast: (toast) => set({ toast }),
  hideToast: () => set({ toast: null })
}));
