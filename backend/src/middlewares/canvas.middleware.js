import {
    checkCanvasExistsByNameService
} from '../services/canvas.service.js'

export const checkCanvasExistsByNameMiddleware = async (req, res, next) => {
    try {
        const name = req.validatedCanvasName;

        const canvasExists = await checkCanvasExistsByNameService(name);

        if (canvasExists) {
            if (req.checkExistenceOnly) return res.status(400).json({
                message: ["Canvas with such name already exists"],
            });
        } else {
            if (!req.checkExistenceOnly) return res.status(400).json({
                message: ["Canvas with such name doesn't exists"],
            });
        }

        req.canvas = canvasExists
    } catch (error) {
        console.error("Error in checkCanvasExistsMiddleware:", error.message);

        return res.status(500).json({
            message: ["Internal error"]
        });
    }

    next();
}