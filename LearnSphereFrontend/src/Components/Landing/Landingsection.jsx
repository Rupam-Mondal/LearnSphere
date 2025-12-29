import girl from "../../assets/LandingPic/girl.webp";
const Landingsection = () => {
  return (
    <section className="min-h-screen bg-[#f5e9fd] flex items-center justify-center px-5">
      <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="text-center md:text-left">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
            Learn Smarter. <br />
            <span className="text-purple-600">Unlock AI Potential</span>
          </h1>

          <p className="mt-5 text-gray-700 text-base md:text-lg max-w-xl">
            Transform your skills with <span className="font-semibold">LearnSphere</span> — 
            your AI-powered learning companion. Learn faster, smarter, and more effectively.
          </p>

          <div className="mt-8 flex justify-center md:justify-start">
            <button className="bg-purple-600 hover:bg-purple-700 transition-all text-white px-8 py-3 rounded-xl font-semibold text-lg shadow-lg">
              Start Learning Now
            </button>
          </div>
        </div>






        <div className="flex justify-center md:justify-end">
          <img
            src={girl}
            alt="Learning Illustration"
            className="w-[280px] rounded-full md:w-[380px] lg:w-[450px]"
          />
        </div>
      </div>
    </section>
  );
};

export default Landingsection;
