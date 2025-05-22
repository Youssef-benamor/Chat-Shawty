import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";

const PotentialChats = ({ updateSelectedTabIndex }) => {
  const { user } = useContext(AuthContext);
  const { potentialChats, createChat, onlineUsers } = useContext(ChatContext);

  return (
    <div className="mb-4">
      {potentialChats && potentialChats.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {potentialChats.map((u, index) => {
            const isOnline = onlineUsers?.some((ou) => ou?.userId === u._id);
            return (
              <div
                key={index}
                onClick={() => {
                  createChat(user._id, u._id);
                  updateSelectedTabIndex(0);
                }}
                className="relative flex cursor-pointer items-center gap-2 rounded-full bg-gradient-to-r from-purple-700 via-purple-500 to-teal-500 px-4 py-2 text-sm font-semibold text-white shadow-md transition-transform hover:scale-105 hover:shadow-lg"
              >
                <span>{u.name}</span>
                {isOnline && (
                  <span className="absolute -right-1 -top-1 h-3 w-3 animate-ping rounded-full border-2 border-zinc-900 bg-teal-400 shadow-md" />
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <span className="text-sm text-zinc-400">
          No new potential connections
        </span>
      )}
    </div>
  );
};

export default PotentialChats;
