import express from 'express'
import { drawPixel, createLobby, joinLobby, getPixels, createCanvas, getCanvas, getCanvases } from '../controllers/pixel.controller.js'
import { protectRoute } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/create', protectRoute, createCanvas)
router.post('/canvas/:name/place', protectRoute, drawPixel)
router.get('/canvas/:name', protectRoute, getCanvas)
router.get('/canvas', protectRoute, getCanvases)
router.get('/join/:name', protectRoute, joinLobby)
router.get('/canvas/:name/pixels', protectRoute, getPixels)

export default router;