import Message from '../models/message.model.js'

export const getAllMessagesService = async (canvasId) =>
    await Message.find({ canvas: canvasId })

// export const sendMessageService = async (message) =>
//     await Message.create(message);

export const getMessagesService = async (filter) => 
    await Message.find(filter).populate('sender', 'name')

export const sendMessageService = async (message) => {
    const newMessage = await Message.create(message);
    return await newMessage.populate("sender", "name");
};

