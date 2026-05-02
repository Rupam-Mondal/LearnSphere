import {
  Sparkles,
  Code2,
  Layers,
  ArrowRight,
  BrainCircuit,
  TerminalSquare,
} from "lucide-react";
import Navbar from "../Components/Navbar/Navbar";
import { FaSadTear, FaUserTie } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Footer from "../Components/Landing/Footer";
import Testimonials from "../Components/Landing/Testimonials";

function Practice() {
  const navigate = useNavigate();

  const tests = [
    {
      title: "Java Masterclass",
      description:
        "Assess your Java programming skills with practical coding questions, threading, and real-world scenarios. Optimize and debug challenging scripts.",
      gradient: "from-orange-500/20 via-orange-400/10 to-amber-500/20",
      iconBg:
        "bg-gradient-to-br from-orange-100 to-orange-50 text-orange-600 border border-orange-200",
      borderGlow:
        "group-hover:border-orange-300 group-hover:shadow-[0_0_40px_-10px_rgba(251,146,60,0.3)] hover:shadow-orange-200",
      icon: <TerminalSquare className="w-8 h-8" />,
      route: "/interview/Java",
      tags: ["Core Java", "Advanced", "Algorithms"],
      level: "Intermediate",
    },
    {
      title: "OOPs Architecture",
      description:
        "Evaluate your understanding of Object-Oriented Programming concepts, SOLID principles, and structured design in modern software engineering.",
      gradient: "from-blue-500/20 via-indigo-400/10 to-purple-500/20",
      iconBg:
        "bg-gradient-to-br from-blue-100 to-indigo-50 text-blue-600 border border-blue-200",
      borderGlow:
        "group-hover:border-blue-300 group-hover:shadow-[0_0_40px_-10px_rgba(59,130,246,0.3)] hover:shadow-blue-200",
      icon: <Layers className="w-8 h-8" />,
      route: "/interview/oops",
      tags: ["System Design", "Concepts", "Architecture"],
      level: "Beginner",
    },
  ];

  return (
    <div className="w-full min-h-screen bg-[#f9fafb]">
      <Navbar />

      {/* ================= HERO ================= */}
      <div className="relative bg-[#0b0f19] pt-32 pb-44 px-6 overflow-hidden border-b border-slate-800">
        {/* Abstract Background Artwork */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        <div className="absolute -top-40 -right-40 w-[800px] h-[800px] bg-gradient-to-br from-indigo-600/30 via-purple-600/20 to-transparent rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute -bottom-40 -left-20 w-[600px] h-[600px] bg-gradient-to-tr from-blue-600/20 to-transparent rounded-full blur-[100px] pointer-events-none"></div>

        <div className="relative max-w-5xl mx-auto text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-8 backdrop-blur-md shadow-2xl animate-[fadeUp_0.6s_ease-out_forwards]">
            {/* <Sparkles className="w-4 h-4" /> */}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">
              Practice Arena
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-[5rem] font-black text-white mb-6 tracking-tight leading-[1.1] animate-[fadeUp_0.8s_ease-out_forwards]">
            Master the <br />
            <span className="relative inline-block mt-2">
              <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                Craft of Coding
              </span>
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed animate-[fadeUp_1s_ease-out_forwards]">
            Step into the arena. Push your boundaries with curated, real-world
            simulation tests designed to evaluate your readiness and boost your
            confidence.
          </p>
        </div>
      </div>

      {/* ================= CARDS ================= */}
      <div className="relative max-w-5xl mx-auto px-6 py-10 z-10 animate-[fadeUp_1.2s_ease-out_forwards]">
        <div className="max-w-6xl mx-auto px-6 pb-24 grid grid-cols-1 sm:grid-cols-2 gap-10">
        {tests.map((test, index) => (
          <div
            key={index}
            className="group relative rounded-3xl p-8 bg-white border border-gray-200 shadow-sm hover:shadow-2xl transition-all duration-500 animate-card"
            style={{ animationDelay: `${index * 120}ms` }}
          >
            {/* Glow */}
            {/* <div
              className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${test.gradient} opacity-0 group-hover:opacity-100 blur-xl transition duration-500`}
            /> */}
            <div
                className={`absolute inset-0 bg-gradient-to-br ${test.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`}
              />

            <div className="relative flex flex-col h-full">
              {/* ICON */}
              <div
                className={`w-14 h-14 flex items-center justify-center rounded-xl ${test.iconBg} mb-6`}
              >
                {test.icon}
              </div>

              {/* CONTENT */}
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                {test.title}
              </h2>

              <p className="text-gray-600 text-sm leading-relaxed mb-10">
                {test.description}
              </p>

              {/* CTA BUTTON */}
              <button
                onClick={() => navigate(test.route)}
                className="
                  relative overflow-hidden
                  mt-auto cursor-pointer
                  inline-flex items-center justify-center gap-2
                  rounded-full
                  bg-black text-white
                  px-5 py-2.5
                  text-sm font-medium
                  hover:bg-gray-800
                  transition-all duration-300
                  active:scale-95
                "
              >
                {/* Shine */}
                <span className="absolute inset-0 translate-x-[-120%] bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:translate-x-[120%] transition duration-700" />

                <span className="relative flex items-center gap-2">
                  Start Practice
                  <svg
                    className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </span>
              </button>
            </div>
          </div>
        ))}
        </div>
      </div>

      {/* ================= ANIMATIONS ================= */}
      <style jsx>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes cardFade {
          from {
            opacity: 0;
            transform: translateY(40px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .animate-fade-up {
          animation: fadeUp 0.8s ease-out forwards;
        }

        .animate-card {
          animation: cardFade 0.7s ease-out forwards;
          opacity: 0;
        }
      `}</style>
      <Testimonials />
      <Footer/>
    </div>
  );
}

export default Practice;
