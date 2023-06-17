import { create } from "zustand";
import { Activity } from "../@types/activity";

export const useActivityStore = create<{
  storeActivity: Activity | null;
  setStoreActivity: (storeActivity: Activity | null) => void;
}>((set) => ({
  storeActivity: null,
  setStoreActivity: (storeActivity) => set({ storeActivity }),
}));
