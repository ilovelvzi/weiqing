import { create } from "zustand";

export type RecordsViewMode = "list" | "calendar";

interface RecordsState {
  viewMode: RecordsViewMode;
  selectedRecordId: string | null;
  isEditModalOpen: boolean;
  isDeleteModalOpen: boolean;
  selectedYear: number;
  selectedMonth: number;
  setViewMode: (viewMode: RecordsViewMode) => void;
  setSelectedRecordId: (selectedRecordId: string | null) => void;
  setEditModalOpen: (isEditModalOpen: boolean) => void;
  setDeleteModalOpen: (isDeleteModalOpen: boolean) => void;
  setCalendarMonth: (selectedYear: number, selectedMonth: number) => void;
}

const now = new Date();

export const useRecordsStore = create<RecordsState>((set) => ({
  viewMode: "list",
  selectedRecordId: null,
  isEditModalOpen: false,
  isDeleteModalOpen: false,
  selectedYear: now.getFullYear(),
  selectedMonth: now.getMonth() + 1,
  setViewMode: (viewMode) => set({ viewMode }),
  setSelectedRecordId: (selectedRecordId) => set({ selectedRecordId }),
  setEditModalOpen: (isEditModalOpen) => set({ isEditModalOpen }),
  setDeleteModalOpen: (isDeleteModalOpen) => set({ isDeleteModalOpen }),
  setCalendarMonth: (selectedYear, selectedMonth) => set({ selectedYear, selectedMonth })
}));
