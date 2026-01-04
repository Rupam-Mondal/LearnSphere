import axios from "axios";
import {
  Loader2,
  User2 as User2Icon,
  BookOpen,
  ArrowRight,
  GraduationCap,
  Sparkles
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const StudentDashboard = () => {
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const fetchTeacherName = async (teacherId) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/student/get-teacher-name`,
        { teacherId }
      );
      return res.data.teacherName || "Instructor";
    } catch {
      return "Instructor";
    }
  };

  useEffect(() => {
    let isMounted = true;
    const fetchCourses = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/student/my-courses`,
          { token }
        );

        const courses = response.data.registeredCourses || [];

        const updatedCourses = await Promise.all(
          courses.map(async (course) => {
            const teacherName = await fetchTeacherName(course.teacher);
            return { ...course, teacherName };
          })
        );

        if (isMounted) {
          setFeed(updatedCourses);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Failed to fetch courses.");
          setLoading(false);
        }
      }
    };

    fetchCourses();
    return () => { isMounted = false; };
  }, [token]);

  return (
    <div className="min-h-screen bg-[#f8fafc] px-4 md:px-8 pt-28 pb-20 font-sans">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-indigo-100/50 blur-[120px]" />
        <div className="absolute bottom-[10%] right-[0%] w-[30%] h-[30%] rounded-full bg-purple-100/50 blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto relative">
        <header className="mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-indigo-100 shadow-sm text-indigo-600 text-xs font-bold uppercase tracking-wider mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            Learning Portal
          </div>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.1]">
                Welcome back,<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
                  Ready to learn?
                </span>
              </h1>
              <p className="mt-4 text-slate-500 text-lg max-w-xl">
                Track your progress and access your registered materials in one centralized workspace.
              </p>
            </div>
            
            {!loading && feed.length > 0 && (
              <div className="flex gap-4">
                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                  <p className="text-slate-400 text-xs font-medium uppercase">Enrolled</p>
                  <p className="text-2xl font-bold text-slate-800">{feed.length} Courses</p>
                </div>
              </div>
            )}
          </div>
        </header>

        {loading && (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-indigo-200 animate-ping opacity-20" />
              <Loader2 className="h-12 w-12 animate-spin text-indigo-600 relative" />
            </div>
            <p className="mt-6 text-slate-400 font-medium animate-pulse">Syncing your curriculum...</p>
          </div>
        )}

        {error && (
          <div className="max-w-md mx-auto bg-white border border-red-100 rounded-3xl p-8 text-center shadow-xl shadow-red-500/5">
            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚠️</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Sync Failed</h3>
            <p className="text-slate-500 mb-6">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && feed.length === 0 && (
          <div className="max-w-md mx-auto bg-white rounded-[2.5rem] p-12 text-center border border-slate-100 shadow-2xl shadow-indigo-500/5">
            <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-10 h-10 text-indigo-500" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">No courses yet</h3>
            <p className="text-slate-500 mb-8">Start your journey by exploring our available courses.</p>
            <button className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
              Browse Catalogue
            </button>
          </div>
        )}

        {!loading && !error && feed.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {feed.map((course) => (
              <div
                key={course._id}
                className="group bg-white rounded-[2rem] border border-slate-200/60 overflow-hidden hover:border-indigo-300 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(79,70,229,0.1)] flex flex-col"
              >
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-700 shadow-sm">
                      Level: Advanced
                    </span>
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-1.5 bg-indigo-50 rounded-lg">
                      <GraduationCap className="w-4 h-4 text-indigo-600" />
                    </div>
                    <span className="text-xs font-bold text-indigo-600 uppercase tracking-tight">Course</span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                    {course.title}
                  </h3>

                  <p className="text-slate-500 text-sm line-clamp-2 mb-6">
                    {course.description}
                  </p>

                  <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                        <User2Icon className="w-4 h-4 text-slate-500" />
                      </div>
                      <span className="text-sm font-semibold text-slate-700">
                        {course.teacherName}
                      </span>
                    </div>
                    
                    <button
                      onClick={() => navigate(`/student/course-details/${course._id}`)}
                      className="p-3 cursor-pointer bg-slate-50 text-slate-900 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300"
                    >
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;