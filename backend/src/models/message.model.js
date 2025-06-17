import mongoose from "mongoose";

const messageSchema = mongoose.Schema(
    {
        content: {
            type: String,
            required: true
        },
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        lobby: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Lobby",
            default: null
        },
        canvas: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Canvas",
            default: null
        },
    },
    { timestamps: true }
)

const Message = mongoose.model("Message", messageSchema);

export default Message;