import { useState, useContext } from "react";
import { Tab } from "@headlessui/react";
import clsx from "clsx";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import UserChat from "./UserChat";
import PotentialChats from "./PotentialChats";

const Users = () => {
  const { user } = useContext(AuthContext);
  const {
    currentChat,
    userChats,
    isUserChatsLoading,
    userChatsError,
    updateCurrentChat,
    potentialChats,
  } = useContext(ChatContext);

  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  return (
    <div
      className={clsx("w-full sm:basis-1/4", currentChat && "hidden sm:block")}
    >
      <Tab.Group
        manual
        selectedIndex={selectedTabIndex}
        onChange={setSelectedTabIndex}
      >
        <Tab.List className="flex space-x-1 rounded-t-md bg-gradient-to-tr from-[#1f1b2e] to-[#2b223f] p-1">
          <Tab
            className={({ selected }) =>
              clsx(
                "w-full whitespace-nowrap rounded-md py-2.5 text-sm font-medium leading-4 transition",
                selected
                  ? "bg-[#342c4d] text-white shadow"
                  : "text-gray-300 hover:bg-[#3c335b] hover:text-white",
              )
            }
          >
            Friends
          </Tab>
          <Tab
            className={({ selected }) =>
              clsx(
                "w-full whitespace-nowrap rounded-md py-2.5 text-sm font-medium leading-4 transition",
                selected
                  ? "bg-[#342c4d] text-white shadow"
                  : "text-gray-300 hover:bg-[#3c335b] hover:text-white",
              )
            }
          >
            Potential Chats (
            {potentialChats && potentialChats.length > 0
              ? potentialChats.length
              : 0}
            )
          </Tab>
        </Tab.List>

        <Tab.Panels>
          <Tab.Panel className="rounded-b-md bg-[#2c243e] p-3 focus:outline-none sm:max-h-[calc(80vh-2.8rem)] sm:overflow-y-auto">
            {userChats?.length < 1 ? (
              <p className="text-gray-400">No chats yet</p>
            ) : (
              <div className="flex flex-col gap-0">
                {isUserChatsLoading && (
                  <p className="text-gray-400">Loading chats...</p>
                )}
                {userChats?.map((chat, index) => (
                  <div
                    key={index}
                    onClick={() => updateCurrentChat(chat)}
                    className={clsx(
                      "border-b border-[#3d325a] px-1.5 py-2 transition hover:bg-[#3b3254]",
                      currentChat?._id === chat._id && "bg-[#453a64]",
                    )}
                  >
                    <UserChat chat={chat} user={user} />
                  </div>
                ))}
              </div>
            )}
          </Tab.Panel>

          <Tab.Panel className="rounded-b-md bg-[#2c243e] p-3 focus:outline-none">
            <PotentialChats updateSelectedTabIndex={setSelectedTabIndex} />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default Users;
