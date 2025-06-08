import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowIntro(false), 3000); // 3 seconds
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-black p-6 text-white">
      {showIntro ? (
        <div className="animate-fade-in-out text-center">
          <h1 className="mb-4 text-5xl font-extrabold">Welcome</h1>
          <p className="text-lg tracking-wide text-purple-300">to ChatShawrty</p>
        </div>
      ) : (
        <div className="w-full max-w-md rounded-xl bg-white/10 p-10 text-center shadow-lg backdrop-blur-md">
          <h2 className="mb-6 text-3xl font-bold">Get Started</h2>
          <div className="space-y-4">
            <Link
              to="/login"
              className="block rounded-md bg-purple-600 py-2 font-semibold text-white transition duration-300 hover:bg-purple-700"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="block rounded-md bg-blue-600 py-2 font-semibold text-white transition duration-300 hover:bg-blue-700"
            >
              Register
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
