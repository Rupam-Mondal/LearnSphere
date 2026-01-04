import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { Loader2, Filter, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CourseCard = ({ course }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
      <img
        src={course.image}
        alt={course.name}
        className="w-full h-48 object-cover rounded-t-3xl"
      />

      <div className="p-6 flex-grow flex flex-col">
        <h3 className="text-xl font-bold text-gray-900 mb-1 line-clamp-1">
          {course.name}
        </h3>

        <p className="text-gray-500 text-xs mb-3 italic">
          by {course.teacher}
        </p>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
          {course.description}
        </p>

        <p className="text-gray-500 text-xs mb-2 font-medium">
          {course.lessons}
        </p>

        <div className="flex justify-between items-center gap-2 mb-6 text-sm text-amber-500 font-medium">
          <div>
            <span>⭐⭐⭐⭐⭐</span>
            <span className="text-gray-400 text-xs ml-1">(4.5)</span>
          </div>

          <p className="text-gray-500 text-[10px] border-l border-gray-200 pl-2 uppercase tracking-tight">
            {course.enrolled} Enrolled
          </p>
        </div>

        <div className="flex items-center justify-between mt-auto">
          <span className="text-2xl font-black text-gray-900">
            ₹{course.price.toLocaleString("en-IN")}
          </span>

          <button
            onClick={() =>
              navigate(`/student/course-details/${course.id}`)
            }
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95 shadow-lg shadow-purple-100"
          >
            Enroll Now
          </button>
        </div>
      </div>
    </div>
  );
};

const StudentFeed = () => {
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedTopic, setSelectedTopic] = useState("All");
  const [maxPrice, setMaxPrice] = useState(10000);
  const [maxLessons, setMaxLessons] = useState(50);

  // 🔍 SEARCH STATE (ONLY ADDITION)
  const [search, setSearch] = useState("");

  const getLessonCount = (lessons) => {
    if (!lessons) return 0;
    return Number(lessons.split(" ")[0]) || 0;
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

  const topics = useMemo(
    () => ["All", ...feed.map((t) => t.topic)],
    [feed]
  );

  // 🔍 SEARCH FILTER APPLIED HERE
  const filteredFeed = useMemo(() => {
    return feed
      .map((topicBlock) => {
        if (selectedTopic !== "All" && topicBlock.topic !== selectedTopic)
          return null;

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

  if (loading)
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-slate-50">
        <Loader2 className="w-12 h-12 animate-spin text-purple-600 mb-4" />
        <p className="text-slate-500 font-medium animate-pulse">
          Personalizing your library...
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      {/* HEADER */}
      <div className="text-4xl md:text-6xl max-w-7xl mx-auto px-4 font-semibold text-gray-900 pt-16">
        Discover Your Next Learning Journey
        <div className="max-w-full md:max-w-[70%] mt-5 text-xl md:text-2xl text-gray-600">
          Explore our comprehensive catalog of expert-led courses designed
          to transform your career.
        </div>
      </div>

      {/* 🔍 SEARCH BAR (ONLY UI ADDITION) */}
      <div className="max-w-7xl mx-auto px-4 mt-12">
        <div className="relative max-w-2xl">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search courses, instructors, or skills…"
            className="w-full pl-14 pr-5 py-4 rounded-full bg-white border border-slate-200 shadow-sm focus:ring-2 focus:ring-purple-500 outline-none text-sm font-medium"
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-20 flex flex-col lg:flex-row gap-10 py-24">
        {/* SIDEBAR */}
        <aside className="lg:w-80 w-full">
          <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-xl p-8 sticky top-10">
            <div className="flex items-center gap-2 mb-8 border-b pb-4">
              <Filter className="w-5 h-5 text-purple-600" />
              <h2 className="text-xl font-bold">Refine Results</h2>
            </div>

            <div className="space-y-10">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 mb-3 block">
                  Category
                </label>
                <select
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                  className="w-full bg-slate-50 rounded-2xl px-4 py-3.5 text-sm font-medium"
                >
                  {topics.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-slate-400">
                  Budget
                </label>
                <input
                  type="range"
                  min="0"
                  max="10000"
                  step="500"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(+e.target.value)}
                  className="w-full mt-4 accent-purple-600"
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-slate-400">
                  Complexity
                </label>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={maxLessons}
                  onChange={(e) => setMaxLessons(+e.target.value)}
                  className="w-full mt-4 accent-purple-600"
                />
              </div>
            </div>
          </div>
        </aside>

        {/* COURSES */}
        <main className="flex-1">
          {filteredFeed.map((topicBlock) => (
            <div key={topicBlock.topic} className="mb-20">
              <h2 className="text-3xl font-black mb-10">
                {topicBlock.topic}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-10">
                {topicBlock.course.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            </div>
          ))}
        </main>
      </div>
    </div>
  );
};

export default StudentFeed;
