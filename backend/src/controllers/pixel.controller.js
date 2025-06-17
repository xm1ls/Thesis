import bcrypt from 'bcryptjs'
import Pixel from '../models/pixel.model.js'
import Lobby from '../models/lobby.model.js';
import Canvas from '../models/canvas.model.js';
import { io } from '../lib/socket.js'

export const drawPixel = async (req, res) => {
    const { x, y, color } = req.body;
    const { name } = req.params
    const userId = req.user._id;

    try {
        const isValidNumber = Number.isFinite(x) && Number.isFinite(y) && x >= 0 && y >= 0;

        if (!isValidNumber || !color || !name) return res.status(400).json({
            message: "Invalid pixel data"
        })

        const pixel = new Pixel({
            x, y, color, userId, canvasName: name
        })

        await pixel.save();

        io.emit("place", pixel)

        res.status(201).json({
            message: "Pixel placed", pixel
        })
    } catch (error) {
        console.log(error.message)
        res.status(400).json({
            message: "Failed to place"
        })
    }
}

export const createLobby = async (req, res) => {
    const { name, password } = req.body;
    const userName = req.user.name;

    try {
        if (!name || !userName) return res.status(400).json({
            message: "Data is not provided"
        })

        if (name.length < 3) return res.status(400).json({
            message: "Name is too short"
        })

        if (password.length > 0 && password.length < 3) return res.status(400).json({
            message: "Password is too short"
        })

        const lobby = new Lobby({
            name,
            password,
            createdBy: userName
        })

        await lobby.save();

        res.status(200).json({
            message: "Lobby created"
        })
    } catch (error) {
        console.log(error)
    }
}

export const joinLobby = async (req, res) => {
    const { name } = req.params;
    try {
        const lobby = await Lobby.findOne({ name })

        if (!lobby) return res.status(400).json({
            message: `Can't find lobby named ${name}`
        })


        res.status(200).json({
            message: "Connected to lobby",
            name: lobby.name
        })
    } catch (error) {
        console.log(error)
    }
}

export const createCanvas = async (req, res) => {
    const { name, width, height } = req.body
    const userName = req.user.name

    try {
        if (!name || !width || !height || !userName)
            return res.status(400).json({
                message: "Invalid data"
            })

        const canvas = await Canvas.findOne({ name })

        if (canvas) return res.status(400).json({
            message: "Canvas with such name is already exists"
        })

        const newCanvas = new Canvas({
            name,
            width,
            height,
            isMain: false,
            createdBy: userName
        })

        await newCanvas.save();

        io.emit("newCanvas", newCanvas);

        res.status(200).json({
            newCanvas,
            message: "Canvas created"
        })
    } catch (error) {
        console.log(error)
    }
}

export const getCanvas = async (req, res) => {
    const { name } = req.params;

    try {
        if(!name) return res.status(400).json({
            message: "Data is not provided"
        })

        const canvas = await Canvas.findOne({ name })

        if(!canvas) return res.status(400).json({
            message: "No such canvas"
        })

        res.status(200).json(
            canvas
        )
    } catch (error) {
        console.log(error)
    }
}

export const getPixels = async (req, res) => {
    const { name: canvasName } = req.params;

    try {
        const pixels = await Pixel.find({ canvasName })

        res.status(200).json(
            pixels
        )
    } catch (error) {
        console.log(error)
    }
}

export const getCanvases = async (req, res) => {
    try {
        const canvases = await Canvas.find();

        res.status(200).json(canvases)
    } catch (error) {
        console.log(error)
    }
}