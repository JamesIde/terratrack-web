import { create } from "zustand";

export const useMarkerStore = create<{
  markerIndex: number | null;
  setMarkerIndex: (markerIndex: number) => void;
}>((set) => ({
  markerIndex: 0,
  setMarkerIndex: (markerIndex) => set({ markerIndex }),
}));
