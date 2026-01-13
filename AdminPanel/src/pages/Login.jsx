import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

const Login = () => {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      let res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/admin/login`,
        {
          adminPassword: password,
        }
      );

      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        toast.success("Login successful!");
        navigate("/dashboard");
      } else {
        toast.error("Login failed. Please try again.");
      }
    } catch (error) {
      toast.error("Log in Failed. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center ">
      <form
        onSubmit={handleLogin}
        className="p-8 rounded-xl shadow-lg w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Admin Login
        </h2>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Admin Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter admin password"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
