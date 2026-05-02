import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  ChevronDown,
  Filter,
  GraduationCap,
  Loader2,
  Search,
  SlidersHorizontal,
  Sparkles,
  Star,
  Users,
  Wallet,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const CourseCard = ({ course }) => {
  const navigate = useNavigate();
  const rating = Number(course.overallRating || 0);
  const price = Number(course.price || 0).toLocaleString("en-IN");

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-white bg-white shadow-[0_20px_70px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1.5 hover:border-purple-100 hover:shadow-[0_30px_90px_rgba(89,22,139,0.16)]">
      <div className="relative h-48 overflow-hidden bg-slate-100">
        <img
          src={course.image}
          alt={course.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

        <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/95 px-3 py-1.5 text-xs font-black text-[#59168B] shadow-lg backdrop-blur">
          <Sparkles className="h-3.5 w-3.5" />
          Premium
        </div>

        <div className="absolute bottom-4 left-4 right-4">
          <p className="mb-2 text-xs font-bold uppercase tracking-normal text-purple-100">
            by {course.teacher}
          </p>
          <h3 className="line-clamp-2 text-xl font-black leading-tight text-white">
            {course.name}
          </h3>
        </div>
      </div>

      <div className="flex flex-grow flex-col p-5">
        <p className="line-clamp-2 flex-grow text-sm leading-6 text-slate-600">
          {course.description}
        </p>

        <div className="mt-5 grid grid-cols-2 gap-2 text-xs font-black text-slate-600">
          <div className="flex min-h-10 items-center gap-2 rounded-xl bg-purple-50 px-3 py-2">
            <BookOpen className="h-4 w-4 text-[#59168B]" />
            <span className="line-clamp-1">{course.lessons || "Lessons"}</span>
          </div>
          <div className="flex min-h-10 items-center gap-2 rounded-xl bg-cyan-50 px-3 py-2">
            <Users className="h-4 w-4 text-cyan-700" />
            <span className="line-clamp-1">{course.enrolled || 0} enrolled</span>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
          <div className="flex items-center gap-1.5 text-sm font-black text-amber-500">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span>{rating > 0 ? rating.toFixed(1) : "New"}</span>
          </div>
          <span className="text-xs font-bold text-slate-500">
            Expert-led course
          </span>
        </div>

        <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-normal text-slate-400">
              Price
            </p>
            <span className="text-xl font-black text-slate-950">
              Rs. {price}
            </span>
          </div>

          <button
            onClick={() => navigate(`/student/course-details/${course.id}`)}
            className="group/btn inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#59168B] px-4 py-2.5 text-sm font-black text-white shadow-[0_12px_30px_rgba(89,22,139,0.24)] transition duration-300 hover:bg-slate-950 active:scale-95"
          >
            Enroll
            <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
          </button>
        </div>
      </div>
    </article>
  );
};

const StudentFeed = () => {
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedTopic, setSelectedTopic] = useState("All");
  const [maxPrice, setMaxPrice] = useState(10000);
  const [maxLessons, setMaxLessons] = useState(50);
  const [search, setSearch] = useState("");

  const getLessonCount = (lessons) => {
    if (!lessons) return 0;
    return Number(String(lessons).split(" ")[0]) || 0;
  };

  useEffect(() => {
    const getFeed = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/student/feed`
        );
        if (response.data.success) {
          setFeed(response.data.data);
        } else {
          setError("Failed to fetch courses");
        }
      } catch {
        setError("Could not load courses");
      } finally {
        setLoading(false);
      }
    };
    getFeed();
  }, []);

  const topics = useMemo(() => ["All", ...feed.map((t) => t.topic)], [feed]);

  const totalCourses = useMemo(
    () => feed.reduce((total, block) => total + block.course.length, 0),
    [feed]
  );

  const filteredFeed = useMemo(() => {
    return feed
      .map((topicBlock) => {
        if (selectedTopic !== "All" && topicBlock.topic !== selectedTopic) {
          return null;
        }

        const filteredCourses = topicBlock.course.filter((course) => {
          const q = search.toLowerCase();
          const matchesSearch =
            course.name.toLowerCase().includes(q) ||
            course.description.toLowerCase().includes(q) ||
            course.teacher.toLowerCase().includes(q);

          return (
            matchesSearch &&
            course.price <= maxPrice &&
            getLessonCount(course.lessons) <= maxLessons
          );
        });

        if (filteredCourses.length === 0) return null;
        return { ...topicBlock, course: filteredCourses };
      })
      .filter(Boolean);
  }, [feed, selectedTopic, maxPrice, maxLessons, search]);

  const filteredCount = useMemo(
    () =>
      filteredFeed.reduce((total, block) => total + block.course.length, 0),
    [filteredFeed]
  );

  if (loading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-[#fbf9ff]">
        <div className="rounded-3xl border border-purple-100 bg-white p-8 text-center shadow-[0_24px_90px_rgba(89,22,139,0.12)]">
          <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-[#59168B]" />
          <p className="font-bold text-slate-600">
            Personalizing your premium course library...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbf9ff] text-slate-950">
      <section className="relative overflow-hidden bg-[#2c1248] px-5 pt-24 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(168,85,247,0.34),transparent_30%),radial-gradient(circle_at_86%_18%,rgba(99,102,241,0.28),transparent_28%),linear-gradient(135deg,rgba(255,255,255,0.08)_0_1px,transparent_1px_52px)]" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#3b1464] via-[#2c1248] to-[#1d123c]" />
        <div className="absolute left-1/2 top-12 h-64 w-64 -translate-x-1/2 rounded-full bg-fuchsia-400/10 blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#fbf9ff] to-transparent" />

        <div className="relative z-10 mx-auto max-w-7xl pb-12">
          <div className="grid gap-8 lg:grid-cols-[1fr_340px] lg:items-end">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-black text-violet-100 shadow-[0_14px_45px_rgba(0,0,0,0.16)] backdrop-blur-xl">
                <GraduationCap className="h-4 w-4 text-fuchsia-200" />
                Premium learning catalog
              </div>

              <h1 className="max-w-4xl text-4xl font-black leading-[1.04] tracking-normal md:text-6xl">
                Find the right course, faster.
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-8 text-violet-100/85 md:text-lg">
                Browse expert-led LearnSphere courses with polished previews,
                useful filters, ratings, and clear pricing in one calm catalog.
              </p>
            </div>

            <div className="rounded-[1.5rem] border border-white/12 bg-white/10 p-4 shadow-[0_22px_70px_rgba(0,0,0,0.24)] backdrop-blur-xl">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white/10 p-3">
                  <BookOpen className="mb-3 h-5 w-5 text-fuchsia-200" />
                  <p className="text-2xl font-black">{totalCourses}</p>
                  <p className="text-xs font-semibold text-violet-100/80">
                    Courses
                  </p>
                </div>
                <div className="rounded-2xl bg-white/10 p-3">
                  <Sparkles className="mb-3 h-5 w-5 text-indigo-200" />
                  <p className="text-2xl font-black">{topics.length - 1}</p>
                  <p className="text-xs font-semibold text-violet-100/80">
                    Topics
                  </p>
                </div>
              </div>
              <div className="mt-3 rounded-2xl border border-white/10 bg-white/10 p-3">
                <p className="text-xs font-bold text-violet-100/75">
                  Showing now
                </p>
                <p className="mt-1 text-xl font-black">{filteredCount}</p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 rounded-[1.5rem] border border-white/12 bg-white/10 p-3 shadow-[0_22px_70px_rgba(0,0,0,0.2)] backdrop-blur-xl md:flex-row md:items-center">
            <div className="relative md:max-w-xl md:flex-1">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-violet-300" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search courses, instructors, or skills..."
                className="h-12 w-full rounded-2xl border border-white/10 bg-white/95 px-11 pr-4 text-sm font-bold text-slate-900 shadow-inner outline-none transition focus:ring-4 focus:ring-fuchsia-300/25"
              />
            </div>
            <div className="flex flex-wrap gap-2 text-xs font-black text-violet-100">
              <span className="rounded-full border border-white/12 bg-white/10 px-3 py-2">
                AI practice
              </span>
              <span className="rounded-full border border-white/12 bg-white/10 px-3 py-2">
                Mentor courses
              </span>
              <span className="rounded-full border border-white/12 bg-white/10 px-3 py-2">
                Career skills
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-8 px-5 pb-20 pt-10 lg:grid-cols-[300px_1fr]">
        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <div className="rounded-[1.75rem] border border-white bg-white/85 p-6 shadow-[0_22px_80px_rgba(15,23,42,0.08)] backdrop-blur">
            <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#59168B] text-white shadow-[0_14px_35px_rgba(89,22,139,0.24)]">
                  <SlidersHorizontal className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-black">Refine</h2>
                  <p className="text-xs font-bold text-slate-400">
                    Tune your catalog
                  </p>
                </div>
              </div>
              <Filter className="h-5 w-5 text-slate-400" />
            </div>

            <div className="space-y-7">
              <div>
                <label className="mb-3 block text-xs font-black uppercase tracking-normal text-slate-400">
                  Category
                </label>
                <div className="relative">
                  <select
                    value={selectedTopic}
                    onChange={(e) => setSelectedTopic(e.target.value)}
                    className="h-14 w-full appearance-none rounded-2xl border border-slate-100 bg-slate-50 px-4 pr-10 text-sm font-bold text-slate-700 outline-none transition focus:ring-4 focus:ring-purple-100"
                  >
                    {topics.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>
              </div>

              <FilterSlider
                icon={Wallet}
                label="Budget"
                value={`Rs. ${maxPrice.toLocaleString("en-IN")}`}
                min="0"
                max="10000"
                step="500"
                state={maxPrice}
                setState={setMaxPrice}
              />

              <FilterSlider
                icon={BookOpen}
                label="Lessons"
                value={`${maxLessons} max`}
                min="0"
                max="50"
                state={maxLessons}
                setState={setMaxLessons}
              />
            </div>
          </div>
        </aside>

        <main>
          {error ? (
            <div className="rounded-[1.75rem] border border-red-100 bg-red-50 p-8 text-center font-bold text-red-600">
              {error}
            </div>
          ) : filteredFeed.length === 0 ? (
            <div className="rounded-[1.75rem] border border-white bg-white p-12 text-center shadow-[0_22px_80px_rgba(15,23,42,0.08)]">
              <Search className="mx-auto mb-4 h-10 w-10 text-slate-300" />
              <h3 className="text-2xl font-black text-slate-950">
                No matching courses
              </h3>
              <p className="mt-2 text-slate-500">
                Try changing the search, topic, budget, or lesson range.
              </p>
            </div>
          ) : (
            <div className="space-y-12">
              {filteredFeed.map((topicBlock) => (
                <section key={topicBlock.topic}>
                  <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-black uppercase tracking-normal text-[#59168B]">
                        Course shelf
                      </p>
                      <h2 className="text-3xl font-black text-slate-950">
                        {topicBlock.topic}
                      </h2>
                    </div>
                    <span className="inline-flex w-fit items-center gap-2 rounded-full border border-purple-100 bg-white px-4 py-2 text-sm font-black text-[#59168B] shadow-sm">
                      <Sparkles className="h-4 w-4" />
                      {topicBlock.course.length} courses
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {topicBlock.course.map((course) => (
                      <CourseCard key={course.id} course={course} />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

const FilterSlider = ({
  icon: Icon,
  label,
  value,
  min,
  max,
  step,
  state,
  setState,
}) => (
  <div>
    <div className="mb-3 flex items-center justify-between">
      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-normal text-slate-400">
        <Icon className="h-4 w-4 text-[#59168B]" />
        {label}
      </div>
      <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-black text-[#59168B]">
        {value}
      </span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={state}
      onChange={(e) => setState(+e.target.value)}
      className="w-full accent-[#59168B]"
    />
  </div>
);

export default StudentFeed;
