import express from "express";
import { Server } from "socket.io";
import http from "http";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "https://thesis-ehnk.onrender.com"],
  },
});

const onlineUsers = {};

io.on("connection", (socket) => {
  console.log(`User connected. Total users: ${io.engine.clientsCount}`);
  socket.join("main");

  const playerCount = io.sockets.adapter.rooms.get("main")?.size || 0;
  io.to("main").emit("update-player-count", playerCount);

  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) onlineUsers[userId] = socket.id;

  socket.on("place", (data) => {
    const { lobbyId, pixel } = data;
    console.log(lobbyId);

    io.to(lobbyId).emit("place", pixel);
  });

  socket.on("erase", (data) => {
    const { lobbyId, pixel } = data;

    io.to(lobbyId).emit("erase", pixel);
  });

  socket.on("newCanvas", (data) => {
    io.to("main").emit("newCanvas", data);
  });

  socket.on("join-lobby", (lobbyId) => {
    console.log(socket.id, ": joined ", lobbyId, " lobby");
    socket.join(lobbyId);
  });

  socket.on("leave-lobby", (lobbyId) => {
    console.log(socket.id, ": left ", lobbyId, " lobby");
    socket.leave(lobbyId);

    // const playerCount = io.sockets.adapter.rooms.get(lobbyId)?.size || 0;
    // io.to(lobbyId).emit('update-player-count', playerCount);
  });

  socket.on("chat-message", (msg) => {
    console.log(msg)
    io.to(msg.lobby).emit("chat-message", msg);
  });

  socket.on("disconnect", () => {
    for (const [uid, sid] of Object.entries(onlineUsers)) {
      if (sid === socket.id) {
        delete onlineUsers[uid];
        console.log(`Removed user ${uid} from online users`);
        break;
      }
    }
  });
});

export { io, app, server };
