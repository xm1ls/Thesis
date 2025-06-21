import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import mongoose from 'mongoose'

import path from "path"

import authRoutes from './routes/auth.route.js'
import pixelRoutes from './routes/pixel.route.js'
import canvasRoutes from './routes/canvas.route.js'
import lobbyRoutes from './routes/lobby.route.js'
import messageRoutes from './routes/message.route.js'

import { connectDB } from './lib/db.js'
import { app, server } from './lib/socket.js'

import Canvas from './models/canvas.model.js'

dotenv.config();

const PORT = process.env.PORT;
const __dirname = path.resolve();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    // origin: "http://localhost:5173",
    origin: "*",
    credentials: true
}))

const initializeMainCanvas = async () => {
    let canvas = await Canvas.findOne({isMain: true});
    if (!canvas) {
        canvas = new Canvas({
            name: "main",
            isMain: true,
            createdBy: "67aa056cd64e9c10d3cba0e8"
        });
        await canvas.save();
    }
    console.log("Main canvas initialized:", canvas._id);
};

initializeMainCanvas();

app.use('/api/auth/', authRoutes);
app.use('/api/draw/', pixelRoutes);
app.use('/api/canvas/', canvasRoutes);
app.use('/api/lobby/', lobbyRoutes);
app.use('/api/message/', messageRoutes);

if(process.env.NODE_ENV==="production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    })
}

server.listen(PORT, () => {
    console.log("listening on PORT:", PORT);
    connectDB();
})