import { Server } from "socket.io";
import dotenv from "dotenv";

dotenv.config();

const port = process.env.PORT || 3000;

const io = new Server({
  cors: {
    origin:
      process.env.NODE_ENV === "production"
        ? "https://socket.infoplus.com"
        : "http://localhost:5173",
  },
});

let onlineUsers = [];

io.on("connection", (socket) => {
  console.log("new connection", socket.id);

  socket.on("addNewUser", (userId) => {
    if (!onlineUsers.some((user) => user.userId === userId)) {
      onlineUsers.push({ userId, socketId: socket.id });
    }

    io.emit("getOnlineUsers", onlineUsers);
  });

  socket.on("sendMessage", (message) => {
    const user = onlineUsers.find((u) => u.userId === message.recipientId);

    if (user) {
      io.to(user.socketId).emit("getMessage", message);
      io.to(user.socketId).emit("getNotification", {
        senderId: message.senderId,
        isRead: false,
        date: new Date(),
        chatId: message.chatId,
      });
    }
  });

  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((u) => u.socketId !== socket.id);
    io.emit("getOnlineUsers", onlineUsers);
  });
});

io.listen(port, () => {
  console.log(`Socket server running on port ${port}`);
});
