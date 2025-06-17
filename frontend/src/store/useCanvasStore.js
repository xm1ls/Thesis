import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./authStore";
import { lobbyStore } from "./lobbyStore";
import toast from "react-hot-toast";

export const useCanvasStore = create((set, get) => ({
    isCanvasLoading: true,
    canvasId: null,
    name: null,
    width: 0,
    height: 0,
    canvas: null,
    pixels: [],
    newPixel: null,
    erasePixel: null,
    color: "#000",
    playerCount: 0,
    colors: null,
    tool: "paint",
    setTool: (tool) => set({ tool }),

    createCanvas: async (data) => {
        try {
            const { name, width, height, colors } = data
            // console.log(data)

            const canvasPromise = axiosInstance.post(`/canvas/create`, {
                name,
                width,
                height,
                colors,
            });

            toast.promise(
                canvasPromise,
                {
                    loading: "Creating...",
                    success: (res) => res?.data?.message || "Successfully created!",
                    error: (err) => err?.response?.data?.message || "Failed to create"
                }
            )

            const { data: { canvas } } = await canvasPromise;
            console.log(canvas)
        } catch (error) {
            console.error(error.message)
        }
    },

    getCanvas: async (name) => {
        try {
            set({ isCanvasLoading: true })

            const canvasPromise = axiosInstance.get(`/canvas/${name}`)

            toast.promise(
                canvasPromise,
                {
                    loading: "Loading...",
                    success: (res) => res?.data?.message || "Ready!",
                    error: (err) => err.response?.data?.message || "Failed"
                }
            );

            const { data: { canvas, pixels } } = await canvasPromise;

            set({
                canvasId: canvas._id,
                name: canvas.name,
                width: canvas.width,
                height: canvas.height,
                colors: canvas.colors,
                canvas,
                pixels,
            })
        } catch (error) {
            console.error(error.message)
        } finally {
            set({ isCanvasLoading: false })
        }
    },

    placePixel: async (x, y) => {
        try {
            const { name, canvasId } = get();
            const userId = useAuthStore.getState().authUser._id

            const pixelPromise = axiosInstance.post(`/canvas/${name}/place`, {
                x,
                y,
                color: get().color,
                placedBy: userId,
                canvas: canvasId
            })

            toast.promise(
                pixelPromise,
                {
                    loading: "Placing...",
                    success: (res) => res?.data?.message || "Successfully placed!",
                    error: (err) => err?.response?.data?.message || "Failed to place"
                }
            )

            const { data: { pixel } } = await pixelPromise;

            if (pixel) {
                const socket = useAuthStore.getState().socket
                const lobbyId = lobbyStore.getState().currentLobby?._id ?? "main";

                socket.emit("place", { pixel, lobbyId });
            }

        } catch (error) {
            console.error(error.message)
        }
    },

    removePixel: async (x, y) => {
        try {
            const { name, canvasId } = get();
            const userId = useAuthStore.getState().authUser._id

            const pixel = {
                x,
                y,
                placedBy: userId,
                canvas: canvasId
            }

            const pixelPromise = axiosInstance.post(`/canvas/${name}/erase`, pixel)

            toast.promise(
                pixelPromise,
                {
                    loading: "Erasing...",
                    success: (res) => res?.data?.message || "Successfully erased!",
                    error: (err) => err?.response?.data?.message || "Failed to erase"
                }
            )

            await pixelPromise;

            const socket = useAuthStore.getState().socket
            const currentLobby = lobbyStore.getState().currentLobby
            const lobbyId = currentLobby?._id ?? "main";

            socket.emit("erase", { pixel, lobbyId });
        } catch (error) {
            console.error(error.message)
        }
    },

    subscribeToCanvas: () => {
        const socket = useAuthStore.getState().socket;

        const handlePlace = (pixel) => {
            if (!pixel) return;
            set({ newPixel: pixel });
        };

        const handleErase = (pixel) => {
            if (!pixel) return;
            set({ erasePixel: pixel });
        };

        const handlePlayerCount = (count) => {
            set({ playerCount: count });
        };

        socket.off("place", handlePlace);
        socket.off("erase", handleErase);
        socket.off("update-player-count", handlePlayerCount);

        socket.on("place", handlePlace);
        socket.on("erase", handleErase);
        socket.on("update-player-count", handlePlayerCount);
    },

    setColor: (color) => set({ color }),
})) 