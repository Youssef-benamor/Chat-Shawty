import Users from "../components/chat/Users";
import ChatBox from "../components/chat/ChatBox";

const Chat = () => {
  return (
    <div className="min-h-screen w-full bg-[#1e1b2c] p-3 text-white">
      <div className="flex flex-col gap-3 pt-28 sm:flex-row">
        <Users />
        <ChatBox />
      </div>
    </div>
  );
};

export default Chat;
