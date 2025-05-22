import { createContext, useCallback, useEffect, useState } from "react";
import { baseUrl, getRequest, postRequest } from "../utils/services";
import { io } from "socket.io-client";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children, user }) => {
  const [userChats, setUserChats] = useState(null);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState(null);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // 1. Connect to socket server
  useEffect(() => {
    const newSocket = io(
      import.meta.env.MODE === "production"
        ? "https://socket.infoplus.com"
        : "http://localhost:3000",
    );
    setSocket(newSocket);
    return () => newSocket.disconnect();
  }, []);

  // 2. Send userId to socket server
  useEffect(() => {
    if (socket && user?._id) {
      socket.emit("addNewUser", user._id);
    }
  }, [socket, user]);

  // 3. Receive real-time messages
  useEffect(() => {
    if (!socket) return;

    const handleMessage = (message) => {
      if (message.chatId === currentChat?._id) {
        setMessages((prev) => [...prev, message]);
      }
    };

    const handleNotification = (notif) => {
      setNotifications((prev) => [notif, ...prev]);
    };

    socket.on("getMessage", handleMessage);
    socket.on("getNotification", handleNotification);

    return () => {
      socket.off("getMessage", handleMessage);
      socket.off("getNotification", handleNotification);
    };
  }, [socket, currentChat]);

  // 4. Send a message
  const sendTextMessage = useCallback(
    async (text, sender, chatId, setTextField) => {
      if (!text.trim()) return;

      const response = await postRequest(
        `${baseUrl}/messages`,
        JSON.stringify({
          chatId,
          senderId: sender._id,
          text,
        }),
      );

      if (response.error) return console.log(response);

      const recipientId = currentChat?.members.find((id) => id !== sender._id);

      socket?.emit("sendMessage", {
        ...response,
        recipientId,
      });

      setMessages((prev) => [...prev, response]);
      setTextField("");
    },
    [socket, currentChat],
  );

  return (
    <ChatContext.Provider
      value={{
        userChats,
        currentChat,
        setCurrentChat,
        messages,
        setMessages,
        sendTextMessage,
        onlineUsers,
        notifications,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
