import { useEffect, useState } from "react";
import axios from "axios";
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

  if (loading) return <p className="text-center">Loading courses...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <section className="max-w-7xl mx-auto px-5 my-20">
      <h1 className="text-3xl md:text-6xl font-bold italic text-gray-900 mb-12 underline w-fit mx-auto">
        What to Learn Next 🚀
      </h1>

      {feed.slice(0, 2).map((topicBlock) => (
        <div key={topicBlock.topic} className="mb-5">
          <h2 className="px-5 text-2xl md:text-4xl font-bold text-gray-800 mb-6 items-center">
            {topicBlock.topic}{" "}
            <span className="text-md md:text-2xl text-gray-500">
              ({topicBlock.course.length} courses)
            </span>
          </h2>

          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide p-3 rounded">
            {topicBlock.course.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      ))}
      <div className="w-full flex items-center justify-center">
        <button
          className="cursor-pointer border border-purple-600 hover:bg-purple-800 text-purple-700 hover:text-white px-6 py-3 rounded-xl text-lg font-semibold transition-colors duration-300 my-4"
          onClick={() => navigate("/student/feed")}
        >
          View All Courses
        </button>
      </div>
    </section>
  );
};

export default Courses;

const CourseCard = ({ course }) => {
  const navigate = useNavigate();
  return (
    <div className="min-w-[280px] md:min-w-[320px] bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
      <div className="relative">
        <img
          src={course.image}
          alt={course.name}
          className="w-full h-48 object-cover rounded-t-2xl"
        />
      </div>

      <div className="p-5 flex-grow flex flex-col">
        <h3 className="text-xl font-bold text-gray-900 mb-1 line-clamp-1">
          {course.name}
        </h3>
        <p className="text-gray-500 text-xs mb-3 italic">by {course.teacher}</p>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
          {course.description}
        </p>

        <p className="text-gray-500 text-xs mb-2">{course.lessons}</p>

        <div className="flex justify-between items-center gap-2 mb-4 text-sm text-amber-500 font-medium">
          <div>
            <span>⭐⭐⭐⭐⭐</span>
            <span className="text-gray-400 text-xs">(4.5/5.0)</span>
          </div>

          <p className="text-gray-500 text-xs border-l border-gray-300 pl-2">
            {course.enrolled} students enrolled
          </p>
        </div>

        <div className="flex items-center justify-between mt-auto pt-0 border-gray-50">
          <span className="text-xl font-black text-gray-900">
            ₹{course.price.toLocaleString("en-IN")}
          </span>
          <button
            onClick={() => navigate(`/student/course-details/${course.id}`)}
            className="cursor-pointer bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-xl text-sm font-semibold transition-colors"
          >
            Enroll Now
          </button>
        </div>
      </div>
    </div>
  );
};