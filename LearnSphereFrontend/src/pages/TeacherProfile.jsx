import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  Award,
  BookOpen,
  BriefcaseBusiness,
  ChevronRight,
  Clock,
  GraduationCap,
  Loader2,
  Mail,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
} from "lucide-react";

const fallbackAvatar =
  "https://t4.ftcdn.net/jpg/03/64/21/11/360_F_364211147_1qgLVxv1Tcq0Ohz3FawUfrtONzz8nq3e.jpg";

const fallbackCourseImage =
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=900";

const getTeacherRating = (teacher) =>
  Number(teacher?.teacherDetails?.rating ?? teacher?.rating ?? 0);

const getCourseRating = (course) =>
  Number(course?.overallRating ?? course?.rating ?? 0);

const getLearnerCount = (courses) =>
  courses.reduce((total, course) => total + (course?.students?.length || 0), 0);

const getLessonCount = (courses) =>
  courses.reduce((total, course) => total + (course?.lessons?.length || 0), 0);

const InfoTile = ({ icon, label, value }) => (
  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
    <div className="flex items-center gap-2 text-teal-700">{icon}</div>
    <p className="mt-3 text-xs font-black uppercase text-slate-400">{label}</p>
    <p className="mt-1 line-clamp-2 font-black text-slate-900">{value}</p>
  </div>
);

const LoadingView = () => (
  <div className="flex min-h-screen items-center justify-center bg-[#f7f8fb] px-4">
    <div className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-2xl">
      <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-teal-50">
        <Loader2 className="h-10 w-10 animate-spin text-teal-700" />
        <Sparkles className="absolute -right-1 -top-1 h-6 w-6 text-amber-500" />
      </div>
      <h2 className="mt-6 text-2xl font-black text-slate-950">
        Loading teacher profile
      </h2>
      <p className="mt-2 text-sm font-semibold text-slate-500">
        Preparing mentor details, courses, and learning stats.
      </p>
    </div>
  </div>
);

export default function TeacherProfile() {
  const { teacherId } = useParams();
  const navigate = useNavigate();

  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openingCourseId, setOpeningCourseId] = useState(null);

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/teacher/${teacherId}/details`,
        );

        setTeacher(res.data.data);
      } catch (err) {
        console.error(err);
        setError("Could not load this teacher profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeacher();
  }, [teacherId]);

  const details = teacher?.teacherDetails || {};
  const courses = useMemo(() => teacher?.courses || [], [teacher]);
  const approvedCourses = useMemo(
    () =>
      courses
        .filter((course) => !course.status || course.status === "APPROVED")
        .sort((a, b) => getCourseRating(b) - getCourseRating(a)),
    [courses],
  );

  const teacherRating = getTeacherRating(teacher);
  const learnerCount = getLearnerCount(approvedCourses);
  const lessonCount = getLessonCount(approvedCourses);
  const topCourse = approvedCourses[0];
  const topics = Array.from(
    new Set(approvedCourses.map((course) => course.topic).filter(Boolean)),
  ).slice(0, 5);

  const openCourse = (courseId) => {
    setOpeningCourseId(courseId);
    navigate(`/student/course-details/${courseId}`);
  };

  if (loading) return <LoadingView />;

  if (error || !teacher) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f8fb] px-4">
        <div className="max-w-md rounded-[2rem] border border-rose-100 bg-white p-8 text-center shadow-xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-50">
            <Award className="h-8 w-8 text-rose-600" />
          </div>
          <h2 className="mt-5 text-2xl font-black text-slate-950">
            Teacher not found
          </h2>
          <p className="mt-2 text-sm font-semibold text-slate-500">
            {error || "This teacher profile is not available."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f8fb] text-slate-950">
      <section className="relative overflow-hidden bg-slate-950 px-4 pt-28 pb-14 text-white sm:px-6 lg:pt-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(20,184,166,0.24),transparent_34%),radial-gradient(circle_at_86%_14%,rgba(245,158,11,0.18),transparent_28%),linear-gradient(135deg,#020617_0%,#111827_58%,#042f2e_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#f7f8fb] to-transparent" />

        <div className="relative z-10 mx-auto grid max-w-7xl gap-8 lg:grid-cols-[minmax(0,1fr)_390px] lg:items-end">
          <div>
            <div className="mb-6 flex flex-wrap items-center gap-3 text-sm font-bold">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-teal-100 backdrop-blur">
                <ShieldCheck className="h-4 w-4" />
                {details.approved || "Verified"} educator
              </span>
              {details.specialization && (
                <span className="rounded-full border border-amber-300/25 bg-amber-400/15 px-4 py-2 text-amber-100">
                  {details.specialization}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              <img
                src={teacher.profilePicture || fallbackAvatar}
                alt={teacher.username}
                className="h-28 w-28 rounded-[2rem] object-cover ring-4 ring-white/10"
              />
              <div className="min-w-0">
                <h1 className="text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
                  {teacher.username}
                </h1>
                <div className="mt-4 flex flex-wrap items-center gap-3 text-slate-300">
                  <span className="inline-flex items-center gap-2">
                    <Mail className="h-4 w-4 text-teal-200" />
                    {teacher.email}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <BriefcaseBusiness className="h-4 w-4 text-amber-200" />
                    {details.experience
                      ? `${details.experience} years experience`
                      : "Experience updating soon"}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8 grid max-w-4xl gap-3 sm:grid-cols-4">
              {[
                {
                  label: "Rating",
                  value: teacherRating ? teacherRating.toFixed(1) : "New",
                  icon: <Star className="h-5 w-5 fill-amber-300 text-amber-300" />,
                },
                {
                  label: "Courses",
                  value: approvedCourses.length,
                  icon: <BookOpen className="h-5 w-5 text-teal-200" />,
                },
                {
                  label: "Learners",
                  value: learnerCount,
                  icon: <Users className="h-5 w-5 text-sky-200" />,
                },
                {
                  label: "Lessons",
                  value: lessonCount,
                  icon: <PlayCircle className="h-5 w-5 text-emerald-200" />,
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
              Mentor snapshot
            </p>
            <div className="mt-4 grid gap-3">
              <InfoTile
                icon={<GraduationCap className="h-5 w-5" />}
                label="Qualification"
                value={details.qualification || "Not shared yet"}
              />
              <InfoTile
                icon={<Award className="h-5 w-5" />}
                label="Top course"
                value={topCourse?.title || "Courses coming soon"}
              />
            </div>
            {topics.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {topics.map((topic) => (
                  <span
                    key={topic}
                    className="rounded-full bg-teal-50 px-3 py-1 text-xs font-black text-teal-700 ring-1 ring-teal-100"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            )}
          </aside>
        </div>
      </section>

      <main className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[340px_minmax(0,1fr)]">
        <aside className="h-fit rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-24">
          <div className="text-center">
            <img
              src={teacher.profilePicture || fallbackAvatar}
              alt={teacher.username}
              className="mx-auto h-24 w-24 rounded-[1.5rem] object-cover ring-4 ring-teal-50"
            />
            <h2 className="mt-4 text-2xl font-black">{teacher.username}</h2>
            <p className="mt-1 text-sm font-semibold text-slate-500">
              {details.specialization || "LearnSphere educator"}
            </p>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <InfoTile
              icon={<Clock className="h-5 w-5" />}
              label="Experience"
              value={details.experience ? `${details.experience} yrs` : "New"}
            />
            <InfoTile
              icon={<Star className="h-5 w-5 fill-amber-400 text-amber-400" />}
              label="Rating"
              value={teacherRating ? teacherRating.toFixed(1) : "New"}
            />
          </div>

          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-black uppercase text-slate-400">
              Profile status
            </p>
            <p className="mt-2 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm font-black capitalize text-emerald-700 ring-1 ring-emerald-100">
              <ShieldCheck className="h-4 w-4" />
              {details.approved || "active"}
            </p>
          </div>
        </aside>

        <section className="min-w-0">
          <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-black uppercase text-teal-700">
                Course portfolio
              </p>
              <h2 className="text-3xl font-black sm:text-4xl">
                Courses by {teacher.username}
              </h2>
            </div>
            <p className="text-sm font-bold text-slate-500">
              {approvedCourses.length} courses available
            </p>
          </div>

          {approvedCourses.length === 0 ? (
            <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
              <BookOpen className="mx-auto h-12 w-12 text-slate-300" />
              <h3 className="mt-4 text-2xl font-black text-slate-900">
                No courses published yet
              </h3>
              <p className="mt-2 text-slate-500">
                This teacher has not published approved courses yet.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {approvedCourses.map((course) => {
                const rating = getCourseRating(course);
                const isOpening = openingCourseId === course._id;

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
                      {course.topic && (
                        <span className="absolute left-4 top-4 rounded-full border border-white/15 bg-white/90 px-3 py-1 text-xs font-black text-slate-900 shadow-lg">
                          {course.topic}
                        </span>
                      )}
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="line-clamp-2 text-xl font-black leading-6 text-white">
                          {course.title}
                        </h3>
                      </div>
                    </div>

                    <div className="p-5">
                      <p className="line-clamp-3 min-h-16 text-sm leading-6 text-slate-600">
                        {course.description ||
                          "A practical course designed to build job-ready skills."}
                      </p>

                      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                        <div className="rounded-2xl bg-amber-50 p-3">
                          <Star className="mx-auto h-5 w-5 fill-amber-400 text-amber-400" />
                          <p className="mt-1 text-sm font-black">
                            {rating ? rating.toFixed(1) : "New"}
                          </p>
                        </div>
                        <div className="rounded-2xl bg-teal-50 p-3">
                          <PlayCircle className="mx-auto h-5 w-5 text-teal-700" />
                          <p className="mt-1 text-sm font-black">
                            {course.lessons?.length || 0}
                          </p>
                        </div>
                        <div className="rounded-2xl bg-slate-100 p-3">
                          <Users className="mx-auto h-5 w-5 text-slate-700" />
                          <p className="mt-1 text-sm font-black">
                            {course.students?.length || 0}
                          </p>
                        </div>
                      </div>

                      <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
                        <div className="min-w-0">
                          <p className="text-xs font-black uppercase text-slate-400">
                            Price
                          </p>
                          <p className="mt-0.5 text-lg font-black text-slate-950">
                            Rs.{" "}
                            <span className="text-xl">
                              {Number(course.price || 0).toLocaleString("en-IN")}
                            </span>
                          </p>
                        </div>
                        <button
                          onClick={() => openCourse(course._id)}
                          disabled={isOpening}
                          className="flex h-10 flex-shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-slate-950 px-3.5 text-xs font-black text-white shadow-md transition hover:-translate-y-0.5 hover:bg-teal-700 hover:shadow-lg active:translate-y-0 disabled:cursor-wait disabled:opacity-75"
                        >
                          {isOpening ? (
                            <>
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              Opening
                            </>
                          ) : (
                            <>
                              View
                              <ChevronRight className="h-3.5 w-3.5" />
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
      </main>
    </div>
  );
}
