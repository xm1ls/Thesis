import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./authStore";
import toast from "react-hot-toast";

export const lobbyStore = create((set, get) => ({
    name: "",
    lobbies: null,
    currentLobbyId: null,
    currentLobby: null,

    createLobby: async (lobbyData) => {
        try {

            const createLobbyPromise = axiosInstance.post('/lobby/create', lobbyData);

            toast.promise(
                createLobbyPromise,
                {
                    loading: "Loading...",
                    success: (res) => res?.data?.message || "Ready!",
                    error: (err) => err.response?.data?.message || "Failed"
                }
            );

            const { data: { lobby } } = await createLobbyPromise;

            set({
                name: lobby.name,
                currentLobby: lobby,
                currentLobbyId: lobby._id
            })

            return lobby;

        } catch (error) {
            console.error(error.message)
        }
    },

    getAllLobby: async () => {
        try {
            const getAllLobbyPromise = axiosInstance.get('/lobby/');

            toast.promise(
                getAllLobbyPromise,
                {
                    loading: "Loading...",
                    success: (res) => res?.data?.message || "Ready!",
                    error: (err) => err.response?.data?.message || "Failed"
                }
            );

            const { data: { lobby } } = await getAllLobbyPromise;

            set({
                lobbies: lobby
            })

        } catch (error) {
            console.error(error.message);

            toast.error(
                "Failed to fetch lobbies"
            )
        }
    },

    joinLobby: async (lobbyId, password, navigate) => {
        try {
            const joinLobbyPromise = axiosInstance.post('/lobby/join', {
                lobbyId,
                password
            });

            toast.promise(
                joinLobbyPromise,
                {
                    loading: "Joining lobby...",
                    success: (res) => res?.data?.message || "Joined successfully!",
                    error: (err) => err.response?.data?.message || "Failed to join"
                }
            );

            const { data: { lobby } } = await joinLobbyPromise;

            set({
                name: lobby.name,
                currentLobby: lobby,
                currentLobbyId: lobby._id,
            });

            const socket = useAuthStore.getState().socket
            socket.emit("join-lobby", lobbyId);

            navigate(`/lobby/${lobby._id}`);
        } catch (error) {
            console.error("Error joining lobby:", error.message);
        }
    },

    leaveLobby: async (lobbyId, navigate) => {
        try {
            const leaveLobbyPromise = axiosInstance.post('/lobby/leave', { lobbyId });

            toast.promise(
                leaveLobbyPromise,
                {
                    loading: "Leaving lobby...",
                    success: (res) => res?.data?.message || "Left successfully!",
                    error: (err) => err.response?.data?.message || "Failed to leave"
                }
            );

            const { data: lobby } = await leaveLobbyPromise;

            set({
                name: null,
                currentLobby: null,
                currentLobbyId: null
            });

            useAuthStore.setState({ currentLobby: null });

            const socket = useAuthStore.getState().socket
            socket.emit("leave-lobby", lobbyId);

            navigate(`/lobby`);
        } catch (error) {
            console.error("Error leaving lobby:", error.message);
        }
    },

    getLobbyById: async (lobbyId) => {
        try {
            const { data: { lobby } } = await axiosInstance.get(`/lobby/${lobbyId}`);
            // set({ currentLobby: lobby });
        } catch (err) {
            console.error("Failed to fetch lobby:", err.message);
        }
    }


})) 