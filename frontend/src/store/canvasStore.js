import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./authStore";
import toast from "react-hot-toast";

export const useCanvasStoreTest = create((set, get) => ({
    canvas: "main",
    canvases: [],
    pixels: [],
    newPixel: null,
    canvasInfo: {},
    isLoadingCanvas: false,

    getPixels: async () => {
        try {
            const res = await axiosInstance.get(`draw/canvas/${get().canvas}/pixels`);
            set({ pixels: res.data })

        } catch (error) {
            console.log(error)
        }
    },

    getCanvases: async () => {
        try {
            const res = await axiosInstance.get(`draw/canvas`);
            set({ canvases: res.data })
        } catch (error) {
            console.log(error)
        }
    },

    placePixel: async (data) => {
        const { canvas } = get()
        try {
            await axiosInstance.post(`draw/canvas/${canvas}/place`, data);
        } catch (error) {
            console.log(error)
            toast.error(error.response.data.message, { duration: 1000 })
        }
    },

    createCanvas: async (data) => {
        try {
            const res = await axiosInstance.post("draw/create", data);
            console.log(res)
            set({ canvas: res.data.newCanvas.name })
            console.log(get().canvas)
        } catch (error) {
            console.log(error)
        }
    },

    joinCanvas: {

    },

    getCanvas: async () => {
        set({ isLoadingCanvas: true })
        
        try {
            const res = await axiosInstance.get(`draw/canvas/${get().canvas}`)
            get().getPixels()
            
            set({ canvasInfo: res.data })
            set({ isLoadingCanvas: false })
        } catch (error) {
            console.log(error)
        }
    },

    subscribeToCanvas: () => {
        const socket = useAuthStore.getState().socket

        socket.on("place", (newPixel) => {
            console.log(newPixel)
            if (newPixel) set({ newPixel: newPixel })
            console.log("new pixel just placed")
        })

        socket.on("newCanvas", (newCanvas) => {
            set((state) => {
                if (state.canvases.some((c) => c.name === newCanvas.name)) {
                    return state;
                }
                return { canvases: [...state.canvases, newCanvas] };
            });
        });

    },

    unsubscribeFromCanvas: () => {
        const socket = useAuthStore.getState().socket;
        socket.off("place");
    },
}))
