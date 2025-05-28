import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";
import path from "path";

import connectDB from "./config/db.js";
import userRoute from "./routes/userRoute.js";
import chatRoute from "./routes/chatRoute.js";
import messageRoute from "./routes/messageRoute.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 6000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173", // Vite dev server
    credentials: true,
  })
);

// API Routes
app.use("/api/users", userRoute);
app.use("/api/chats", chatRoute);
app.use("/api/messages", messageRoute);

// Serve static files in production
if (process.env.NODE_ENV === "production") {
  const __dirname = path.resolve();
  const __rootdir = path.join(__dirname, "..");
  app.use(express.static(path.join(__rootdir, "client", "dist")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__rootdir, "client", "dist", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running...");
  });
}

// Error middleware
app.use(notFound);
app.use(errorHandler);

// Connect to DB
connectDB();

// Create HTTP server and Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

// Keep track of online users
const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("🔌 New socket connection:", socket.id);

  // Add user
  socket.on("addNewUser", (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log("✅ User connected:", userId);
  });

  // Handle messages
  socket.on("sendMessage", (data) => {
    const recipientSocketId = onlineUsers.get(data.recipientId);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit("getMessage", data);
      io.to(recipientSocketId).emit("getNotification", {
        senderId: data.senderId,
        chatId: data.chatId,
      });
    }
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    for (let [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        console.log("❌ User disconnected:", userId);
        break;
      }
    }
  });
});

// Start server
server.listen(port, () => {
  console.log(`🚀 Server running with socket.io on port ${port}`);
});
