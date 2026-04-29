import { ArrowRight, Sparkles, BookOpen, Video, Users } from "lucide-react";
import girl from "../../assets/LandingPic/girl.webp";
import { Link, useNavigate } from "react-router-dom";

const Landingsection = () => {
  const navigate = useNavigate();
  return (
    <section className="relative min-h-[100vh] bg-slate-950 flex items-center justify-center px-5 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/30 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/30 blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10 pt-20 pb-16">
        {/* Left Content */}
        <div className="text-center lg:text-left flex flex-col items-center lg:items-start">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-purple-300 text-sm font-medium mb-6 backdrop-blur-md">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Learning Platform</span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] mb-6 tracking-tight">
            Learn Smarter. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
              Unlock Potential
            </span>
          </h1>

          <p className="text-slate-400 text-lg md:text-xl max-w-xl mb-10 leading-relaxed">
            Transform your trajectory with{" "}
            <span className="text-slate-200 font-semibold">LearnSphere</span>.
            Experience hyper-personalized learning journeys driven by
            next-generation AI.
          </p>

          <div className="mt-8 flex justify-center md:justify-start">
            <button
            onClick={() => navigate("/student/feed")}
             className="bg-purple-600 hover:bg-purple-700 transition-all text-white px-8 py-3 rounded-xl font-semibold text-lg shadow-lg cursor-pointer">
              Start Learning Now
            </button>
          </div>
        </div>

        {/* Right Content / Image */}
        <div className="relative flex justify-center lg:justify-end perspective-1000">
          <div className="relative w-[300px] md:w-[420px] lg:w-[500px]">
            {/* Glow Behind Image */}
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500 to-blue-500 rounded-[3rem] blur-2xl opacity-40 animate-pulse"></div>

            <div className="relative rounded-[3rem] overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm p-4 shadow-2xl transform transition-transform duration-700 hover:rotate-2 hover:scale-[1.02]">
              <img
                src={girl}
                alt="Learning Illustration"
                className="w-full h-auto object-cover rounded-[2.5rem]"
              />

              {/* Floating Badge */}
              <div className="absolute bottom-8 -left-8 bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-2xl shadow-xl flex items-center gap-4 animate-[bounce_4s_infinite]">
                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <span className="text-2xl">⚡</span>
                </div>
                <div>
                  <p className="text-white font-bold text-sm">AI Assisted</p>
                  <p className="text-purple-200 text-xs">Personalized Path</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Landingsection;