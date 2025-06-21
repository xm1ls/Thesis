import express from 'express'

import { protectRoute } from '../middlewares/auth.middleware.js';

import {
    setCheckExistenceFlag
} from '../middlewares/flag.middleware.js';

import {
    validateCanvasMiddleware,
    validatePixelMiddleware,
    validateCanvasNameMiddleware,
} from '../middlewares/validator.middleware.js';

import {
    checkCanvasExistsByNameMiddleware,
} from '../middlewares/canvas.middleware.js';

import {
    getAllController,
    getCanvasController,
    placePixelController,
    createCanvasController,
    deleteCanvasController,
    erasePixelController,
    updateCanvasColorsController,
} from '../controllers/canvas.controller.js'

const router = express.Router();

router.get('/', protectRoute, getAllController);

const getCanvasMiddlewares = [
    protectRoute,
    validateCanvasNameMiddleware,
    setCheckExistenceFlag(false),
    checkCanvasExistsByNameMiddleware,
];

router.get('/:name', getCanvasMiddlewares, getCanvasController);

const placePixelMiddlewares = [
    protectRoute,
    validateCanvasNameMiddleware,
    setCheckExistenceFlag(false),
    checkCanvasExistsByNameMiddleware,
    validatePixelMiddleware,
];

router.post('/:name/place', placePixelMiddlewares, placePixelController);

const erasePixelMiddlewares = [
    protectRoute,
    validateCanvasNameMiddleware,
    setCheckExistenceFlag(false),
    checkCanvasExistsByNameMiddleware,
    // validatePixelMiddleware,
];

router.post('/:name/erase', erasePixelMiddlewares, erasePixelController);

const createCanvasMiddlewares = [
    protectRoute,
    validateCanvasNameMiddleware,
    setCheckExistenceFlag(true),
    checkCanvasExistsByNameMiddleware,
    validateCanvasMiddleware,
];

router.post('/create', createCanvasMiddlewares, createCanvasController);

router.delete(
    '/:name/delete',
    validateCanvasNameMiddleware,
    validatePixelMiddleware,
    deleteCanvasController
);

router.put('/:canvasId/colors', protectRoute, updateCanvasColorsController)

export default router;