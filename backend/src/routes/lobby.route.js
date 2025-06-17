import express from 'express'

import { protectRoute } from '../middlewares/auth.middleware.js';

import {
    setCheckExistenceFlag
} from '../middlewares/flag.middleware.js';

import {
    validateLobbyMiddleware,
    validateLobbyNameMiddleware,
    checkLobbyExistsByNameMiddleware,
} from '../middlewares/lobby.middleware.js';

import {
    createLobbyController,
    getAllLobbyController,
    joinLobbyController,
    leaveLobbyController,
    getLobbyByIdController,
} from '../controllers/lobby.controller.js'

const router = express.Router();

const createLobbyMiddlewares = [
    protectRoute,
    validateLobbyNameMiddleware,
    setCheckExistenceFlag(true),
    checkLobbyExistsByNameMiddleware,
    validateLobbyMiddleware,
];

router.post('/create', createLobbyMiddlewares, createLobbyController);

const getAllLobbyMiddlewares = [
    protectRoute,
];

router.get('/', getAllLobbyMiddlewares, getAllLobbyController);

const joinLobbyMiddlewares = [
    protectRoute,
];

router.post('/join', joinLobbyMiddlewares, joinLobbyController);

const leaveLobbyMiddlewares = [
    protectRoute,
]

router.post('/leave', leaveLobbyMiddlewares, leaveLobbyController);

const getLobbyByIdMiddlewares = [
    protectRoute
]
router.get('/:lobbyId', getLobbyByIdMiddlewares, getLobbyByIdController)


export default router;