import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [profilePicture, setProfilePicture] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const profilepicLinkGenerate = async (e) => {
    setLoading(true);
    const file = e.target.files[0];
    if (!file) {
      alert("Please select a file");
      return;
    }

    const form = new FormData();
    form.append("file", file);
    form.append("upload_preset", import.meta.env.VITE_COLUDINARY_UPLOAD_PRESET);
    form.append("cloud_name", import.meta.env.VITE_COLUDINARY_CLOUD_NAME);

    try {
      const response = await axios.post(
        import.meta.env.VITE_COLUDINARY_URL + "/image/upload",
        form
      );
      setProfilePicture(response.data.secure_url);
    } catch (error) {
      alert("Upload failed");
    }

    setLoading(false);
  };

  const register = async (e) => {
    e.preventDefault();
    try {
      let response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/register`,
        {
          username,
          email,
          password,
          role,
          profilePicture,
        }
      );

      if (response.data.success) {
        alert(response.data.message);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        navigate("/");
      } else {
        alert(response.data.error || "Registration failed");
      }
    } catch (error) {
      alert("Registration failed. User AlreaDY exists or some credentials missed.");
    }
  };

  const login = async (e) => {
    e.preventDefault();
    try {
      let response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/login`,
        {
          email,
          password,
        }
      );

      if (response.data.success) {
        alert(response.data.message);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        navigate("/");
      } else {
        alert(response.data.error || "Login failed");
      }
    } catch (error) {
      alert("Login failed. Please check your credentials.");
    }
  };

  const inputStyle =
    "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#59168B] transition";

  return (
    <div className="flex justify-center items-center min-h-screen px-4 sm:px-6 bg-gradient-to-r from-purple-200 via-purple-100 to-pink-100">
      <div className="w-full max-w-md bg-white p-6 sm:p-8 rounded-2xl shadow-lg transition-all duration-300">
       
        <div className="flex justify-center mb-8">
          <button
            className={`w-1/2 py-2 font-semibold rounded-l-lg transition-colors duration-300 ${
              isLogin ? "bg-[#59168B] text-white" : "bg-gray-100 text-gray-700"
            }`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            className={`w-1/2 py-2 font-semibold rounded-r-lg transition-colors duration-300 ${
              !isLogin ? "bg-[#59168B] text-white" : "bg-gray-100 text-gray-700"
            }`}
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>
        </div>

        
        {isLogin ? (
          <form className="space-y-5" onSubmit={login}>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Email</label>
              <input
                type="email"
                className={inputStyle}
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Password
              </label>
              <input
                type="password"
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
          <form className="space-y-5" onSubmit={(e) => register(e)}>
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Username
              </label>
              <input
                type="text"
                className={inputStyle}
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Email</label>
              <input
                type="email"
                className={inputStyle}
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Password
              </label>
              <input
                type="password"
                className={inputStyle}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Role</label>
              <select
                className={inputStyle}
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Profile Picture
              </label>
              <input
                type="file"
                accept="image/*"
                className={inputStyle}
                onChange={profilepicLinkGenerate}
              />
              {loading ? (
                <p className="text-sm text-gray-500 mt-2">Uploading...</p>
              ) : (
                profilePicture && (
                  <img
                    src={profilePicture}
                    alt="Profile"
                    className="mt-3 w-24 h-24 rounded-xl object-cover"
                  />
                )
              )}
            </div>
            <button
              type="submit"
              className={`w-full bg-[#59168B] text-white py-2 rounded-lg hover:bg-[#4b1278] transition ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              
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
