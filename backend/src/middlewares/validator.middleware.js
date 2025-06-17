import {
    validateCanvas,
    validateCanvasName
} from "../validators/canvas.validator.js";

import {
    validatePixel,
} from "../validators/pixel.validator.js";

export const validateCanvasMiddleware = async (req, res, next) => {
    const { error, value: canvasData } = validateCanvas({
        ...req.body,
        createdBy: req.user._id.toString()
    })

    if (error) return res.status(400).json({
        message: error.details?.map(({ message }) => message) || ["Invalid data provided"]
    });

    req.validatedCanvas = canvasData;
    
    next();
}

export const validateCanvasNameMiddleware = async (req, res, next) => {
    const canvasName = req.params.name || req.body.name;

    const { error, value: validatedName } = validateCanvasName(canvasName)

    if (error) return res.status(400).json({
        message: error.details?.map(({ message }) => message) || ["Invalid data provided"]
    })

    req.validatedCanvasName = validatedName;

    next();
}

export const validatePixelMiddleware = async (req, res, next) => {
    const { error, value: pixelData } = validatePixel(req.body)

    if (error) return res.status(400).json({
        message: error.details?.map(({ message }) => message) || ["Invalid data provided"]
    })

    req.validatedPixel = pixelData;

    next()
}