import mongoose from 'mongoose'

const canvasSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            minLength: 3,
            maxLength: 30,
        },
        width: {
            type: Number,
            default: 50,
            required: true,
            min: 10,
            max: 100,
        },
        height: {
            type: Number,
            default: 50,
            required: true,
            min: 10,
            max: 100,
        },
        // password: {
        //     type: String,
        //     default: "",
        //     validate: {
        //         validator: function (value) {
        //             return value === "" || value.length >= 4;
        //         },
        //         message: "Password must be at least 4 characters long",
        //     },
        // },
        colors: {
            type: [String],
            validate: {
                validator: function (arr) {
                    return arr.every(color =>
                        /^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/.test(color)
                    );
                },
                message: 'Each color must be a valid hex code',
            },
            default: [],
        },
        // maxPlayers: {
        //     type: Number,
        //     required: true,
        //     default: 1,
        //     min: 1,
        //     max: 5
        // },
        isMain: {
            type: Boolean,
            default: false
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        }
    },
    { timestamps: true }
)

const Canvas = mongoose.model("Canvas", canvasSchema)

export default Canvas;