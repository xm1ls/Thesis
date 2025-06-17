import express from 'express'

import { protectRoute } from '../middlewares/auth.middleware.js';

import { validateMessageMiddleware } from '../middlewares/message.middleware.js';

import {
    getMessagesController,
    sendMessageController
} from '../controllers/message.controller.js'

const router = express.Router();

const getMessagesMiddlewares = [
    protectRoute,
];

router.get('/', getMessagesMiddlewares, getMessagesController);

const sendMessageMiddlewares = [
    protectRoute,
    validateMessageMiddleware
];

router.post('/send', sendMessageMiddlewares, sendMessageController);


export default router;