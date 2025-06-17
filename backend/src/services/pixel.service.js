import Pixel from "../models/pixel.model.js"
import { io } from '../lib/socket.js'

import mongoose from 'mongoose'

export const getAllPixelsService = async (canvasId) =>
    await Pixel.find({ canvas: canvasId })

export const placePixelService = async (pixelData, userId, canvasId) => {
    const pixel = new Pixel({
        ...pixelData,
        placedBy: userId,
        canvas: canvasId
    })

    return await pixel.save();
}

export const erasePixelService = async (pixelData, canvasId) => {
    const { x, y } = pixelData;

    await Pixel.deleteMany({
        x,
        y,
        canvas: new mongoose.Types.ObjectId(canvasId)
    });

    // io.emit("erase", { x, y, canvas: canvasId });
};