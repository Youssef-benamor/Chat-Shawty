import { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

const Register = () => {
  const {
    registerInfo,
    updateRegisterInfo,
    registerUser,
    registerError,
    updateRegisterError,
    isRegisterLoading,
  } = useContext(AuthContext);

  useEffect(() => {
    if (registerError?.error) {
      toast.error(registerError.message);
      updateRegisterError(null);
    }
  }, [registerError]);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-purple-900 via-black to-purple-800 px-6 py-12">
      {/* Blurred Background Shapes */}
      <div className="animate-blob absolute left-[-100px] top-[-100px] h-72 w-72 rounded-full bg-purple-700 opacity-70 blur-3xl filter"></div>
      <div className="animate-blob animation-delay-2000 absolute bottom-[-100px] right-[-100px] h-96 w-96 rounded-full bg-black opacity-60 blur-3xl filter"></div>
      <div className="animate-blob animation-delay-4000 absolute left-1/2 top-1/2 h-80 w-80 rounded-full bg-purple-600 opacity-50 blur-3xl filter"></div>

      {/* Glassmorphic Form */}
      <form
        onSubmit={registerUser}
        className="relative z-10 w-full max-w-md space-y-6 rounded-xl border border-purple-600 bg-white bg-opacity-10 p-10 text-white shadow-lg backdrop-blur-md"
      >
        <h2 className="mb-8 text-center text-3xl font-extrabold">
          Create Account
        </h2>

        <div>
          <label htmlFor="name" className="mb-2 block font-semibold">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="w-full rounded-md bg-white bg-opacity-30 p-3 text-white placeholder-purple-200 transition focus:outline-none focus:ring-2 focus:ring-purple-400"
            placeholder="Your full name"
            onChange={(e) =>
              updateRegisterInfo({ ...registerInfo, name: e.target.value })
            }
          />
        </div>

        <div>
          <label htmlFor="email" className="mb-2 block font-semibold">
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="w-full rounded-md bg-white bg-opacity-30 p-3 text-white placeholder-purple-200 transition focus:outline-none focus:ring-2 focus:ring-purple-400"
            placeholder="you@example.com"
            onChange={(e) =>
              updateRegisterInfo({ ...registerInfo, email: e.target.value })
            }
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-2 block font-semibold">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="w-full rounded-md bg-white bg-opacity-30 p-3 text-white placeholder-purple-200 transition focus:outline-none focus:ring-2 focus:ring-purple-400"
            placeholder="Enter your password"
            onChange={(e) =>
              updateRegisterInfo({ ...registerInfo, password: e.target.value })
            }
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="mb-2 block font-semibold">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            className="w-full rounded-md bg-white  bg-opacity-30 p-3 text-white placeholder-purple-200 transition focus:outline-none focus:ring-2 focus:ring-purple-400"
            placeholder="Confirm your password"
            onChange={(e) =>
              updateRegisterInfo({
                ...registerInfo,
                confirmPassword: e.target.value,
              })
            }
          />
        </div>

        <button
          type="submit"
          disabled={isRegisterLoading}
          className="w-full rounded-lg bg-purple-600 py-3 font-bold transition hover:bg-purple-700"
        >
          {isRegisterLoading ? "Creating your account..." : "Register"}
        </button>

        <p className="mt-4 text-center text-purple-300">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold underline hover:text-purple-100"
          >
            Login
          </Link>
        </p>
      </form>

      {/* Add simple blob animation styles */}
      <style>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default Register;
