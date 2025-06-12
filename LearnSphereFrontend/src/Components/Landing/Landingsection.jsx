function LandingSection() {
  const content = [
    "Supercharge your",
    "Learning preparation",
    "With AI"
  ];

  const subcontent = [
    "Learn and practice with AI-powered learning platform, accelerating your skills for real-world success.",
    "track progress, and personalize your learning."
  ];

  return (
    <div className="w-full flex flex-col justify-center items-center text-center mt-10 px-4">
      <div className="space-y-2 md:space-y-4">
        <h1 className="text-3xl md:text-6xl font-bold text-zinc-300">
          {content[0]}
        </h1>
        <h1 className="text-3xl md:text-6xl font-bold text-zinc-300">
          {content[1]}
        </h1>
        <h1 className="text-3xl md:text-6xl font-bold" style={{ color: "#7F00FF" }}>
          {content[2]}
        </h1>
        <div className="mt-6 space-y-1 text-center">
          {subcontent.map((line, index) => (
            <p key={index} className="text-zinc-400 text-sm md:text-lg tracking-wide">
              {line}
            </p>
          ))}
        </div>
      </div>

      <div className="flex gap-8 mt-8">
        <div className="py-2 px-5 font-semibold cursor-pointer text-white bg-[#6E56F9] rounded-lg">Start Your Journey</div>
        <div className="bg-[#405980] font-semibold cursor-pointer py-2 px-5 text-white rounded-lg">Contact Us</div>
      </div>
    </div>
  );
}

export default LandingSection;
