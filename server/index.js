import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/db.js";
import userRoute from "./routes/userRoute.js";
import chatRoute from "./routes/chatRoute.js";
import messageRoute from "./routes/messageRoute.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 6000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use(
  cors({
    origin: process.env.frontendURL, // Change this in production
    credentials: true,
  })
);

// API Routes
app.use("/api/users", userRoute);
app.use("/api/chats", chatRoute);
app.use("/api/messages", messageRoute);

// Serve static files from Vite build in production
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV === "production") {
  const clientBuildPath = path.resolve(__dirname, "../client/dist");
  app.use(express.static(clientBuildPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(clientBuildPath, "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is running...");
  });
}

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

// Start server only after DB connection is successful
const startServer = async () => {
  try {
    await connectDB();
    console.log("✅ MongoDB connected");

    // Create HTTP server
    const server = http.createServer(app);

    // Initialize Socket.IO
    const io = new Server(server, {
      cors: {
        origin: process.env.frontendURL,
        credentials: true,
      },
    });

    // Online users map
    const onlineUsers = new Map();

    io.on("connection", (socket) => {
      if (process.env.NODE_ENV !== "production") {
        console.log("🔌 New socket connection:", socket.id);
      }

      // Handle user login
      socket.on("addNewUser", (userId) => {
        onlineUsers.set(userId, socket.id);
        if (process.env.NODE_ENV !== "production") {
          console.log("✅ User connected:", userId);
        }
      });

      // Handle sending message
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

      // Handle user disconnect
      socket.on("disconnect", () => {
        for (let [userId, socketId] of onlineUsers.entries()) {
          if (socketId === socket.id) {
            onlineUsers.delete(userId);
            if (process.env.NODE_ENV !== "production") {
              console.log("❌ User disconnected:", userId);
            }
            break;
          }
        }
      });
    });

    // Start listening
    server.listen(port, () => {
      console.log(`🚀 Server running on port ${port} with Socket.IO`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
