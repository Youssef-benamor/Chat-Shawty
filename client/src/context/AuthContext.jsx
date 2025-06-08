import { createContext, useCallback, useEffect, useState } from "react";
import { baseUrl, postRequest, putRequest } from "../utils/services";
import { toast } from "react-toastify";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const [registerError, setRegisterError] = useState(null);
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);
  const [registerInfo, setRegisterInfo] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loginError, setLoginError] = useState(null);
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });

  const [profileError, setProfileError] = useState(null);
  const [isUpdateProfileLoading, setIsUpdateProfileLoading] = useState(false);
  const [profileInfo, setProfileInfo] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    profilePicture: null,
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("User");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Error and info update callbacks
  const updateRegisterError = useCallback((info) => setRegisterError(info), []);
  const updateLoginError = useCallback((info) => setLoginError(info), []);
  const updateProfileError = useCallback((info) => setProfileError(info), []);
  const updateRegisterInfo = useCallback((info) => setRegisterInfo(info), []);
  const updateLoginInfo = useCallback((info) => setLoginInfo(info), []);
  const updateProfileInfo = useCallback((info) => setProfileInfo(info), []);

  // Register user function
  const registerUser = useCallback(
    async (e) => {
      e.preventDefault();

      setRegisterError(null);

      if (registerInfo.password !== registerInfo.confirmPassword) {
        setRegisterError({
          error: true,
          message: "Passwords do not match",
        });
        return;
      }

      setIsRegisterLoading(true);

      const response = await postRequest(
        `${baseUrl}/users/register`,
        JSON.stringify(registerInfo),
      );

      setIsRegisterLoading(false);

      if (response.error) {
        setRegisterError(response);
        return;
      }

      localStorage.setItem("User", JSON.stringify(response));
      setUser(response);
      toast.success("Registration Successful!");
    },
    [registerInfo],
  );

  // Login user function
  const loginUser = useCallback(
    async (e) => {
      e.preventDefault();

      setLoginError(null);
      setIsLoginLoading(true);

      const response = await postRequest(
        `${baseUrl}/users/login`,
        JSON.stringify(loginInfo),
      );

      setIsLoginLoading(false);

      if (response.error) {
        setLoginError(response);
        return;
      }

      localStorage.setItem("User", JSON.stringify(response));
      setUser(response);
    },
    [loginInfo],
  );

  // Logout function
  const logoutUser = useCallback(async () => {
    await postRequest(`${baseUrl}/users/logout`);
    localStorage.removeItem("User");
    setUser(null);
  }, []);

  // Update user profile with file upload support
  const updateUserProfile = useCallback(
    async (e) => {
      e.preventDefault();

      setProfileError(null);

      if (profileInfo.password !== profileInfo.confirmPassword) {
        setProfileError({
          error: true,
          message: "Passwords do not match",
        });
        return;
      }

      setIsUpdateProfileLoading(true);

      try {
        const formData = new FormData();
        formData.append("name", profileInfo.name);
        formData.append("password", profileInfo.password || "");
        formData.append("confirmPassword", profileInfo.confirmPassword || "");
        formData.append("user", JSON.stringify(user));
        if (profileInfo.profilePicture) {
          formData.append("profilePicture", profileInfo.profilePicture);
        }

        const response = await fetch(`${baseUrl}/users/profile`, {
          method: "PUT",
          headers: {
            // Don't set Content-Type header for FormData
            Authorization: user?.token ? `Bearer ${user.token}` : "",
          },
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          throw data;
        }

        localStorage.setItem("User", JSON.stringify(data));
        setUser(data);
        toast.success("Profile updated successfully");
      } catch (error) {
        setProfileError({
          error: true,
          message: error.message || "Failed to update profile",
        });
      } finally {
        setIsUpdateProfileLoading(false);
      }
    },
    [profileInfo, user],
  );

  return (
    <AuthContext.Provider
      value={{
        user,

        registerInfo,
        updateRegisterInfo,
        registerUser,
        registerError,
        updateRegisterError,
        isRegisterLoading,

        loginUser,
        loginError,
        updateLoginError,
        loginInfo,
        updateLoginInfo,
        isLoginLoading,

        logoutUser,

        profileInfo,
        updateProfileInfo,
        updateUserProfile,
        profileError,
        updateProfileError,
        isUpdateProfileLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
