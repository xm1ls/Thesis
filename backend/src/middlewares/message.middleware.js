import { validateMessage } from "../validators/message.validator.js";

export const validateMessageMiddleware = async (req, res, next) => {
    try {
        const { error, value: messageData } = validateMessage(req.body)

        if (error) return res.status(400).json({
            message: error.details?.map(({ message }) => message) || ["Invalid data provided"]
        });

        req.validatedMessage = messageData;

        next();

    } catch (error) {
        console.error("Error in validateMessageMiddleware:", error.message);

        return res.status(500).json({
            message: ["Something went wrong"]
        })
    }
}