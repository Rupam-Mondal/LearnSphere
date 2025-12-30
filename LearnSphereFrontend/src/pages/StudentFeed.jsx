import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { Loader2, Filter, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar/Navbar";

/* -------- Child Component: CourseCard -------- */
const CourseCard = ({ course }) => {
  const navigate = useNavigate();
  return (
    <div className="bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
      <div className="relative">
        <img
          src={course.image}
          alt={course.name}
          className="w-full h-48 object-cover rounded-t-3xl"
        />
      </div>

      <div className="p-6 flex-grow flex flex-col">
        <h3 className="text-xl font-bold text-gray-900 mb-1 line-clamp-1">
          {course.name}
        </h3>
        <p className="text-gray-500 text-xs mb-3 italic">by {course.teacher}</p>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
          {course.description}
        </p>

        <p className="text-gray-500 text-xs mb-2 font-medium">{course.lessons}</p>

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
            onClick={() => navigate(`/student/course-details/${course.id}`)}
            className="cursor-pointer bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95 shadow-lg shadow-purple-100"
          >
            Enroll Now
          </button>
        </div>
      </div>
    </div>
  );
};

/* -------- Main Component: StudentFeed -------- */
const StudentFeed = () => {
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [selectedTopic, setSelectedTopic] = useState("All");
  const [maxPrice, setMaxPrice] = useState(10000);
  const [maxLessons, setMaxLessons] = useState(50);

  const getLessonCount = (lessons) => {
    if (!lessons) return 0;
    return Number(lessons.split(" ")[0]) || 0;
  };

  useEffect(() => {
    const getFeed = async () => {
      try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/student/feed`);
        if (response.data.success) {
          setFeed(response.data.data);
        } else {
          setError("Failed to fetch courses");
        }
      } catch (err) {
        setError("Could not load courses");
      } finally {
        setLoading(false);
      }
    };
    getFeed();
  }, []);

  const topics = useMemo(() => ["All", ...feed.map((t) => t.topic)], [feed]);

  const filteredFeed = useMemo(() => {
    return feed
      .map((topicBlock) => {
        if (selectedTopic !== "All" && topicBlock.topic !== selectedTopic) return null;
        const filteredCourses = topicBlock.course.filter((course) => {
          return course.price <= maxPrice && getLessonCount(course.lessons) <= maxLessons;
        });
        if (filteredCourses.length === 0) return null;
        return { ...topicBlock, course: filteredCourses };
      })
      .filter(Boolean);
  }, [feed, selectedTopic, maxPrice, maxLessons]);

  if (loading) return (
    <div className="flex flex-col justify-center items-center h-screen bg-slate-50">
      <Loader2 className="w-12 h-12 animate-spin text-purple-600 mb-4" />
      <p className="text-slate-500 font-medium animate-pulse">Personalizing your library...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFCFE] text-slate-900 font-sans">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 pb-20 flex flex-col lg:flex-row gap-10 py-24">
        
        <aside className="lg:w-80 w-full flex-shrink-0">
          <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-xl shadow-purple-100/20 p-8 sticky top-10">
            <div className="flex items-center gap-2 mb-8 border-b border-slate-50 pb-4">
              <Filter className="w-5 h-5 text-purple-600" />
              <h2 className="text-xl font-bold text-slate-800">Refine Results</h2>
            </div>

            <div className="space-y-10">
              {/* Topic Select */}
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 block">Category</label>
                <select
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                  className="w-full bg-slate-50 border-none ring-1 ring-slate-100 rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-purple-500 transition-all outline-none text-sm font-medium"
                >
                  {topics.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>

              {/* Price Range */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Budget</label>
                  <span className="text-sm font-bold text-purple-600 bg-purple-50 px-3 py-1 rounded-full">₹{maxPrice.toLocaleString()}</span>
                </div>
                <input
                  type="range" min="0" max="10000" step="500"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(+e.target.value)}
                  className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
              </div>

              {/* Lessons Range */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Complexity</label>
                  <span className="text-sm font-bold text-purple-600 bg-purple-50 px-3 py-1 rounded-full">{maxLessons} Lessons</span>
                </div>
                <input
                  type="range" min="5" max="50" step="1"
                  value={maxLessons}
                  onChange={(e) => setMaxLessons(+e.target.value)}
                  className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN FEED */}
        <main className="flex-1">
          {filteredFeed.length === 0 ? (
            <div className="bg-white rounded-[3rem] p-24 text-center border border-dashed border-slate-200">
              <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                 <Search className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">No results found</h3>
              <p className="text-slate-500">We couldn't find any courses matching your current filters.</p>
            </div>
          ) : (
            filteredFeed.map((topicBlock) => (
              <div key={topicBlock.topic} className="mb-20">
                <div className="flex items-center gap-4 mb-10">
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">{topicBlock.topic}</h2>
                  <div className="h-[2px] flex-1 bg-gradient-to-r from-purple-100 to-transparent"></div>
                  <span className="bg-white border border-slate-100 px-4 py-1.5 rounded-full text-xs font-bold text-slate-400 shadow-sm">
                    {topicBlock.course.length} Available
                  </span>
                </div>

                {/* Grid Layout */}
                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-10">
                  {topicBlock.course.map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>
              </div>
            ))
          )}
        </main>
      </div>
    </div>
  );
};

export default StudentFeed;