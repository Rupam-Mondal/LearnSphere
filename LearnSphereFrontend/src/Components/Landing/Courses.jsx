import { useEffect, useState } from "react";
import axios from "axios";
import {
  ArrowRight,
  BookOpen,
  Clock3,
  Crown,
  Layers3,
  Sparkles,
  Star,
  Users,
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Courses = () => {
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const getFeed = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/student/feed`
        );

        if (response.data.success) {
          setFeed(response.data.data);
        } else {
          setError(response.data.message || "Failed to fetch courses");
        }
      } catch (err) {
        console.error(err);
        setError("Could not load courses.");
      } finally {
        setLoading(false);
      }
    };

    getFeed();
  }, []);

  if (loading) {
    return (
      <section className="bg-white px-5 py-24">
        <div className="mx-auto max-w-7xl rounded-3xl border border-purple-100 bg-purple-50/70 p-8 text-center text-[#59168B] shadow-[0_24px_80px_rgba(89,22,139,0.08)]">
          Loading premium courses...
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-white px-5 py-24">
        <p className="mx-auto max-w-7xl rounded-2xl border border-red-100 bg-red-50 p-6 text-center font-semibold text-red-600">
          {error}
        </p>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden bg-[#fbf9ff] px-5 py-24">
      <div className="absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-white via-purple-50 to-[#fbf9ff]" />
      <div className="absolute left-0 top-40 h-72 w-72 rounded-full bg-purple-200/40 blur-3xl" />
      <div className="absolute right-0 top-72 h-80 w-80 rounded-full bg-cyan-100/70 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-16 flex flex-col gap-7 rounded-[2rem] border border-white bg-white/80 p-6 shadow-[0_26px_90px_rgba(89,22,139,0.09)] backdrop-blur md:flex-row md:items-end md:justify-between md:p-9">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-purple-100 bg-purple-50 px-4 py-2 text-sm font-black text-[#59168B]">
              <Crown className="h-4 w-4" />
              Premium course catalog
            </div>
            <h2 className="max-w-3xl text-4xl font-black leading-tight tracking-normal text-gray-950 md:text-6xl lg:text-7xl">
              Handpicked paths for serious growth.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-gray-600 md:text-lg">
              Premium courses from LearnSphere teachers, arranged into clean
              shelves so students can scan, compare, and start faster.
            </p>
          </div>

          <button
            className="group inline-flex w-fit cursor-pointer items-center justify-center gap-3 rounded-2xl bg-[#59168B] px-6 py-4 text-sm font-bold text-white shadow-[0_18px_45px_rgba(89,22,139,0.28)] transition duration-300 hover:-translate-y-1 hover:bg-[#4b1278]"
            onClick={() => navigate("/student/feed")}
          >
            View All Courses
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        <div className="space-y-14">
          {feed.slice(0, 2).map((topicBlock) => (
            <div
              key={topicBlock.topic}
              className="rounded-[1.6rem] border border-white bg-white/70 p-4 shadow-[0_22px_80px_rgba(15,23,42,0.06)] backdrop-blur md:p-5"
            >
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#59168B] to-cyan-500 text-white shadow-[0_16px_45px_rgba(89,22,139,0.25)]">
                    <Layers3 className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-gray-950 md:text-[1.7rem]">
                      {topicBlock.topic}
                    </h3>
                    <p className="mt-1 text-sm font-semibold text-gray-500">
                      Curated course shelf
                    </p>
                  </div>
                </div>
                <span className="inline-flex w-fit items-center gap-2 rounded-full border border-purple-100 bg-purple-50 px-4 py-2 text-sm font-black text-[#59168B]">
                  <Sparkles className="h-4 w-4" />
                  {topicBlock.course.length} courses
                </span>
              </div>

              <div className="flex gap-5 overflow-x-auto pb-3">
                {topicBlock.course.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Courses;

const CourseCard = ({ course }) => {
  const navigate = useNavigate();
  const price = Number(course.price || 0).toLocaleString("en-IN");

  return (
    <div className="group flex min-w-[280px] max-w-[320px] flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-[0_18px_55px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1.5 hover:border-purple-100 hover:shadow-[0_24px_70px_rgba(89,22,139,0.16)] md:min-w-[315px]">
      <div className="relative h-44 overflow-hidden bg-gray-100">
        <img
          src={course.image}
          alt={course.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
        <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/95 px-3 py-1.5 text-xs font-black text-[#59168B] shadow-lg backdrop-blur">
          <Zap className="h-3.5 w-3.5" />
          Featured
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
        <p className="line-clamp-2 flex-grow text-sm leading-6 text-gray-600">
          {course.description}
        </p>

        <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-black text-gray-600">
          <div className="flex min-h-10 items-center gap-2 rounded-xl bg-purple-50 px-3 py-2">
            <BookOpen className="h-4 w-4 text-[#59168B]" />
            <span className="line-clamp-1">{course.lessons || "Lessons"}</span>
          </div>
          <div className="flex min-h-10 items-center gap-2 rounded-xl bg-cyan-50 px-3 py-2">
            <Users className="h-4 w-4 text-[#59168B]" />
            <span className="line-clamp-1">{course.enrolled || 0} enrolled</span>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-3 py-2.5">
          <div className="flex items-center gap-2 text-sm font-bold text-gray-600">
            <Clock3 className="h-4 w-4 text-cyan-600" />
            Flexible pace
          </div>
          <div className="flex items-center gap-1 text-sm font-black text-amber-500">
            <Star className="h-4 w-4 fill-amber-400" />
            4.5
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between gap-3 border-t border-gray-100 pt-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-normal text-gray-400">
              Course price
            </p>
            <span className="text-xl font-black text-gray-950">
              Rs. {price}
            </span>
          </div>
          <button
            onClick={() => navigate(`/student/course-details/${course.id}`)}
            className="group/btn inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#59168B] px-4 py-2.5 text-sm font-black text-white shadow-[0_12px_30px_rgba(89,22,139,0.24)] transition duration-300 hover:bg-gray-950"
          >
            Enroll
            <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
};
