import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");

  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();
    try {
      let response = await axios.post("http://localhost:4000/api/auth/login", {
        email: email,
        password: password,
      });

      console.log(response.data);

      if(response.data.success) {
        alert(response.data.message);
      }
      if(response.status === 401) {
        alert(response.data.error);
      }

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      navigate("/");

    } catch (error) {
      alert("Login failed. Please check your credentials.");
    }
  };

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
          <form className="space-y-5" onSubmit={(e)=>login(e)}>
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="signup-role"
                className="block text-sm text-gray-600 mb-1"
              >
                Role
              </label>
              <select
                id="signup-role"
                className={inputStyle}
                value={role}
                onChange={(e) => {
                  setRole(e.target.value);
                }}
              >
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
