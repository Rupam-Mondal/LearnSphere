import React, { useContext, useEffect } from "react";
import { UserContext } from "../../contexts/userContext";
import { useNavigate } from "react-router-dom";
import { Book, Hamburger, Home, LogOut, MenuIcon, Pencil } from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();
  const { token, setToken, user, setUser } = useContext(UserContext);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
  };

  return (
    <div className="fixed w-full flex justify-center mt-0 z-10">
      <div className="w-[100%] max-w-full h-16 bg-white shadow-[2px_2px_5px_rgba(0,0,0,0.1)] px-6 flex items-center justify-between md:justify-between">
        <div className="text-xl md:text-2xl  font-bold text-[#59168B]">
          LearnSphere
        </div>
        <MenuIcon
          className="md:hidden w-8 h-8 cursor-pointer"
          onClick={() => {
            setIsMenuOpen(!isMenuOpen);
          }}
        />
        {isMenuOpen && <Menu onClose={() => setIsMenuOpen(false)} />}

        <div className="hidden md:flex flex-1 justify-center space-x-10 text-gray-700 font-medium">
          <button
            onClick={() => {
              navigate(`/`);
            }}
            className="hover:text-black cursor-pointer"
          >
            Home
          </button>
          <button
            className="hover:text-black cursor-pointer"
            onClick={() => {
              navigate(`/student/feed`);
            }}
          >
            Feed
          </button>
          <button
            className="hover:text-black cursor-pointer
          "
            onClick={() => {
              navigate("/practice");
            }}
          >
            Practice
          </button>
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
              className="hover:text-black cursor-pointer"
              onClick={() => {
                navigate(`/student/dashboard/${user.id}`);
              }}
            >
              Dashboard
            </button>
          ) : (
            <button
              className="hover:text-black curssor-pointer"
              onClick={() => {
                navigate("/auth");
              }}
            >
              DashBoard
            </button>
          )}
        </div>

        <div className="hidden md:flex items-center space-x-4">
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
            <>
              <button
                className="border border-[#59168B]  px-5 py-2 rounded-sm hover:bg-[#ebd9f9] transition cursor-pointer"
                onClick={() => {
                  navigate("/auth");
                }}
              >
                Login
              </button>
              <button
                className="bg-[#59168B] text-white px-5 py-2 rounded-sm hover:bg-[#4b1278] transition cursor-pointer"
                onClick={() => {
                  navigate("/auth");
                }}
              >
                Register
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const Menu = ({ onClose }) => {
  const navigate = useNavigate();
  const { token, setToken, user, setUser } = useContext(UserContext);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-md"
        onClick={onClose}
      />

      <div
        className="
          absolute top-0 right-0 h-full w-[50%]
          bg-white shadow-2xl
          animate-slideIn
          flex flex-col
        "
      >
        <button
          className="
            absolute top-4 left-[-48px]
            w-10 h-10 rounded-full bg-white
            shadow-lg flex items-center justify-center
            text-xl font-bold text-gray-700
            active:scale-95 transition
            cursor-pointer
          "
          onClick={onClose}
        >
          ✕
        </button>

        <div className="px-6 py-8 bg-[#f0ddff] border-b">
          {token ? (
            <div className="flex items-center gap-4">
              <img
                src={
                  user?.profilePicture ||
                  "https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341"
                }
                alt="profile"
                className="w-20 h-20 rounded-full border-2 border-[#591688]"
              />

              <div>
                <p className="text-lg font-semibold">
                  Hi, {user?.username || "User"} 👋
                </p>
                <p className="text-sm text-gray-600">Welcome back!</p>
              </div>
            </div>
          ) : (
            <div className="flex gap-3">
              <button
                className="flex-1 border border-[#59168B] py-2 rounded-md hover:bg-[#ebd9f9] transition"
                onClick={() => {
                  navigate("/auth");
                  onClose();
                }}
              >
                Login
              </button>
              <button
                className="flex-1 bg-[#59168B] text-white py-2 rounded-md hover:bg-[#4b1278] transition"
                onClick={() => {
                  navigate("/auth");
                  onClose();
                }}
              >
                Register
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col px-6 py-6 gap-3">
          <div className="flex items-center justify-start px-3 w-full rounded-sm transition-all duration-300 hover:bg-gray-100">
            <Home className="w-6 h-6 text-gray-600" />
            <MenuItem
              label="Home"
              onClick={() => {
                navigate("/");
                onClose();
              }}
            />
          </div>

          <div className="flex items-center justify-start px-3 w-full rounded-sm transition-all duration-300 hover:bg-gray-100">
            <Pencil className="w-6 h-6 text-gray-600" />
            <MenuItem
              label="Practice"
              onClick={() => {
                navigate("/practice");
                onClose();
              }}
            />
          </div>

          <div className="flex items-center justify-start px-3 w-full rounded-sm transition-all duration-300 hover:bg-gray-100">
            <Pencil className="w-6 h-6 text-gray-600" />
            <MenuItem
              label="Explore"
              onClick={() => {
                navigate("/student/feed");
                onClose();
              }}
            />
          </div>

          <div className="flex items-center justify-start px-3 w-full rounded-sm transition-all duration-300 hover:bg-gray-100">
            {token && user?.role === "STUDENT" && (
              <>
                <Book className="w-6 h-6 text-gray-600" />
                <MenuItem
                  label="Dashboard"
                  onClick={() => {
                    navigate(`/student/dashboard/${user.id}`);
                    onClose();
                  }}
                />
              </>
            )}

            {token && user?.role === "TEACHER" && (
              <MenuItem
                label="Teacher Dashboard"
                onClick={() => {
                  navigate(`/teacher-dashboard/${user.id}`);
                  onClose();
                }}
              />
            )}
          </div>

          <div className="flex items-center justify-start px-3 w-full rounded-sm transition-all duration-300 hover:bg-red-50">
            {token && (
              <>
                <LogOut className="w-6 h-6 text-red-600" />
                <MenuItem label="Logout" onClick={handleLogout} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const MenuItem = ({ label, onClick }) => (
  <button
    className={`
      text-left text-lg font-medium ${
        label === "Logout" ? "text-red-600" : "text-gray-700"
      }
      px-4 py-3 rounded-lg
      hover:bg-gray-100 active:scale-[0.98]
      transition
    `}
    onClick={onClick}
  >
    {label}
  </button>
);
