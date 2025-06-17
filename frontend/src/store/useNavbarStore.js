import { create } from "zustand";

export const useNavbarStore = create((set) => ({
  actions: null, 
  setActions: (actions) => set({ actions }),
  clearActions: () => set({ actions: null }),
}));
