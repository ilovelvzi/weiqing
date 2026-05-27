import { TrendRange } from "@weiqing/shared";
import { create } from "zustand";

interface TrendState {
  selectedRange: TrendRange;
  setSelectedRange: (selectedRange: TrendRange) => void;
}

export const useTrendStore = create<TrendState>((set) => ({
  selectedRange: TrendRange.SEVEN_DAYS,
  setSelectedRange: (selectedRange) => set({ selectedRange })
}));
