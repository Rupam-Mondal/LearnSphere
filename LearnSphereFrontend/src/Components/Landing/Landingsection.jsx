import "./Float.css";

function LandingSection() {
  const content = ["Supercharge your", "Learning preparation", "With AI"];

  const subcontent = [
    "Learn and practice with AI-powered learning platform, accelerating your skills for real-world success.",
    "track progress, and personalize your learning.",``
  ];

  return (
    <div className="w-full relative flex flex-col justify-center items-center text-center mt-10 px-4">
      <div className="space-y-2 md:space-y-4">
        <h1 className="text-3xl md:text-6xl font-bold text-zinc-300">
          {content[0]}
        </h1>
        <h1 className="text-3xl md:text-6xl font-bold text-zinc-300">
          {content[1]}
        </h1>
        <h1
          className="text-3xl md:text-6xl font-bold"
          style={{ color: "#7F00FF" }}
        >
          {content[2]}
        </h1>
        <div className="mt-6 space-y-1 text-center">
          {subcontent.map((line, index) => (
            <p
              key={index}
              className="text-zinc-400 text-sm md:text-lg tracking-wide"
            >
              {line}
            </p>
          ))}
        </div>
      </div>

      <div className="flex gap-8 mt-8">
        <div className="py-2 px-5 font-semibold cursor-pointer text-white bg-[#6E56F9] rounded-lg">
          Start Your Journey
        </div>
        <div className="bg-[#405980] font-semibold cursor-pointer py-2 px-5 text-white rounded-lg">
          Contact Us
        </div>
      </div>

      <div class="absolute flex py-2 px-3 left-32 top-0 cursor-pointer float-animation">
        <div class="flex items-center gap-3 rounded-2xl bg-[#F3EFFF] px-4 py-2 shadow-lg">
          <div class="flex items-center justify-center h-10 w-10 rounded-xl bg-[#E3D6FF]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2.5"
              stroke="#A367FF"
              class="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 4.75l2.4 4.86 5.36.78-3.88 3.78.92 5.36-4.8-2.52-4.8 2.52.92-5.36-3.88-3.78 5.36-.78L12 4.75z"
              />
            </svg>
          </div>
          <div class="text-sm leading-tight">
            <div class="font-semibold text-gray-800">Top Rated</div>
            <div class="text-gray-500 text-xs">4.9/5 Rating</div>
          </div>
        </div>
      </div>

      <div class="absolute left-32 bottom-32 flex py-2 px-3 cursor-pointer float-animation">
        <div class="flex items-center gap-3 rounded-2xl bg-[#E5F6FD] px-4 py-2 shadow-lg">
          <div class="flex items-center justify-center h-10 w-10 rounded-xl bg-[#BDE3F4]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2.2"
              stroke="#3B82F6"
              class="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 14c4 0 5.5 2 6 4H6c.5-2 2-4 6-4zm0-2a4 4 0 100-8 4 4 0 000 8z"
              />
            </svg>
          </div>
          <div class="text-sm leading-tight">
            <div class="font-semibold text-gray-800">Expert Mentors</div>
            <div class="text-gray-500 text-xs">Learn from the best</div>
          </div>
        </div>
      </div>

      <div class="absolute right-32 top-0 flex py-2 px-3 cursor-pointer float-animation">
        <div class="flex items-center gap-3 rounded-2xl bg-[#E7FBEF] px-4 py-2 shadow-lg">
          <div class="flex items-center justify-center h-10 w-10 rounded-xl bg-[#BFF2D2]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2.2"
              stroke="#22C55E"
              class="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M8 12h8m-4-4v8m7-1.5A6.5 6.5 0 1112 4.5a6.5 6.5 0 018.5 8.5z"
              />
            </svg>
          </div>
          <div class="text-sm leading-tight">
            <div class="font-semibold text-gray-800">Skill-Oriented</div>
            <div class="text-gray-500 text-xs">Real-world skills</div>
          </div>
        </div>
      </div>

      <div class="absolute right-32 bottom-32 flex py-2 px-3 cursor-pointer float-animation">
        <div class="flex items-center gap-3 rounded-2xl bg-[#FFF5EB] px-4 py-2 shadow-lg">
          <div class="flex items-center justify-center h-10 w-10 rounded-xl bg-[#FFE0B3]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2.2"
              stroke="#F97316"
              class="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 6v6l4 2m-4-8a9 9 0 100 18 9 9 0 000-18z"
              />
            </svg>
          </div>
          <div class="text-sm leading-tight">
            <div class="font-semibold text-gray-800">Flexible Learning</div>
            <div class="text-gray-500 text-xs">Anytime, Anywhere</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingSection;
