import { Mood } from "@weiqing/shared";
import { create } from "zustand";

interface CheckinState {
  draftWeight: string;
  draftMood: Mood | null;
  draftNote: string;
  isSuccessVisible: boolean;
  setDraftWeight: (draftWeight: string) => void;
  setDraftMood: (draftMood: Mood | null) => void;
  setDraftNote: (draftNote: string) => void;
  setSuccessVisible: (isSuccessVisible: boolean) => void;
  resetDraft: () => void;
}

export const useCheckinStore = create<CheckinState>((set) => ({
  draftWeight: "",
  draftMood: null,
  draftNote: "",
  isSuccessVisible: false,
  setDraftWeight: (draftWeight) => set({ draftWeight }),
  setDraftMood: (draftMood) => set({ draftMood }),
  setDraftNote: (draftNote) => set({ draftNote }),
  setSuccessVisible: (isSuccessVisible) => set({ isSuccessVisible }),
  resetDraft: () =>
    set({
      draftWeight: "",
      draftMood: null,
      draftNote: "",
      isSuccessVisible: false
    })
}));
