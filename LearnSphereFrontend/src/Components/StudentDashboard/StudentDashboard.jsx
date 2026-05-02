import axios from "axios";
import {
  ArrowRight,
  Bell,
  BookOpen,
  CalendarClock,
  CheckCircle,
  GraduationCap,
  Loader2,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  Star,
  Trophy,
  Users,
  Video,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const fallbackCourseImage =
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=900";

const InlineSpinner = ({ className = "h-4 w-4" }) => (
  <Loader2 className={`${className} animate-spin`} />
);

const StatCard = ({ icon, label, value, tone = "teal" }) => {
  const tones = {
    teal: "bg-teal-50 text-teal-700",
    amber: "bg-amber-50 text-amber-700",
    emerald: "bg-emerald-50 text-emerald-700",
    slate: "bg-slate-100 text-slate-700",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div
        className={`flex h-11 w-11 items-center justify-center rounded-2xl ${tones[tone]}`}
      >
        {icon}
      </div>
      <p className="mt-4 text-2xl font-black text-slate-950">{value}</p>
      <p className="mt-1 text-sm font-semibold text-slate-500">{label}</p>
    </div>
  );
};

const CourseSkeleton = () => (
  <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm">
    <div className="h-52 animate-pulse bg-slate-200" />
    <div className="space-y-4 p-5">
      <div className="h-5 w-3/4 animate-pulse rounded-full bg-slate-200" />
      <div className="h-4 w-full animate-pulse rounded-full bg-slate-100" />
      <div className="h-4 w-2/3 animate-pulse rounded-full bg-slate-100" />
      <div className="grid grid-cols-3 gap-2">
        <div className="h-16 animate-pulse rounded-2xl bg-slate-100" />
        <div className="h-16 animate-pulse rounded-2xl bg-slate-100" />
        <div className="h-16 animate-pulse rounded-2xl bg-slate-100" />
      </div>
    </div>
  </div>
);

const StudentDashboard = () => {
  const [feed, setFeed] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openingTarget, setOpeningTarget] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    let isMounted = true;

    const fetchCourses = async () => {
      try {
        if (!token) {
          setError("No token found. Please login again.");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/student/my-courses`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (isMounted) {
          setFeed(response.data.registeredCourses || []);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.response?.data?.message || "Failed to fetch courses.");
          setLoading(false);
        }
      }
    };

    const fetchNotifications = async () => {
      try {
        if (!token) return;

        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/student/doubt-session/notifications`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (isMounted && response.data.success) {
          setNotifications(response.data.notifications || []);
        }
      } catch (err) {
        console.error("Error fetching doubt notifications:", err);
      }
    };

    fetchCourses();
    fetchNotifications();

    return () => {
      isMounted = false;
    };
  }, [token]);

  const formatSessionTime = (value) => {
    if (!value) return "Time not set";

    return new Date(value).toLocaleString([], {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const stats = useMemo(() => {
    const completed = feed.filter((course) => course.isValidforCertificate).length;
    const pending = Math.max(feed.length - completed, 0);
    const averageRating =
      feed.length > 0
        ? (
            feed.reduce(
              (sum, course) => sum + Number(course.overallRating || 0),
              0,
            ) / feed.length
          ).toFixed(1)
        : "0.0";

    return { completed, pending, averageRating };
  }, [feed]);

  const goTo = (target, path) => {
    setOpeningTarget(target);
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-[#f7f8fb] text-slate-950">
      <section className="relative overflow-hidden bg-slate-950 px-4 pt-28 pb-14 text-white sm:px-6 lg:pt-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(20,184,166,0.24),transparent_34%),radial-gradient(circle_at_84%_14%,rgba(245,158,11,0.18),transparent_28%),linear-gradient(135deg,#020617_0%,#111827_58%,#042f2e_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#f7f8fb] to-transparent" />

        <div className="relative z-10 mx-auto grid max-w-7xl gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-end">
          <div>
            <div className="mb-6 flex flex-wrap items-center gap-3 text-sm font-bold">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-teal-100 backdrop-blur">
                <Sparkles className="h-4 w-4" />
                Student workspace
              </span>
              <span className="rounded-full border border-amber-300/25 bg-amber-400/15 px-4 py-2 text-amber-100">
                Premium learning dashboard
              </span>
            </div>

            <h1 className="max-w-4xl text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
              Continue your courses with a focused learning command center.
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
              Track enrolled courses, pending assessments, certificates, and
              teacher video sessions from one polished workspace.
            </p>

            <div className="mt-8 grid max-w-4xl gap-3 sm:grid-cols-4">
              {[
                {
                  label: "Enrolled",
                  value: feed.length,
                  icon: <BookOpen className="h-5 w-5 text-teal-200" />,
                },
                {
                  label: "Completed",
                  value: stats.completed,
                  icon: <Trophy className="h-5 w-5 text-amber-200" />,
                },
                {
                  label: "Pending",
                  value: stats.pending,
                  icon: <CalendarClock className="h-5 w-5 text-sky-200" />,
                },
                {
                  label: "Avg rating",
                  value: stats.averageRating,
                  icon: <Star className="h-5 w-5 fill-amber-300 text-amber-300" />,
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur"
                >
                  <div className="flex items-center gap-2">
                    {stat.icon}
                    <span className="text-2xl font-black">{stat.value}</span>
                  </div>
                  <p className="mt-1 text-sm text-slate-300">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <aside className="rounded-[2rem] border border-white/10 bg-white p-5 text-slate-950 shadow-2xl">
            <p className="text-sm font-black uppercase text-teal-700">
              Today&apos;s focus
            </p>
            <h2 className="mt-2 text-2xl font-black">
              {notifications.length > 0
                ? `${notifications.length} support update${notifications.length > 1 ? "s" : ""}`
                : feed.length > 0
                  ? "Resume your latest course"
                  : "Start your first course"}
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              {notifications.length > 0
                ? "Your teacher has updates for doubt sessions. Review them below."
                : "Your active courses and next actions are available below."}
            </p>
            <button
              onClick={() => goTo("catalogue", "/student/feed")}
              className="mt-5 flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3.5 font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-teal-700 hover:shadow-xl active:translate-y-0"
            >
              Browse Catalogue
              <ArrowRight className="h-5 w-5" />
            </button>
          </aside>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        {loading && (
          <div>
            <div className="mb-8 flex items-center gap-3 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50">
                <InlineSpinner className="h-6 w-6 text-teal-700" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-950">
                  Syncing your curriculum
                </h2>
                <p className="text-sm font-semibold text-slate-500">
                  Fetching enrolled courses and teacher updates.
                </p>
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <CourseSkeleton key={index} />
              ))}
            </div>
          </div>
        )}

        {!loading && error && (
          <div className="mx-auto max-w-md rounded-[2rem] border border-rose-100 bg-white p-8 text-center shadow-xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-50">
              <ShieldCheck className="h-8 w-8 text-rose-600" />
            </div>
            <h3 className="mt-5 text-2xl font-black text-slate-900">
              Sync failed
            </h3>
            <p className="mt-2 text-sm font-semibold text-slate-500">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-xl active:translate-y-0"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && (
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
            <section className="min-w-0 space-y-10">
              {notifications.length > 0 && (
                <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                  <div className="mb-5 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-black uppercase text-teal-700">
                        Teacher support
                      </p>
                      <h2 className="text-2xl font-black text-slate-950">
                        Doubt session notifications
                      </h2>
                    </div>
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-600 text-sm font-black text-white shadow-lg">
                      {notifications.length}
                    </span>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    {notifications.map((item) => {
                      const courseTarget = `course-${item._id}`;
                      const videoTarget = `video-${item._id}`;

                      return (
                        <div
                          key={item._id}
                          className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-white text-teal-700 shadow-sm">
                              <Bell className="h-5 w-5" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-black text-slate-950">
                                {item.status === "LINK_SENT"
                                  ? "Video session ready"
                                  : "Request sent"}
                              </p>
                              <p className="mt-1 line-clamp-1 text-sm font-semibold text-slate-600">
                                {item.course?.title || "Course"}
                              </p>
                              <p className="mt-1 text-sm text-slate-500">
                                Teacher: {item.teacher?.username || "Teacher"}
                              </p>
                              {item.status === "LINK_SENT" && (
                                <p className="mt-2 text-sm font-bold text-teal-700">
                                  {formatSessionTime(item.scheduledAt)}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="mt-4 flex flex-wrap gap-2">
                            <button
                              onClick={() =>
                                goTo(
                                  courseTarget,
                                  `/student/course-details/${item.course?._id}`,
                                )
                              }
                              className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-black text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:border-teal-200 hover:text-teal-700 hover:shadow-md active:translate-y-0"
                            >
                              {openingTarget === courseTarget ? (
                                <>
                                  <InlineSpinner />
                                  Opening
                                </>
                              ) : (
                                "Open Course"
                              )}
                            </button>
                            {item.status === "LINK_SENT" && item.roomId && (
                              <button
                                onClick={() =>
                                  goTo(
                                    videoTarget,
                                    `/video-chat?room=${encodeURIComponent(
                                      item.roomId,
                                    )}`,
                                  )
                                }
                                className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-teal-700 hover:shadow-xl active:translate-y-0"
                              >
                                {openingTarget === videoTarget ? (
                                  <>
                                    <InlineSpinner />
                                    Joining
                                  </>
                                ) : (
                                  <>
                                    <Video className="h-4 w-4" />
                                    Join
                                  </>
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

              <section>
                <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                  <div>
                    <p className="text-sm font-black uppercase text-teal-700">
                      My learning
                    </p>
                    <h2 className="text-3xl font-black sm:text-4xl">
                      Enrolled courses
                    </h2>
                  </div>
                  <p className="text-sm font-bold text-slate-500">
                    {feed.length} course{feed.length === 1 ? "" : "s"}
                  </p>
                </div>

                {feed.length === 0 ? (
                  <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
                    <BookOpen className="mx-auto h-12 w-12 text-slate-300" />
                    <h3 className="mt-4 text-2xl font-black text-slate-900">
                      No courses yet
                    </h3>
                    <p className="mt-2 text-slate-500">
                      Start your learning journey by exploring available courses.
                    </p>
                    <button
                      onClick={() => goTo("empty-catalogue", "/student/feed")}
                      className="mt-6 inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-slate-950 px-6 py-3 font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-teal-700 hover:shadow-xl active:translate-y-0"
                    >
                      Browse Catalogue
                      <ArrowRight className="h-5 w-5" />
                    </button>
                  </div>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {feed.map((course) => {
                      const courseTarget = `course-card-${course._id}`;

                      return (
                        <article
                          key={course._id}
                          className="group overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-teal-200 hover:shadow-2xl"
                        >
                          <div className="relative h-52 overflow-hidden bg-slate-900">
                            <img
                              src={course.thumbnail || fallbackCourseImage}
                              alt={course.title}
                              className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/15 to-transparent" />
                            <span className="absolute left-4 top-4 rounded-full border border-white/15 bg-white/90 px-3 py-1 text-xs font-black text-slate-900 shadow-lg">
                              Course
                            </span>
                            <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-black/70 px-3 py-1 text-xs font-black text-white backdrop-blur">
                              <Star className="h-3.5 w-3.5 fill-amber-300 text-amber-300" />
                              {Number(course.overallRating || 0).toFixed(1)}
                            </span>
                            <div className="absolute bottom-4 left-4 right-4">
                              <h3 className="line-clamp-2 text-xl font-black leading-6 text-white">
                                {course.title}
                              </h3>
                              <p className="mt-1 text-sm font-semibold text-slate-300">
                                by {course.teacherName || "LearnSphere teacher"}
                              </p>
                            </div>
                          </div>

                          <div className="p-5">
                            <p className="line-clamp-2 min-h-12 text-sm leading-6 text-slate-600">
                              {course.description ||
                                "Continue your structured learning path."}
                            </p>

                            <div className="mt-4 flex flex-wrap gap-2">
                              {course.isValidforCertificate ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700 ring-1 ring-emerald-100">
                                  <CheckCircle className="h-3.5 w-3.5" />
                                  Certificate eligible
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-black text-amber-700 ring-1 ring-amber-100">
                                  <CalendarClock className="h-3.5 w-3.5" />
                                  Assessment pending
                                </span>
                              )}
                              {course.dateOfCompletion && (
                                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                                  {new Date(
                                    course.dateOfCompletion,
                                  ).toLocaleDateString(undefined, {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </span>
                              )}
                            </div>

                            <div className="mt-5 grid grid-cols-3 gap-2 text-center">
                              <div className="rounded-2xl bg-teal-50 p-3">
                                <GraduationCap className="mx-auto h-5 w-5 text-teal-700" />
                                <p className="mt-1 text-xs font-black text-slate-800">
                                  Course
                                </p>
                              </div>
                              <div className="rounded-2xl bg-amber-50 p-3">
                                <Trophy className="mx-auto h-5 w-5 text-amber-700" />
                                <p className="mt-1 text-xs font-black text-slate-800">
                                  Cert
                                </p>
                              </div>
                              <div className="rounded-2xl bg-slate-100 p-3">
                                <Users className="mx-auto h-5 w-5 text-slate-700" />
                                <p className="mt-1 text-xs font-black text-slate-800">
                                  Active
                                </p>
                              </div>
                            </div>

                            <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
                              <div className="flex min-w-0 items-center gap-3">
                                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-teal-50 text-teal-700">
                                  {course.teacherPhoto ? (
                                    <img
                                      src={course.teacherPhoto}
                                      alt={course.teacherName}
                                      className="h-full w-full object-cover"
                                    />
                                  ) : (
                                    <span className="text-sm font-black">
                                      {course.teacherName?.charAt(0) || "T"}
                                    </span>
                                  )}
                                </div>
                                <p className="truncate text-sm font-bold text-slate-700">
                                  {course.teacherName || "Teacher"}
                                </p>
                              </div>

                              <button
                                onClick={() =>
                                  goTo(
                                    courseTarget,
                                    `/student/course-details/${course._id}`,
                                  )
                                }
                                className="flex h-10 flex-shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-slate-950 px-3.5 text-xs font-black text-white shadow-md transition hover:-translate-y-0.5 hover:bg-teal-700 hover:shadow-lg active:translate-y-0"
                              >
                                {openingTarget === courseTarget ? (
                                  <>
                                    <InlineSpinner className="h-3.5 w-3.5" />
                                    Opening
                                  </>
                                ) : (
                                  <>
                                    Continue
                                    <ArrowRight className="h-3.5 w-3.5" />
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                )}
              </section>
            </section>

            <aside className="h-fit space-y-5 lg:sticky lg:top-24">
              <StatCard
                icon={<BookOpen className="h-5 w-5" />}
                label="Total enrolled courses"
                value={feed.length}
                tone="teal"
              />
              <StatCard
                icon={<Trophy className="h-5 w-5" />}
                label="Certificate-ready courses"
                value={stats.completed}
                tone="amber"
              />
              <StatCard
                icon={<CalendarClock className="h-5 w-5" />}
                label="Assessments pending"
                value={stats.pending}
                tone="slate"
              />
            </aside>
          </div>
        )}
      </main>
    </div>
  );
};

export default StudentDashboard;
