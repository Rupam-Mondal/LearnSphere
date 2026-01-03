import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Teachers() {
  const [teachers, setTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [ratingFilter, setRatingFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  /* ================= FETCH ================= */
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/teacher/all_teachers`
        );

        const sorted = response.data.teachers.sort(
          (a, b) => (b.rating ?? 0) - (a.rating ?? 0)
        );

        setTeachers(sorted);
        setFilteredTeachers(sorted);
      } catch (error) {
        console.error("Error fetching teachers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  /* ================= FILTER ================= */
  useEffect(() => {
    let filtered = teachers;

    if (searchQuery) {
      filtered = filtered.filter((t) =>
        t.username.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (ratingFilter !== "all") {
      filtered = filtered.filter(
        (t) => (t.rating ?? 0) >= Number(ratingFilter)
      );
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter((t) =>
        t.courses.some((c) => c.category === categoryFilter)
      );
    }

    setFilteredTeachers(filtered);
  }, [teachers, ratingFilter, categoryFilter, searchQuery]);

  const categories = Array.from(
    new Set(teachers.flatMap((t) => t.courses.map((c) => c.category)))
  ).filter(Boolean);

  return (
    <div className="min-h-screen bg-[#f9fafb]">
      {/* ================= HERO ================= */}
      <div className="relative pt-24 pb-16 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-100 via-cyan-100 to-blue-100 blur-3xl opacity-70" />

        <div className="relative max-w-7xl mx-auto text-center animate-fade-up">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Discover Expert Educators
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Learn from experienced teachers and accelerate your growth
          </p>

          {/* SEARCH */}
          <div className="max-w-2xl mx-auto mt-10 animate-fade-up-delay">
            <div className="relative">
              <input
                type="text"
                placeholder="Search teachers by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-white px-12 py-3 text-gray-800 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="max-w-7xl mx-auto px-4 pb-24 grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-10">
        {/* FILTERS */}
        <aside className="lg:sticky lg:top-10 h-fit animate-slide-in">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Refine Results
            </h2>

            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-2">
                  Rating
                </label>
                <select
                  value={ratingFilter}
                  onChange={(e) => setRatingFilter(e.target.value)}
                  className="w-full cursor-pointer rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 transition"
                >
                  <option value="all">All Ratings</option>
                  <option value="4">4★ & above</option>
                  <option value="3">3★ & above</option>
                  <option value="2">2★ & above</option>
                </select>
              </div>

              {categories.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-2">
                    Category
                  </label>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full cursor-pointer rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 transition"
                  >
                    <option value="all">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <button
                onClick={() => {
                  setRatingFilter("all");
                  setCategoryFilter("all");
                  setSearchQuery("");
                }}
                className="w-full cursor-pointer rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 py-2.5 text-sm font-medium transition"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </aside>

        {/* TEACHERS GRID */}
        <section>
          {loading ? (
            <p className="text-center text-gray-500 mt-20 animate-pulse">
              Loading teachers...
            </p>
          ) : filteredTeachers.length === 0 ? (
            <p className="text-center text-gray-500 mt-20 animate-fade-up">
              No teachers found
            </p>
          ) : (
            <>
              <p className="text-sm text-gray-500 mb-6 animate-fade-up">
                Showing {filteredTeachers.length} of {teachers.length} teachers
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredTeachers.map((teacher, index) => (
                  <div
                    key={teacher._id}
                    className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 animate-card"
                    style={{ animationDelay: `${index * 80}ms` }}
                  >
                    {/* IMAGE */}
                    <div className="relative h-52 overflow-hidden bg-gray-100">
                      <img
                        src={
                          teacher.profilePicture ||
                          "https://t4.ftcdn.net/jpg/03/64/21/11/360_F_364211147_1qgLVxv1Tcq0Ohz3FawUfrtONzz8nq3e.jpg"
                        }
                        alt={teacher.username}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      />

                      {teacher.rating && (
                        <div className="absolute top-4 right-4 bg-yellow-400 px-3 py-1 rounded-full text-sm font-semibold">
                          ★ {teacher.rating.toFixed(1)}
                        </div>
                      )}
                    </div>

                    {/* CONTENT */}
                    <div className="p-6 flex flex-col">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {teacher.username}
                      </h3>

                      <p className="text-sm text-gray-500 mt-1 truncate">
                        {teacher.email}
                      </p>

                      <p className="text-sm text-gray-600 mt-3">
                        Courses: {teacher.courses.length}
                      </p>

                      <button
                        onClick={() => navigate(`/student/teacher/${teacher._id}`)}
                        className="mt-6 cursor-pointer rounded-xl bg-black text-white py-3 text-sm font-medium hover:bg-gray-800 transition"
                      >
                        View Profile
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>
      </div>

      {/* ================= ANIMATIONS ================= */}
      <style jsx>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes cardFade {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .animate-fade-up {
          animation: fadeUp 0.6s ease-out forwards;
        }

        .animate-fade-up-delay {
          animation: fadeUp 0.6s ease-out 0.2s forwards;
          opacity: 0;
        }

        .animate-slide-in {
          animation: slideIn 0.6s ease-out forwards;
        }

        .animate-card {
          animation: cardFade 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}
