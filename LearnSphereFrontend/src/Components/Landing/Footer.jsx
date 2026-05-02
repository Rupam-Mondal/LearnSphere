import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="relative overflow-hidden bg-[#100719] px-5 py-16 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(89,22,139,0.42),transparent_32%),radial-gradient(circle_at_88%_12%,rgba(6,182,212,0.16),transparent_28%)]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-12 rounded-3xl border border-white/10 bg-white/10 p-7 shadow-[0_28px_90px_rgba(0,0,0,0.3)] backdrop-blur-xl md:p-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold text-purple-100">
                <Sparkles className="h-4 w-4" />
                Teach on LearnSphere
              </div>
              <h2 className="text-3xl font-black leading-tight md:text-5xl">
                Build a premium course experience for modern learners.
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-300">
                Publish courses, support students, and grow your teaching brand
                with a polished platform built around learning outcomes.
              </p>
            </div>

            <button
              onClick={() => navigate("/teacher-Home")}
              className="group inline-flex w-fit cursor-pointer items-center justify-center gap-3 rounded-2xl bg-white px-7 py-4 text-base font-black text-[#59168B] shadow-[0_20px_60px_rgba(255,255,255,0.16)] transition duration-300 hover:-translate-y-1 hover:bg-purple-50"
            >
              Get Started
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        <div className="grid gap-10 border-b border-white/10 pb-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <h3 className="text-2xl font-black">LearnSphere</h3>
            <p className="mt-4 max-w-md text-sm leading-7 text-slate-400">
              A premium learning ecosystem for courses, practice, interviews,
              teachers, and student progress.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-black uppercase tracking-normal text-white">
              Explore
            </h4>
            <div className="space-y-3 text-sm font-medium text-slate-400">
              <button
                onClick={() => navigate("/student/feed")}
                className="flex cursor-pointer items-center gap-2 transition hover:text-white"
              >
                <BookOpen className="h-4 w-4" />
                Courses
              </button>
              <button
                onClick={() => navigate("/practice")}
                className="flex cursor-pointer items-center gap-2 transition hover:text-white"
              >
                <GraduationCap className="h-4 w-4" />
                Practice
              </button>
              <button
                onClick={() => navigate("/all/teachers")}
                className="flex cursor-pointer items-center gap-2 transition hover:text-white"
              >
                <ShieldCheck className="h-4 w-4" />
                Teachers
              </button>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-black uppercase tracking-normal text-white">
              Contact
            </h4>
            <a
              href="mailto:support@learnsphere.com"
              className="flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-white"
            >
              <Mail className="h-4 w-4" />
              support@learnsphere.com
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-4 pt-8 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <p>
            &copy; {new Date().getFullYear()} LearnSphere. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-5">
            <a href="#" className="transition hover:text-white">
              Privacy Policy
            </a>
            <a href="#" className="transition hover:text-white">
              Terms of Service
            </a>
            <a href="#" className="transition hover:text-white">
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
