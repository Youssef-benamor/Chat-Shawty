import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 3000;


// Create Socket.IO server attached to HTTP server
const io = new Server(server, {
  cors: {
    origin: ["https://chat-shawty.vercel.app", "http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

let onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Add new user with userId and socketId
  socket.on("addNewUser", (userId) => {
    if (!onlineUsers.has(userId)) {
      onlineUsers.set(userId, socket.id);
      console.log(`User added: ${userId}`);
    }

    // Emit updated online users as array of objects
    io.emit(
      "getOnlineUsers",
      Array.from(onlineUsers, ([userId, socketId]) => ({ userId, socketId }))
    );
  });

  // Handle sending message to recipient by userId
  socket.on("sendMessage", (message) => {
    const recipientSocketId = onlineUsers.get(message.recipientId);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit("getMessage", message);
      io.to(recipientSocketId).emit("getNotification", {
        senderId: message.senderId,
        isRead: false,
        date: new Date(),
      });
      console.log(
        `Message sent from ${message.senderId} to ${message.recipientId}`
      );
    }
  });

  // Handle user disconnecting
  socket.on("disconnect", () => {
    // Remove user from onlineUsers map by socketId
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        console.log(`User disconnected: ${userId}`);
        break;
      }
    }

    io.emit(
      "getOnlineUsers",
      Array.from(onlineUsers, ([userId, socketId]) => ({ userId, socketId }))
    );
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
