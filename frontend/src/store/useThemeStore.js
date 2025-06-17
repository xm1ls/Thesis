import { create } from "zustand";

export const useThemeStore = create((set, get) => ({
    theme: localStorage.getItem("app-theme") || "light",

    setTheme: () => {
        const { theme } = get()

        if (theme === "light") {
            localStorage.setItem("app-theme", "dark");
            set({ theme: "dark" });
        } else {
            localStorage.setItem("app-theme", "light");
            set({ theme: "light" });
        }
    },
}));