import Navbar from "../Components/Navbar/Navbar";
import { FaSadTear, FaUserTie } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function Practice() {
  const navigate = useNavigate();

  const tests = [
    {
      title: "Java Test",
      description:
        "Assess your Java programming skills with practical coding questions and real-world scenarios.",
      gradient: "from-yellow-400/20 via-yellow-300/20 to-orange-300/20",
      iconBg: "bg-yellow-100",
      icon: <FaSadTear className="text-yellow-500 text-3xl" />,
      route: "/interview/Java",
    },
    {
      title: "OOPs Test",
      description:
        "Evaluate your understanding of Object-Oriented Programming concepts with structured challenges.",
      gradient: "from-blue-400/20 via-cyan-300/20 to-blue-300/20",
      iconBg: "bg-blue-100",
      icon: <FaUserTie className="text-blue-500 text-3xl" />,
      route: "/interview/oops",
    },
  ];

  return (
    <div className="w-full min-h-screen bg-[#f9fafb]">
      <Navbar />

      {/* ================= HERO ================= */}
      <div className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-100 via-cyan-100 to-blue-100 blur-3xl opacity-70" />

        <div className="relative max-w-5xl mx-auto text-center animate-fade-up">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Practice & Improve
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Sharpen your skills with curated practice tests designed to boost
            your confidence
          </p>
        </div>
      </div>

      {/* ================= CARDS ================= */}
      <div className="max-w-6xl mx-auto px-6 pb-24 grid grid-cols-1 sm:grid-cols-2 gap-10">
        {tests.map((test, index) => (
          <div
            key={index}
            className="group relative rounded-3xl p-8 bg-white border border-gray-200 shadow-sm hover:shadow-2xl transition-all duration-500 animate-card"
            style={{ animationDelay: `${index * 120}ms` }}
          >
            {/* Glow */}
            <div
              className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${test.gradient} opacity-0 group-hover:opacity-100 blur-xl transition duration-500`}
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
    </div>
  );
}

export default Practice;
