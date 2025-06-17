function Navbar() {
  return (
    <div className="fixed w-full flex justify-center mt-6">
      <div className="w-[90%] max-w-6xl h-16 bg-white rounded-full shadow-[8px_8px_15px_rgba(0,0,0,0.1)] px-6 flex items-center justify-between">
        <div className="text-xl font-bold text-[#59168B]">LearnSphere</div>

        <div className="flex-1 flex justify-center space-x-10 text-gray-700 font-medium">
          <button className="hover:text-black">Home</button>
          <button className="hover:text-black">Jobs</button>
          <button className="hover:text-black">Practice</button>
          <button className="hover:text-black">Dashboard</button>
        </div>
        <button
          className="bg-[#59168B] text-white px-5 py-2 rounded-full hover:bg-[#4b1278] transition"
          onClick={() => {navigate("/signup")}}
        >
          Register
        </button>
      </div>
    </div>
  );
}

export default Navbar;