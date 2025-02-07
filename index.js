const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
app.use(express.static(__dirname + '/public'));

const httpServer = createServer(app);
const io = new Server(httpServer, { /* options */ });

const canvasPixels = []

io.on("connection", (socket) => {
    console.log(socket.id)
    io.emit("firstConnect", canvasPixels)

    socket.on("drawing", (data) => {
        canvasPixels.push(data);
        io.emit("drawing", data)
    })
});

httpServer.listen(3000, () => console.log("listening"));