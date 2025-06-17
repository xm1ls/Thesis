import mongoose from 'mongoose'

export const lobbySchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            minLength: 3,
            maxLength: 30,
        },
        password: {
            type: String,
            default: "",
            validate: {
                validator: function (value) {
                    return value === "" || value.length >= 4;
                },
                message: "Password must be at least 4 characters long",
            },
        },
        isPrivate: {
            type: Boolean,
            default: false
        },
        maxPlayers: {
            type: Number,
            required: true,
            default: 1,
            min: 1,
            max: 10
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        canvas: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Canvas",
            // required: true,
        },
        players: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        playerCount: {
            type: Number,
            default: 0
        },
    },
    { timestamps: true }
)

const Lobby = mongoose.model("Lobby", lobbySchema);

export default Lobby;