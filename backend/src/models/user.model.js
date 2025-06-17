import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            default: ""
        },
        name: {
            type: String,
            required: true,
            unique: true,
            minLength: 3,
            maxLength: 30
        },
        password: {
            type: String,
            requried: true,
            minLength: 8,
        },
        pixelsPlaced: {
            type: Number,
            min: 0,
            default: 0,
        },
        currentLobby: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Lobby',
            default: null
        }

    },
    { timestamps: true }
)

const User = mongoose.model("User", userSchema);

export default User;