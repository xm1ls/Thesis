import { create } from 'zustand'
import { axiosInstance } from '../lib/axios';
import { io } from 'socket.io-client'
import toast from "react-hot-toast";
import { lobbyStore } from './lobbyStore';

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "/api";

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isCheckingAuth: true,
    socket: null,
    currentLobby: null,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check");
            set({ authUser: res.data, currentLobby: res.data.currentLobby })
            lobbyStore.setState({ currentLobbyId: res.data.currentLobby });

            get().connectSocket();
        } catch (error) {
            set({ authUser: null })
        } finally {
            set({ isCheckingAuth: false })
        }
    },

    signup: async (data) => {
        set({ isSigningUp: true })
        try {
            const res = await axiosInstance.post("/auth/signup", data);
            set({ authUser: res.data })
            get().connectSocket();

            toast.success(res.data.message);
        } catch (error) {
            console.log(error)
            toast.error(error.response.data.message);
        } finally {
            set({ isSigningUp: false })
        }
    },

    login: async (data) => {
        set({ isLoggingIn: true })
        try {
            const res = await axiosInstance.post("/auth/login", data)
            set({ authUser: res.data })
            get().connectSocket();

            toast.success(res.data.message);
        } catch (error) {
            toast.error(error.response.data.message, { duration: 1000 });
        } finally {
            set({ isLoggingIn: false })
        }
    },

    logout: async () => {
        try {
            const res = await axiosInstance.post("/auth/logout")
            set({ authUser: null })
            get().disconnectSocket();

            toast.success(res.data.message);
        } catch (error) {
            console.log(error)
            toast.error(error.response.data.message);
        }
    },

    connectSocket: () => {
        const { authUser } = get();
        if (!authUser || get().socket?.connected) return;

        const socket = io(BASE_URL, {
            query: {
                userId: authUser._id,
            },
        });

        socket.connect();

        set({ socket: socket });
    },

    disconnectSocket: () => {
        if (get().socket?.connected) get().socket.disconnect();
    },
}));