import { validateLobby, validateLobbyName } from "../validators/lobby.validator.js";
import { checkLobbyExistsByNameService } from '../services/lobby.service.js'

export const validateLobbyMiddleware = async (req, res, next) => {
    try {
        const { error, value: lobbyData } = validateLobby(req.body)

        if (error) return res.status(400).json({
            message: error.details?.map(({ message }) => message) || ["Invalid data provided"]
        });

        req.validatedLobby = lobbyData;

        next();

    } catch (error) {
        console.error("Error in validateLobbyMiddleware:", error.message);

        return res.status(500).json({
            message: ["Something went wrong"]
        })
    }
}

export const validateLobbyNameMiddleware = async (req, res, next) => {
    const lobbyName = req.params.name || req.body.name;

    const { error, value: validatedLobbyName } = validateLobbyName(lobbyName)

    if (error) return res.status(400).json({
        message: error.details?.map(({ message }) => message) || ["Invalid data provided"]
    })

    req.validatedLobbyName = validatedLobbyName;

    next();
}

export const checkLobbyExistsByNameMiddleware = async (req, res, next) => {
    try {
        const name = req.validatedLobbyName;

        const lobbyExists = await checkLobbyExistsByNameService(name);

        if (lobbyExists) {
            if (req.checkExistenceOnly) return res.status(400).json({
                message: ["Lobby with such name already exists"],
            });
        } else {
            if (!req.checkExistenceOnly) return res.status(400).json({
                message: ["Lobby with such name doesn't exists"],
            });
        }

        req.lobby = lobbyExists
    } catch (error) {
        console.error("Error in checkLobbyExistsMiddleware:", error.message);

        return res.status(500).json({
            message: ["Internal error"]
        });
    }

    next();
}