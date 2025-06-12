import { ArrowRight } from "lucide-react";

function Stylebar() {
  return (
    <div className="mt-6 cursor-pointer bg-[#1a1a1a] text-white rounded-full flex items-center justify-between py-2 px-5 w-fit gap-4 shadow-sm group">
      <p className="text-sm font-semibold tracking-wide">
        Best Learning Platform
      </p>
      <div className="relative">
        <div className="py-1 px-4 bg-[#2b2b2b] rounded-full flex items-center justify-center transition-all duration-200 group-hover:translate-x-1 group-hover:text-white text-gray-300">
          <ArrowRight size={14} />
        </div>
      </div>
    </div>
  );
}

export default Stylebar;
