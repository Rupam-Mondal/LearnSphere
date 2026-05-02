import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Award,
  BookOpen,
  ChevronRight,
  GraduationCap,
  Loader2,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  X,
} from "lucide-react";

const fallbackAvatar =
  "https://t4.ftcdn.net/jpg/03/64/21/11/360_F_364211147_1qgLVxv1Tcq0Ohz3FawUfrtONzz8nq3e.jpg";

const ratingOptions = [
  { label: "All ratings", value: "all" },
  { label: "4.5+ premium", value: "4.5" },
  { label: "4+ top rated", value: "4" },
  { label: "3+ trusted", value: "3" },
];

const getTeacherRating = (teacher) =>
  Number(teacher?.teacherDetails?.rating ?? teacher?.rating ?? 0);

const getCourseCount = (teacher) => teacher?.courses?.length || 0;

const getLearnerCount = (teacher) =>
  (teacher?.courses || []).reduce(
    (total, course) => total + (course?.students?.length || 0),
    0,
  );

const getSpecialization = (teacher) =>
  teacher?.teacherDetails?.specialization || "Expert educator";

const TeacherSkeleton = () => (
  <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm">
    <div className="h-52 animate-pulse bg-slate-200" />
    <div className="space-y-4 p-5">
      <div className="h-5 w-2/3 animate-pulse rounded-full bg-slate-200" />
      <div className="h-4 w-full animate-pulse rounded-full bg-slate-100" />
      <div className="grid grid-cols-3 gap-2">
        <div className="h-16 animate-pulse rounded-2xl bg-slate-100" />
        <div className="h-16 animate-pulse rounded-2xl bg-slate-100" />
        <div className="h-16 animate-pulse rounded-2xl bg-slate-100" />
      </div>
    </div>
  </div>
);

export default function Teachers() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ratingFilter, setRatingFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/teacher/all_teachers`,
        );

        const sorted = (response.data.teachers || []).sort((a, b) => {
          const ratingDelta = getTeacherRating(b) - getTeacherRating(a);
          return ratingDelta || getCourseCount(b) - getCourseCount(a);
        });

        setTeachers(sorted);
      } catch (error) {
        console.error("Error fetching teachers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  const categories = useMemo(
    () =>
      Array.from(
        new Set(
          teachers.flatMap((teacher) =>
            (teacher.courses || []).map(
              (course) => course.category || course.topic,
            ),
          ),
        ),
      ).filter(Boolean),
    [teachers],
  );

  const filteredTeachers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return teachers.filter((teacher) => {
      const courses = teacher.courses || [];
      const searchable = [
        teacher.username,
        teacher.email,
        getSpecialization(teacher),
        ...courses.map((course) => course.title),
        ...courses.map((course) => course.topic),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = !query || searchable.includes(query);
      const matchesRating =
        ratingFilter === "all" ||
        getTeacherRating(teacher) >= Number(ratingFilter);
      const matchesCategory =
        categoryFilter === "all" ||
        courses.some(
          (course) =>
            course.category === categoryFilter || course.topic === categoryFilter,
        );

      return matchesSearch && matchesRating && matchesCategory;
    });
  }, [teachers, ratingFilter, categoryFilter, searchQuery]);

  const totalCourses = teachers.reduce(
    (total, teacher) => total + getCourseCount(teacher),
    0,
  );
  const totalLearners = teachers.reduce(
    (total, teacher) => total + getLearnerCount(teacher),
    0,
  );
  const featuredTeacher = teachers[0];

  const resetFilters = () => {
    setRatingFilter("all");
    setCategoryFilter("all");
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-[#f7f8fb] text-slate-950">
      <section className="relative overflow-hidden bg-slate-950 px-4 pt-28 pb-14 text-white sm:px-6 lg:pt-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_20%,rgba(20,184,166,0.22),transparent_32%),radial-gradient(circle_at_88%_18%,rgba(245,158,11,0.18),transparent_26%),linear-gradient(135deg,#020617_0%,#111827_58%,#042f2e_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#f7f8fb] to-transparent" />

        <div className="relative z-10 mx-auto grid max-w-7xl gap-8 lg:grid-cols-[minmax(0,1fr)_390px] lg:items-end">
          <div>
            <div className="mb-6 flex flex-wrap items-center gap-3 text-sm font-bold">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-teal-100 backdrop-blur">
                <Sparkles className="h-4 w-4" />
                Premium mentors
              </span>
              <span className="rounded-full border border-amber-300/25 bg-amber-400/15 px-4 py-2 text-amber-100">
                Verified teaching profiles
              </span>
            </div>

            <h1 className="max-w-4xl text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
              Learn from educators who ship real outcomes.
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
              Browse specialists by rating, topic, course portfolio, and learner
              traction. Pick the teacher whose expertise matches your next skill.
            </p>

            <div className="mt-8 grid max-w-3xl gap-3 sm:grid-cols-3">
              {[
                {
                  label: "Teachers",
                  value: teachers.length,
                  icon: <Users className="h-5 w-5" />,
                },
                {
                  label: "Courses",
                  value: totalCourses,
                  icon: <BookOpen className="h-5 w-5" />,
                },
                {
                  label: "Learners",
                  value: totalLearners,
                  icon: <GraduationCap className="h-5 w-5" />,
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur"
                >
                  <div className="flex items-center gap-2 text-teal-200">
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
              Featured educator
            </p>
            {featuredTeacher ? (
              <div className="mt-4">
                <div className="flex items-center gap-4">
                  <img
                    src={featuredTeacher.profilePicture || fallbackAvatar}
                    alt={featuredTeacher.username}
                    className="h-16 w-16 rounded-2xl object-cover ring-4 ring-teal-50"
                  />
                  <div className="min-w-0">
                    <h2 className="truncate text-xl font-black">
                      {featuredTeacher.username}
                    </h2>
                    <p className="truncate text-sm font-semibold text-slate-500">
                      {getSpecialization(featuredTeacher)}
                    </p>
                  </div>
                </div>
                <div className="mt-5 grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-2xl bg-amber-50 p-3">
                    <Star className="mx-auto h-5 w-5 fill-amber-400 text-amber-400" />
                    <p className="mt-1 text-sm font-black">
                      {getTeacherRating(featuredTeacher).toFixed(1)}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-teal-50 p-3">
                    <BookOpen className="mx-auto h-5 w-5 text-teal-700" />
                    <p className="mt-1 text-sm font-black">
                      {getCourseCount(featuredTeacher)}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-slate-100 p-3">
                    <Users className="mx-auto h-5 w-5 text-slate-700" />
                    <p className="mt-1 text-sm font-black">
                      {getLearnerCount(featuredTeacher)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() =>
                    navigate(`/student/teacher/${featuredTeacher._id}`)
                  }
                  className="mt-5 flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3.5 font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-xl active:translate-y-0"
                >
                  View Profile
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="mt-4 rounded-2xl bg-slate-50 p-5 text-sm font-semibold text-slate-500">
                Teacher highlights will appear here once profiles are available.
              </div>
            )}
          </aside>
        </div>
      </section>

      <main className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="h-fit rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-24">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-black uppercase text-teal-700">
                Find your mentor
              </p>
              <h2 className="mt-1 text-2xl font-black">Refine results</h2>
            </div>
            <ShieldCheck className="h-7 w-7 text-teal-700" />
          </div>

          <div className="mt-6 space-y-5">
            <label className="block">
              <span className="text-sm font-bold text-slate-600">Search</span>
              <div className="relative mt-2">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Name, topic, course..."
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-10 font-semibold text-slate-800 outline-none transition focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-100"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-200 hover:text-slate-700"
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </label>

            <label className="block">
              <span className="text-sm font-bold text-slate-600">Rating</span>
              <select
                value={ratingFilter}
                onChange={(event) => setRatingFilter(event.target.value)}
                className="mt-2 w-full cursor-pointer rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-slate-800 outline-none transition focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-100"
              >
                {ratingOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            {categories.length > 0 && (
              <label className="block">
                <span className="text-sm font-bold text-slate-600">Topic</span>
                <select
                  value={categoryFilter}
                  onChange={(event) => setCategoryFilter(event.target.value)}
                  className="mt-2 w-full cursor-pointer rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-slate-800 outline-none transition focus:border-teal-400 focus:bg-white focus:ring-4 focus:ring-teal-100"
                >
                  <option value="all">All topics</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>
            )}

            <button
              onClick={resetFilters}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 font-black text-slate-800 transition hover:-translate-y-0.5 hover:border-teal-200 hover:bg-teal-50 hover:text-teal-800 hover:shadow-sm active:translate-y-0"
            >
              Reset Filters
            </button>
          </div>
        </aside>

        <section className="min-w-0">
          <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-black uppercase text-teal-700">
                Educator directory
              </p>
              <h2 className="text-3xl font-black sm:text-4xl">
                {filteredTeachers.length} matching teachers
              </h2>
            </div>
            <p className="text-sm font-bold text-slate-500">
              Showing {filteredTeachers.length} of {teachers.length}
            </p>
          </div>

          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <TeacherSkeleton key={index} />
              ))}
            </div>
          ) : filteredTeachers.length === 0 ? (
            <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
              <Award className="mx-auto h-12 w-12 text-slate-300" />
              <h3 className="mt-4 text-2xl font-black text-slate-900">
                No teachers found
              </h3>
              <p className="mt-2 text-slate-500">
                Try a different topic, rating, or teacher name.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filteredTeachers.map((teacher) => {
                const rating = getTeacherRating(teacher);
                const courses = teacher.courses || [];
                const topCourse = courses[0];

                return (
                  <article
                    key={teacher._id}
                    className="group overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-teal-200 hover:shadow-2xl"
                  >
                    <div className="relative h-56 overflow-hidden bg-slate-900">
                      <img
                        src={teacher.profilePicture || fallbackAvatar}
                        alt={teacher.username}
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />
                      <div className="absolute left-4 top-4 rounded-full border border-white/15 bg-white/90 px-3 py-1 text-xs font-black text-slate-900 shadow-lg">
                        {getSpecialization(teacher)}
                      </div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="truncate text-2xl font-black text-white">
                          {teacher.username}
                        </h3>
                        <p className="truncate text-sm font-semibold text-slate-300">
                          {teacher.email}
                        </p>
                      </div>
                    </div>

                    <div className="p-5">
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="rounded-2xl bg-amber-50 p-3">
                          <Star className="mx-auto h-5 w-5 fill-amber-400 text-amber-400" />
                          <p className="mt-1 text-sm font-black">
                            {rating ? rating.toFixed(1) : "New"}
                          </p>
                        </div>
                        <div className="rounded-2xl bg-teal-50 p-3">
                          <BookOpen className="mx-auto h-5 w-5 text-teal-700" />
                          <p className="mt-1 text-sm font-black">
                            {courses.length}
                          </p>
                        </div>
                        <div className="rounded-2xl bg-slate-100 p-3">
                          <Users className="mx-auto h-5 w-5 text-slate-700" />
                          <p className="mt-1 text-sm font-black">
                            {getLearnerCount(teacher)}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <p className="text-xs font-black uppercase text-slate-400">
                          Top course
                        </p>
                        <p className="mt-1 line-clamp-2 min-h-12 font-black leading-6 text-slate-900">
                          {topCourse?.title || "Courses coming soon"}
                        </p>
                        {topCourse?.topic && (
                          <span className="mt-3 inline-flex rounded-full bg-white px-3 py-1 text-xs font-bold text-teal-700 ring-1 ring-slate-200">
                            {topCourse.topic}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => navigate(`/student/teacher/${teacher._id}`)}
                        className="mt-5 flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3.5 font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-xl active:translate-y-0"
                      >
                        View Profile
                        <ChevronRight className="h-5 w-5 transition group-hover:translate-x-0.5" />
                      </button>
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
