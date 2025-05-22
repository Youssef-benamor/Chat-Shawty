import { useFetchRecipientUser } from "../../hooks/useFetchRecipient";
import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import avatar from "/src/assets/ava.webp";

import { unreadNotificationsFunc } from "../../utils/unreadNotifications";
import { useFetchLatestMessage } from "../../hooks/useFetchLatestMessage";
import moment from "moment";
import clsx from "clsx";

const UserChat = ({ chat, user }) => {
  const { recipientUser } = useFetchRecipientUser(chat, user);
  const { onlineUsers, notifications, markThisUserNotificationsAsRead } =
    useContext(ChatContext);

  const { latestMessage } = useFetchLatestMessage(chat);
  const unreadNotifications = unreadNotificationsFunc(notifications);
  const thisUserNotifications = unreadNotifications?.filter(
    (n) => n.senderId === recipientUser?._id,
  );

  const isOnline = onlineUsers?.some((u) => u?.userId === recipientUser?._id);

  const truncateText = (text) =>
    text.length > 20 ? text.substring(0, 20) + "..." : text;

  const profileImage = recipientUser?.profilePic || avatar;

  return (
    <div
      onClick={() => {
        if (thisUserNotifications?.length > 0) {
          markThisUserNotificationsAsRead(thisUserNotifications, notifications);
        }
      }}
      className="relative flex cursor-pointer items-center justify-between gap-2 rounded-xl bg-gradient-to-br from-[#1f1b2e] to-[#2b223f] px-4 py-3 shadow-lg backdrop-blur-md transition hover:brightness-110"
    >
      {/* Left Side */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <img
            src={profileImage}
            alt="avatar"
            className="h-11 w-11 rounded-full border-2 border-purple-600 object-cover shadow-md"
          />
          {isOnline && (
            <span className="absolute -bottom-1 -right-1 h-3 w-3 animate-pulse rounded-full border-2 border-[#1f1b2e] bg-teal-400" />
          )}
        </div>
        <div className="max-w-[180px]">
          <div className="truncate font-semibold text-white">
            {recipientUser?.name}
          </div>
          <div className="truncate text-sm text-gray-400">
            {latestMessage?.text && truncateText(latestMessage.text)}
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex flex-col items-end gap-1">
        <span className="text-xs text-gray-500">
          {moment(latestMessage?.createdAt).calendar()}
        </span>
        {thisUserNotifications?.length > 0 && (
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-500 text-xs font-bold text-white shadow-md">
            {thisUserNotifications.length}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserChat;
