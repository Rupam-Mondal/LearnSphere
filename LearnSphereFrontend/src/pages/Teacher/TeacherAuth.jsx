import React, { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { UserContext } from "../../contexts/userContext";
import auth from "../../assets/Auth/login.png";

const TeacherAuth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [highestDegree, setHighestDegree] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [experience, setExperience] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [qualificationProof, setQualificationProof] = useState("");

  const [loading, setLoading] = useState(false);
  const { setToken, setUser } = useContext(UserContext);
  const navigate = useNavigate();



  const handleFileUpload = async (e, type) => {
    setLoading(true);
    const file = e.target.files[0];
    if (!file) {
      toast.error("Please select a file");
      setLoading(false);
      return;
    }

    const form = new FormData();
    form.append("file", file);
    form.append("upload_preset", import.meta.env.VITE_COLUDINARY_UPLOAD_PRESET);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_COLUDINARY_URL}/image/upload`,
        form
      );
      if (type === "profile") {
        setProfilePicture(response.data.secure_url);
        toast.success("Profile picture uploaded!");
      } else {
        setQualificationProof(response.data.secure_url);
        toast.success("Qualification proof uploaded!");
      }
    } catch (error) {
      toast.error("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const register = async (e) => {
    setLoading(true);
    e.preventDefault();
    if (!profilePicture || !qualificationProof) {
      return toast.error(
        "Please upload both profile picture and qualification proof"
      );
    }

    try {
      let response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/teacher/auth/register`,
        {
          username,
          email,
          password,
          role: "TEACHER", 
          profilePicture,
          teacherDetails: {
            qualification : highestDegree,
            specialization,
            experience,
            qualificationProof,
          },
        }
      );

      if (response.data.success) {
        toast.success("Teacher registration successful!");
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        setToken(response.data.token);
        setUser(response.data.user);
        navigate("/teacher-dashboard"); 
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed.");
    }
    setLoading(false);
  };

  const login = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/teacher/auth/login`,
        { email, password }
      );

      if (response.data.success) {
        if (response.data.user.role === "TEACHER") {
          toast.success("Welcome back, Teacher!");
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("user", JSON.stringify(response.data.user));
          setToken(response.data.token);
          setUser(response.data.user);
          navigate(`/teacher-dashboard/${response.data.user._id}`);
        } else {
          toast.error("Access denied. This is the Teacher portal.");
        }
      }
    } catch (error) {
      toast.error("Invalid credentials.");
    }
    setLoading(false);
  };

  const inputStyle =
    "w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#59168B] transition-all duration-200 placeholder:text-gray-400";

  return (
    <div className="max-w-7xl mx-auto flex flex-row-reverse justify-between items-center min-h-screen px-4 bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-purple-100 via-slate-50 to-pink-100 py-10">
      <div className="w-1/2 hidden md:block">
        <img
          src={auth}
          alt="Teacher illustration"
          className="w-full h-full object-contain"
        />
      </div>

      <div className="w-full max-w-md bg-white/80 backdrop-blur-lg p-8 rounded-3xl shadow-[0_20px_50px_rgba(89,22,139,0.1)] border border-white overflow-y-auto max-h-[90vh]">
        <div className="flex p-1 bg-gray-100 rounded-2xl mb-8">
          {["Login", "Sign Up"].map((tab, idx) => (
            <button
              key={tab}
              className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 ${
                (isLogin ? idx === 0 : idx === 1)
                  ? "bg-white text-[#59168B] shadow-md"
                  : "text-gray-500"
              }`}
              onClick={() => setIsLogin(idx === 0)}
            >
              {tab}
            </button>
          ))}
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-2 text-center">
          {isLogin ? "Teacher Login" : "Join as an Educator"}
        </h1>

        <form className="space-y-4" onSubmit={isLogin ? login : register}>
          {!isLogin && (
            <div className="group">
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1 ml-1">
                Username
              </label>
              <input
                type="text"
                className={inputStyle}
                placeholder="Full Name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          )}

          <div className="group">
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1 ml-1">
              Email
            </label>
            <input
              type="email"
              className={inputStyle}
              placeholder="teacher@school.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="group">
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1 ml-1">
              Password
            </label>
            <input
              type="password"
              className={inputStyle}
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {!isLogin && (
            <div className="space-y-4 animate-in fade-in duration-500">
              <div className="grid grid-cols-2 gap-3">
                <div className="group">
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1 ml-1">
                    Degree
                  </label>
                  <input
                    type="text"
                    className={inputStyle}
                    placeholder="PhD, MSc"
                    value={highestDegree}
                    onChange={(e) => setHighestDegree(e.target.value)}
                    required
                  />
                </div>
                <div className="group">
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1 ml-1">
                    Experience (Yrs)
                  </label>
                  <input
                    type="number"
                    className={inputStyle}
                    placeholder="5"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="group">
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1 ml-1">
                  Specialization
                </label>
                <input
                  type="text"
                  className={inputStyle}
                  placeholder="e.g. Mathematics"
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="group">
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1 ml-1">
                    Profile Pic
                  </label>
                  <label className="flex flex-col items-center justify-center p-2 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-purple-400">
                    <span className="text-[10px] text-gray-400">
                      {profilePicture ? "✅ Uploaded" : "Upload"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, "profile")}
                    />
                  </label>
                </div>
                <div className="group">
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1 ml-1">
                    Degree PDF/Img
                  </label>
                  <label className="flex flex-col items-center justify-center p-2 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-purple-400">
                    <span className="text-[10px] text-gray-400">
                      {qualificationProof ? "✅ Uploaded" : "Upload"}
                    </span>
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, "proof")}
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full cursor-pointer bg-[#59168B] text-white py-3 rounded-xl font-bold shadow-lg hover:bg-[#4b1278] transition-all mt-4 disabled:opacity-50"
          >
            {loading
              ? "Processing..."
              : isLogin
              ? "Sign In"
              : "Create Teacher Account"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TeacherAuth;
