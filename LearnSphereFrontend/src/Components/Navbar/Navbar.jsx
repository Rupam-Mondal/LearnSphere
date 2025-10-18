import React, { useContext, useEffect } from "react";
import { UserContext } from "../../contexts/userContext";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const { token, setToken, user, setUser } = useContext(UserContext);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (storedUser) {
      setUser(storedUser);
    }

    if (storedToken) {
      setToken(storedToken);
    } else {
      setToken(null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
  };

  return (
    <div className="fixed w-full flex justify-center mt-6 z-10">
      <div className="w-[90%] max-w-6xl h-16 bg-white rounded-full shadow-[8px_8px_15px_rgba(0,0,0,0.1)] px-6 flex items-center justify-between">
        <div className="text-xl font-bold text-[#59168B]">LearnSphere</div>

        <div className="flex-1 flex justify-center space-x-10 text-gray-700 font-medium">
          <button className="hover:text-black">Home</button>
          <button
            className="hover:text-black"
            onClick={() => {
              navigate(`/student/feed/${user.id}`);
            }}
          >
            Feed
          </button>
          <button className="hover:text-black">Practice</button>
          {token && user && user.role === "TEACHER" ? (
            <button
              className="hover:text-black"
              onClick={() => {
                navigate(`/teacher-dashboard/${user.id}`);
              }}
            >
              Teacher Dashboard
            </button>
          ) : token && user && user.role === "STUDENT" ? (
            <button
              className="hover:text-black"
              onClick={() => {
                navigate(`/student/dashboard/${user.id}`);
              }}
            >
              Dashboard
            </button>
          ) : (
            <button
              className="hover:text-black"
              onClick={() => {
                navigate("/auth");
              }}
            >
              DashBoard
            </button>
          )}
        </div>

        <div className="flex items-center space-x-4">
          {token ? (
            <>
              <img
                src={
                  user?.profilePicture ||
                  "https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D"
                }
                alt="profile icon"
                className="w-10 h-10 rounded-full cursor-pointer hover:opacity-80 transition border-2 border-[#591688]"
              />
              <button
                className="text-sm text-[#59168B] underline hover:text-black ml-2"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <button
              className="bg-[#59168B] text-white px-5 py-2 rounded-full hover:bg-[#4b1278] transition cursor-pointer"
              onClick={() => {
                navigate("/auth");
              }}
            >
              Register
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
