import { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu } from "@headlessui/react";
import { Bars3Icon, ChevronDownIcon } from "@heroicons/react/20/solid";
import { AuthContext } from "../context/AuthContext";
import clsx from "clsx";
import Notification from "./chat/Notification";
import avatar from "../assets/avatar.svg"; // default avatar image

const NavBar = () => {
  const { user, logoutUser } = useContext(AuthContext);
  const location = useLocation();

  const isChatPage = location.pathname.startsWith("/chat");

  console.log("Current path:", location.pathname);

  return (
    <nav
      className={clsx(
        "fixed left-0 right-0 top-0 z-30 border-b border-purple-700 bg-opacity-70 shadow-lg backdrop-blur-xl transition-all duration-500 ease-in-out",
        isChatPage ? "bg-red-600" : "bg-purple-900",
      )}
      style={{ height: isChatPage ? "3rem" : "4rem" }}
    >
      <div
        className="container mx-auto flex items-center justify-between px-6 text-white transition-all duration-500 ease-in-out sm:px-12"
        style={{
          paddingTop: isChatPage ? "0.25rem" : "0.75rem",
          paddingBottom: isChatPage ? "0.25rem" : "0.75rem",
        }}
      >
        <Link
          to="/"
          className={clsx(
            "font-extrabold tracking-wide transition-colors duration-300 hover:text-purple-300",
            isChatPage
              ? "text-lg font-semibold text-purple-300 opacity-80"
              : "text-3xl",
          )}
          style={{ whiteSpace: "nowrap" }}
        >
          Chat Or Shawty
        </Link>

        <div className="flex items-center gap-x-4">
          {user ? (
            <>
              <Notification />

              <Menu as="div" className="relative inline-block text-left">
                <Menu.Button
                  className={clsx(
                    "inline-flex items-center gap-2 rounded-md p-2 transition hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500",
                    isChatPage ? "p-1" : "p-2",
                  )}
                  title={user.name}
                >
                  {!isChatPage && (
                    <span className="hidden max-w-[140px] truncate font-semibold sm:block">
                      {user.name}
                    </span>
                  )}
                  <ChevronDownIcon
                    className={clsx(
                      "text-purple-300 sm:block",
                      isChatPage ? "h-4 w-4" : "h-5 w-5",
                    )}
                    aria-hidden="true"
                  />
                  <Bars3Icon
                    className={clsx(
                      "text-purple-300 sm:hidden",
                      isChatPage ? "h-5 w-5" : "h-6 w-6",
                    )}
                    aria-hidden="true"
                  />
                </Menu.Button>

                <Menu.Items className="absolute right-0 mt-2 w-52 rounded-md border border-purple-700 bg-opacity-90 bg-gradient-to-tr from-purple-900 to-black text-white shadow-lg backdrop-blur-md focus:outline-none">
                  <div className="flex flex-col">
                    <div className="flex items-center border-b border-purple-700 px-4 py-3 sm:hidden">
                      <img
                        src={
                          user.profilePicture
                            ? `${
                                import.meta.env.VITE_BACKEND_URL
                              }/uploads/profile_pictures/${user.profilePicture}`
                            : avatar
                        }
                        alt="User Avatar"
                        className="h-10 w-10 rounded-full"
                      />
                      <span className="ml-3 truncate font-semibold">
                        {user.name}
                      </span>
                    </div>

                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to="/"
                          className={clsx(
                            "px-4 py-2 text-sm font-medium transition",
                            active
                              ? "bg-purple-700 text-white"
                              : "text-purple-300 hover:text-white",
                          )}
                        >
                          Chat
                        </Link>
                      )}
                    </Menu.Item>

                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to="/profile"
                          className={clsx(
                            "px-4 py-2 text-sm font-medium transition",
                            active
                              ? "bg-purple-700 text-white"
                              : "text-purple-300 hover:text-white",
                          )}
                        >
                          Profile
                        </Link>
                      )}
                    </Menu.Item>

                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => logoutUser()}
                          className={clsx(
                            "w-full px-4 py-2 text-left text-sm font-medium transition",
                            active
                              ? "bg-purple-700 text-white"
                              : "text-purple-300 hover:text-white",
                          )}
                        >
                          Logout
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Menu>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-md px-4 py-2 font-semibold transition hover:bg-purple-700 hover:text-white"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-md bg-purple-600 px-4 py-2 font-semibold transition hover:bg-purple-700"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
