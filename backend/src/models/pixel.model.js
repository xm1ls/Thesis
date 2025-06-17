import mongoose from 'mongoose'

const pixelSchema = new mongoose.Schema(
    {
        x: {
            type: Number,
            required: true,
            min: 0
        },
        y: {
            type: Number,
            requried: true,
            min: 0
        },
        color: {
            type: String,
            required: true,
        },
        placedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        canvas: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Canvas",
            required: true,
        }
    },
    { timestamps: true }
)

const Pixel = mongoose.model("Pixel", pixelSchema);

export default Pixel;