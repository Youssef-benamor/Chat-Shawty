import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import { unreadNotificationsFunc } from "../../utils/unreadNotifications";
import moment from "moment";
import clsx from "clsx";
import { Popover } from "@headlessui/react";
import { ChatBubbleOvalLeftEllipsisIcon } from "@heroicons/react/20/solid";

const Notification = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const {
    notifications,
    userChats,
    allUsers,
    markAllNotificationsAsRead,
    markNotificationAsRead,
  } = useContext(ChatContext);

  const unreadNotifications = unreadNotificationsFunc(notifications);
  const modifiedNotifications = notifications.map((n) => {
    const sender = allUsers.find((user) => user._id === n.senderId);

    return {
      ...n,
      senderName: sender?.name,
    };
  });

  return (
    <Popover className="relative">
      {({ open, close }) => (
        <>
          <Popover.Button
            className={clsx(
              "relative rounded-full p-2 transition-opacity focus:outline-none",
              open ? "opacity-90" : "opacity-100",
              "hover:bg-purple-700/30",
            )}
            aria-label="Open notifications"
          >
            <ChatBubbleOvalLeftEllipsisIcon className="h-6 w-6 text-purple-300" />
            {unreadNotifications?.length > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-tr from-teal-400 to-teal-600 text-xs font-bold text-white shadow-lg">
                {unreadNotifications.length}
              </span>
            )}
          </Popover.Button>

          <Popover.Panel className="absolute right-0 z-20 mt-2 w-[calc(100vw-3.5rem)] rounded-lg bg-gradient-to-br from-purple-900/90 via-black/70 to-purple-800/90 shadow-2xl backdrop-blur-md sm:w-80">
            <div className="flex flex-col overflow-hidden rounded-lg border border-purple-700">
              <div className="flex items-center justify-between border-b border-purple-700 px-5 py-3">
                <h3 className="text-lg font-bold text-white">Notifications</h3>
                <button
                  className="text-sm font-semibold text-purple-400 transition hover:text-purple-300"
                  onClick={() => markAllNotificationsAsRead(notifications)}
                  aria-label="Mark all notifications as read"
                >
                  Mark all as read
                </button>
              </div>

              {modifiedNotifications.length === 0 ? (
                <p className="border-b border-purple-700 px-5 py-4 text-center text-sm text-purple-400">
                  No notifications yet...
                </p>
              ) : (
                <div className="scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-purple-900 max-h-60 overflow-y-auto">
                  {modifiedNotifications.map((n, index) => (
                    <div
                      key={index}
                      className={clsx(
                        "cursor-pointer border-b border-purple-700 px-5 py-3 text-sm transition-colors hover:bg-purple-800/70",
                        n.isRead
                          ? "bg-transparent text-purple-300"
                          : "rounded-md bg-purple-700/70 font-semibold text-white shadow-md",
                      )}
                      onClick={() => {
                        close();
                        navigate("/");
                        markNotificationAsRead(
                          n,
                          userChats,
                          user,
                          notifications,
                        );
                      }}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          close();
                          navigate("/");
                          markNotificationAsRead(
                            n,
                            userChats,
                            user,
                            notifications,
                          );
                        }
                      }}
                    >
                      <p>{`${
                        n.senderName || "Someone"
                      } sent you a new message`}</p>
                      <time className="text-xs text-purple-400">
                        {moment(n.date).calendar()}
                      </time>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Popover.Panel>
        </>
      )}
    </Popover>
  );
};

export default Notification;
