import axios from "axios";
import { Loader2, User2 as User2Icon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const StudentDashboard = () => {
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const fetchTeacherName = async (teacherId) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/student/get-teacher-name`,
        { teacherId }
      );
      return res.data.teacherName || "Unknown";
    } catch (err) {
      console.error("Error fetching teacher name:", err);
      return "Unknown";
    }
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/student/my-courses`,
          { token }
        );
        let courses = response.data.registeredCourses || [];

        const updatedCourses = await Promise.all(
          courses.map(async (course) => {
            const teacherName = await fetchTeacherName(course.teacher);
            return { ...course, teacherName };
          })
        );

        setFeed(updatedCourses);
      } catch (err) {
        setError(
          err.message || "Failed to fetch courses. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-10 tracking-tight">
        Your Courses
      </h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
          <p className="ml-4 text-xl text-gray-600">
            Loading enrolled courses...
          </p>
        </div>
      ) : error ? (
        <div className="text-center p-8 bg-red-100 border border-red-300 text-red-700 rounded-lg shadow-md mx-auto max-w-lg">
          <p className="text-xl font-semibold mb-2">
            Oops! Something went wrong.
          </p>
          <p className="text-lg">{error}</p>
          <p className="text-md mt-4 text-red-600">
            Please refresh the page or try again later.
          </p>
        </div>
      ) : feed.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {feed.map((course) => (
            <div
              key={course._id}
              className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:border-blue-300 border border-transparent"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-105"
                />
                {/* <div className="absolute top-3 right-3 bg-blue-600 text-white text-lg font-bold px-4 py-1 rounded-full shadow-md">
                  ₹{course.price}
                </div> */}
              </div>

              <div className="p-6 flex-grow flex flex-col">
                <h3 className="text-2xl font-semibold text-gray-800 mb-2 truncate">
                  {course.title}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-grow">
                  {course.description}
                </p>

                <div className="flex items-center gap-2 text-md text-gray-500 mb-6">
                  <User2Icon className="w-5 h-5 text-indigo-500" />
                  <span className="font-medium">
                    Teacher: {course.teacherName || "Unknown"}
                  </span>
                </div>

                <button
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 rounded-lg font-semibold text-lg shadow-md hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 transform hover:-translate-y-0.5"
                  onClick={() =>
                    navigate(`/student/course-details/${course._id}`)
                  }
                >
                  View Course
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-8 bg-white rounded-lg shadow-md mx-auto max-w-lg">
          <p className="text-2xl font-semibold text-gray-700 mb-4">
            No courses available right now.
          </p>
          <p className="text-lg text-gray-500">
            Check back later for new and exciting courses!
          </p>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
