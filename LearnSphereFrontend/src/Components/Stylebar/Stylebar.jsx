import { ArrowRight } from "lucide-react";

function Stylebar() {
  return (
    <div className="mt-8 bg-[#1a1a1a] text-white rounded-full flex items-center justify-between py-2 px-4 w-fit gap-4 shadow-sm">
      <p className="text-sm font-semibold tracking-wide">
        LEARNSPHERE: Best Learning Platform
      </p>
      <div className="relative">
        <div className="w-6 h-6 bg-[#2b2b2b] rounded-full flex items-center justify-center">
          <ArrowRight size={14} className="text-gray-300" />
        </div>
      </div>
    </div>
  );
}

export default Stylebar;
