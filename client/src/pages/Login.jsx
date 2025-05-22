import { useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

const Login = () => {
  const {
    loginUser,
    loginError,
    updateLoginError,
    loginInfo,
    updateLoginInfo,
    isLoginLoading,
  } = useContext(AuthContext);

  useEffect(() => {
    if (loginError?.error) {
      toast.error(loginError.message);
      updateLoginError(null);
    }
  }, [loginError]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-black p-6">
      <div className="w-full max-w-md rounded-xl bg-white/10 p-8 text-white shadow-lg backdrop-blur-md">
        <h2 className="mb-6 text-center text-3xl font-extrabold">Login</h2>
        <form onSubmit={loginUser} className="space-y-5">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full rounded-md bg-white/20 px-4 py-2 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="you@example.com"
              onChange={(e) =>
                updateLoginInfo({ ...loginInfo, email: e.target.value })
              }
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full rounded-md bg-white/20 px-4 py-2 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="••••••••"
              onChange={(e) =>
                updateLoginInfo({ ...loginInfo, password: e.target.value })
              }
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-purple-600 py-2 font-semibold text-white shadow-md transition duration-300 hover:bg-purple-700"
          >
            {isLoginLoading ? "Getting you in..." : "Login"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            to="/register"
            className="text-sm text-purple-300 hover:underline"
          >
            Don’t have an account? Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
