import {
    checkCanvasExistsService,
    checkCanvasExistsByNameService,
    hashPasswordService,
    createCanvasService,
    getAllCanvasesService
} from '../services/canvas.service.js'

import {
    erasePixelService,
    getAllPixelsService,
    placePixelService
} from '../services/pixel.service.js'

import {
    getAllMessagesService
} from '../services/message.service.js'

export const getCanvasController = async (req, res) => {
    try {
        const canvas = req.canvas;
        const canvasId = canvas._id

        const pixels = await getAllPixelsService(canvasId)
        const messages = await getAllMessagesService(canvasId)

        res.status(200).json({
            message: ["Canvas found"],
            canvas,
            pixels: pixels.length > 0 ? pixels : [],
            messages: messages.length > 0 ? messages : [],
        })

    } catch (error) {
        console.error("Error occurred in getCanvasController:", error.message)

        res.status(500).json({
            message: ["Something went wrong"]
        })
    }
}

export const getAllController = async (req, res) => {
    try {
        const canvases = await getAllCanvasesService();

        if (!canvases.length) return res.status(404).json({
            message: ["No Canvases found"]
        })

        res.status(200).json({
            message: ["Canvases found"],
            canvases,
        });

    } catch (error) {
        console.error("Error occurred in getAllController:", error.message)

        res.status(500).json({
            message: ["Something went wrong"]
        })
    }
}

export const placePixelController = async (req, res) => {
    const pixelData = req.validatedPixel;
    const canvasId = req.canvasId
    const userId = req.user._id

    try {
        const isCanvasExists = await checkCanvasExistsService(pixelData.canvas);

        if (!isCanvasExists) return res.status(404).json({
            message: ["There is no canvas with such name"]
        });

        const pixel = await placePixelService(
            pixelData,
            userId,
            pixelData.canvas
        );

        res.status(201).json({
            message: ["Successfully placed!"],
            pixel
        })
    } catch (error) {
        console.error("Error occured in placePixelController:", error.message);

        res.status(500).json({
            message: ["Failed to place"]
        })
    }
}

export const erasePixelController = async (req, res) => {
    const pixelData = req.body;
    const canvasId = req.body.canvas

    try {
        const isCanvasExists = await checkCanvasExistsService(pixelData.canvas);

        if (!isCanvasExists) return res.status(404).json({
            message: ["There is no canvas with such name"]
        });

        await erasePixelService(
            pixelData,
            canvasId 
        );

        res.status(201).json({
            message: ["Successfully erased!"],
        })
    } catch (error) {
        console.error("Error occured in erasePixelController:", error.message);

        res.status(500).json({
            message: ["Failed to erase"]
        })
    }
}

export const createCanvasController = async (req, res) => {
    try {
        // const { name, width, height, colors, password, maxPlayers, createdBy } = req.validatedCanvas;
        console.log(req.validatedCanvas)
        const { name, width, height, colors, createdBy } = req.validatedCanvas;

        // let hashedPassword = "";
        // if (password && password !== "") hashedPassword = await hashPasswordService(password);

        const newCanvas = await createCanvasService({
            name,
            width,
            height,
            colors,
            // password: hashedPassword,
            // maxPlayers,
            isMain: false,
            createdBy,
        })

        res.status(201).json({
            message: "Canvas created",
            newCanvas
        });
    } catch (error) {
        console.error("Error occured in createCanvasController:", error.message);

        res.status(500).json({
            message: "Failed to create canvas"
        })
    }
}

export const deleteCanvasController = async (req, res) => {
    try {
        const canvasId = req.canvasId

        console.log(canvasId)

        

    } catch (error) {
        console.error("Error occured in deleteCanvas:", error.message);
    }
}