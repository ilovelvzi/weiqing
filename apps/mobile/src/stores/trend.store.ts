import { TrendRange } from "@weiqing/shared";
import { create } from "zustand";

type SupportedTrendRange =
  | TrendRange.SEVEN_DAYS
  | TrendRange.THIRTY_DAYS
  | TrendRange.NINETY_DAYS;

interface TrendState {
  selectedRange: SupportedTrendRange;
  setSelectedRange: (selectedRange: SupportedTrendRange) => void;
}

export const useTrendStore = create<TrendState>((set) => ({
  selectedRange: TrendRange.SEVEN_DAYS,
  setSelectedRange: (selectedRange) => set({ selectedRange })
}));
