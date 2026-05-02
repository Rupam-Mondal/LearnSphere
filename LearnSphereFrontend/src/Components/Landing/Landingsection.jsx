import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  BrainCircuit,
  GraduationCap,
  PlayCircle,
  Sparkles,
  Star,
  Trophy,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import girl from "../../assets/LandingPic/girl.webp";

const Landingsection = () => {
  const navigate = useNavigate();

  const highlights = [
    { icon: BookOpen, label: "Smart courses", value: "120+" },
    { icon: Users, label: "Active learners", value: "25K" },
    { icon: Star, label: "Avg. rating", value: "4.8" },
  ];

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#100719] px-5 pt-24 text-white">
      <img
        src={girl}
        alt="Student learning with LearnSphere"
        className="absolute inset-y-0 right-0 h-full w-full object-cover object-center opacity-35 lg:object-right"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,#100719_0%,rgba(16,7,25,0.98)_38%,rgba(26,9,45,0.78)_68%,rgba(16,7,25,0.52)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(89,22,139,0.52),transparent_30%),radial-gradient(circle_at_76%_16%,rgba(6,182,212,0.2),transparent_24%),linear-gradient(135deg,rgba(255,255,255,0.07)_0_1px,transparent_1px_48px)]" />
      <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-white via-white/75 to-transparent" />

      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-6rem)] max-w-7xl grid-cols-1 items-center gap-10 pb-20 lg:grid-cols-[1.08fr_0.92fr]">
        <div className="max-w-3xl">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-purple-100 shadow-[0_12px_40px_rgba(88,28,135,0.25)] backdrop-blur-xl">
            <Sparkles className="h-4 w-4 text-purple-200" />
            Premium AI learning ecosystem
          </div>

          <h1 className="max-w-4xl text-5xl font-black leading-[1.01] tracking-normal text-white md:text-7xl lg:text-[5.45rem]">
            Learn faster with
            <span className="mt-3 block text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-100 to-cyan-200">
              a premium AI path.
            </span>
          </h1>

          <p className="mt-7 max-w-2xl text-base leading-8 text-slate-200 md:text-xl">
            A polished learning space for curated courses, mentor-led growth,
            smart practice, and interview preparation that feels focused from
            the first click.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <button
              onClick={() => navigate("/student/feed")}
              className="group inline-flex cursor-pointer items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-white to-purple-100 px-8 py-4 text-base font-black text-[#59168B] shadow-[0_24px_70px_rgba(255,255,255,0.2)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_80px_rgba(168,85,247,0.32)]"
            >
              Explore Courses
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>
            <button
              onClick={() => navigate("/practice")}
              className="inline-flex cursor-pointer items-center justify-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-8 py-4 text-base font-black text-white shadow-[0_18px_50px_rgba(15,23,42,0.32)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-cyan-200/60 hover:bg-white/15"
            >
              <PlayCircle className="h-5 w-5 text-cyan-200" />
              Practice Skills
            </button>
          </div>

          <div className="mt-12 grid max-w-3xl grid-cols-3 gap-3 sm:gap-4">
            {highlights.map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="rounded-2xl border border-white/14 bg-white/10 p-4 shadow-[0_20px_60px_rgba(15,23,42,0.24)] backdrop-blur-xl sm:p-5"
              >
                <Icon className="mb-4 h-5 w-5 text-cyan-200 sm:h-6 sm:w-6" />
                <p className="text-2xl font-black text-white sm:text-3xl">
                  {value}
                </p>
                <p className="mt-1 text-xs font-medium text-slate-300 sm:text-sm">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative hidden min-h-[590px] lg:block">
          <div className="absolute right-0 top-12 h-[500px] w-[405px] overflow-hidden rounded-[2rem] border border-white/15 bg-white/10 p-3 shadow-[0_35px_120px_rgba(0,0,0,0.38)] backdrop-blur-xl">
            <img
              src={girl}
              alt="LearnSphere student workspace"
              className="h-full w-full rounded-[1.4rem] object-cover"
            />
            <div className="absolute inset-3 rounded-[1.4rem] bg-gradient-to-t from-[#100719]/88 via-transparent to-transparent" />
            <div className="absolute bottom-8 left-8 right-8">
              <p className="text-sm font-semibold text-cyan-100">
                Today&apos;s focus
              </p>
              <p className="mt-2 text-3xl font-black leading-tight">
                Complete your AI-guided course path.
              </p>
            </div>
          </div>

          <div className="absolute left-5 top-24 w-72 rounded-3xl border border-white/15 bg-white/95 p-5 text-gray-950 shadow-[0_25px_80px_rgba(0,0,0,0.24)]">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#59168B]">
                <BrainCircuit className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-500">AI Mentor</p>
                <p className="font-black">Personal roadmap ready</p>
              </div>
            </div>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-purple-100">
              <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-[#59168B] to-cyan-500" />
            </div>
            <p className="mt-3 text-sm font-semibold text-gray-500">
              72% path progress this week
            </p>
          </div>

          <div className="absolute bottom-24 left-20 w-60 rounded-3xl border border-white/15 bg-[#100719]/85 p-5 shadow-[0_25px_80px_rgba(0,0,0,0.32)] backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400/15">
                <Trophy className="h-5 w-5 text-cyan-200" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-400">
                  Interview score
                </p>
                <p className="text-2xl font-black">94%</p>
              </div>
            </div>
          </div>

          <div className="absolute right-8 top-4 flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-5 py-4 shadow-[0_20px_65px_rgba(0,0,0,0.26)] backdrop-blur-xl">
            <BadgeCheck className="h-5 w-5 text-cyan-200" />
            <span className="text-sm font-bold">Verified teachers</span>
          </div>

          <div className="absolute bottom-4 right-20 w-68 rounded-3xl border border-white/15 bg-white/10 p-5 shadow-[0_25px_80px_rgba(0,0,0,0.3)] backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#59168B]">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <p className="font-black">Live course upgrade</p>
                <p className="text-sm text-slate-300">
                  New lessons matched to your pace
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Landingsection;
