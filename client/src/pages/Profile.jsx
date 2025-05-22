import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

const Profile = () => {
  const {
    user,
    profileInfo,
    updateProfileInfo,
    updateUserProfile,
    profileError,
    updateProfileError,
    isUpdateProfileLoading,
  } = useContext(AuthContext);

  useEffect(() => {
    updateProfileInfo({
      ...profileInfo,
      name: user?.name || "",
      email: user?.email || "",
      profilePicture: null, // reset file input on mount
    });
  }, [user]);

  useEffect(() => {
    if (profileError?.error) {
      toast.error(profileError.message);
      updateProfileError(null);
    }
  }, [profileError]);

  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    updateProfileInfo({
      ...profileInfo,
      profilePicture: file,
    });
  };

  return (
    <div className="min-h-screen bg-[#1e1b2c] px-6 py-12 text-white lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight">
          Update Profile
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={updateUserProfile}>
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium">
              Name
            </label>
            <div className="mt-2">
              <input
                id="name"
                name="name"
                type="text"
                value={profileInfo.name}
                required
                className="block w-full rounded-md border border-teal-600 bg-[#2c263b] p-2 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                onChange={(e) =>
                  updateProfileInfo({ ...profileInfo, name: e.target.value })
                }
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                value={profileInfo.email}
                autoComplete="email"
                readOnly
                required
                className="block w-full rounded-md bg-gray-600 p-2 text-white placeholder:text-gray-300"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                className="block w-full rounded-md border border-teal-600 bg-[#2c263b] p-2 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                onChange={(e) =>
                  updateProfileInfo({
                    ...profileInfo,
                    password: e.target.value,
                  })
                }
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium"
            >
              Confirm Password
            </label>
            <div className="mt-2">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                className="block w-full rounded-md border border-teal-600 bg-[#2c263b] p-2 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                onChange={(e) =>
                  updateProfileInfo({
                    ...profileInfo,
                    confirmPassword: e.target.value,
                  })
                }
              />
            </div>
          </div>

          {/* Profile Picture */}
          <div>
            <label
              htmlFor="profilePicture"
              className="block text-sm font-medium"
            >
              Profile Picture
            </label>
            <div className="mt-2">
              <input
                id="profilePicture"
                name="profilePicture"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-white"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-teal-500"
              disabled={isUpdateProfileLoading}
            >
              {isUpdateProfileLoading ? "Updating your profile..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
