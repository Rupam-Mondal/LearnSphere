import React, { useState } from "react";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  const inputStyle =
    "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#59168B] transition";

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-purple-200 via-purple-100 to-pink-100">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg transition-all duration-300">
        <div className="flex justify-center mb-8">
          <button
            className={`px-6 py-2 font-semibold rounded-l-lg transition-colors duration-300 ${
              isLogin ? "bg-[#59168B] text-white" : "bg-gray-100 text-gray-700"
            }`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            className={`px-6 py-2 font-semibold rounded-r-lg transition-colors duration-300 ${
              !isLogin ? "bg-[#59168B] text-white" : "bg-gray-100 text-gray-700"
            }`}
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>
        </div>

        {isLogin ? (
          <form className="space-y-5">
            <div>
              <label
                htmlFor="login-email"
                className="block text-sm text-gray-600 mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="login-email"
                className={inputStyle}
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label
                htmlFor="login-password"
                className="block text-sm text-gray-600 mb-1"
              >
                Password
              </label>
              <input
                type="password"
                id="login-password"
                className={inputStyle}
                placeholder="Enter your password"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#59168B] text-white py-2 rounded-lg hover:bg-[#4b1278] transition"
            >
              Login
            </button>
          </form>
        ) : (
          <form className="space-y-5">
            <div>
              <label
                htmlFor="signup-username"
                className="block text-sm text-gray-600 mb-1"
              >
                Username
              </label>
              <input
                type="text"
                id="signup-username"
                className={inputStyle}
                placeholder="Enter your username"
              />
            </div>
            <div>
              <label
                htmlFor="signup-email"
                className="block text-sm text-gray-600 mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="signup-email"
                className={inputStyle}
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label
                htmlFor="signup-password"
                className="block text-sm text-gray-600 mb-1"
              >
                Password
              </label>
              <input
                type="password"
                id="signup-password"
                className={inputStyle}
                placeholder="Enter your password"
              />
            </div>
            <div>
              <label
                htmlFor="signup-role"
                className="block text-sm text-gray-600 mb-1"
              >
                Role
              </label>
              <select id="signup-role" className={inputStyle}>
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-[#59168B] text-white py-2 rounded-lg hover:bg-[#4b1278] transition"
            >
              Sign Up
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
