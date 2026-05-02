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
  Lock,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import { UserContext } from "../contexts/userContext";
import { generateCertificate } from "../lib/cirtificateGenerator";

const InlineSpinner = ({ className = "h-4 w-4" }) => (
  <Loader2 className={`${className} animate-spin`} />
);

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
          className="absolute -top-3 -right-3 z-10 cursor-pointer rounded-full bg-red-600 p-2 text-white transition hover:-translate-y-0.5 hover:bg-red-700 hover:shadow-lg active:translate-y-0"
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
  const [doubtMessage, setDoubtMessage] = useState("");
  const [doubtSessions, setDoubtSessions] = useState([]);
  const [doubtLoading, setDoubtLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [markingVideoId, setMarkingVideoId] = useState(null);
  const userId = user?.id;

  useEffect(() => {
    const fetchUserData = async () => {
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

  useEffect(() => {
    if (enrolled) {
      fetchDoubtSession();
    }
  }, [enrolled, courseId]);

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

  const handlePayment = async () => {
    if (paymentLoading) return;

    try {
      setPaymentLoading(true);
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/purchase/create-order`,
        { id: courseId },
      );

      const order = data.order;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "LearnSphere",
        description: `Payment for course: ${courseDetails.title}`,
        order_id: order.id,
        handler: async function (response) {
          try {
            console.log("Payment response:", response);

            const verifyResponse = await axios.post(
              `${import.meta.env.VITE_BACKEND_URL}/purchase/verify-payment`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
            );

            if (verifyResponse.data.success) {
              toast.success(
                "Payment successful! Enrolling you in the course...",
              );
              await enrollCourse();
            } else {
              toast.error(
                "Payment verification failed. Please contact support.",
              );
            }
          } catch (error) {
            console.error("Verify error:", error);
            toast.error("Something went wrong during verification");
          } finally {
            setPaymentLoading(false);
          }
        },
        modal: {
          ondismiss: () => setPaymentLoading(false),
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error(error);
      toast.error("Payment failed");
      setPaymentLoading(false);
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


      if (response.data.success) {
        setCourseDetails(response.data.course);
        setEnrolled(response.data.enrolled);
      } else {
        setError(response.data.message);
      }
    } catch {
      setError("Could not load course details. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchDoubtSession = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/student/doubt-session`,
        { courseId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        setDoubtSessions(response.data.sessions || []);
      }
    } catch (error) {
      console.error("Error fetching doubt session:", error);
    }
  };

  const requestDoubtSession = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in to request a session.");
      return;
    }

    try {
      setDoubtLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/student/doubt-session/request`,
        { courseId, message: doubtMessage },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        setDoubtSessions((prev) => [response.data.session, ...prev]);
        setDoubtMessage("");
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message || "Could not request session.");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Could not request session.",
      );
    } finally {
      setDoubtLoading(false);
    }
  };

  async function makeItMark(courseId, videoId) {
    setClickedMark(true);
    setMarkingVideoId(videoId);
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in to mark the lesson as completed.");
      setClickedMark(false);
      setMarkingVideoId(null);
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
    } catch {
      toast.error("An error occurred while marking the lesson.");
    } finally {
      setClickedMark(false);
      setMarkingVideoId(null);
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

  const formatSessionTime = (value) => {
    if (!value) return "Time not set yet";

    return new Date(value).toLocaleString([], {
      dateStyle: "medium",
      timeStyle: "short",
    });
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
  const averageRating = courseDetails?.ratings?.length
    ? (
        courseDetails.ratings.reduce((sum, item) => sum + item.rating, 0) /
        courseDetails.ratings.length
      ).toFixed(1)
    : "New";
  const firstName = user?.username?.split(" ")[0] || "Learner";
  const previewLessons = courseDetails?.lessons?.slice(0, 4) || [];
  const nextLessonIndex = courseDetails?.lessons?.findIndex(
    (lesson) => !completedLessons.includes(lesson.videoId),
  );
  const safeNextLessonIndex = nextLessonIndex >= 0 ? nextLessonIndex : 0;

  return (
    <div className="min-h-screen bg-[#f7f8fb] text-slate-950">
      <section className="relative overflow-hidden bg-slate-950 px-4 pt-28 pb-12 text-white sm:px-6 lg:pt-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(20,184,166,0.22),transparent_32%),radial-gradient(circle_at_82%_12%,rgba(245,158,11,0.16),transparent_28%),linear-gradient(135deg,#020617_0%,#111827_55%,#042f2e_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#f7f8fb] to-transparent" />

        <div className="relative z-10 mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_420px] lg:items-start">
          <div className="max-w-4xl">
            <div className="mb-6 flex flex-wrap items-center gap-3 text-sm font-semibold">
              <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-teal-100 backdrop-blur">
                {courseDetails?.topic || "Featured course"}
              </span>
              <span
                className={`rounded-full px-4 py-2 ${
                  enrolled
                    ? "bg-emerald-400/15 text-emerald-100 ring-1 ring-emerald-300/25"
                    : "bg-amber-400/15 text-amber-100 ring-1 ring-amber-300/25"
                }`}
              >
                {enrolled ? "Enrolled learning space" : "Premium access"}
              </span>
            </div>

            <h1 className="max-w-4xl text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
              {enrolled
                ? `Continue ${courseDetails?.title}`
                : courseDetails?.title}
            </h1>

            <p className="mt-6 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
              {courseDetails?.description ||
                "Build practical skills with guided lessons, resources, and teacher support."}
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                <div className="flex items-center gap-2 text-amber-300">
                  <Star className="h-5 w-5 fill-amber-300" />
                  <span className="text-2xl font-black">{averageRating}</span>
                </div>
                <p className="mt-1 text-sm text-slate-300">
                  {courseDetails?.ratings?.length
                    ? `${courseDetails.ratings.length} learner reviews`
                    : "No reviews yet"}
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                <div className="flex items-center gap-2 text-teal-200">
                  <Users className="h-5 w-5" />
                  <span className="text-2xl font-black">
                    {courseDetails?.students?.length || 0}
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-300">Students enrolled</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                <div className="flex items-center gap-2 text-sky-200">
                  <BookOpen className="h-5 w-5" />
                  <span className="text-2xl font-black">{totalLessons}</span>
                </div>
                <p className="mt-1 text-sm text-slate-300">Video lessons</p>
              </div>
            </div>

            {enrolled && (
              <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.08] p-5 shadow-2xl backdrop-blur">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-bold uppercase text-teal-200">
                      Welcome back, {firstName}
                    </p>
                    <h2 className="mt-1 text-2xl font-black text-white">
                      {Math.round(progressPercentage)}% complete
                    </h2>
                    <p className="mt-1 text-sm text-slate-300">
                      {completedLessons.length} of {totalLessons} lessons done
                    </p>
                  </div>
                  <div className="flex h-24 w-24 items-center justify-center rounded-full border-[10px] border-emerald-400/25 bg-emerald-400/10 text-xl font-black text-emerald-200">
                    {Math.round(progressPercentage)}%
                  </div>
                </div>
                <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 transition-all duration-700"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          <aside className="rounded-[2rem] border border-white/10 bg-white p-3 text-slate-950 shadow-2xl lg:sticky lg:top-24">
            <div
              onClick={() => setShowDemoModal(true)}
              className="group relative aspect-video cursor-pointer overflow-hidden rounded-[1.5rem] bg-slate-900"
            >
              <img
                src={
                  courseDetails?.thumbnail ||
                  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=900"
                }
                alt={courseDetails?.title}
                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 shadow-2xl transition group-hover:scale-105">
                  <PlayCircle className="h-9 w-9 text-slate-950" />
                </div>
              </div>
              <p className="absolute bottom-4 left-5 text-sm font-bold text-white">
                Watch course preview
              </p>
            </div>

            <div className="p-5">
              {enrolled ? (
                <div className="space-y-4">
                  <div className="rounded-2xl bg-emerald-50 p-4 ring-1 ring-emerald-100">
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="h-6 w-6 text-emerald-600" />
                      <div>
                        <p className="font-black text-emerald-950">
                          You are enrolled
                        </p>
                        <p className="text-sm text-emerald-700">
                          Lessons, resources, progress, and support unlocked.
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setOpenLessonIndex(safeNextLessonIndex)}
                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-4 font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-xl active:translate-y-0"
                  >
                    <PlayCircle className="h-5 w-5" />
                    Continue Learning
                  </button>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-2xl font-black text-slate-950">
                        {completedLessons.length}/{totalLessons}
                      </p>
                      <p className="mt-1 text-xs font-bold uppercase text-slate-500">
                        Lessons done
                      </p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-2xl font-black text-slate-950">
                        {attempts}/3
                      </p>
                      <p className="mt-1 text-xs font-bold uppercase text-slate-500">
                        Attempts
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="mb-5 flex items-end justify-between gap-4">
                    <div>
                      <p className="text-sm font-bold uppercase text-slate-500">
                        Course price
                      </p>
                      <p className="text-4xl font-black text-slate-950">
                        Rs. {courseDetails?.price || "499"}
                      </p>
                    </div>
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-800">
                      Premium
                    </span>
                  </div>
                  <button
                    onClick={handlePayment}
                    disabled={paymentLoading}
                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-slate-950 via-teal-900 to-teal-700 px-5 py-4 font-black text-white shadow-[0_18px_40px_rgba(15,118,110,0.35)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_48px_rgba(15,118,110,0.45)] active:translate-y-0 disabled:cursor-wait disabled:opacity-80"
                  >
                    {paymentLoading ? (
                      <>
                        <InlineSpinner />
                        Opening Secure Payment
                      </>
                    ) : (
                      <>
                        Enroll Now
                        <ChevronRight className="h-5 w-5" />
                      </>
                    )}
                  </button>
                  <div className="mt-5 grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-xl bg-slate-50 p-3">
                      <PlayCircle className="mx-auto h-5 w-5 text-rose-600" />
                      <p className="mt-1 text-xs font-bold text-slate-700">
                        Lessons
                      </p>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-3">
                      <Award className="mx-auto h-5 w-5 text-amber-600" />
                      <p className="mt-1 text-xs font-bold text-slate-700">
                        Certificate
                      </p>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-3">
                      <Clock className="mx-auto h-5 w-5 text-teal-600" />
                      <p className="mt-1 text-xs font-bold text-slate-700">
                        Lifetime
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        {!enrolled && (
          <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
            <section className="space-y-8">
              <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <h2 className="text-2xl font-black sm:text-3xl">
                    What you will learn
                  </h2>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {(courseDetails?.topicCover || []).map((point, index) => (
                    <div
                      key={index}
                      className="flex gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4"
                    >
                      <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-teal-600" />
                      <p className="text-sm font-semibold leading-6 text-slate-700">
                        {point}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <div className="mb-6 flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-black sm:text-3xl">
                      Curriculum preview
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Enroll to unlock videos, resources, progress tracking, and support.
                    </p>
                  </div>
                  <Lock className="h-6 w-6 text-slate-400" />
                </div>
                <div className="space-y-3">
                  {previewLessons.map((lesson, index) => (
                    <div
                      key={lesson.videoId || index}
                      className="flex items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-white text-slate-500 ring-1 ring-slate-200">
                          <Lock className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-bold text-slate-900">
                            {lesson.title || `Lesson ${index + 1}`}
                          </p>
                          <p className="text-xs font-semibold text-slate-500">
                            Lecture {index + 1}
                          </p>
                        </div>
                      </div>
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-500 ring-1 ring-slate-200">
                        Locked
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <aside className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-black">Designed for outcomes</h3>
              <div className="mt-5 space-y-4">
                {[
                  [
                    "Structured path",
                    "Learn in the right sequence without guessing what comes next.",
                  ],
                  [
                    "Teacher access",
                    "Request a live doubt session after enrollment.",
                  ],
                  [
                    "Proof of skill",
                    "Finish every lesson and clear assessment for certification.",
                  ],
                ].map(([title, text]) => (
                  <div key={title} className="rounded-2xl bg-slate-50 p-4">
                    <p className="font-black text-slate-900">{title}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      {text}
                    </p>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        )}

        {enrolled && courseDetails.lessons && courseDetails.lessons.length > 0 && (
          <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
            <section className="min-w-0">
              <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                <div>
                  <p className="text-sm font-black uppercase text-teal-700">
                    Course content
                  </p>
                  <h2 className="text-3xl font-black sm:text-4xl">
                    Continue your lessons
                  </h2>
                </div>
                <p className="text-sm font-semibold text-slate-500">
                  {totalLessons} lessons available
                </p>
              </div>

              <div className="space-y-4">
                {courseDetails.lessons.map((lesson, index) => {
                  const isCompleted = completedLessons.includes(lesson.videoId);
                  const isOpen = openLessonIndex === index;

                  return (
                    <div
                      key={lesson.videoId || index}
                      className={`overflow-hidden rounded-[1.5rem] border bg-white shadow-sm transition ${
                        isOpen ? "border-teal-200 shadow-md" : "border-slate-200"
                      }`}
                    >
                      <button
                        className="flex w-full cursor-pointer items-center justify-between gap-4 p-5 text-left transition hover:bg-slate-50"
                        onClick={() => toggleLesson(index)}
                      >
                        <div className="flex min-w-0 items-center gap-4">
                          <div
                            className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl ${
                              isCompleted
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {isCompleted ? (
                              <CheckCircle className="h-6 w-6" />
                            ) : (
                              <PlayCircle className="h-6 w-6" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-black uppercase text-slate-400">
                              Lesson {index + 1}
                            </p>
                            <h3 className="truncate text-lg font-black text-slate-950">
                              {lesson.title}
                            </h3>
                          </div>
                        </div>
                        {isOpen ? (
                          <ChevronUp className="h-6 w-6 flex-shrink-0 text-teal-700" />
                        ) : (
                          <ChevronDown className="h-6 w-6 flex-shrink-0 text-slate-400" />
                        )}
                      </button>

                      {isOpen && (
                        <div className="border-t border-slate-100 bg-slate-50 p-5">
                          <div className="flex flex-col gap-4 rounded-2xl bg-white p-4 ring-1 ring-slate-100 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex min-w-0 items-center gap-3">
                              <PlayCircle className="h-6 w-6 flex-shrink-0 text-rose-600" />
                              <div className="min-w-0">
                                <p className="truncate font-bold text-slate-900">
                                  {lesson.title || `Video ${index + 1}`}
                                </p>
                                <p className="text-sm text-slate-500">
                                  Video lesson
                                </p>
                              </div>
                            </div>
                            <div className="flex flex-col gap-3 sm:flex-row">
                              {lesson.videoUrl && (
                                <button
                                  onClick={() => openLessonVideo(lesson.videoUrl)}
                                  className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-lg active:translate-y-0"
                                >
                                  <PlayCircle className="h-4 w-4" />
                                  Watch
                                </button>
                              )}
                              <button
                                onClick={() =>
                                  !isCompleted && makeItMark(courseId, lesson.videoId)
                                }
                                disabled={isCompleted || markingVideoId === lesson.videoId}
                                className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition ${
                                  isCompleted
                                    ? "cursor-not-allowed bg-emerald-100 text-emerald-700"
                                    : "cursor-pointer bg-teal-600 text-white hover:-translate-y-0.5 hover:bg-teal-700 hover:shadow-lg active:translate-y-0 disabled:cursor-wait disabled:opacity-80"
                                }`}
                              >
                                {markingVideoId === lesson.videoId ? (
                                  <>
                                    <InlineSpinner />
                                    Saving
                                  </>
                                ) : isCompleted ? (
                                  "Completed"
                                ) : (
                                  "Mark Done"
                                )}
                              </button>
                            </div>
                          </div>

                          {lesson.resources?.length > 0 ? (
                            <div className="mt-4 grid gap-3 sm:grid-cols-2">
                              {lesson.resources.map((resource, resIndex) => (
                                <a
                                  key={resIndex}
                                  href={resource || "#"}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 text-sm font-bold text-slate-700 transition hover:-translate-y-0.5 hover:border-teal-200 hover:text-teal-700 hover:shadow-sm"
                                >
                                  <FileText className="h-5 w-5 text-teal-600" />
                                  Resource {resIndex + 1}
                                </a>
                              ))}
                            </div>
                          ) : (
                            <p className="mt-4 rounded-xl bg-white p-3 text-sm font-semibold text-slate-500 ring-1 ring-slate-100">
                              No additional resources available for this lesson.
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            <aside className="h-fit space-y-5 lg:sticky lg:top-24">
              <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                    <MessageCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-black uppercase text-teal-700">
                      Teacher support
                    </p>
                    <h3 className="text-xl font-black text-slate-950">
                      Request live help
                    </h3>
                  </div>
                </div>
                <textarea
                  value={doubtMessage}
                  onChange={(e) => setDoubtMessage(e.target.value)}
                  placeholder="Briefly describe your doubt..."
                  className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-medium text-slate-800 outline-none transition focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-100"
                  rows={4}
                />
                <button
                  onClick={requestDoubtSession}
                  disabled={doubtLoading}
                  className="mt-3 flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-teal-600 py-3.5 font-black text-white shadow-lg shadow-teal-600/20 transition hover:-translate-y-0.5 hover:bg-teal-700 hover:shadow-xl active:translate-y-0 disabled:cursor-wait disabled:opacity-75"
                >
                  {doubtLoading ? (
                    <>
                      <InlineSpinner />
                      Sending Request
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Ask for Video Session
                    </>
                  )}
                </button>

                <div className="mt-5 space-y-3">
                  {doubtSessions.length > 0 ? (
                    doubtSessions.map((session) => (
                      <div
                        key={session._id}
                        className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-sm font-black text-slate-800">
                            {session.status === "LINK_SENT"
                              ? "Session scheduled"
                              : "Request sent"}
                          </span>
                          <span className="text-xs font-bold text-teal-700">
                            {formatSessionTime(session.scheduledAt)}
                          </span>
                        </div>
                        {session.message && (
                          <p className="mt-2 text-sm leading-6 text-slate-600">
                            {session.message}
                          </p>
                        )}
                        {session.status === "LINK_SENT" && session.roomId && (
                          <button
                            onClick={() =>
                              navigate(
                                `/video-chat?room=${encodeURIComponent(
                                  session.roomId,
                                )}`,
                              )
                            }
                            className="mt-3 w-full cursor-pointer rounded-xl bg-emerald-600 py-2.5 font-bold text-white transition hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-lg active:translate-y-0"
                          >
                            Join Video Session
                          </button>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm font-semibold leading-6 text-slate-500">
                      No support requests yet. Send a doubt and your teacher can
                      schedule a video session.
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-black uppercase text-slate-500">
                  Learning dashboard
                </p>
                <h2 className="mt-2 text-2xl font-black">Your progress</h2>
                <div className="mt-5 rounded-2xl bg-slate-950 p-5 text-white">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-sm text-slate-300">Completed</p>
                      <p className="text-3xl font-black">
                        {completedLessons.length}/{totalLessons}
                      </p>
                    </div>
                    <p className="text-3xl font-black text-emerald-300">
                      {Math.round(progressPercentage)}%
                    </p>
                  </div>
                  <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/15">
                    <div
                      className="h-full rounded-full bg-emerald-400 transition-all duration-700"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                </div>
              </div>
            </aside>
          </section>
        )}

        {enrolled && totalLessons > 0 && hasCompleted && (
          <div className="mt-12 rounded-[2rem] border border-emerald-200 bg-emerald-50 p-6 text-center shadow-sm">
            {hasCertificate ? (
              <>
                <h2 className="text-2xl font-black text-emerald-950">
                  Congratulations, you cleared the course.
                </h2>
                <div className="mt-5 flex flex-col justify-center gap-4 sm:flex-row">
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
                    className="cursor-pointer rounded-xl bg-emerald-600 px-6 py-3 font-bold text-white shadow-lg transition hover:bg-emerald-700"
                  >
                    Download Certificate
                  </button>
                  <button
                    onClick={() => setShowFeedbackModal(true)}
                    className="cursor-pointer rounded-xl bg-slate-950 px-6 py-3 font-bold text-white shadow-lg transition hover:bg-slate-800"
                  >
                    Give Feedback
                  </button>
                </div>
              </>
            ) : attempts <= 3 ? (
              <>
                <h2 className="text-2xl font-black text-emerald-950">
                  You completed every lesson.
                </h2>
                <p className="mt-3 text-emerald-700">
                  You are now eligible for the {courseDetails.assessmentType}.
                  You have used {attempts} of 3 attempts.
                </p>
                <button
                  onClick={() =>
                    assessmentController(courseDetails.assessmentType)
                  }
                  className="mt-5 cursor-pointer rounded-xl bg-emerald-600 px-6 py-3 font-bold text-white transition hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-lg active:translate-y-0"
                >
                  Proceed to {courseDetails.assessmentType.toUpperCase()}
                </button>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-black text-red-900">
                  Assessment attempts exhausted.
                </h2>
                <p className="mt-3 text-red-700">
                  You have used all 3 attempts and are no longer eligible to
                  receive the certificate for this course.
                </p>
              </>
            )}
          </div>
        )}

        {enrolled && (
          <div className="mt-12 pb-10">
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-600 shadow-lg">
                <MessageCircle className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-3xl font-black text-slate-900">
                Discussion
              </h2>
            </div>
            <CommentSection courseId={courseId} />
          </div>
        )}
      </main>

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

      {courseDetails?.ratings?.length > 0 && (
        <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500 shadow-lg">
              <Star className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-3xl font-black text-slate-900">Reviews</h2>
          </div>
          <div className="flex flex-col gap-5 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
            {courseDetails.ratings.map((review) => (
              <ReviewCard key={review._id} review={review} />
            ))}
          </div>
        </div>
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
  const [commentPosting, setCommentPosting] = useState(false);
  const [replyPostingId, setReplyPostingId] = useState(null);
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
    if (!newComment.trim() || commentPosting) return;
    if (!token) {
      console.error("Please log in to post a comment.");
      return;
    }

    try {
      setCommentPosting(true);
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
    } finally {
      setCommentPosting(false);
    }
  };

  const handleAddReply = async (commentId) => {
    if (!replyText.trim() || replyPostingId) return;
    if (!token) {
      console.error("Please log in to reply.");
      return;
    }

    try {
      setReplyPostingId(commentId);
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
    } finally {
      setReplyPostingId(null);
    }
  };

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a public comment..."
          className="flex-1 resize-none rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-800 outline-none transition focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-100"
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
          disabled={commentPosting || !newComment.trim()}
          className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-slate-950 px-6 py-3 font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-xl active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 sm:self-start"
        >
          {commentPosting ? (
            <>
              <InlineSpinner />
              Posting
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Comment
            </>
          )}
        </button>
      </div>

      {loading ? (
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 font-semibold text-slate-500">
          <InlineSpinner className="h-5 w-5" />
          Loading comments...
        </div>
      ) : comments.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm font-semibold text-slate-500">
          No comments yet. Be the first to comment!
        </p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div
              key={comment._id}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-teal-600 font-bold text-white">
                  {comment.userID?.username
                    ? comment.userID.username[0].toUpperCase()
                    : "U"}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-black text-slate-900">
                    {comment.userID?.username || "Unknown User"}
                  </p>
                  <p className="mt-1 leading-6 text-slate-700">
                    {comment.text}
                  </p>

                  {userRole === "teacher" && (
                    <button
                      onClick={() =>
                        setReplyingTo(
                          replyingTo === comment._id ? null : comment._id,
                        )
                      }
                      className="mt-2 cursor-pointer text-sm font-bold text-teal-700 transition hover:text-teal-900 hover:underline"
                    >
                      Reply
                    </button>
                  )}

                  {comment.replies?.length > 0 && (
                    <div className="ml-8 mt-3 space-y-2">
                      {comment.replies.map((reply) => (
                        <div
                          key={reply._id}
                          className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-3"
                        >
                          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-slate-800 text-sm font-bold text-white">
                            {reply.user?.username
                              ? reply.user.username[0].toUpperCase()
                              : "U"}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800">
                              {reply.user?.username || "User"}
                            </p>
                            <p className="text-sm leading-6 text-slate-600">
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
                        className="flex-1 rounded-xl border border-slate-200 bg-white p-3 outline-none transition focus:border-teal-400 focus:ring-4 focus:ring-teal-100"
                      />
                      <button
                        onClick={() => handleAddReply(comment._id)}
                        disabled={replyPostingId === comment._id || !replyText.trim()}
                        className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-2 text-sm font-bold text-white shadow transition hover:-translate-y-0.5 hover:bg-teal-700 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {replyPostingId === comment._id ? (
                          <>
                            <InlineSpinner />
                            Replying
                          </>
                        ) : (
                          "Reply"
                        )}
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
    } catch {
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
          className="absolute right-4 top-4 cursor-pointer rounded-full bg-red-500 p-2 text-white transition hover:-translate-y-0.5 hover:bg-red-600 hover:shadow-lg active:translate-y-0"
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
            className="mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 py-3 font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:from-blue-700 hover:to-cyan-700 hover:shadow-xl active:translate-y-0 disabled:cursor-wait disabled:opacity-75"
          >
            {submitting ? (
              <>
                <InlineSpinner />
                Submitting
              </>
            ) : (
              "Submit Feedback"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const ReviewCard = ({ review }) => {
  const rating = review?.rating || 0;

  return (
    <div className="border border-gray-200 rounded-2xl p-5 bg-white shadow-sm hover:shadow-md transition-all duration-200">
      {/* Header */}
      <div className="flex items-center gap-4 mb-3">
        {/* Avatar */}
        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 text-white flex items-center justify-center rounded-full font-semibold text-sm">
          {review?.student?.profilePicture ? (
            <img
              src={review.student.profilePicture}
              alt={review.student.username}
              className="w-full h-full object-cover rounded-full"
            />
          ) : review?.student?.username ? (
            review.student.username[0].toUpperCase()
          ) : (
            "U"
          )}
        </div>

        {/* Name */}
        <div>
          <h3 className="font-semibold text-gray-800">
            {review?.student?.username || "User"}
          </h3>
          <p className="text-gray-400 text-xs">
            {review?.createdAt
              ? new Date(review.createdAt).toLocaleDateString()
              : "Recently"}
          </p>
        </div>
      </div>

      {/* ⭐ Rating */}
      <div className="flex items-center gap-1 mb-3">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={`${
              star <= Math.round(rating)
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
        <span className="text-sm text-gray-500 ml-2">{rating.toFixed(1)}</span>
      </div>

      {/* Comment */}
      <p className="text-gray-600 text-sm leading-relaxed">
        {review?.feedback || "No feedback provided."}
      </p>
    </div>
  );
};

export default StudentCourseDetails1;
