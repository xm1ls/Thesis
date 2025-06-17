import Lobby from "../models/lobby.model.js";
import User from "../models/user.model.js";
import bcrypt from 'bcryptjs';

// export const createLobbyService = async (lobbyData) =>
//     await Lobby.create(lobbyData);

// export const createLobbyService = async (lobbyData) => {
//     const { createdBy, ...rest } = lobbyData;

//     const lobby = new Lobby({
//         ...rest,
//         players: [createdBy],
//         playerCount: 1,
//         createdBy: createdBy
//     });

//     const savedLobby = await lobby.save();
//     savedLobby.password = undefined;

//     return savedLobby;
// };

export const createLobbyService = async (lobbyData) => {
    const { createdBy, ...rest } = lobbyData;

    // Create the lobby instance
    const lobby = new Lobby({
        ...rest,
        players: [createdBy],
        playerCount: 1,
        createdBy
    });

    // Save lobby to DB
    const savedLobby = await lobby.save();

    // Update user's currentLobby field
    const user = await User.findById(createdBy);
    if (!user) throw new Error("User not found");

    user.currentLobby = savedLobby._id;
    await user.save();

    // Remove sensitive data before returning
    savedLobby.password = undefined;

    return savedLobby;
};

export const checkLobbyExistsByNameService = async (lobbyName) =>
    await Lobby.findOne({ name: lobbyName }).select('-password')

export const checkLobbyExistsByIdService = async (lobbyId) =>
    await Lobby.findOne({ _id: lobbyId }).select('-password')

export const getAllLobbyService = async () =>
    await Lobby.find().select('-password').populate('createdBy', 'name').exec();

// export const joinLobbyService = async (lobbyId, password, userId) => {
//     // Get the lobby without .lean() to keep it as a Mongoose document
//     const lobby = await Lobby.findOne({ _id: lobbyId });
//     if (!lobby) throw new Error("Lobby not found");

//     // Check if user is already in the lobby
//     if (lobby.players.includes(userId)) {
//         throw new Error("User already in the lobby");
//     }

//     // Check if lobby is private and verify password if necessary
//     const isPrivate = !!(lobby.password && lobby.password.trim() !== '');
//     if (isPrivate) {
//         const isPasswordCorrect = await bcrypt.compare(password, lobby.password);
//         if (!isPasswordCorrect) return false;
//     }

//     // Add user and update player count directly on the fetched document
//     lobby.players.addToSet(userId); // addToSet avoids duplicate users
//     lobby.playerCount += 1;

//     // Save the updated document and exclude password from result
//     const updatedLobby = await lobby.save();
//     updatedLobby.password = undefined; // Manually remove password

//     return updatedLobby;
// }

// export const leaveLobbyService = async (lobbyId, userId) => {
//     const lobby = await Lobby.findOne({ _id: lobbyId });
//     if (!lobby) throw new Error("Lobby not found");

//     // Check if the user is in the lobby
//     if (!lobby.players.includes(userId)) {
//         throw new Error("User is not in the lobby");
//     }

//     // Remove user from players array
//     lobby.players = lobby.players.filter(id => id.toString() !== userId.toString());

//     // Decrement player count safely (don't go below 0)
//     lobby.playerCount = Math.max(0, lobby.playerCount - 1);

//     // Save the updated document
//     const updatedLobby = await lobby.save();
//     updatedLobby.password = undefined; // remove sensitive data

//     return updatedLobby;
// };

export const joinLobbyService = async (lobbyId, password, userId) => {
    // Check if user is already in a lobby
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    if (user.currentLobby) {
        throw new Error("User is already in another lobby");
    }

    // Get the lobby
    const lobby = await Lobby.findOne({ _id: lobbyId });
    if (!lobby) throw new Error("Lobby not found");

    if (lobby.players.includes(userId)) {
        throw new Error("User already in this lobby");
    }

    // Validate password if private
    const isPrivate = !!(lobby.password && lobby.password.trim() !== '');
    if (isPrivate) {
        const isPasswordCorrect = await bcrypt.compare(password, lobby.password);
        if (!isPasswordCorrect) {
            throw new Error("Incorrect lobby password");
        }
    }

    // Add user to lobby
    lobby.players.addToSet(userId);
    lobby.playerCount += 1;

    // Update user's current lobby
    user.currentLobby = lobby._id;

    // Save both documents
    await Promise.all([lobby.save(), user.save()]);

    lobby.password = undefined;
    return lobby;
};

export const leaveLobbyService = async (lobbyId, userId) => {
    const lobby = await Lobby.findOne({ _id: lobbyId });
    if (!lobby) throw new Error("Lobby not found");

    // Check if the user is in the lobby
    if (!lobby.players.includes(userId)) {
        throw new Error("User is not in the lobby");
    }

    // Remove user from lobby
    lobby.players = lobby.players.filter(id => id.toString() !== userId.toString());
    lobby.playerCount = Math.max(0, lobby.playerCount - 1);

    // Update the user's currentLobby to null
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");
    user.currentLobby = null;

    // Save both changes
    await Promise.all([lobby.save(), user.save()]);

    lobby.password = undefined; // Hide sensitive data
    return lobby;
};
