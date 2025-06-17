import { 
    checkLobbyExistsByIdService,
    createLobbyService,
    getAllLobbyService,
    joinLobbyService,
    leaveLobbyService
} from "../services/lobby.service.js"

import { hashPasswordService } from "../services/utils.service.js"
import { io } from '../lib/socket.js'

export const createLobbyController = async (req, res) => {
    try {
        const { password, ...lobbyData } = req.validatedLobby;
        console.log(req)

        const hashedPassword = password ? await hashPasswordService(password) : "";
        const isPrivate = password?.trim().length > 0;

        const lobby = await createLobbyService({
            ...lobbyData,
            password: hashedPassword,
            isPrivate
        });

        return res.status(201).json({
            message: ["Lobby created successfully"],
            lobby
        });
    } catch (error) {
        console.error("Error occured in createLobbyController:", error.message)

        res.status(500).json({
            message: ["Something went wrong"]
        })
    }
}

export const getAllLobbyController = async (req, res) => {
    try {
        const lobby = await getAllLobbyService();

        return res.status(201).json({
            message: [`Found ${lobby.length} lobbies`],
            lobby
        });
    } catch (error) {
        console.error("Error occured in getAllLobbyController:", error.message)

        res.status(500).json({
            message: ["Something went wrong"]
        })
    }
}

export const joinLobbyController = async (req, res) => {
    try {
        const { lobbyId, password } = req.body;
        const userId = req.user.id; // Assuming you have user info from auth middleware

        // Call the service function to join the lobby
        const lobby = await joinLobbyService(lobbyId, password, userId);

        // If password is incorrect, return an error
        if (!lobby) {
            return res.status(401).json({
                message: ["Incorrect password"],
            });
        }

        // io.to(lobbyId).emit('join-lobby', lobbyId);

        // Success response
        res.status(200).json({
            message: ["Joined the lobby successfully"],
            lobby,
        });

    } catch (error) {
        console.error("Error occurred in joinLobbyController:", error.message);

        // Check for specific errors to return custom messages
        if (error.message === "Lobby not found") {
            return res.status(404).json({
                message: ["Lobby not found"],
            });
        }

        if (error.message === "User already in the lobby") {
            return res.status(400).json({
                message: ["You are already in this lobby"],
            });
        }

        // Fallback for unexpected errors
        res.status(500).json({
            message: ["Something went wrong"],
        });
    }
};

export const leaveLobbyController = async (req, res) => {
    try {
        const { lobbyId } = req.body;
        const userId = req.user.id; 

        const lobby = await leaveLobbyService(lobbyId, userId);

        // io.to(lobbyId).emit('leave-lobby', lobbyId);

        // Success response
        res.status(200).json({
            message: ["Left the lobby successfully"],
            lobby,
        });

    } catch (error) {
        console.error("Error occurred in leaveLobbyController:", error.message);

        // Check for specific errors to return custom messages
        if (error.message === "Lobby not found") {
            return res.status(404).json({
                message: ["Lobby not found"],
            });
        }

        // Fallback for unexpected errors
        res.status(500).json({
            message: ["Something went wrong"],
        });
    }
};

export const getLobbyByIdController = async (req, res) => {
    try {
        const { lobbyId } = req.params;

        const lobby = await checkLobbyExistsByIdService(lobbyId);
        if (!lobby) return res.status(404).json({ message: 'Lobby not found' });

        res.status(200).json({
            message: ["Lobby has been found successfully"],
            lobby,
        });

    } catch (error) {
        console.error("Error occurred in getLobbyByIdController:", error.message);

        // Fallback for unexpected errors
        res.status(500).json({
            message: ["Something went wrong"],
        });
    }
}