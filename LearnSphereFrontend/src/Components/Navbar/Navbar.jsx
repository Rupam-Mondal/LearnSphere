import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../contexts/userContext";
import { useNavigate } from "react-router-dom";

function Navbar() {
  // const [token, setToken] = useState(null);
  const navigate = useNavigate();
  const { token, setToken } = useContext(UserContext);
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    } else {
      setToken(null);
    }
  }, []);

  return (
    <div className="fixed w-full flex justify-center mt-6 z-10">
      <div className="w-[90%] max-w-6xl h-16 bg-white rounded-full shadow-[8px_8px_15px_rgba(0,0,0,0.1)] px-6 flex items-center justify-between">
        <div className="text-xl font-bold text-[#59168B]">LearnSphere</div>

        <div className="flex-1 flex justify-center space-x-10 text-gray-700 font-medium">
          <button className="hover:text-black">Home</button>
          <button className="hover:text-black">Jobs</button>
          <button className="hover:text-black">Practice</button>
          <button className="hover:text-black">Dashboard</button>
        </div>
        <div className="flex items-center space-x-4">
          {token ? (
            <img
              src={
                "https://t4.ftcdn.net/jpg/03/64/21/11/360_F_364211147_1qgLVxv1Tcq0Ohz3FawUfrtONzz8nq3e.jpg"
              }
              alt="profile icon"
              className="w-10 h-10 rounded-full cursor-pointer hover:opacity-80 transition border-2 border-[#591688]"
            />
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
