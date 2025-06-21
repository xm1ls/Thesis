import { getMessagesService, sendMessageService } from "../services/message.service.js";

export const getMessagesController = async (req, res) => {
    try {
        const { lobbyId, canvasId, global } = req.query;
        let filter = {};

        console.log(req.query)

        if (lobbyId) {
            filter.lobby = lobbyId;
        } else if (canvasId) {
            filter.canvas = canvasId;
        } else if (global) {
            filter.lobby = null;
            filter.canvas = null; 
        }

        const messages = await getMessagesService(filter);

        res.status(200).json({
            message: ['Messages found'],
            messages: messages?.length > 0 ? messages : [],
        })
    } catch (error) {
        console.error("Error occurred in getCanvasMessagesController:", error.message)

        res.status(500).json({
            message: ["Something went wrong"]
        })
    }
}

// export const sendMessageController = async (req, res) => {
//     try {
//         const message = req.validatedMessage;

//         await sendMessageService(message);

//         res.status(201).json({
//             message: ["Message send successfully"],
//         })
//     } catch (error) {
//         console.error("Error occurred in sendMessageController:", error.message)

//         res.status(500).json({
//             message: ["Something went wrong"]
//         })
//     }
// }

export const sendMessageController = async (req, res) => {
    try {
        const message = req.validatedMessage;

        const savedMessage = await sendMessageService(message);

        res.status(201).json({
            message: ["Message sent successfully"],
            savedMessage,
        });
    } catch (error) {
        console.error("Error occurred in sendMessageController:", error.message);

        res.status(500).json({
            message: ["Something went wrong"],
        });
    }
};
