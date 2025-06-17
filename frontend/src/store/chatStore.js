import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./authStore";
import { lobbyStore } from "./lobbyStore";
import { useCanvasStore } from "./useCanvasStore";
import toast from "react-hot-toast";

export const useChatStore = create((set, get) => ({
    content: "",
    sender: null,
    lobby: null,
    canvas: null,

    sendMessage: async (message) => {
        try {
            const userId = useAuthStore.getState().authUser._id
            const lobbyId = lobbyStore.getState().currentLobby
            const canvasId = useCanvasStore.getState().canvasId

            const messagePromise = axiosInstance.post("/message/send", {
                content: message,
                sender: userId,
                lobby: lobbyId,
                canvas: canvasId
            })

            toast.promise(
                messagePromise,
                {
                    loading: "Sending...",
                    success: (res) => res?.data?.message || "Successfully sent!",
                    error: (err) => err?.response?.data?.message || "Failed to send"
                }
            )

            const res = await messagePromise;
        } catch (error) {
            console.error(error.message)
        }
    }
}))
