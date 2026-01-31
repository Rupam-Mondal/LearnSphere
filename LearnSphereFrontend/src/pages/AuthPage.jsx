import React, { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { UserContext } from "../contexts/userContext";
import auth from "../assets/Auth/login.png";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [profilePicture, setProfilePicture] = useState("");
  const [loading, setLoading] = useState(false);
  const { token, setToken, user, setUser } = useContext(UserContext);

  const navigate = useNavigate();

  const profilepicLinkGenerate = async (e) => {
    setLoading(true);
    const file = e.target.files[0];
    if (!file) {
      toast.error("Please select a file");
      setLoading(false);
      return;
    }
    const safeUsername = username.trim().toLowerCase().replace(/\s+/g, "_");
    const form = new FormData();
    form.append("file", file);
    form.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
    form.append("cloud_name", import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);
    form.append("folder", `learnSphere/students/${safeUsername}/profile_pics`);
    form.append("quality", "auto");
    form.append("fetch_format", "auto");

    try {
      const response = await axios.post(
        import.meta.env.VITE_CLOUDINARY_URL + "/image/upload",
        form
      );
      setProfilePicture(response.data.secure_url);
    } catch (error) {
      toast.error("Upload failed");
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
          role: "STUDENT",
          profilePicture,
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        setToken(response.data.token);
        setUser(response.data.user);
        navigate("/");
      } else {
        toast.error(response.data.error || "Registration failed");
      }
    } catch (error) {
      toast.error(
        "Registration failed. User AlreaDY exists or some credentials missed."
      );
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
        console.log(response.data);

        if (response.data.user.role === "STUDENT") {
          toast.success(response.data.message);
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("user", JSON.stringify(response.data.user));
          setToken(response.data.token);
          setUser(response.data.user);
          navigate("/");
        } else {
          toast.error("Only Students are allowed to login here.");
        }
      } else {
        toast.error(response.data.error || "Login failed");
      }
    } catch (error) {
      toast.error("Login failed. Please check your credentials.");
    }
  };

  const inputStyle =
    "w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#59168B] transition-all duration-200 placeholder:text-gray-400";
  return (
    <div className="max-w-7xl mx-auto flex justify-between items-center min-h-screen px-4 bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-purple-100 via-slate-50 to-pink-100">
      <div className="w-1/2 hidden md:block">
        <img
        src= {auth}
        alt="Illustration of login"
        className="w-full h-full object-contain"
      />
      </div>
      <div className="w-full max-w-md bg-white/80 backdrop-blur-lg p-8 rounded-3xl shadow-[0_20px_50px_rgba(89,22,139,0.1)] border border-white">

        <div className="flex p-1 bg-gray-100 rounded-2xl mb-8">
          <button
            className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 ${
              isLogin
                ? "bg-white text-[#59168B] shadow-md"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 ${
              !isLogin
                ? "bg-white text-[#59168B] shadow-md"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-2 text-center">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h1>
        <p className="text-gray-500 text-sm text-center mb-8">
          {isLogin
            ? "Please enter your details to login"
            : "Join LearnSphere today"}
        </p>

        <form className="space-y-4" onSubmit={isLogin ? login : register}>
          {!isLogin && (
            <div className="group">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 ml-1">
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
          )}

          <div className="group">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 ml-1">
              Email Address
            </label>
            <input
              type="email"
              className={inputStyle}
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="group">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 ml-1">
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

          {!isLogin && (
            <div className="group">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 ml-1">
                Profile Picture
              </label>
              <div className="flex items-center gap-4 mt-1">
                <label className="flex-1 flex flex-col items-center justify-center px-4 py-2 bg-white border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-purple-400 transition-colors">
                  <span className="text-xs text-gray-500">
                    {loading ? "Uploading..." : "Click to upload"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={profilepicLinkGenerate}
                  />
                </label>
                {profilePicture && (
                  <img
                    src={profilePicture}
                    alt="Preview"
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-purple-100"
                  />
                )}
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#59168B] text-white py-3 rounded-xl font-bold shadow-lg shadow-purple-200 hover:bg-[#4b1278] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 mt-4 disabled:opacity-50"
          >
            {isLogin ? "Sign In" : "Create Account"}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-gray-100 pt-6">
          <p className="text-sm text-gray-500">
            Are you a teacher?{" "}
            <button className="text-[#59168B] font-bold hover:underline">
              Access Portal
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
