import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  BookOpen,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  FileText,
  PlayCircle,
  Star,
  Users,
  Globe,
  Award,
  ChevronRight,
  X,
  MessageCircle,
  TrendingUp,
  Sparkles,
  Send,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import { UserContext } from "../contexts/userContext";
import { generateCertificate } from "../lib/cirtificateGenerator";

const VideoPlayerModal = ({ videoUrl, onClose }) => {
  const embedUrl = videoUrl
    ? videoUrl
        .replace("watch?v=", "embed/")
        .replace("youtu.be/", "youtube.com/embed/")
    : null;

  if (!embedUrl) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-4xl p-6 rounded-2xl shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 bg-red-600 text-white rounded-full p-2 hover:bg-red-700 transition-colors z-10"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="w-full aspect-video">
          <iframe
            src={embedUrl}
            title="Course Lesson Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full rounded-lg"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

const StudentCourseDetails1 = () => {
  const { id: courseId } = useParams();
  const [courseDetails, setCourseDetails] = useState(null);
  const [enrolled, setEnrolled] = useState(false);
  const navigate = useNavigate();

  const [showDemoModal, setShowDemoModal] = useState(false);
  const [showLessonVideoModal, setShowLessonVideoModal] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openLessonIndex, setOpenLessonIndex] = useState(null);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [clickedMark, setClickedMark] = useState(false);
  const { token, user, setUser } = useContext(UserContext);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const userId = user?.id;

  useEffect(() => {
    const fetchUserData = async () => {
      console.log(userId);
      if (token) {
        try {
          const res = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/student/get-info`,
            { studentId: userId },
          );
          if (res.data.success) {
            setUser(res.data.student);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };
    fetchUserData();
  }, [userId]);

  useEffect(() => {
    const fetchProgress = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/student/check-progress`,
          { token: token, courseId: courseId },
        );
        if (response.data.success) {
          const completed = response.data.completedLessons.map(
            (lesson) => lesson.videoId,
          );
          setCompletedLessons(completed);
        }
      } catch (error) {
        console.error("Error fetching progress:", error);
      }
    };
    fetchProgress();
  }, [courseId, clickedMark === true]);

  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem("token");
    fetchCourseDetails(token);
  }, [courseId]);

  const toggleLesson = (index) => {
    setOpenLessonIndex(openLessonIndex === index ? null : index);
  };

  const openLessonVideo = (videoUrl) => {
    setCurrentVideoUrl(videoUrl);
    setShowLessonVideoModal(true);
  };

  const enrollCourse = async () => {
    if (!token) {
      toast.error("Please log in to enroll in the course.");
      return;
    }

    try {
      setEnrolled(true);
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/student/enroll-course`,
        { courseId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        fetchCourseDetails(token);
      } else {
        setEnrolled(false);
        console.error(`Enrollment failed: ${response.data.message}`);
      }
    } catch (error) {
      setEnrolled(false);
      console.error("An error occurred during enrollment.", error);
    }
  };

  const fetchCourseDetails = async (token) => {
    if (!token) {
      setError("You need to be logged in to view course details.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/student/course-details`,
        { courseId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // console.log("Course details response:", response.data.course);

      if (response.data.success) {
        setCourseDetails(response.data.course);
        setEnrolled(response.data.enrolled);
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError("Could not load course details. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  async function makeItMark(courseId, videoId) {
    setClickedMark(true);
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in to mark the lesson as completed.");
      return;
    }
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/student/mark-as-done`,
        {
          token: token,
          courseId: courseId,
          videoId: videoId,
        },
      );

      if (response.data.success) {
        toast.success("Lesson marked as completed");
      } else {
        toast.error(`Failed to mark lesson: ${response.data.message}`);
      }
    } catch (error) {
      toast.error("An error occurred while marking the lesson.");
    } finally {
      setClickedMark(false);
    }
  }

  const assessmentController = (assessmentType) => {
    if (
      (completedLessons.length / courseDetails.lessons.length) * 100 ===
      100
    ) {
      if (assessmentType === "quiz") {
        navigate(`/quiz`, {
          state: {
            courseTitle: courseDetails.title,
            courseId: courseId,
            userId: user._id,
          },
        });
      } else {
        navigate(
          `/interview1/${courseDetails.title.replace(/\s+/g, "-").toLowerCase()}`,
          {
            state: {
              courseTitle: courseDetails.title,
              courseId: courseId,
              userId: user._id,
            },
          },
        );
      }
    } else {
      toast.error("Please complete all lessons to proceed to the assessment.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50">
        <div className="text-center">
          <div className="relative">
            <div className="w-24 h-24 border-[6px] border-blue-100 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
            <Sparkles className="w-10 h-10 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>
          <p className="mt-8 text-xl font-bold text-slate-700 animate-pulse">
            Loading course details...
          </p>
          <div className="mt-4 flex gap-1.5 justify-center">
            <div
              className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
              style={{ animationDelay: "0ms" }}
            ></div>
            <div
              className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
              style={{ animationDelay: "150ms" }}
            ></div>
            <div
              className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
              style={{ animationDelay: "300ms" }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-rose-50 via-red-50/50 to-orange-50">
        <div className="max-w-md text-center p-10 rounded-3xl bg-white shadow-[0_20px_60px_rgba(0,0,0,0.1)] border border-red-100 animate-scaleIn">
          <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-rose-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <X className="w-10 h-10 text-red-600" />
          </div>
          <h3 className="text-3xl font-black text-slate-900 mb-3">
            Error Loading Course
          </h3>
          <p className="text-slate-600 mb-4 text-lg">{error}</p>
          <p className="text-sm text-slate-500 bg-slate-50 p-4 rounded-xl">
            Please try refreshing the page or checking your login status.
          </p>
        </div>
      </div>
    );
  }

  if (!courseDetails) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center p-10 rounded-3xl bg-white shadow-xl">
          <p className="text-lg text-slate-600">
            No course details available for this ID.
          </p>
        </div>
      </div>
    );
  }

  // const progressPercentage =
  //   courseDetails.lessons.length > 0
  //     ? (completedLessons.length / courseDetails.lessons.length) * 100
  //     : 0;

  const enrolledCourse = user?.courses?.find(
    (c) => c.course?.toString() === courseId,
  );

  const totalLessons = courseDetails?.lessons?.length || 0;
  const progressPercentage =
    totalLessons > 0 ? (completedLessons.length / totalLessons) * 100 : 0;

  const hasCompleted = progressPercentage === 100;
  const hasCertificate = enrolledCourse?.isValidforCertificate;
  const attempts = enrolledCourse?.attempts || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 text-white pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtNi42MjcgNS4zNzMtMTIgMTItMTJzMTIgNS4zNzMgMTIgMTItNS4zNzMgMTItMTIgMTItMTItNS4zNzMtMTItMTJ6bTAgMjRjMC02LjYyNyA1LjM3My0xMiAxMi0xMnMxMiA1LjM3MyAxMiAxMi01LjM3MyAxMi0xMiAxMi0xMi01LjM3My0xMi0xMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>

        <div className="absolute top-20 right-20 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>

        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between gap-12 relative z-10">
          <div className="flex-1 lg:pr-8">
            <div className="flex items-center gap-2 text-sm font-bold text-cyan-400 mb-8 uppercase tracking-wider">
              <span className="bg-cyan-400/20 backdrop-blur-sm px-4 py-2 rounded-full border border-cyan-400/30 hover:bg-cyan-400/30 transition-all duration-300 shadow-lg">
                {courseDetails?.topic}
              </span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-slate-300">{courseDetails?.title}</span>
            </div>

            <h1 className="text-6xl md:text-7xl font-black mb-8 leading-[1.1] bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-100 to-blue-200 animate-fadeIn">
              {courseDetails?.title}
            </h1>

            <p className="text-xl text-slate-300 mb-10 leading-relaxed max-w-3xl">
              {courseDetails?.description ||
                "Master the fundamentals and advanced concepts in this comprehensive guide designed for all skill levels."}
            </p>

            <div className="flex flex-wrap items-center gap-6 mb-10">
              <div className="flex items-center gap-3 bg-gradient-to-br from-amber-400/20 to-orange-400/20 backdrop-blur-sm px-5 py-3 rounded-2xl border border-amber-400/30 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                <Star className="w-6 h-6 fill-amber-400 text-amber-400 drop-shadow-lg" />
                <span className="text-xl font-black text-amber-300">4.8</span>
                <span className="text-slate-300 text-sm font-medium">
                  (12,430)
                </span>
              </div>

              <div className="flex items-center gap-3 text-slate-300 hover:text-white transition-colors">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 backdrop-blur-sm flex items-center justify-center border border-cyan-400/30 shadow-lg">
                  <Users className="w-6 h-6 text-cyan-400" />
                </div>
                <span className="font-bold text-lg">
                  {courseDetails?.students.length || 0} students
                </span>
              </div>

              <div className="flex items-center gap-3 text-slate-300 hover:text-white transition-colors">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm flex items-center justify-center border border-blue-400/30 shadow-lg">
                  <Globe className="w-6 h-6 text-blue-400" />
                </div>
                <span className="font-bold text-lg">English [Auto]</span>
              </div>
            </div>

            <div className="items-center gap-5 p-5 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 inline-flex shadow-xl hover:shadow-2xl hover:bg-white/15 transition-all duration-300">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center font-black text-3xl shadow-xl ring-4 ring-white/20">
                {courseDetails?.teacher?.username?.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-400 mb-1">
                  Created by
                </p>
                <p className="font-black text-xl text-cyan-400 hover:text-cyan-300 cursor-pointer transition-colors">
                  {courseDetails?.teacher?.username}
                </p>
              </div>
            </div>

            <div className="w-full mt-16 bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-3xl p-10 shadow-2xl border border-slate-700/50 hover:border-slate-600/50 transition-all duration-500">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-xl">
                  <TrendingUp className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-4xl font-black text-white">
                  What you'll learn
                </h2>
              </div>

              <ul className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {courseDetails?.topicCover.map((point, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-4 text-slate-200 text-base group hover:translate-x-2 transition-all duration-300"
                  >
                    <div className="w-7 h-7 rounded-xl bg-cyan-400/20 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-cyan-400/40 group-hover:scale-110 transition-all duration-300 shadow-lg">
                      <CheckCircle className="w-5 h-5 text-cyan-400" />
                    </div>
                    <span className="leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:w-[38%]">
            <div className="bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.2)] border border-slate-200 overflow-hidden sticky top-28 transform hover:scale-[1.02] transition-all duration-500 hover:shadow-[0_25px_70px_rgba(0,0,0,0.25)]">
              <div className="relative group cursor-pointer overflow-hidden">
                <img
                  src={
                    courseDetails?.thumbnail ||
                    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800"
                  }
                  alt="Preview"
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                <div
                  onClick={() => setShowDemoModal(true)}
                  className="absolute inset-0 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500"
                >
                  <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500 shadow-2xl ring-4 ring-white/30">
                    <PlayCircle className="w-14 h-14 text-white drop-shadow-lg" />
                  </div>
                  <span className="text-white font-black text-xl">
                    Preview this course
                  </span>
                </div>
              </div>

              <div className="p-8">
                <div className="flex items-baseline gap-3 mb-8">
                  <span className="text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600">
                    ₹{courseDetails?.price || "499"}
                  </span>
                </div>

                {enrolled ? (
                  <button
                    disabled
                    className="w-full bg-gradient-to-r from-slate-300 to-slate-400 text-white py-5 rounded-2xl font-black text-lg mb-5 shadow-lg cursor-not-allowed relative overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-3">
                      <CheckCircle className="w-6 h-6" />
                      Already Enrolled
                    </span>
                  </button>
                ) : (
                  <button
                    onClick={enrollCourse}
                    className="w-full bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-600 hover:from-blue-700 hover:via-blue-600 hover:to-cyan-700 text-white py-5 rounded-2xl font-black text-lg mb-5 shadow-[0_8px_24px_rgba(37,99,235,0.4)] hover:shadow-[0_12px_32px_rgba(37,99,235,0.5)] transition-all duration-300 transform hover:scale-[1.02] active:scale-95 relative overflow-hidden group"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-400 opacity-0 group-hover:opacity-30 transition-opacity duration-300"></span>
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      Enroll Now
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </button>
                )}

                <div className="space-y-5 pt-8 border-t-2 border-slate-100">
                  <p className="font-black text-sm text-slate-700 mb-5 uppercase tracking-wide">
                    This course includes:
                  </p>
                  <ul className="text-sm space-y-4 text-slate-600">
                    <li className="flex items-center gap-4 group hover:translate-x-2 transition-all duration-300">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-50 to-rose-100 flex items-center justify-center group-hover:shadow-lg transition-all duration-300">
                        <PlayCircle className="w-5 h-5 text-red-600" />
                      </div>
                      <span className="font-bold text-base">
                        {courseDetails?.lessons.length || 0} video lectures
                      </span>
                    </li>
                    <li className="flex items-center gap-4 group hover:translate-x-2 transition-all duration-300">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center group-hover:shadow-lg transition-all duration-300">
                        <Award className="w-5 h-5 text-amber-600" />
                      </div>
                      <span className="font-bold text-base">
                        Certificate of completion
                      </span>
                    </li>
                    <li className="flex items-center gap-4 group hover:translate-x-2 transition-all duration-300">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-100 flex items-center justify-center group-hover:shadow-lg transition-all duration-300">
                        <Clock className="w-5 h-5 text-blue-600" />
                      </div>
                      <span className="font-bold text-base">
                        Lifetime access
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {enrolled &&
        courseDetails.lessons &&
        courseDetails.lessons.length > 0 && (
          <div className="mt-16 max-w-7xl mx-auto px-6 pb-16">
            <div className="flex items-center gap-5 mb-10">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-xl">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-5xl font-black text-slate-900">
                Course Content
              </h2>
            </div>

            <div className="bg-white flex flex-col gap-3 rounded-3xl p-10 shadow-[0_8px_32px_rgba(0,0,0,0.08)] border-2 border-slate-100 mb-10 hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 via-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
                    <TrendingUp className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <span className="text-sm font-black text-slate-600 block uppercase tracking-wide mb-1">
                      Your Progress
                    </span>
                    <span className="text-3xl font-black text-slate-900">
                      {completedLessons.length}/{courseDetails.lessons.length}
                    </span>
                  </div>
                </div>
                <span className="text-4xl font-black text-emerald-600">
                  {Math.round(progressPercentage)}%
                </span>
              </div>

              <div className="relative w-full bg-slate-200 rounded-full h-5 overflow-hidden shadow-inner">
                <div
                  className="h-5 rounded-full bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-600 transition-all duration-1000 ease-out relative overflow-hidden shadow-lg"
                  style={{ width: `${progressPercentage}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
                </div>
              </div>

              {courseDetails.lessons.map((lesson, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-xl overflow-hidden shadow-sm"
                >
                  <button
                    className={`w-full text-left p-5 flex justify-between items-center transition-colors duration-200
                                        ${
                                          openLessonIndex === index
                                            ? "bg-blue-50"
                                            : "bg-gray-50 hover:bg-gray-100"
                                        }`}
                    onClick={() => toggleLesson(index)}
                  >
                    <span className="text-lg font-semibold text-gray-800 flex-1">
                      <span className="text-blue-600 mr-2">
                        Lecture {index + 1}:
                      </span>{" "}
                      {lesson.title}
                    </span>
                    {completedLessons.includes(lesson.videoId) && (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    )}
                    {openLessonIndex === index ? (
                      <ChevronUp className="w-6 h-6 text-blue-600" />
                    ) : (
                      <ChevronDown className="w-6 h-6 text-gray-500" />
                    )}
                  </button>

                  {openLessonIndex === index && (
                    <div className="p-5 bg-white border-t border-gray-200">
                      {lesson.videoUrl ? (
                        <ul className="space-y-4">
                          {lesson.videoUrl ? (
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 border rounded-xl bg-white shadow-sm">
                              <div className="flex items-center gap-3 flex-1">
                                <PlayCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                                <span className="text-gray-900 font-semibold text-sm sm:text-base truncate">
                                  {lesson.title || `Video ${index + 1}`}
                                </span>
                              </div>

                              <div className="flex flex-row md:flex-col items-center gap-3 w-full md:w-auto">
                                <button
                                  onClick={() =>
                                    openLessonVideo(lesson.videoUrl)
                                  }
                                  className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-full hover:bg-red-700 transition-all shadow-md hover:shadow-lg w-full md:w-auto"
                                >
                                  <PlayCircle className="w-4 h-4" />
                                  Show Video
                                </button>

                                {completedLessons.includes(lesson.videoId) ? (
                                  <button
                                    disabled
                                    className="px-4 py-2 text-sm font-medium rounded-full hover:bg-gray-500 transition-all shadow-sm hover:shadow w-full md:w-auto bg-gray-500 text-white hover:text-white cursor-not-allowed flex items-center justify-center gap-2"
                                  >
                                    Mark as Done
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => {
                                      makeItMark(courseId, lesson.videoId);
                                    }}
                                    className="px-4 py-2 text-sm font-medium rounded-full hover:bg-gray-100 transition-all shadow-sm hover:shadow w-full md:w-auto bg-blue-500 text-white hover:text-black cursor-pointer flex items-center justify-center gap-2"
                                  >
                                    Mark as Done
                                  </button>
                                )}
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="flex items-center gap-3 flex-1">
                                <FileText className="w-5 h-5 text-blue-600 flex-shrink-0" />
                                <a
                                  href={lesson.otherUrl || "#"}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-700 hover:text-blue-800 font-medium truncate"
                                >
                                  {lesson.title ||
                                    `Resource Link ${resIndex + 1}`}
                                </a>
                              </div>
                              <span className="text-sm text-gray-500 flex-shrink-0">
                                Document/Link
                              </span>
                            </>
                          )}
                        </ul>
                      ) : (
                        <p className="text-gray-500 italic p-3">
                          No resources available for this lesson.
                        </p>
                      )}
                      {lesson.resources.length > 0 ? (
                        <ul className="space-y-4">
                          {lesson.resources.map((resource, resIndex) => (
                            <li key={resIndex}>
                              <div className="flex items-center gap-3 flex-1">
                                <FileText className="w-5 h-5 text-blue-600 flex-shrink-0" />
                                <a
                                  href={resource || "#"}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-700 hover:text-blue-800 font-medium truncate"
                                >
                                  {" "}
                                  click here to view resource
                                </a>
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-500 italic p-3">
                          No additional resources available for this lesson.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

      {enrolled && totalLessons > 0 && hasCompleted && (
        <>
          {hasCertificate ? (
            // 🎓 CERTIFICATE AVAILABLE
            <div className="mt-10 p-6 bg-green-100 border border-green-300 text-center">
              <h2 className="text-2xl font-bold text-green-800 mb-2">
                🎉 Congratulations! You have Cleared the Course! 🎉
              </h2>

              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button
                  onClick={() =>
                    generateCertificate({
                      studentName: user.username,
                      courseName: courseDetails.title,
                      teacherName: courseDetails.teacherName,
                      percentage: enrolledCourse?.percentageGained + "%",
                      certificateId: "LS-" + enrolledCourse?.dateOfCompletion,
                      date: enrolledCourse?.dateOfCompletion,
                    })
                  }
                  className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition shadow-lg font-semibold"
                >
                  🎓 Download Certificate
                </button>

                <button
                  onClick={() => setShowFeedbackModal(true)}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:from-blue-700 hover:to-cyan-700 transition shadow-lg font-semibold"
                >
                  ⭐ Give Feedback
                </button>
              </div>
            </div>
          ) : attempts <= 3 ? (
            // 📝 ELIGIBLE FOR ASSESSMENT
            <div className="mt-10 p-6 bg-green-100 border border-green-300 text-center">
              <h2 className="text-2xl font-bold text-green-800 mb-2">
                🎉 Congratulations! You have Completed the Course! 🎉
              </h2>

              <p className="text-green-700">
                You are now eligible for the {courseDetails.assessmentType}.
                <br />
                You have 3 total attempts.
                <br />
                You attempted {attempts} times.
                <br />
                <br />
                Best of luck, {user?.username?.split(" ")[0]}!
              </p>

              <button
                onClick={() =>
                  assessmentController(courseDetails.assessmentType)
                }
                className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Proceed to {courseDetails.assessmentType.toUpperCase()}
              </button>
            </div>
          ) : (
            // ❌ ATTEMPTS EXHAUSTED
            <div className="mt-10 p-6 bg-red-100 border border-red-300 text-center">
              <h2 className="text-2xl font-bold text-red-800 mb-2">
                ❌ You have exhausted all attempts for the{" "}
                {courseDetails.assessmentType}.
              </h2>

              <p className="text-red-700">
                You have used all 3 attempts. You are no longer eligible to
                receive the certificate for this course.
              </p>
            </div>
          )}
        </>
      )}

      {enrolled && (
        <div className="max-w-7xl mx-auto px-6 pb-20 mt-10">
          <div className="flex items-center gap-5 mb-10">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-xl">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-5xl font-black text-slate-900">Discussion</h2>
          </div>
          <CommentSection courseId={courseId} />
        </div>
      )}

      {showDemoModal && (
        <VideoPlayerModal
          videoUrl={courseDetails.demoVideo}
          onClose={() => setShowDemoModal(false)}
        />
      )}

      {showLessonVideoModal && currentVideoUrl && (
        <VideoPlayerModal
          videoUrl={currentVideoUrl}
          onClose={() => setShowLessonVideoModal(false)}
        />
      )}
      {showFeedbackModal && (
        <FeedbackModal
          courseId={courseId}
          onClose={() => setShowFeedbackModal(false)}
        />
      )}
    </div>
  );
};

const CommentSection = ({ courseId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserRole(decoded.role);
      } catch (err) {
        console.error("Invalid token:", err);
      }
    }
  }, [token]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/comment/get-by-course`,
        { courseID: courseId },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response.data.success) {
        setComments(response.data.comments);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && courseId) fetchComments();
  }, [courseId]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    if (!token) {
      console.error("Please log in to post a comment.");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/comment/add`,
        { courseID: courseId, text: newComment.trim() },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response.data.success) {
        setNewComment("");
        fetchComments();
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleAddReply = async (commentId) => {
    if (!replyText.trim()) return;
    if (!token) {
      console.error("Please log in to reply.");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/comment/add-reply`,
        { commentID: commentId, text: replyText.trim() },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response.data.success) {
        setReplyText("");
        setReplyingTo(null);
        fetchComments();
      }
    } catch (error) {
      console.error("Error adding reply:", error);
    }
  };

  return (
    <div className="bg-gray-50 rounded-2xl p-6 shadow-inner">
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a public comment..."
          className="flex-1 border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800 resize-none"
          rows={3}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleAddComment();
            }
          }}
        />
        <button
          onClick={handleAddComment}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-semibold transition-colors shadow-md self-end sm:self-start"
        >
          Comment
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500 italic">Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="text-gray-500 italic">
          No comments yet. Be the first to comment!
        </p>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment._id} className="border-b border-gray-200 pb-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-500 text-white flex items-center justify-center rounded-full font-bold">
                  {comment.userID?.username
                    ? comment.userID.username[0].toUpperCase()
                    : "U"}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">
                    {comment.userID?.username || "Unknown User"}
                  </p>
                  <p className="text-gray-700">{comment.text}</p>

                  {userRole === "teacher" && (
                    <button
                      onClick={() =>
                        setReplyingTo(
                          replyingTo === comment._id ? null : comment._id,
                        )
                      }
                      className="text-sm text-blue-600 mt-1 hover:underline"
                    >
                      Reply
                    </button>
                  )}

                  {comment.replies?.length > 0 && (
                    <div className="ml-8 mt-3 space-y-2">
                      {comment.replies.map((reply) => (
                        <div
                          key={reply._id}
                          className="flex items-start gap-3 bg-gray-100 p-3 rounded-xl"
                        >
                          <div className="w-8 h-8 bg-gray-400 text-white flex items-center justify-center rounded-full text-sm font-bold">
                            {reply.user?.username
                              ? reply.user.username[0].toUpperCase()
                              : "U"}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">
                              {reply.user?.username || "User"}
                            </p>
                            <p className="text-gray-700 text-sm">
                              {reply.text}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {replyingTo === comment._id && userRole === "teacher" && (
                    <div className="mt-3 ml-8 flex flex-col sm:flex-row gap-3">
                      <input
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Write a reply..."
                        className="flex-1 border border-gray-300 rounded-xl p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                      <button
                        onClick={() => handleAddReply(comment._id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow"
                      >
                        Reply
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
const StarRating = ({ rating, setRating }) => {
  return (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          onClick={() => setRating(star)}
          className={`w-8 h-8 cursor-pointer transition-all duration-200 ${
            star <= rating
              ? "text-yellow-400 fill-yellow-400 scale-110"
              : "text-gray-300 hover:text-yellow-300"
          }`}
        />
      ))}
    </div>
  );
};

const FeedbackModal = ({ onClose, courseId }) => {
  const token = localStorage.getItem("token");

  const [courseRating, setCourseRating] = useState(0);
  const [facultyRating, setFacultyRating] = useState(0);
  const [videoRating, setVideoRating] = useState(0);
  const [moduleRating, setModuleRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState("");

  const handleSubmit = async () => {
    if (!courseRating || !facultyRating || !videoRating || !moduleRating) {
      toast.error("Please rate all categories.");
      return;
    }

    try {
      setSubmitting(true);

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/student/send-feedback`,
        {
          token,
          courseId,
          rating:
            (courseRating + facultyRating + videoRating + moduleRating) / 4,
          feedback, 
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      
      toast.success(res.data.message);
      onClose();
    } catch (error) {
      toast.error("Failed to submit feedback.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed top-10 inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl p-10 relative animate-scaleIn">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-black text-slate-900 mb-4 text-center">
          Course Feedback
        </h2>

        <div className="space-y-4">
          <div>
            <p className="font-semibold text-slate-700 mb-2">
              How was the overall course?
            </p>
            <StarRating rating={courseRating} setRating={setCourseRating} />
          </div>

          <div>
            <p className="font-semibold text-slate-700 mb-2">
              How was the faculty?
            </p>
            <StarRating rating={facultyRating} setRating={setFacultyRating} />
          </div>

          <div>
            <p className="font-semibold text-slate-700 mb-2">
              How were the lesson videos?
            </p>
            <StarRating rating={videoRating} setRating={setVideoRating} />
          </div>

          <div>
            <p className="font-semibold text-slate-700 mb-2">
              How were the modules & structure?
            </p>
            <StarRating rating={moduleRating} setRating={setModuleRating} />
          </div>

          <div>
            <p className="font-semibold text-slate-700 mb-2">
              Give a feedback in brief (optional)
            </p>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              rows="3"
              placeholder="Enter your feedback here..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full mt-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white py-3 rounded-xl font-bold shadow-lg transition-all"
          >
            {submitting ? "Submitting..." : "Submit Feedback"}
          </button>
        </div>
      </div>
    </div>
  );
};
export default StudentCourseDetails1;
