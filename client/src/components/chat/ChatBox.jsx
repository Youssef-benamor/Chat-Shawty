import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import { useFetchRecipientUser } from "../../hooks/useFetchRecipient";
import moment from "moment";
import InputEmoji from "react-input-emoji";
import {
  ArrowLongLeftIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/20/solid";
import clsx from "clsx";
import { toast } from "react-toastify";

const ChatBox = () => {
  const { user } = useContext(AuthContext);
  const {
    currentChat,
    updateCurrentChat,
    messages,
    isMessagesLoading,
    sendTextMessage,
  } = useContext(ChatContext);
  const { recipientUser, error: recipientUserFetchError } =
    useFetchRecipientUser(currentChat, user);
  const [textMessage, setTextMessage] = useState("");
  const scroll = useRef();

  useEffect(() => {
    if (!recipientUser && recipientUserFetchError?.error) {
      toast.error(recipientUserFetchError.message);
    }
  }, [recipientUser, recipientUserFetchError]);

  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!recipientUser || !currentChat)
    return (
      <div className="mt-5 w-full text-center sm:basis-3/4">
        <span className="inline-block rounded-3xl bg-opacity-70 bg-gradient-to-r from-purple-700 via-purple-900 to-black px-6 py-3 text-lg font-semibold text-white shadow-lg backdrop-blur-md">
          Select a chat to start a conversation
        </span>
      </div>
    );

  if (isMessagesLoading)
    return (
      <p className="w-full text-center font-semibold text-purple-300 sm:basis-3/4">
        Loading Chat...
      </p>
    );

  return (
    <div
      className={clsx(
        "flex h-[calc(100vh-5.25rem)] w-full flex-col gap-4 overflow-y-auto rounded-lg bg-gradient-to-br from-purple-900/60 via-black/50 to-purple-800/60 p-4 shadow-xl backdrop-blur-md sm:h-[80vh] sm:basis-3/4",
        currentChat ? "" : "hidden sm:flex",
      )}
    >
      <div className="flex flex-none items-center justify-between rounded-md bg-gradient-to-r from-purple-700 to-purple-900 px-4 py-2 shadow-md">
        <button
          className="flex-none rounded-md bg-purple-800 p-2 text-white transition hover:bg-purple-600 sm:hidden"
          onClick={() => {
            updateCurrentChat(null);
          }}
          aria-label="Back to chat list"
        >
          <ArrowLongLeftIcon className="h-5 w-5" />
        </button>
        <strong className="flex-1 px-4 text-center text-xl font-bold tracking-wide text-white sm:px-0">
          {recipientUser?.name}
        </strong>
      </div>

      <div className="scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-purple-900 flex grow flex-col gap-3 overflow-y-auto px-2 py-3">
        {messages &&
          messages.map((message, index) => (
            <div
              key={index}
              className={clsx(
                "flex max-w-[60%] flex-col rounded-xl p-3 shadow-md transition-all duration-300",
                message?.senderId === user?._id
                  ? "self-end bg-gradient-to-tr from-teal-600 to-teal-400 text-white"
                  : "self-start bg-gradient-to-tr from-purple-700 to-purple-900 text-purple-100",
              )}
              ref={scroll}
            >
              <span className="whitespace-pre-wrap break-words">
                {message.text}
              </span>
              <span className="mt-1 text-right text-xs font-light opacity-75">
                {moment(message.createdAt).calendar()}
              </span>
            </div>
          ))}
      </div>

      <div className="flex w-full items-center justify-between gap-3 rounded-md bg-gradient-to-r from-purple-800 to-purple-700 p-3 shadow-inner">
        <InputEmoji
          value={textMessage}
          onChange={setTextMessage}
          fontFamily="Nunito, sans-serif"
          borderRadius={8}
          cleanOnEnter
          placeholder="Type your message..."
          className="flex-grow bg-transparent text-white placeholder-purple-300 focus:outline-none"
        />
        <button
          className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-500 transition hover:bg-teal-400 active:scale-95"
          onClick={() =>
            sendTextMessage(textMessage, user, currentChat._id, setTextMessage)
          }
          aria-label="Send message"
        >
          <PaperAirplaneIcon className="h-5 w-5 -rotate-45 text-white" />
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
