import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./authStore";
import { lobbyStore } from "./lobbyStore";
import { useCanvasStore } from "./useCanvasStore";
import toast from "react-hot-toast";

// Shared handler reference
let handleSend = null;

export const useChatStore = create((set, get) => ({
  content: "",
  sender: null,
  lobby: null,
  canvas: null,

  messages: [],

  subscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;

    // Prevent duplicate listeners
    if (handleSend) socket.off("chat-message", handleSend);

    handleSend = (message) => {
      console.log("Incoming socket message:", message);
      set((state) => ({
        messages: [...state.messages, message],
      }));
    };

    socket.on("chat-message", handleSend);
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;

    if (handleSend) {
      socket.off("chat-message", handleSend);
      handleSend = null;
    }
  },

  getMessages: async (lobbyId) => {
    const res = await axiosInstance.get("/message", {
      params: { lobbyId },
    });

    set({ messages: res.data.messages });
  },

  sendMessage: async (message) => {
    try {
      const userId = useAuthStore.getState().authUser._id;
      const lobbyId = lobbyStore.getState().currentLobby._id;
      const canvasId = useCanvasStore.getState().canvasId;

      const messageObj = {
        content: message,
        sender: userId,
        lobby: lobbyId,
        canvas: canvasId,
      };

      const messagePromise = axiosInstance.post("/message/send", messageObj);

      toast.promise(messagePromise, {
        loading: "Sending...",
        success: (res) => res?.data?.message || "Successfully sent!",
        error: (err) => err?.response?.data?.message || "Failed to send",
      });

      const res = await messagePromise;

      const socket = useAuthStore.getState().socket;
      socket.emit("chat-message", res.data.savedMessage);
    } catch (error) {
      console.error(error.message);
    }
  },
}));
